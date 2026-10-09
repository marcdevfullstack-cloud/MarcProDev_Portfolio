// Page d'accueil : rafraîchit les contenus depuis Supabase, envoie le formulaire
// de contact et compte les visites. Si Supabase ne répond pas, le HTML déjà
// présent dans la page (généré par scripts/build.mjs) reste affiché.
(function () {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const R = window.PortfolioRender;
  const configured = !!(cfg.isConfigured && cfg.isConfigured());
  const headers = { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey };
  const rest = table => cfg.supabaseUrl + '/rest/v1/portfolio_' + table;
  const TABLES = ['stats', 'skills', 'experiences', 'education', 'projects', 'testimonials'];

  function render(data) {
    const html = R.regions(data);
    Object.keys(html).forEach(key => {
      if (html[key] === undefined) return;
      const el = document.querySelector('[data-pf="' + key + '"]');
      if (el) el.innerHTML = html[key];
    });
    const cv = R.cvHref((data.profile || [])[0]);
    if (cv) document.querySelectorAll('a[download]').forEach(a => { a.href = cv; });
    const testi = document.getElementById('testimonials');
    if (testi && html.testimonials !== undefined) testi.hidden = !html.testimonials;
  }

  async function load() {
    const get = async (table, query) => {
      const res = await fetch(rest(table) + '?select=*&' + query, { headers });
      if (!res.ok) throw new Error(table + ' : HTTP ' + res.status);
      return res.json();
    };
    const [profile, ...others] = await Promise.all([
      get('profile', 'id=eq.1'),
      ...TABLES.map(t => get(t, 'order=position.asc,id.asc'))
    ]);
    const data = { profile };
    TABLES.forEach((t, i) => { data[t] = others[i]; });
    return data;
  }

  // ─── Aperçu depuis l'admin : index.html?preview=1 ───
  // L'admin dépose l'élément en cours d'édition dans localStorage ; on le
  // superpose aux données enregistrées, sans rien écrire en base.
  function applyPreview(data) {
    let draft;
    try { draft = JSON.parse(localStorage.getItem('portfolio_preview') || 'null'); } catch (e) { draft = null; }
    if (!draft || !draft.key || !draft.row) return;
    if (draft.key === 'profile') {
      data.profile = [Object.assign({}, data.profile[0], draft.row)];
    } else if (data[draft.key]) {
      const rows = data[draft.key];
      const i = rows.findIndex(r => r.id === draft.row.id);
      if (i >= 0) rows[i] = Object.assign({}, rows[i], draft.row);
      else rows.push(draft.row);
    }
    const bar = document.createElement('div');
    bar.className = 'preview-bar';
    bar.textContent = 'Aperçu — ces modifications ne sont pas encore enregistrées.';
    document.body.append(bar);
  }

  // ─── Statistiques : un type et une date, rien d'autre ───
  function track(type) {
    if (!configured) return;
    fetch(rest('events'), {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }, headers),
      body: JSON.stringify({ type }),
      keepalive: true
    }).catch(() => {});
  }

  function trackVisitOnce() {
    try {
      if (sessionStorage.getItem('portfolio_visit')) return;
      sessionStorage.setItem('portfolio_visit', '1');
    } catch (e) { /* stockage indisponible : on compte quand même */ }
    track('visit');
  }

  // ─── Formulaire de contact ───
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const say = (text, kind) => { status.textContent = text; status.className = 'form-status ' + kind; };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.elements.website.value) return;   // champ piège : rempli seulement par les robots
      const payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        company: form.elements.company.value.trim(),
        message: form.elements.message.value.trim()
      };
      if (!configured) return say('Le formulaire est indisponible. Écrivez-moi directement par e-mail.', 'error');
      button.disabled = true;
      say('Envoi en cours…', '');
      try {
        const res = await fetch(rest('messages'), {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }, headers),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        say('Message envoyé. Merci, je vous réponds rapidement.', 'ok');
      } catch (err) {
        say('L\'envoi a échoué. Écrivez-moi directement par e-mail, l\'adresse est juste au-dessus.', 'error');
      }
      button.disabled = false;
    });
  }

  window.PortfolioSite = { render };
  initContactForm();
  document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('a[download]')) track('cv_download');
  });

  if (!configured) return;
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  if (!preview) trackVisitOnce();
  load()
    .then(data => { if (preview) applyPreview(data); render(data); })
    .catch(err => console.warn('[portfolio] contenus Supabase indisponibles, HTML de la page conservé :', err.message));
})();
