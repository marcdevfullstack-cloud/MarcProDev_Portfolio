// Fabrique le HTML des contenus à partir des données Supabase.
// Utilisé tel quel par le navigateur (js/site.js, js/project.js) et par
// scripts/build.mjs, pour que le site en ligne et le HTML généré soient identiques.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PortfolioRender = api;
})(typeof self !== 'undefined' ? self : this, function () {
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
  const PILLS = ['blue', 'orange', 'blue', 'yellow', 'orange', 'blue'];
  const two = n => String(n).padStart(2, '0');
  const lines = s => String(s || '').split('\n').map(l => l.trim()).filter(Boolean);
  const paragraphs = s => String(s || '').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);

  function cvHref(p) {
    let cv = safeUrl(p && p.cv_url);
    if (cv.includes('/storage/v1/object/public/')) cv += (cv.includes('?') ? '&' : '?') + 'download=Marc-Aurele-Adou-CV.pdf';
    return cv;
  }

  const projectHasDetail = p => !!(p.problem || p.solution || (p.gallery || []).length);

  function projectFacts(p) {
    return (p.role || p.result ? '<div class="project-facts">' +
      (p.role ? '<div><b>Mon rôle —</b> ' + rich(p.role) + '</div>' : '') +
      (p.result ? '<div><b>Résultat —</b> ' + rich(p.result) + '</div>' : '') + '</div>' : '');
  }
  const projectTags = p => '<div class="project-tags">' + (p.tags || []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>';
  function projectShot(p) {
    const img = safeUrl(p.image_url);
    if (!img) return '';
    const style = p.image_style === 'raw' || p.image_style === 'crop' ? ' ' + p.image_style : '';
    return '<div class="project-shot' + style + '"><img src="' + esc(img) + '" alt="Capture du projet ' + esc(p.name) + '" loading="lazy" /></div>';
  }

  function projectItem(p, i) {
    const url = safeUrl(p.url);
    const shot = projectShot(p);
    const body =
      '<div class="project-name">' + esc(p.name) + '</div>' +
      (p.context ? '<div class="project-context">' + esc(p.context) + '</div>' : '') +
      (p.description ? '<div class="project-desc">' + rich(p.description) + '</div>' : '') +
      projectFacts(p) + projectTags(p) +
      (projectHasDetail(p) && p.id > 0 ? '<a class="project-more" href="projet.html?id=' + encodeURIComponent(p.id) + '">Voir le détail du projet →</a>' : '');
    return '<div class="project-item">' +
      '<div class="project-num">' + two(i + 1) + '</div>' +
      (shot
        ? '<div class="project-info has-shot">' + shot + '<div class="project-body">' + body + '</div></div>'
        : '<div class="project-info">' + body + '</div>') +
      (url
        ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ouvrir ' + esc(p.name) + ' dans un nouvel onglet">↗</a>'
        : '<span></span>') +
      '</div>';
  }

  // Page de détail d'un projet (projet.html)
  function projectPage(p) {
    const url = safeUrl(p.url);
    const gallery = [p.image_url].concat(p.gallery || []).map(safeUrl).filter(Boolean);
    const block = (title, text) => text
      ? '<section class="case-block"><h2>' + title + '</h2>' + paragraphs(text).map(t => '<p>' + rich(t) + '</p>').join('') + '</section>'
      : '';
    return '<div class="section-eyebrow">' + esc(p.context || 'Projet') + '</div>' +
      '<h1 class="case-title">' + esc(p.name) + '</h1>' +
      (p.description ? '<p class="case-lead">' + rich(p.description) + '</p>' : '') +
      projectTags(p) +
      (url ? '<p class="case-cta"><a class="btn btn-blue" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Voir le projet en ligne ↗</a></p>' : '') +
      block('Le problème', p.problem) +
      block('Ma solution', p.solution) +
      block('Mon rôle', p.role) +
      block('Résultat', p.result) +
      (gallery.length ? '<section class="case-block"><h2>Captures</h2><div class="case-gallery">' +
        gallery.map((g, i) => '<a href="' + esc(g) + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(g) + '" alt="Capture ' + (i + 1) + ' du projet ' + esc(p.name) + '" loading="lazy" /></a>').join('') +
        '</div></section>' : '');
  }

  // Retourne { clé: html } — une entrée absente signifie « ne pas toucher à cette zone ».
  function regions(data) {
    const out = {};
    const p = (data.profile || [])[0];

    if (p) {
      const title = v => { const l = lines(v); return l.length ? l.map(esc).join('<br>') : undefined; };
      out.availability = '<span class="pulse"></span> ' + esc(p.availability);
      out.name = esc(p.first_name);
      out.headline = esc(p.headline);
      out.role = esc(p.role_line) + (p.role_stack ? ' — <span>' + esc(p.role_stack) + '</span>' : '');
      out.heroDesc = rich(p.hero_desc);
      out.heroMeta = [
        ['Localisation', p.location, ''],
        ['Entreprise', p.company, ' accent'],
        ['Expérience', p.experience_label, '']
      ].filter(m => m[1]).map(m =>
        '<div class="hero-meta-item"><span class="hero-meta-label">' + m[0] + '</span>' +
        '<span class="hero-meta-val' + m[2] + '">' + esc(m[1]) + '</span></div>'
      ).join('');
      if ((p.hero_pills || []).length) {
        out.heroPills = p.hero_pills.map((t, i) => '<span class="skill-pill pill-' + PILLS[i % PILLS.length] + '">' + esc(t) + '</span>').join(' ');
      }

      const links = [['LinkedIn', safeUrl(p.linkedin_url)], ['GitHub', safeUrl(p.github_url)]].filter(l => l[1]);
      const linkHtml = cls => links.map(l =>
        '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener noreferrer"' + (cls ? ' class="' + cls + '"' : '') + '>⟶ ' + l[0] + '</a>'
      ).join('');
      out.heroLinks = linkHtml('');
      out.socialLinks = linkHtml('social-link');

      out.aboutTitle = title(p.about_title) || '';
      const photo = safeUrl(p.photo_url);
      out.aboutBody =
        (photo ? '<img class="about-photo" src="' + esc(photo) + '" alt="Portrait de ' + esc(p.full_name) + '" width="112" height="112" />' : '') +
        paragraphs(p.about_text).map(t => '<p class="about-text">' + rich(t) + '</p>').join('') +
        '<div class="about-location"><span class="loc-pin">◉</span> ' + esc(p.about_location) + '</div>';

      out.skillsTitle = title(p.skills_title);
      out.experienceTitle = title(p.experience_title);
      out.projectsTitle = title(p.projects_title);
      out.testimonialsTitle = title(p.testimonials_title);
      const ct = lines(p.contact_title);
      if (ct.length) {
        // la dernière ligne prend le dégradé
        out.contactTitle = ct.map((l, i) => i === ct.length - 1 ? '<span class="grad">' + esc(l) + '</span>' : esc(l)).join('<br>');
      }

      out.contactDesc = esc(p.contact_desc);
      if (p.email) out.contactActions = '<a href="mailto:' + esc(p.email) + '" class="contact-email-badge">✉ ' + esc(p.email) + '</a>';
      out.cvInfo = '<span>' + esc(p.full_name) + '</span> — ' + esc(p.cv_title) +
        '<br><span class="cv-updated">PDF · ' + esc(p.cv_updated) + '</span>';
      out.footerLeft = '© ' + new Date().getFullYear() + ' — ' + esc(p.full_name);
      out.footerRight = esc(p.footer_role) + (p.company ? ' <span class="footer-dot">◉</span> ' + esc(p.company) : '');
    }

    const stats = data.stats || [];
    if (stats.length) {
      out.stats = stats.map(s =>
        '<div class="stat"><div class="stat-num">' + esc(s.value) + '</div><div class="stat-label">' + esc(s.label) + '</div></div>'
      ).join('');
    }

    const skills = data.skills || [];
    if (skills.length) {
      const tags = (list, cls) => (list || []).map(t => '<span class="tag-inline' + cls + '">' + esc(t) + '</span>').join(' ');
      out.skills = skills.map(s => {
        const color = COLORS.includes(s.color) ? s.color : 'blue';
        return '<div class="skill-card">' +
          '<div class="skill-icon-wrap icon-' + color + '" aria-hidden="true">' + esc(s.icon) + '</div>' +
          '<div class="skill-name">' + esc(s.title) + '</div>' +
          ((s.main || []).length ? '<div class="skill-sub">Stack principale</div><div class="skill-list">' + tags(s.main, ' main') + '</div>' : '') +
          ((s.other || []).length ? '<div class="skill-sub alt">Aussi utilisé</div><div class="skill-list">' + tags(s.other, '') + '</div>' : '') +
          '</div>';
      }).join('');
    }

    const exps = data.experiences || [];
    if (exps.length) {
      out.timeline = exps.map(x =>
        '<div class="timeline-item">' +
        '<div class="exp-period">' + esc(x.period) + '</div>' +
        '<div class="exp-title">' + esc(x.title) + '</div>' +
        '<div class="exp-company">' + esc(x.company) + '</div>' +
        ((x.bullets || []).length ? '<ul class="exp-list">' + x.bullets.map(b => '<li>' + rich(b) + '</li>').join('') + '</ul>' : '') +
        '</div>'
      ).join('');
    }

    const edu = data.education || [];
    if (edu.length) {
      out.education = edu.map(x =>
        '<div class="edu-card"><div class="exp-period">' + esc(x.period) + '</div>' +
        '<div class="edu-name">' + esc(x.name) + '</div><div class="edu-school">' + esc(x.school) + '</div></div>'
      ).join('');
    }

    const projects = (data.projects || []).filter(x => x.visible !== false);
    if (projects.length) out.projects = projects.map(projectItem).join('');

    if (data.testimonials) {
      const initials = name => String(name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
      out.testimonials = data.testimonials.filter(t => t.visible !== false).map(t => {
        const link = safeUrl(t.author_url);
        const name = link
          ? '<a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(t.author) + ' ↗</a>'
          : esc(t.author);
        return '<figure class="testi-card"><blockquote class="testi-quote">' + rich(t.quote) + '</blockquote>' +
          '<figcaption class="testi-author"><div class="testi-avatar" aria-hidden="true">' + esc(initials(t.author)) + '</div>' +
          '<div><div class="testi-name">' + name + '</div><div class="testi-role">' + esc(t.author_role) + '</div></div></figcaption></figure>';
      }).join('');
    }

    return out;
  }

  // Balises <head> : titre, description, aperçu de partage
  function meta(data) {
    const p = (data.profile || [])[0] || {};
    const site = safeUrl(p.site_url).replace(/\/+$/, '');
    let image = safeUrl(p.og_image_url);
    if (image && site && !/^https?:/i.test(image)) image = site + '/' + image.replace(/^\/+/, '');
    return {
      title: p.seo_title || '',
      description: p.seo_description || '',
      url: site ? site + '/' : '',
      image
    };
  }

  return { esc, rich, safeUrl, cvHref, regions, meta, projectHasDetail, projectPage };
});
