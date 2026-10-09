// Espace admin du portfolio : connexion Supabase, puis édition de chaque table.
(function () {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');

  // ─── Petits outils DOM (jamais d'innerHTML avec des données) ───
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k in el && k !== 'list') el[k] = v;
      else el.setAttribute(k, v);
    });
    children.flat().forEach(c => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  }
  const mount = (...nodes) => { app.replaceChildren(...nodes); };
  let toastTimer;
  function toast(text, kind) {
    toastEl.textContent = text;
    toastEl.className = kind || 'ok';
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, kind === 'error' ? 7000 : 3000);
  }
  const errText = e => (e && (e.message || e.error_description)) || String(e);

  // ─── Description des contenus éditables ───
  const BOLD = 'Entourez un passage de ** pour le mettre en gras : **comme ceci**.';
  const COLLECTIONS = {
    profile: {
      label: 'Profil & textes', single: true,
      intro: 'Accroche, section À propos, contact, liens et CV.',
      fields: [
        { name: 'first_name', label: 'Prénom affiché en grand', type: 'text' },
        { name: 'headline', label: 'Mot sous le prénom', type: 'text', hint: 'Ex. « Développeur. »' },
        { name: 'role_line', label: 'Spécialité', type: 'text' },
        { name: 'role_stack', label: 'Technologies phares', type: 'text', hint: 'Affiché en orange après la spécialité.' },
        { name: 'availability', label: 'Bandeau de disponibilité', type: 'text' },
        { name: 'hero_desc', label: 'Accroche', type: 'textarea', hint: BOLD },
        { name: 'location', label: 'Localisation', type: 'text' },
        { name: 'company', label: 'Entreprise actuelle', type: 'text' },
        { name: 'experience_label', label: 'Expérience (résumé)', type: 'text' },
        { name: 'about_title', label: 'Titre de la section À propos', type: 'textarea', rows: 2, hint: 'Un retour à la ligne crée une nouvelle ligne de titre.' },
        { name: 'about_text', label: 'Texte À propos', type: 'textarea', rows: 9, hint: 'Laissez une ligne vide entre deux paragraphes. ' + BOLD },
        { name: 'about_location', label: 'Ligne de localisation (À propos)', type: 'text' },
        { name: 'full_name', label: 'Nom complet', type: 'text' },
        { name: 'email', label: 'E-mail de contact', type: 'text' },
        { name: 'contact_desc', label: 'Texte de la section Contact', type: 'textarea', rows: 3 },
        { name: 'linkedin_url', label: 'Lien LinkedIn', type: 'text' },
        { name: 'github_url', label: 'Lien GitHub', type: 'text' },
        { name: 'cv_url', label: 'CV (PDF)', type: 'file', accept: 'application/pdf', folder: 'cv', hint: 'Choisissez un PDF pour remplacer le CV, puis enregistrez.' },
        { name: 'cv_title', label: 'Intitulé à côté du CV', type: 'text' },
        { name: 'cv_updated', label: 'Mention de mise à jour du CV', type: 'text', hint: 'Ex. « Mis à jour 2026 »' },
        { name: 'footer_role', label: 'Intitulé en pied de page', type: 'text' }
      ]
    },
    stats: {
      label: 'Chiffres clés', intro: 'Les quatre chiffres de la section À propos.',
      title: r => r.value + ' — ' + r.label,
      fields: [
        { name: 'value', label: 'Chiffre', type: 'text', required: true, hint: 'Court : « 10+ », « 35k+ ».' },
        { name: 'label', label: 'Libellé', type: 'text', required: true }
      ]
    },
    skills: {
      label: 'Compétences', intro: 'Une carte par domaine.',
      title: r => r.title, subtitle: r => (r.main || []).join(' · '),
      fields: [
        { name: 'title', label: 'Titre de la carte', type: 'text', required: true },
        { name: 'icon', label: 'Icône (emoji)', type: 'text' },
        { name: 'color', label: 'Couleur', type: 'select', options: [['blue', 'Bleu'], ['orange', 'Orange'], ['yellow', 'Jaune'], ['purple', 'Violet']] },
        { name: 'main', label: 'Stack principale', type: 'lines', hint: 'Une compétence par ligne.' },
        { name: 'other', label: 'Aussi utilisé', type: 'lines', hint: 'Une compétence par ligne.' }
      ]
    },
    experiences: {
      label: 'Expériences', intro: 'Le parcours professionnel, du plus récent au plus ancien.',
      title: r => r.title, subtitle: r => r.company + ' · ' + r.period,
      fields: [
        { name: 'period', label: 'Période', type: 'text', required: true, hint: 'Ex. « Mai 2025 — Septembre 2026 · CDI »' },
        { name: 'title', label: 'Poste', type: 'text', required: true },
        { name: 'company', label: 'Entreprise et lieu', type: 'text' },
        { name: 'bullets', label: 'Réalisations', type: 'lines', rows: 7, hint: 'Une réalisation par ligne. ' + BOLD }
      ]
    },
    education: {
      label: 'Formation', intro: 'Diplômes et langues.',
      title: r => r.name, subtitle: r => r.school + ' · ' + r.period,
      fields: [
        { name: 'period', label: 'Période ou rubrique', type: 'text', required: true },
        { name: 'name', label: 'Diplôme', type: 'text', required: true },
        { name: 'school', label: 'Établissement', type: 'text' }
      ]
    },
    projects: {
      label: 'Projets', intro: 'Les projets et leurs captures.',
      title: r => r.name, subtitle: r => r.context, thumb: r => r.image_url, hasVisible: true,
      fields: [
        { name: 'name', label: 'Nom du projet', type: 'text', required: true },
        { name: 'context', label: 'Contexte', type: 'text', hint: 'Ex. « Application mobile · Daymond · Lead Technique »' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'role', label: 'Mon rôle', type: 'textarea', rows: 3, hint: 'Affiché après « Mon rôle — ». Laissez vide pour masquer la ligne.' },
        { name: 'result', label: 'Résultat', type: 'textarea', rows: 2, hint: 'Affiché après « Résultat — ». Laissez vide pour masquer la ligne.' },
        { name: 'tags', label: 'Technologies', type: 'lines', hint: 'Une étiquette par ligne.' },
        { name: 'url', label: 'Lien du projet', type: 'text', hint: 'Laissez vide s\'il n\'y a pas de lien public.' },
        { name: 'image_url', label: 'Capture', type: 'file', accept: 'image/png,image/jpeg,image/webp', folder: 'images', image: true, hint: 'PNG, JPEG ou WebP. Une capture mobile en hauteur rend le mieux.' },
        { name: 'image_style', label: 'Présentation de la capture', type: 'select', options: [['frame', 'Telle quelle (image avec cadre de téléphone)'], ['raw', 'Coins arrondis et bordure (capture brute)'], ['crop', 'Recadrée au centre (capture du Play Store)']] },
        { name: 'visible', label: 'Afficher sur le site', type: 'bool' }
      ]
    },
    testimonials: {
      label: 'Témoignages', intro: 'La section n\'apparaît sur le site que s\'il y a au moins un témoignage affiché.',
      title: r => r.author, subtitle: r => r.author_role, hasVisible: true,
      fields: [
        { name: 'quote', label: 'Témoignage', type: 'textarea', rows: 5, required: true },
        { name: 'author', label: 'Auteur', type: 'text', required: true },
        { name: 'author_role', label: 'Poste et entreprise', type: 'text', hint: 'Ex. « PDG — Daymond »' },
        { name: 'visible', label: 'Afficher sur le site', type: 'bool' }
      ]
    }
  };

  // ─── Configuration manquante ───
  if (!cfg.isConfigured || !cfg.isConfigured() || !window.supabase) {
    mount(h('div', { class: 'center' }, h('div', { class: 'card wide' },
      h('h1', null, 'Supabase n\'est pas encore configuré'),
      h('p', null, 'L\'espace admin a besoin de votre projet Supabase pour fonctionner.'),
      h('ol', null,
        h('li', null, 'Créez un projet sur supabase.com.'),
        h('li', null, 'Dans SQL Editor, exécutez le contenu de ', h('code', null, 'supabase/schema.sql'), ' et suivez les étapes indiquées en tête du fichier.'),
        h('li', null, 'Copiez l\'URL du projet et la clé « anon / publishable » dans ', h('code', null, 'js/config.js'), '.'),
        h('li', null, 'Rechargez cette page.'))
    )));
    return;
  }

  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const bucket = cfg.bucket || 'portfolio';
  // les tables sont préfixées pour cohabiter avec celles des autres applications du projet
  const table = key => sb.from('portfolio_' + key);
  let session = null;
  let current = 'profile';
  let loginMessage = '';

  // ─── Connexion ───
  function renderLogin(message) {
    const email = h('input', { type: 'email', id: 'email', autocomplete: 'username', required: true });
    const password = h('input', { type: 'password', id: 'password', autocomplete: 'current-password', required: true });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Se connecter');
    const error = h('div', { class: 'msg error', hidden: !message }, message || '');
    mount(h('div', { class: 'center' }, h('form', {
      class: 'card',
      onsubmit: async e => {
        e.preventDefault();
        submit.disabled = true; error.hidden = true;
        const { error: err } = await sb.auth.signInWithPassword({ email: email.value.trim(), password: password.value });
        submit.disabled = false;
        if (err) { error.textContent = 'Connexion refusée : e-mail ou mot de passe incorrect.'; error.hidden = false; }
      }
    },
      h('h1', null, 'Espace admin'),
      h('p', null, 'Connectez-vous pour modifier le portfolio.'),
      error,
      h('div', { class: 'field' }, h('label', { for: 'email' }, 'E-mail'), email),
      h('div', { class: 'field' }, h('label', { for: 'password' }, 'Mot de passe'), password),
      submit
    )));
  }

  async function start(newSession) {
    session = newSession;
    if (!session) { renderLogin(loginMessage); loginMessage = ''; return; }
    const { data: isAdmin, error } = await sb.rpc('portfolio_is_admin');
    if (error || !isAdmin) {
      // la déconnexion relance start(null), qui affichera ce message
      loginMessage = error
        ? 'Vérification impossible : ' + errText(error) + ' — le fichier supabase/schema.sql a-t-il été exécuté ?'
        : 'Ce compte n\'est pas déclaré admin (voir la dernière étape de supabase/schema.sql).';
      await sb.auth.signOut();
      return;
    }
    renderShell();
  }

  // ─── Structure ───
  let mainEl;
  function renderShell() {
    mainEl = h('main', { class: 'main' });
    const tabs = Object.entries(COLLECTIONS).map(([key, c]) =>
      h('button', { class: 'tab' + (key === current ? ' active' : ''), type: 'button', 'data-key': key, onclick: () => open(key) }, c.label));
    mount(h('div', { class: 'shell' },
      h('aside', { class: 'side' },
        h('div', { class: 'brand' }, 'MarcProDev', h('span', null, '.'), ' admin'),
        tabs,
        h('div', { class: 'spacer' }),
        h('div', { class: 'who' }, session.user.email),
        h('a', { class: 'btn btn-small', href: 'index.html', target: '_blank', rel: 'noopener' }, 'Voir le site ↗'),
        h('button', { class: 'btn btn-small', type: 'button', onclick: () => sb.auth.signOut() }, 'Se déconnecter')),
      mainEl));
    open(current);
  }

  function open(key) {
    current = key;
    document.querySelectorAll('.side .tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
    const c = COLLECTIONS[key];
    return c.single ? showSingle(key) : showList(key);
  }

  function head(title, intro, ...actions) {
    return h('div', { class: 'main-head' }, h('div', null, h('h1', null, title), intro && h('p', null, intro)), h('div', { class: 'form-actions' }, actions));
  }
  const loading = () => { mainEl.replaceChildren(h('p', { style: 'color:var(--text2)' }, 'Chargement…')); };
  const failed = e => { mainEl.replaceChildren(h('div', { class: 'msg error' }, 'Erreur : ' + errText(e))); };

  // ─── Liste d'une table ───
  async function showList(key) {
    const c = COLLECTIONS[key];
    loading();
    const { data: rows, error } = await table(key).select('*').order('position').order('id');
    if (error) return failed(error);
    if (current !== key) return;

    const move = async (i, dir) => {
      const order = rows.slice();
      const j = i + dir;
      if (j < 0 || j >= order.length) return;
      [order[i], order[j]] = [order[j], order[i]];
      const updates = order.map((r, n) => ({ r, pos: n + 1 })).filter(x => x.r.position !== x.pos);
      const results = await Promise.all(updates.map(x => table(key).update({ position: x.pos }).eq('id', x.r.id)));
      const bad = results.find(r => r.error);
      if (bad) toast('Ordre non enregistré : ' + errText(bad.error), 'error');
      showList(key);
    };

    const list = rows.length
      ? h('div', { class: 'rows' }, rows.map((r, i) => {
        const del = h('button', { class: 'btn btn-small btn-danger', type: 'button' }, 'Supprimer');
        let armed = false;
        del.addEventListener('click', async () => {
          if (!armed) { armed = true; del.textContent = 'Confirmer ?'; setTimeout(() => { armed = false; del.textContent = 'Supprimer'; }, 4000); return; }
          del.disabled = true;
          const { error: err } = await table(key).delete().eq('id', r.id);
          if (err) { toast('Suppression impossible : ' + errText(err), 'error'); del.disabled = false; return; }
          toast('Supprimé.');
          showList(key);
        });
        const thumb = c.thumb && c.thumb(r);
        return h('div', { class: 'row' },
          thumb && h('img', { class: 'thumb', src: thumb, alt: '' }),
          h('div', { class: 'title' },
            h('b', null, c.title(r), c.hasVisible && r.visible === false && h('span', { class: 'badge' }, 'masqué')),
            c.subtitle && h('small', null, c.subtitle(r))),
          h('div', { class: 'actions' },
            h('button', { class: 'btn btn-small', type: 'button', disabled: i === 0, 'aria-label': 'Monter', onclick: () => move(i, -1) }, '↑'),
            h('button', { class: 'btn btn-small', type: 'button', disabled: i === rows.length - 1, 'aria-label': 'Descendre', onclick: () => move(i, 1) }, '↓'),
            h('button', { class: 'btn btn-small', type: 'button', onclick: () => showForm(key, r, rows) }, 'Modifier'),
            del));
      }))
      : h('div', { class: 'empty' }, 'Aucun élément pour l\'instant.');

    mainEl.replaceChildren(
      head(c.label, c.intro, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => showForm(key, null, rows) }, '+ Ajouter')),
      list);
  }

  // ─── Formulaire ───
  function buildField(f, value) {
    const id = 'f-' + f.name;
    let input, read, extra = [];

    if (f.type === 'textarea' || f.type === 'lines') {
      input = h('textarea', { id, rows: f.rows || 4 });
      input.value = f.type === 'lines' ? (value || []).join('\n') : (value || '');
      read = () => f.type === 'lines'
        ? input.value.split('\n').map(s => s.trim()).filter(Boolean)
        : input.value.trim();
    } else if (f.type === 'select') {
      input = h('select', { id }, f.options.map(([v, l]) => h('option', { value: v }, l)));
      input.value = value || f.options[0][0];
      read = () => input.value;
    } else if (f.type === 'bool') {
      input = h('input', { type: 'checkbox', id, checked: value !== false });
      read = () => input.checked;
      return { read, node: h('div', { class: 'field' }, h('div', { class: 'check' }, input, h('label', { for: id }, f.label))) };
    } else if (f.type === 'file') {
      input = h('input', { type: 'text', id, value: value || '', placeholder: 'Adresse du fichier' });
      const preview = f.image ? h('img', { class: 'preview', alt: 'Aperçu', hidden: !value, src: value || '' }) : null;
      const status = h('span', { class: 'hint' });
      const picker = h('input', { type: 'file', accept: f.accept, 'aria-label': 'Choisir un fichier pour ' + f.label });
      picker.addEventListener('change', async () => {
        const file = picker.files[0];
        if (!file) return;
        if (!f.accept.split(',').includes(file.type)) { status.textContent = 'Format non accepté.'; return; }
        if (file.size > 10 * 1024 * 1024) { status.textContent = 'Fichier trop lourd (10 Mo maximum).'; return; }
        status.textContent = 'Envoi en cours…';
        const clean = file.name.normalize('NFD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').toLowerCase();
        const path = f.folder + '/' + Date.now() + '-' + clean;
        const { error } = await sb.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: '3600' });
        if (error) { status.textContent = 'Échec de l\'envoi : ' + errText(error); return; }
        input.value = sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
        if (preview) { preview.src = input.value; preview.hidden = false; }
        status.textContent = 'Fichier envoyé. Enregistrez pour l\'appliquer.';
      });
      input.addEventListener('change', () => { if (preview) { preview.src = input.value; preview.hidden = !input.value; } });
      extra = [h('div', { class: 'upload-row' }, picker, status), preview];
      read = () => input.value.trim();
    } else {
      input = h('input', { type: 'text', id, value: value == null ? '' : value });
      read = () => input.value.trim();
    }
    if (f.required) input.required = true;
    return { read, node: h('div', { class: 'field' }, h('label', { for: id }, f.label), input, extra, f.hint && h('div', { class: 'hint' }, f.hint)) };
  }

  function buildForm(key, row, onSave, onCancel) {
    const c = COLLECTIONS[key];
    const built = c.fields.map(f => ({ f, ...buildField(f, row ? row[f.name] : undefined) }));
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Enregistrer');
    return h('form', {
      class: 'panel',
      onsubmit: async e => {
        e.preventDefault();
        const values = {};
        built.forEach(b => { values[b.f.name] = b.read(); });
        submit.disabled = true;
        const error = await onSave(values);
        submit.disabled = false;
        if (error) toast('Enregistrement impossible : ' + errText(error), 'error');
      }
    },
      built.map(b => b.node),
      h('div', { class: 'form-actions' }, submit, onCancel && h('button', { class: 'btn', type: 'button', onclick: onCancel }, 'Annuler')));
  }

  function showForm(key, row, rows) {
    const c = COLLECTIONS[key];
    const back = () => showList(key);
    mainEl.replaceChildren(
      head((row ? 'Modifier' : 'Ajouter') + ' — ' + c.label, null),
      buildForm(key, row, async values => {
        let error;
        if (row) ({ error } = await table(key).update(values).eq('id', row.id));
        else ({ error } = await table(key).insert({ ...values, position: rows.reduce((m, r) => Math.max(m, r.position), 0) + 1 }));
        if (error) return error;
        toast('Enregistré.');
        back();
      }, back));
    window.scrollTo(0, 0);
  }

  async function showSingle(key) {
    const c = COLLECTIONS[key];
    loading();
    const { data, error } = await table(key).select('*').eq('id', 1).maybeSingle();
    if (error) return failed(error);
    if (current !== key) return;
    mainEl.replaceChildren(
      head(c.label, c.intro),
      buildForm(key, data, async values => {
        const { error: err } = await table(key).upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
        if (err) return err;
        toast('Enregistré.');
      }));
  }

  // ─── Démarrage ───
  let startedFor;
  sb.auth.onAuthStateChange((_event, s) => {
    const id = s ? s.user.id : null;
    if (id === startedFor) { session = s; return; }  // simple rafraîchissement du jeton
    startedFor = id;
    // hors du callback : Supabase déconseille d'y appeler d'autres méthodes auth
    setTimeout(() => start(s), 0);
  });
})();
