// Page de détail d'un projet : projet.html?id=<identifiant>
(function () {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const R = window.PortfolioRender;
  const root = document.getElementById('case');
  const headers = { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey };
  const rest = table => cfg.supabaseUrl + '/rest/v1/portfolio_' + table;

  const fail = text => {
    root.innerHTML = '<h1 class="case-title">Projet introuvable</h1><p class="case-lead">' + R.esc(text) +
      '</p><p class="case-cta"><a class="btn btn-blue" href="index.html#projects">← Retour aux projets</a></p>';
  };

  const id = Number(new URLSearchParams(location.search).get('id'));
  if (!Number.isInteger(id) || id <= 0) return fail('Le lien de ce projet est incomplet.');
  if (!cfg.isConfigured || !cfg.isConfigured()) return fail('Les projets ne sont pas disponibles pour le moment.');

  fetch(rest('projects') + '?select=*&id=eq.' + id, { headers })
    .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(rows => {
      const p = rows[0];
      if (!p) return fail('Ce projet n\'existe pas ou n\'est plus affiché.');
      document.title = p.name + ' — Marc-Aurèle Adou';
      root.innerHTML = R.projectPage(p);
      fetch(rest('events'), {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }, headers),
        body: JSON.stringify({ type: 'project_view' }),
        keepalive: true
      }).catch(() => {});
    })
    .catch(() => fail('Le projet n\'a pas pu être chargé. Réessayez dans un instant.'));
})();
