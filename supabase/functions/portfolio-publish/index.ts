// Edge Function « portfolio-publish » : lance la régénération du site sur GitHub.
// Appelée par le bouton « Publier » de l'admin. Le jeton GitHub reste côté
// serveur, dans les secrets de la fonction — jamais dans le navigateur.
//
// Secrets à définir (Edge Functions > Secrets) :
//   PORTFOLIO_GITHUB_TOKEN  jeton GitHub « fine-grained », limité à ce dépôt,
//                           permission « Actions : Read and write »
//   PORTFOLIO_GITHUB_REPO   ex. marcdevfullstack-cloud/MarcProDev_Portfolio
import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  // L'appelant doit être un admin du portfolio : on vérifie avec son propre jeton.
  const authorization = req.headers.get('Authorization') ?? '';
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: isAdmin, error } = await supabase.rpc('portfolio_is_admin');
  if (error || !isAdmin) return json({ error: 'Réservé à l\'admin du portfolio' }, 403);

  const token = Deno.env.get('PORTFOLIO_GITHUB_TOKEN');
  const repo = Deno.env.get('PORTFOLIO_GITHUB_REPO');
  if (!token || !repo) return json({ error: 'Secrets PORTFOLIO_GITHUB_TOKEN / PORTFOLIO_GITHUB_REPO manquants' }, 500);

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/publish.yml/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-publish',
    },
    body: JSON.stringify({ ref: 'master' }),
  });
  if (!res.ok) return json({ error: `GitHub a répondu ${res.status}` }, 502);
  return json({ ok: true });
});
