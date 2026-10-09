// Connexion Supabase — Project Settings > API dans le tableau de bord Supabase.
// La clé « anon / publishable » est faite pour être publique : la sécurité repose
// sur les règles RLS de supabase/schema.sql.
// Ne mettez JAMAIS ici la clé « service_role / secret ».
window.PORTFOLIO_CONFIG = {
  supabaseUrl: 'https://gqyvpoumtpglnkxolxtu.supabase.co',      // ex. https://abcdefgh.supabase.co
  supabaseAnonKey: 'sb_publishable_vs5snaqZ7UcNpSDDfPwf9g_U4G0HSvK',
  bucket: 'portfolio'
};

window.PORTFOLIO_CONFIG.isConfigured = function () {
  const c = window.PORTFOLIO_CONFIG;
  return /^https:\/\//.test(c.supabaseUrl) && !!c.supabaseAnonKey && !/^VOTRE_/.test(c.supabaseAnonKey);
};
