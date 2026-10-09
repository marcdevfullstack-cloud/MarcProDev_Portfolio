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
    children.flat(Infinity).forEach(c => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  }
  const mount = (...nodes) => { app.replaceChildren(...nodes); };
  let toastTimer;
  function toast(text, kind) {
    toastEl.textContent = text;
    toastEl.className = kind || 'ok';
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, kind === 'error' ? 8000 : 3000);
  }
  function errText(e) {
    const text = (e && (e.message || e.error_description)) || String(e);
    // colonne ou table inconnue : la migration n'a pas été exécutée
    return /column|schema cache|does not exist/i.test(text)
      ? text + ' — avez-vous exécuté supabase/002_ameliorations.sql ?'
      : text;
  }
  // bouton à deux clics pour les actions irréversibles
  function confirmButton(label, action, cls) {
    const btn = h('button', { class: 'btn btn-small ' + (cls || 'btn-danger'), type: 'button' }, label);
    let armed = false;
    btn.addEventListener('click', async () => {
      if (!armed) {
        armed = true; btn.textContent = 'Confirmer ?';
        setTimeout(() => { armed = false; btn.textContent = label; }, 4000);
        return;
      }
      btn.disabled = true;
      await action();
      btn.disabled = false;
    });
    return btn;
  }

  // ─── Description des contenus éditables ───
  const BOLD = 'Entourez un passage de ** pour le mettre en gras : **comme ceci**.';
  const TITLE_HINT = 'Un retour à la ligne crée une nouvelle ligne de titre.';
  const IMAGES = 'image/png,image/jpeg,image/webp';
  const COLLECTIONS = {
    profile: {
      label: 'Profil & textes', single: true,
      intro: 'Accroche, section À propos, contact, liens, CV et référencement.',
      fields: [
        { heading: 'Haut de page' },
        { name: 'first_name', label: 'Prénom affiché en grand', type: 'text' },
        { name: 'headline', label: 'Mot sous le prénom', type: 'text', hint: 'Ex. « Développeur. »' },
        { name: 'role_line', label: 'Spécialité', type: 'text' },
        { name: 'role_stack', label: 'Technologies phares', type: 'text', hint: 'Affiché en orange après la spécialité.' },
        { name: 'availability', label: 'Bandeau de disponibilité', type: 'text' },
        { name: 'hero_desc', label: 'Accroche', type: 'textarea', hint: BOLD },
        { name: 'location', label: 'Localisation', type: 'text' },
        { name: 'company', label: 'Entreprise actuelle', type: 'text' },
        { name: 'experience_label', label: 'Expérience (résumé)', type: 'text' },
        { name: 'hero_pills', label: 'Carte « tech stack »', type: 'lines', hint: 'Une technologie par ligne (six au maximum pour un bon rendu).' },
        { heading: 'À propos' },
        { name: 'about_title', label: 'Titre de la section', type: 'textarea', rows: 2, hint: TITLE_HINT },
        { name: 'about_text', label: 'Texte', type: 'textarea', rows: 9, hint: 'Laissez une ligne vide entre deux paragraphes. ' + BOLD },
        { name: 'photo_url', label: 'Photo', type: 'file', accept: IMAGES, folder: 'images', image: true, compress: 600, hint: 'Un portrait carré rend le mieux.' },
        { name: 'about_location', label: 'Ligne de localisation', type: 'text' },
        { heading: 'Titres des sections' },
        { name: 'skills_title', label: 'Compétences', type: 'textarea', rows: 2, hint: TITLE_HINT },
        { name: 'experience_title', label: 'Parcours', type: 'textarea', rows: 2 },
        { name: 'projects_title', label: 'Projets', type: 'textarea', rows: 2 },
        { name: 'testimonials_title', label: 'Témoignages', type: 'textarea', rows: 2 },
        { name: 'contact_title', label: 'Contact', type: 'textarea', rows: 2, hint: 'La dernière ligne s\'affiche en dégradé.' },
        { heading: 'Contact, liens et CV' },
        { name: 'full_name', label: 'Nom complet', type: 'text' },
        { name: 'email', label: 'E-mail de contact', type: 'text' },
        { name: 'contact_desc', label: 'Texte de la section Contact', type: 'textarea', rows: 3 },
        { name: 'linkedin_url', label: 'Lien LinkedIn', type: 'text' },
        { name: 'github_url', label: 'Lien GitHub', type: 'text' },
        { name: 'cv_url', label: 'CV (PDF)', type: 'file', accept: 'application/pdf', folder: 'cv', hint: 'Choisissez un PDF pour remplacer le CV, puis enregistrez.' },
        { name: 'cv_title', label: 'Intitulé à côté du CV', type: 'text' },
        { name: 'cv_updated', label: 'Mention de mise à jour du CV', type: 'text', hint: 'Ex. « Mis à jour 2026 »' },
        { name: 'footer_role', label: 'Intitulé en pied de page', type: 'text' },
        { heading: 'Référencement et partage' },
        { name: 'site_url', label: 'Adresse du site', type: 'text', hint: 'Ex. https://marcprodev.com — nécessaire pour l\'aperçu sur LinkedIn.' },
        { name: 'seo_title', label: 'Titre dans Google et dans l\'onglet', type: 'text' },
        { name: 'seo_description', label: 'Description dans Google et LinkedIn', type: 'textarea', rows: 3, hint: 'Environ 150 caractères.' },
        { name: 'og_image_url', label: 'Image de partage', type: 'file', accept: 'image/png,image/jpeg', folder: 'images', image: true, hint: '1200 × 630 px, PNG ou JPEG. Ces quatre champs s\'appliquent à la prochaine publication.' }
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
      label: 'Projets', intro: 'Les projets, leurs captures et leur page de détail.',
      title: r => r.name, subtitle: r => r.context, thumb: r => r.image_url, hasVisible: true,
      fields: [
        { heading: 'Dans la liste des projets' },
        { name: 'name', label: 'Nom du projet', type: 'text', required: true },
        { name: 'context', label: 'Contexte', type: 'text', hint: 'Ex. « Application mobile · Daymond · Lead Technique »' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'role', label: 'Mon rôle', type: 'textarea', rows: 3, hint: 'Affiché après « Mon rôle — ». Laissez vide pour masquer la ligne.' },
        { name: 'result', label: 'Résultat', type: 'textarea', rows: 2, hint: 'Affiché après « Résultat — ». Laissez vide pour masquer la ligne.' },
        { name: 'tags', label: 'Technologies', type: 'lines', hint: 'Une étiquette par ligne.' },
        { name: 'url', label: 'Lien du projet', type: 'text', hint: 'Laissez vide s\'il n\'y a pas de lien public.' },
        { name: 'image_url', label: 'Capture principale', type: 'file', accept: IMAGES, folder: 'images', image: true, compress: 1000, hint: 'Une capture mobile en hauteur rend le mieux. L\'image est allégée automatiquement.' },
        { name: 'image_style', label: 'Présentation de la capture', type: 'select', options: [['frame', 'Telle quelle (image avec cadre de téléphone)'], ['raw', 'Coins arrondis et bordure (capture brute)'], ['crop', 'Recadrée au centre (capture du Play Store)']] },
        { name: 'visible', label: 'Afficher sur le site', type: 'bool' },
        { heading: 'Page de détail du projet' },
        { name: 'problem', label: 'Le problème', type: 'textarea', rows: 5, hint: 'Le besoin de départ. La page de détail apparaît dès qu\'un de ces trois champs est rempli. ' + BOLD },
        { name: 'solution', label: 'Ma solution', type: 'textarea', rows: 6, hint: 'Ce que vous avez construit et les choix techniques. Ligne vide entre deux paragraphes.' },
        { name: 'gallery', label: 'Autres captures', type: 'gallery', accept: IMAGES, folder: 'images', compress: 1000 }
      ]
    },
    testimonials: {
      label: 'Témoignages', intro: 'La section n\'apparaît sur le site que s\'il y a au moins un témoignage affiché.',
      title: r => r.author, subtitle: r => r.author_role, hasVisible: true,
      fields: [
        { name: 'quote', label: 'Témoignage', type: 'textarea', rows: 5, required: true },
        { name: 'author', label: 'Auteur', type: 'text', required: true },
        { name: 'author_role', label: 'Poste et entreprise', type: 'text', hint: 'Ex. « PDG — Daymond »' },
        { name: 'author_url', label: 'Profil LinkedIn de l\'auteur', type: 'text', hint: 'Facultatif. Rend le nom cliquable : un témoignage vérifiable pèse plus.' },
        { name: 'visible', label: 'Afficher sur le site', type: 'bool' }
      ]
    }
  };
  const VIEWS = {
    messages: { label: 'Messages', show: showMessages },
    statistics: { label: 'Statistiques', show: showStatistics },
    publish: { label: 'Publication & sauvegarde', show: showPublish },
    security: { label: 'Sécurité', show: showSecurity }
  };

  // ─── Configuration manquante ───
  if (!cfg.isConfigured || !cfg.isConfigured() || !window.supabase) {
    mount(h('div', { class: 'center' }, h('div', { class: 'card wide' },
      h('h1', null, 'Supabase n\'est pas encore configuré'),
      h('p', null, 'L\'espace admin a besoin de votre projet Supabase pour fonctionner.'),
      h('ol', null,
        h('li', null, 'Créez un projet sur supabase.com.'),
        h('li', null, 'Dans SQL Editor, exécutez ', h('code', null, 'supabase/schema.sql'), ' puis ', h('code', null, 'supabase/002_ameliorations.sql'), '.'),
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
  let recovering = /type=recovery/.test(location.hash);

  // ─── Fichiers : compression, envoi, nettoyage ───
  const publicPrefix = cfg.supabaseUrl + '/storage/v1/object/public/' + bucket + '/';
  const storagePath = url => (url && url.startsWith(publicPrefix))
    ? decodeURIComponent(url.slice(publicPrefix.length).split('?')[0]) : null;
  async function removeFiles(urls) {
    const paths = [...new Set(urls.map(storagePath).filter(Boolean))];
    if (paths.length) await sb.storage.from(bucket).remove(paths);
  }
  const fileUrls = (c, row) => !row ? [] : c.fields.flatMap(f =>
    f.type === 'file' ? [row[f.name]] : f.type === 'gallery' ? (row[f.name] || []) : []).filter(Boolean);

  // Redimensionne et convertit en WebP ; garde l'original si ce n'est pas plus léger.
  async function compressImage(file, maxWidth) {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, maxWidth / bmp.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
      if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
      return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
    } catch (e) {
      return file;
    }
  }

  async function uploadFile(f, file) {
    if (!f.accept.split(',').includes(file.type)) throw new Error('Format non accepté.');
    if (f.compress) file = await compressImage(file, f.compress);
    if (file.size > 10 * 1024 * 1024) throw new Error('Fichier trop lourd (10 Mo maximum).');
    const clean = file.name.normalize('NFD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').toLowerCase();
    const path = f.folder + '/' + Date.now() + '-' + clean;
    const { error } = await sb.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: '31536000' });
    if (error) throw error;
    return { url: publicPrefix + path, size: file.size };
  }
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko';

  // ─── Connexion, mot de passe oublié, code à usage unique ───
  function authCard(title, intro, ...content) {
    mount(h('div', { class: 'center' }, h('div', { class: 'card' }, h('h1', null, title), intro && h('p', null, intro), content)));
  }

  function renderLogin(message, kind) {
    const email = h('input', { type: 'email', id: 'email', autocomplete: 'username', required: true });
    const password = h('input', { type: 'password', id: 'password', autocomplete: 'current-password', required: true });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Se connecter');
    const note = h('div', { class: 'msg ' + (kind || 'error'), hidden: !message }, message || '');
    const say = (text, k) => { note.textContent = text; note.className = 'msg ' + k; note.hidden = false; };
    authCard('Espace admin', 'Connectez-vous pour modifier le portfolio.',
      h('form', {
        onsubmit: async e => {
          e.preventDefault();
          submit.disabled = true; note.hidden = true;
          const { error } = await sb.auth.signInWithPassword({ email: email.value.trim(), password: password.value });
          submit.disabled = false;
          if (error) say('Connexion refusée : e-mail ou mot de passe incorrect.', 'error');
        }
      },
        note,
        h('div', { class: 'field' }, h('label', { for: 'email' }, 'E-mail'), email),
        h('div', { class: 'field' }, h('label', { for: 'password' }, 'Mot de passe'), password),
        h('div', { class: 'form-actions' },
          submit,
          h('button', {
            class: 'btn', type: 'button',
            onclick: async () => {
              if (!email.value.trim()) return say('Saisissez d\'abord votre e-mail.', 'error');
              const { error } = await sb.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: location.origin + location.pathname });
              if (error) return say('Envoi impossible : ' + errText(error), 'error');
              say('Si ce compte existe, un e-mail de réinitialisation vient d\'être envoyé.', 'ok');
            }
          }, 'Mot de passe oublié ?'))));
  }

  function renderNewPassword() {
    const p1 = h('input', { type: 'password', id: 'new-password', autocomplete: 'new-password', required: true, minLength: 8 });
    const p2 = h('input', { type: 'password', id: 'new-password-2', autocomplete: 'new-password', required: true, minLength: 8 });
    const note = h('div', { class: 'msg error', hidden: true });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Enregistrer le mot de passe');
    authCard('Nouveau mot de passe', 'Choisissez un mot de passe d\'au moins 8 caractères.',
      h('form', {
        onsubmit: async e => {
          e.preventDefault();
          if (p1.value !== p2.value) { note.textContent = 'Les deux mots de passe sont différents.'; note.hidden = false; return; }
          submit.disabled = true;
          const { error } = await sb.auth.updateUser({ password: p1.value });
          submit.disabled = false;
          if (error) { note.textContent = 'Changement impossible : ' + errText(error); note.hidden = false; return; }
          recovering = false;
          history.replaceState(null, '', location.pathname);
          toast('Mot de passe modifié.');
          start(session);
        }
      },
        note,
        h('div', { class: 'field' }, h('label', { for: 'new-password' }, 'Nouveau mot de passe'), p1),
        h('div', { class: 'field' }, h('label', { for: 'new-password-2' }, 'Confirmez'), p2),
        submit));
  }

  async function renderMfaChallenge() {
    const { data } = await sb.auth.mfa.listFactors();
    const factor = data && (data.totp || []).find(f => f.status === 'verified');
    if (!factor) return enter();
    const code = h('input', { type: 'text', id: 'mfa-code', inputMode: 'numeric', autocomplete: 'one-time-code', maxLength: 6, required: true });
    const note = h('div', { class: 'msg error', hidden: true });
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Vérifier');
    authCard('Code de vérification', 'Saisissez le code à 6 chiffres de votre application d\'authentification.',
      h('form', {
        onsubmit: async e => {
          e.preventDefault();
          submit.disabled = true;
          const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.value.trim() });
          submit.disabled = false;
          if (error) { note.textContent = 'Code incorrect ou expiré.'; note.hidden = false; return; }
          enter();
        }
      },
        note,
        h('div', { class: 'field' }, h('label', { for: 'mfa-code' }, 'Code'), code),
        h('div', { class: 'form-actions' }, submit,
          h('button', { class: 'btn', type: 'button', onclick: () => sb.auth.signOut() }, 'Se déconnecter'))));
    code.focus();
  }

  async function start(newSession) {
    session = newSession;
    if (!session) { renderLogin(loginMessage); loginMessage = ''; return; }
    if (recovering) return renderNewPassword();
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') return renderMfaChallenge();
    enter();
  }

  async function enter() {
    const { data: isAdmin, error } = await sb.rpc('portfolio_is_admin');
    if (error || !isAdmin) {
      // la déconnexion relance start(null), qui affichera ce message
      loginMessage = error
        ? 'Vérification impossible : ' + errText(error)
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
    const tab = (key, label) => h('button', { class: 'tab' + (key === current ? ' active' : ''), type: 'button', 'data-key': key, onclick: () => open(key) }, label);
    const unread = h('span', { class: 'badge unread', hidden: true });
    table('messages').select('id', { count: 'exact', head: true }).eq('read', false)
      .then(({ count }) => { if (count) { unread.textContent = count; unread.hidden = false; } });
    mount(h('div', { class: 'shell' },
      h('aside', { class: 'side' },
        h('div', { class: 'brand' }, 'MarcProDev', h('span', null, '.'), ' admin'),
        Object.entries(COLLECTIONS).map(([key, c]) => tab(key, c.label)),
        h('div', { class: 'sep' }),
        Object.entries(VIEWS).map(([key, v]) => {
          const t = tab(key, v.label);
          if (key === 'messages') t.append(unread);
          return t;
        }),
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
    if (VIEWS[key]) return VIEWS[key].show();
    return COLLECTIONS[key].single ? showSingle(key) : showList(key);
  }

  function head(title, intro, ...actions) {
    return h('div', { class: 'main-head' }, h('div', null, h('h1', null, title), intro && h('p', null, intro)), h('div', { class: 'form-actions' }, actions));
  }
  const loading = () => { mainEl.replaceChildren(h('p', { class: 'muted' }, 'Chargement…')); };
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
        const del = confirmButton('Supprimer', async () => {
          const { error: err } = await table(key).delete().eq('id', r.id);
          if (err) return toast('Suppression impossible : ' + errText(err), 'error');
          await removeFiles(fileUrls(c, r));
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
  // uploaded : fichiers envoyés pendant l'édition, pour pouvoir nettoyer ceux qui ne servent pas
  function buildField(f, value, uploaded) {
    if (f.heading) return { node: h('h2', { class: 'form-heading' }, f.heading) };
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
      return { f, read: () => input.checked, node: h('div', { class: 'field' }, h('div', { class: 'check' }, input, h('label', { for: id }, f.label))) };
    } else if (f.type === 'file') {
      input = h('input', { type: 'text', id, value: value || '', placeholder: 'Adresse du fichier' });
      const preview = f.image ? h('img', { class: 'preview', alt: 'Aperçu', hidden: !value, src: value || '' }) : null;
      const status = h('span', { class: 'hint' });
      const picker = h('input', { type: 'file', accept: f.accept, 'aria-label': 'Choisir un fichier pour ' + f.label });
      picker.addEventListener('change', async () => {
        const file = picker.files[0];
        if (!file) return;
        status.textContent = 'Envoi en cours…';
        try {
          const up = await uploadFile(f, file);
          uploaded.push(up.url);
          input.value = up.url;
          if (preview) { preview.src = up.url; preview.hidden = false; }
          status.textContent = 'Fichier envoyé (' + kb(up.size) + '). Enregistrez pour l\'appliquer.';
        } catch (e) { status.textContent = 'Échec de l\'envoi : ' + errText(e); }
        picker.value = '';
      });
      input.addEventListener('change', () => { if (preview) { preview.src = input.value; preview.hidden = !input.value; } });
      extra = [h('div', { class: 'upload-row' }, picker, status), preview];
      read = () => input.value.trim();
    } else if (f.type === 'gallery') {
      let urls = (value || []).slice();
      const grid = h('div', { class: 'gallery' });
      const status = h('span', { class: 'hint' });
      const draw = () => grid.replaceChildren(...urls.map((u, i) => h('div', { class: 'gallery-item' },
        h('img', { src: u, alt: 'Capture ' + (i + 1) }),
        h('button', { class: 'btn btn-small btn-danger', type: 'button', onclick: () => { urls.splice(i, 1); draw(); } }, 'Retirer'))));
      const picker = h('input', { type: 'file', accept: f.accept, multiple: true, id });
      picker.addEventListener('change', async () => {
        const files = [...picker.files];
        for (let n = 0; n < files.length; n++) {
          status.textContent = 'Envoi ' + (n + 1) + ' / ' + files.length + '…';
          try {
            const up = await uploadFile(f, files[n]);
            uploaded.push(up.url); urls.push(up.url); draw();
          } catch (e) { status.textContent = 'Échec de l\'envoi : ' + errText(e); picker.value = ''; return; }
        }
        status.textContent = files.length + ' capture(s) ajoutée(s). Enregistrez pour l\'appliquer.';
        picker.value = '';
      });
      draw();
      return { f, read: () => urls.slice(), node: h('div', { class: 'field' }, h('label', { for: id }, f.label), grid, h('div', { class: 'upload-row' }, picker, status)) };
    } else {
      input = h('input', { type: 'text', id, value: value == null ? '' : value });
      read = () => input.value.trim();
    }
    if (f.required) input.required = true;
    return { f, read, node: h('div', { class: 'field' }, h('label', { for: id }, f.label), input, extra, f.hint && h('div', { class: 'hint' }, f.hint)) };
  }

  function buildForm(key, row, onSave, onCancel) {
    const c = COLLECTIONS[key];
    const uploaded = [];
    const built = c.fields.map(f => buildField(f, row ? row[f.name] : undefined, uploaded));
    const values = () => {
      const v = {};
      built.forEach(b => { if (b.read) v[b.f.name] = b.read(); });
      return v;
    };
    const submit = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Enregistrer');
    return h('form', {
      class: 'panel',
      onsubmit: async e => {
        e.preventDefault();
        const v = values();
        submit.disabled = true;
        const error = await onSave(v);
        submit.disabled = false;
        if (error) return toast('Enregistrement impossible : ' + errText(error), 'error');
        // nettoyage : anciens fichiers remplacés et envois finalement non utilisés
        const kept = fileUrls(c, v);
        await removeFiles(fileUrls(c, row).concat(uploaded).filter(u => !kept.includes(u)));
        uploaded.length = 0;
      }
    },
      built.map(b => b.node),
      h('div', { class: 'form-actions' },
        submit,
        h('button', {
          class: 'btn', type: 'button',
          onclick: () => {
            const draft = Object.assign({ id: row ? row.id : -1, position: row ? row.position : 9999 }, values());
            localStorage.setItem('portfolio_preview', JSON.stringify({ key, row: draft }));
            window.open('index.html?preview=1', 'portfolio-preview');
          }
        }, 'Aperçu sur le site ↗'),
        onCancel && h('button', { class: 'btn', type: 'button', onclick: async () => { await removeFiles(uploaded); onCancel(); } }, 'Annuler')));
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
        setTimeout(back, 0);   // après le nettoyage des fichiers
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
        setTimeout(() => { if (current === key) showSingle(key); }, 0);
      }));
  }

  // ─── Messages du formulaire de contact ───
  async function showMessages() {
    loading();
    const { data: rows, error } = await table('messages').select('*').order('created_at', { ascending: false });
    if (error) return failed(error);
    if (current !== 'messages') return;
    const date = d => new Date(d).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
    const list = rows.length
      ? h('div', { class: 'rows' }, rows.map(m => h('article', { class: 'message' + (m.read ? '' : ' unread') },
        h('header', null,
          h('div', null,
            h('b', null, m.name), m.company && h('span', { class: 'muted' }, ' · ' + m.company),
            !m.read && h('span', { class: 'badge unread' }, 'nouveau')),
          h('small', { class: 'muted' }, date(m.created_at))),
        h('a', { href: 'mailto:' + m.email }, m.email),
        h('p', null, m.message),
        h('div', { class: 'actions' },
          h('a', { class: 'btn btn-small', href: 'mailto:' + m.email + '?subject=' + encodeURIComponent('Re: votre message') }, 'Répondre'),
          h('button', {
            class: 'btn btn-small', type: 'button',
            onclick: async () => {
              const { error: err } = await table('messages').update({ read: !m.read }).eq('id', m.id);
              if (err) return toast('Modification impossible : ' + errText(err), 'error');
              showMessages();
            }
          }, m.read ? 'Marquer comme non lu' : 'Marquer comme lu'),
          confirmButton('Supprimer', async () => {
            const { error: err } = await table('messages').delete().eq('id', m.id);
            if (err) return toast('Suppression impossible : ' + errText(err), 'error');
            showMessages();
          })))))
      : h('div', { class: 'empty' }, 'Aucun message pour l\'instant.');
    mainEl.replaceChildren(head('Messages', 'Les messages envoyés depuis le formulaire de contact du site.'), list);
    const badge = document.querySelector('.side .badge.unread');
    const count = rows.filter(m => !m.read).length;
    if (badge) { badge.textContent = count; badge.hidden = !count; }
  }

  // ─── Statistiques ───
  async function showStatistics() {
    loading();
    const types = [['visit', 'Visites du site'], ['cv_download', 'Téléchargements du CV'], ['project_view', 'Pages projet consultées']];
    const since = days => new Date(Date.now() - days * 86400000).toISOString();
    const periods = [['7 derniers jours', since(7)], ['30 derniers jours', since(30)], ['Depuis le début', null]];
    const count = async (type, from) => {
      let q = table('events').select('id', { count: 'exact', head: true }).eq('type', type);
      if (from) q = q.gte('created_at', from);
      const { count: n, error } = await q;
      if (error) throw error;
      return n || 0;
    };
    let grid;
    try {
      grid = await Promise.all(types.map(t => Promise.all(periods.map(p => count(t[0], p[1])))));
    } catch (e) { return failed(e); }
    if (current !== 'statistics') return;
    mainEl.replaceChildren(
      head('Statistiques', 'Une visite est comptée une fois par session de navigation. Aucune donnée personnelle n\'est enregistrée.'),
      h('div', { class: 'panel' },
        h('table', { class: 'stats-table' },
          h('thead', null, h('tr', null, h('th', null, ''), periods.map(p => h('th', null, p[0])))),
          h('tbody', null, types.map((t, i) => h('tr', null, h('th', { scope: 'row' }, t[1]), grid[i].map(n => h('td', null, String(n))))))),
        h('p', { class: 'hint' }, 'Ces chiffres incluent les robots d\'indexation : lisez-les comme une tendance, pas comme un compte exact.')));
  }

  // ─── Publication et sauvegarde ───
  function showPublish() {
    const publish = h('button', { class: 'btn btn-primary', type: 'button' }, 'Publier maintenant');
    const result = h('div', { class: 'msg', hidden: true });
    publish.addEventListener('click', async () => {
      publish.disabled = true; result.hidden = true;
      const { error } = await sb.functions.invoke('portfolio-publish', { method: 'POST' });
      publish.disabled = false;
      result.hidden = false;
      if (error) {
        result.className = 'msg error';
        result.textContent = 'La publication immédiate n\'a pas pu être lancée (' + errText(error) + '). La fonction « portfolio-publish » est-elle déployée ? En attendant, la publication automatique passe toutes les 6 heures.';
      } else {
        result.className = 'msg ok';
        result.textContent = 'Publication lancée. Le site généré sera à jour dans une à deux minutes.';
      }
    });

    const backup = h('button', { class: 'btn', type: 'button' }, 'Télécharger la sauvegarde');
    backup.addEventListener('click', async () => {
      backup.disabled = true;
      try {
        const out = { exported_at: new Date().toISOString() };
        for (const key of [...Object.keys(COLLECTIONS), 'messages']) {
          const { data, error } = await table(key).select('*').order('id');
          if (error) throw error;
          out[key] = data;
        }
        const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
        const a = h('a', { href: url, download: 'portfolio-sauvegarde-' + out.exported_at.slice(0, 10) + '.json' });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast('Sauvegarde téléchargée.');
      } catch (e) { toast('Sauvegarde impossible : ' + errText(e), 'error'); }
      backup.disabled = false;
    });

    mainEl.replaceChildren(
      head('Publication & sauvegarde'),
      h('div', { class: 'panel' },
        h('h2', { class: 'form-heading first' }, 'Publier le site'),
        h('p', { class: 'muted' }, 'Vos visiteurs voient vos modifications dès que vous enregistrez. Publier met aussi à jour la version figée du site : celle que lisent Google et LinkedIn, et celle qui s\'affiche si Supabase ne répond pas.'),
        result,
        h('div', { class: 'form-actions' }, publish),
        h('h2', { class: 'form-heading' }, 'Sauvegarde'),
        h('p', { class: 'muted' }, 'Télécharge tous les contenus (textes, projets, témoignages, messages) dans un fichier JSON. Les images et le CV restent dans le stockage Supabase.'),
        h('div', { class: 'form-actions' }, backup)));
  }

  // ─── Sécurité : double authentification ───
  async function showSecurity() {
    loading();
    const { data, error } = await sb.auth.mfa.listFactors();
    if (error) return failed(error);
    if (current !== 'security') return;
    const factor = (data.totp || []).find(f => f.status === 'verified');
    const panel = h('div', { class: 'panel' });
    mainEl.replaceChildren(head('Sécurité', 'Protégez l\'accès à l\'admin par un code à usage unique, en plus du mot de passe.'), panel);

    if (factor) {
      panel.append(
        h('div', { class: 'msg ok' }, 'La double authentification est activée.'),
        h('p', { class: 'muted' }, 'À chaque connexion, le code de votre application d\'authentification est demandé.'),
        h('div', { class: 'form-actions' }, confirmButton('Désactiver la double authentification', async () => {
          const { error: err } = await sb.auth.mfa.unenroll({ factorId: factor.id });
          if (err) return toast('Désactivation impossible : ' + errText(err), 'error');
          toast('Double authentification désactivée.');
          showSecurity();
        })));
      return;
    }

    const startBtn = h('button', { class: 'btn btn-primary', type: 'button' }, 'Activer la double authentification');
    panel.append(
      h('p', { class: 'muted' }, 'Il vous faut une application d\'authentification sur votre téléphone (Google Authenticator, Microsoft Authenticator, Authy…).'),
      h('div', { class: 'form-actions' }, startBtn));
    startBtn.addEventListener('click', async () => {
      startBtn.disabled = true;
      // on repart de zéro si une activation précédente est restée inachevée
      for (const f of (data.all || []).filter(x => x.status === 'unverified')) await sb.auth.mfa.unenroll({ factorId: f.id });
      const { data: enrolled, error: err } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Admin portfolio ' + Date.now() });
      if (err) { startBtn.disabled = false; return toast('Activation impossible : ' + errText(err), 'error'); }
      const code = h('input', { type: 'text', id: 'enroll-code', inputMode: 'numeric', autocomplete: 'one-time-code', maxLength: 6, required: true });
      const verify = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Vérifier et activer');
      panel.replaceChildren(
        h('p', { class: 'muted' }, '1. Scannez ce QR code avec votre application d\'authentification.'),
        h('img', { class: 'qr', src: enrolled.totp.qr_code, alt: 'QR code à scanner' }),
        h('p', { class: 'muted' }, 'Ou saisissez cette clé à la main : ', h('code', null, enrolled.totp.secret)),
        h('form', {
          onsubmit: async e => {
            e.preventDefault();
            verify.disabled = true;
            const { error: e2 } = await sb.auth.mfa.challengeAndVerify({ factorId: enrolled.id, code: code.value.trim() });
            verify.disabled = false;
            if (e2) return toast('Code incorrect ou expiré.', 'error');
            toast('Double authentification activée.');
            showSecurity();
          }
        },
          h('div', { class: 'field' }, h('label', { for: 'enroll-code' }, '2. Saisissez le code à 6 chiffres affiché par l\'application'), code),
          h('div', { class: 'form-actions' }, verify)));
    });
  }

  // ─── Démarrage ───
  let startedFor;
  sb.auth.onAuthStateChange((event, s) => {
    if (event === 'PASSWORD_RECOVERY') recovering = true;
    const id = s ? s.user.id : null;
    if (id === startedFor && event !== 'PASSWORD_RECOVERY') { session = s; return; }  // simple rafraîchissement du jeton
    startedFor = id;
    // hors du callback : Supabase déconseille d'y appeler d'autres méthodes auth
    setTimeout(() => start(s), 0);
  });
})();
