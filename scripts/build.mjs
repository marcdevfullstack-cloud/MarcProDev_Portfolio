// Régénère index.html à partir des contenus Supabase, pour que Google, LinkedIn
// et les visiteurs sans Supabase voient la même chose que le site en direct.
//
//   node scripts/build.mjs
//
// Ne remplace que le texte entre les marqueurs <!--pf:xxx--> … <!--/pf:xxx-->,
// les liens du CV et les balises <head>. En cas d'erreur, index.html n'est pas modifié.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const render = createRequire(import.meta.url)(join(root, 'js', 'render.js'));

// js/config.js est écrit pour le navigateur : on l'évalue avec un faux « window ».
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'js', 'config.js'), 'utf8'), sandbox);
const cfg = sandbox.window.PORTFOLIO_CONFIG;
if (!cfg.isConfigured()) {
  console.error('Supabase n\'est pas configuré dans js/config.js.');
  process.exit(1);
}

const headers = { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey };
async function get(table, query) {
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/portfolio_${table}?select=*&${query}`, { headers });
  if (!res.ok) throw new Error(`${table} : HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

const TABLES = ['stats', 'skills', 'experiences', 'education', 'projects', 'testimonials'];
const data = { profile: await get('profile', 'id=eq.1') };
for (const t of TABLES) data[t] = await get(t, 'order=position.asc,id.asc');
if (!data.profile.length) throw new Error('La table portfolio_profile est vide.');

const file = join(root, 'index.html');
const before = readFileSync(file, 'utf8');
let html = before;

// 1. zones de contenu
const regions = render.regions(data);
for (const [key, value] of Object.entries(regions)) {
  if (value === undefined) continue;
  const open = `<!--pf:${key}-->`;
  const close = `<!--/pf:${key}-->`;
  const a = html.indexOf(open);
  const b = html.indexOf(close);
  if (a < 0 || b < a) { console.warn(`zone « ${key} » absente de index.html, ignorée`); continue; }
  html = html.slice(0, a + open.length) + value + html.slice(b);
}

// 2. section Témoignages : visible seulement s'il y en a
html = html.replace(/<section id="testimonials"( hidden)?>/, `<section id="testimonials"${regions.testimonials ? '' : ' hidden'}>`);

// 3. liens du CV
const cv = render.cvHref(data.profile[0]);
if (cv) html = html.replace(/<a href="[^"]*"( download(?:="[^"]*")?)/g, (_, rest) => `<a href="${render.esc(cv)}"${rest}`);

// 4. balises <head>
const meta = render.meta(data);
const setContent = (selector, value) => {
  if (!value) return;
  const re = new RegExp(`(<meta ${selector} content=")[^"]*(")`);
  html = html.replace(re, (_, a, b) => a + render.esc(value) + b);
};
if (meta.title) html = html.replace(/<title>[^<]*<\/title>/, `<title>${render.esc(meta.title)}</title>`);
setContent('name="description"', meta.description);
setContent('property="og:title"', meta.title);
setContent('property="og:description"', meta.description);
setContent('property="og:image"', meta.image);
setContent('property="og:url"', meta.url);

if (html === before) {
  console.log('index.html est déjà à jour.');
} else {
  writeFileSync(file, html);
  console.log('index.html régénéré.');
}
