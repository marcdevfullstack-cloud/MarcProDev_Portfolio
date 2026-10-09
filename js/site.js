// Charge les contenus depuis Supabase et les affiche à la place du HTML statique.
// Si Supabase n'est pas configuré ou ne répond pas, le HTML d'origine reste en place.
(function () {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  // texte échappé, avec **gras** et retours à la ligne
  const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // n'accepte que http(s), mailto et les chemins relatifs
  const safeUrl = u => {
    u = String(u || '').trim();
    if (!u) return '';
    if (/^(https?:|mailto:)/i.test(u)) return u;
    return /^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//') ? '' : u;
  };
  const COLORS = ['blue', 'orange', 'yellow', 'purple'];
  const two = n => String(n).padStart(2, '0');

  function renderProfile(p) {
    if (!p) return;
    const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

    set('.hero-availability', '<span class="pulse"></span> ' + esc(p.availability));
    set('.hero-title .name-line', esc(p.first_name));
    set('.hero-title .role-line', esc(p.headline));
    set('.hero-role', esc(p.role_line) + (p.role_stack ? ' — <span>' + esc(p.role_stack) + '</span>' : ''));
    set('.hero-desc', rich(p.hero_desc));
    set('.hero-meta', [
      ['Localisation', p.location, ''],
      ['Entreprise', p.company, ' accent'],
      ['Expérience', p.experience_label, '']
    ].filter(m => m[1]).map(m =>
      '<div class="hero-meta-item"><span class="hero-meta-label">' + m[0] + '</span>' +
      '<span class="hero-meta-val' + m[2] + '">' + esc(m[1]) + '</span></div>'
    ).join(''));

    // CV : tous les liens de téléchargement
    let cv = safeUrl(p.cv_url);
    if (cv) {
      if (cv.includes('/storage/v1/object/public/')) cv += (cv.includes('?') ? '&' : '?') + 'download=Marc-Aurele-Adou-CV.pdf';
      $$('a[download]').forEach(a => { a.href = cv; });
    }

    // À propos
    set('#about .section-title', rich(p.about_title));
    const loc = $('#about .about-location');
    if (loc) {
      $$('#about .about-text').forEach(el => el.remove());
      String(p.about_text || '').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean).forEach(t => {
        const el = document.createElement('p');
        el.className = 'about-text';
        el.innerHTML = rich(t);
        loc.parentNode.insertBefore(el, loc);
      });
      loc.innerHTML = '<span class="loc-pin">◉</span> ' + esc(p.about_location);
    }

    // Contact, liens, pied de page
    set('.contact-desc', esc(p.contact_desc));
    const mail = $('.contact-email-badge');
    if (mail && p.email) { mail.href = 'mailto:' + p.email; mail.textContent = '✉ ' + p.email; }
    set('.cv-info', '<span>' + esc(p.full_name) + '</span> — ' + esc(p.cv_title) +
      '<br><span style="color:var(--text3);font-size:0.8rem;font-family:var(--font-mono)">PDF · ' + esc(p.cv_updated) + '</span>');
    const links = [['LinkedIn', safeUrl(p.linkedin_url)], ['GitHub', safeUrl(p.github_url)]].filter(l => l[1]);
    const linkHtml = cls => links.map(l =>
      '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener noreferrer"' + (cls ? ' class="' + cls + '"' : '') + '>⟶ ' + l[0] + '</a>'
    ).join('');
    set('.hero-links', linkHtml(''));
    set('.social-links', linkHtml('social-link'));
    set('.footer-left', '© ' + new Date().getFullYear() + ' — ' + esc(p.full_name));
    set('.footer-right', esc(p.footer_role) + (p.company ? ' <span class="footer-dot">◉</span> ' + esc(p.company) : ''));
  }

  function renderStats(rows) {
    const el = $('.stats-grid');
    if (!el || !rows.length) return;
    el.innerHTML = rows.map(s =>
      '<div class="stat"><div class="stat-num">' + esc(s.value) + '</div><div class="stat-label">' + esc(s.label) + '</div></div>'
    ).join('');
  }

  function renderSkills(rows) {
    const el = $('.skills-grid');
    if (!el || !rows.length) return;
    const tags = (list, cls) => (list || []).map(t => '<span class="tag-inline' + cls + '">' + esc(t) + '</span>').join('');
    el.innerHTML = rows.map(s => {
      const color = COLORS.includes(s.color) ? s.color : 'blue';
      return '<div class="skill-card">' +
        '<div class="skill-icon-wrap icon-' + color + '" aria-hidden="true">' + esc(s.icon) + '</div>' +
        '<div class="skill-name">' + esc(s.title) + '</div>' +
        ((s.main || []).length ? '<div class="skill-sub">Stack principale</div><div class="skill-list">' + tags(s.main, ' main') + '</div>' : '') +
        ((s.other || []).length ? '<div class="skill-sub alt">Aussi utilisé</div><div class="skill-list">' + tags(s.other, '') + '</div>' : '') +
        '</div>';
    }).join('');
  }

  function renderExperiences(rows) {
    const el = $('.timeline');
    if (!el || !rows.length) return;
    el.innerHTML = rows.map(x =>
      '<div class="timeline-item">' +
      '<div class="exp-period">' + esc(x.period) + '</div>' +
      '<div class="exp-title">' + esc(x.title) + '</div>' +
      '<div class="exp-company">' + esc(x.company) + '</div>' +
      ((x.bullets || []).length ? '<ul class="exp-list">' + x.bullets.map(b => '<li>' + rich(b) + '</li>').join('') + '</ul>' : '') +
      '</div>'
    ).join('');
  }

  function renderEducation(rows) {
    const el = $('.edu-grid');
    if (!el || !rows.length) return;
    el.innerHTML = rows.map(x =>
      '<div class="edu-card"><div class="exp-period">' + esc(x.period) + '</div>' +
      '<div class="edu-name">' + esc(x.name) + '</div><div class="edu-school">' + esc(x.school) + '</div></div>'
    ).join('');
  }

  function renderProjects(rows) {
    const section = $('#projects');
    rows = rows.filter(p => p.visible !== false);
    if (!section || !rows.length) return;
    $$('.project-item', section).forEach(el => el.remove());
    section.insertAdjacentHTML('beforeend', rows.map((p, i) => {
      const img = safeUrl(p.image_url);
      const url = safeUrl(p.url);
      const style = p.image_style === 'raw' || p.image_style === 'crop' ? ' ' + p.image_style : '';
      const body =
        '<div class="project-name">' + esc(p.name) + '</div>' +
        (p.context ? '<div class="project-context">' + esc(p.context) + '</div>' : '') +
        (p.description ? '<div class="project-desc">' + rich(p.description) + '</div>' : '') +
        (p.role || p.result ? '<div class="project-facts">' +
          (p.role ? '<div><b>Mon rôle —</b> ' + rich(p.role) + '</div>' : '') +
          (p.result ? '<div><b>Résultat —</b> ' + rich(p.result) + '</div>' : '') + '</div>' : '') +
        '<div class="project-tags">' + (p.tags || []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>';
      return '<div class="project-item">' +
        '<div class="project-num">' + two(i + 1) + '</div>' +
        (img
          ? '<div class="project-info has-shot"><div class="project-shot' + style + '"><img src="' + esc(img) + '" alt="Capture du projet ' + esc(p.name) + '" loading="lazy" /></div><div class="project-body">' + body + '</div></div>'
          : '<div class="project-info">' + body + '</div>') +
        (url
          ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ouvrir ' + esc(p.name) + ' dans un nouvel onglet">↗</a>'
          : '<span></span>') +
        '</div>';
    }).join(''));
  }

  function renderTestimonials(rows) {
    const section = $('#testimonials');
    if (!section) return;
    rows = rows.filter(t => t.visible !== false);
    section.hidden = !rows.length;
    const initials = name => String(name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
    $('.testi-grid', section).innerHTML = rows.map(t =>
      '<figure class="testi-card"><blockquote class="testi-quote">' + rich(t.quote) + '</blockquote>' +
      '<figcaption class="testi-author"><div class="testi-avatar" aria-hidden="true">' + esc(initials(t.author)) + '</div>' +
      '<div><div class="testi-name">' + esc(t.author) + '</div><div class="testi-role">' + esc(t.author_role) + '</div></div></figcaption></figure>'
    ).join('');
  }

  function render(data) {
    renderProfile((data.profile || [])[0]);
    renderStats(data.stats || []);
    renderSkills(data.skills || []);
    renderExperiences(data.experiences || []);
    renderEducation(data.education || []);
    renderProjects(data.projects || []);
    renderTestimonials(data.testimonials || []);
  }

  async function load() {
    const headers = { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey };
    const get = async (table, query) => {
      const res = await fetch(cfg.supabaseUrl + '/rest/v1/portfolio_' + table + '?select=*&' + query, { headers });
      if (!res.ok) throw new Error(table + ' : HTTP ' + res.status);
      return res.json();
    };
    const tables = ['stats', 'skills', 'experiences', 'education', 'projects', 'testimonials'];
    const [profile, ...rest] = await Promise.all([
      get('profile', 'id=eq.1'),
      ...tables.map(t => get(t, 'order=position.asc,id.asc'))
    ]);
    const data = { profile };
    tables.forEach((t, i) => { data[t] = rest[i]; });
    return data;
  }

  window.PortfolioSite = { render };

  if (cfg.isConfigured && cfg.isConfigured()) {
    load().then(render).catch(err => console.warn('[portfolio] contenus Supabase indisponibles, HTML statique conservé :', err.message));
  }
})();
