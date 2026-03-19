<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio — MarcProDev</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #08090a;
      --surface: #111214;
      --border: #1e2024;
      --accent: #00ff88;
      --accent2: #ff3d6e;
      --text: #f0f0f0;
      --muted: #6b7280;
      --font-display: 'Syne', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      overflow-x: hidden;
      cursor: none;
    }

    /* Custom cursor */
    .cursor {
      position: fixed;
      width: 12px; height: 12px;
      background: var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s;
      mix-blend-mode: difference;
    }
    .cursor-ring {
      position: fixed;
      width: 36px; height: 36px;
      border: 1px solid var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: all 0.08s ease-out;
      opacity: 0.5;
    }
    body:hover .cursor { opacity: 1; }

    /* Noise overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    /* GRID BACKGROUND */
    .grid-bg {
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }

    /* NAV */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.5rem 3rem;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(20px);
      background: rgba(8,9,10,0.8);
    }
    .nav-logo {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
    }
    .nav-logo span { color: var(--accent); }
    nav ul { list-style: none; display: flex; gap: 2.5rem; }
    nav a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    nav a:hover { color: var(--accent); }

    /* SECTIONS */
    section { position: relative; z-index: 1; }

    /* HERO */
    #hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 6rem 3rem 3rem;
      position: relative;
      overflow: hidden;
    }
    .hero-number {
      position: absolute;
      right: -0.5rem;
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--font-display);
      font-size: clamp(15rem, 30vw, 28rem);
      font-weight: 800;
      color: transparent;
      -webkit-text-stroke: 1px rgba(0,255,136,0.07);
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
    }
    .hero-content { max-width: 900px; }
    .hero-tag {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      border: 1px solid rgba(0,255,136,0.3);
      padding: 0.3rem 0.8rem;
      border-radius: 2px;
      margin-bottom: 2rem;
      animation: fadeUp 0.8s ease both;
    }
    .hero-tag::before { content: '◆'; font-size: 0.5rem; }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 9vw, 8rem);
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -0.04em;
      animation: fadeUp 0.8s 0.1s ease both;
    }
    h1 .highlight {
      color: transparent;
      -webkit-text-stroke: 2px var(--accent);
      display: block;
    }
    .hero-desc {
      margin-top: 2rem;
      font-size: 0.9rem;
      color: var(--muted);
      max-width: 480px;
      line-height: 1.8;
      animation: fadeUp 0.8s 0.2s ease both;
    }
    .hero-cta {
      display: flex; gap: 1rem; margin-top: 3rem;
      animation: fadeUp 0.8s 0.3s ease both;
    }
    .btn {
      padding: 0.85rem 2rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      transition: all 0.2s;
      display: inline-block;
    }
    .btn-primary {
      background: var(--accent);
      color: #000;
      font-weight: 600;
    }
    .btn-primary:hover { background: #00e07a; transform: translateY(-2px); }
    .btn-outline {
      border: 1px solid var(--border);
      color: var(--text);
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

    /* ABOUT */
    #about {
      padding: 8rem 3rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
      border-top: 1px solid var(--border);
    }
    .section-label {
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 0.75rem;
    }
    .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    h2 {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
    }
    .about-text {
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 2;
      margin-top: 1.5rem;
    }
    .about-text strong { color: var(--text); }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
    }
    .stat {
      background: var(--surface);
      padding: 2rem;
      transition: background 0.2s;
    }
    .stat:hover { background: #161820; }
    .stat-num {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 800;
      color: var(--accent);
      line-height: 1;
    }
    .stat-label {
      font-size: 0.7rem;
      color: var(--muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 0.5rem;
    }

    /* SKILLS */
    #skills {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
    }
    .skills-header { max-width: 600px; margin-bottom: 4rem; }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
    }
    .skill-card {
      background: var(--surface);
      padding: 2rem;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
    }
    .skill-card::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      width: 0;
      background: var(--accent);
      transition: width 0.3s ease;
    }
    .skill-card:hover::before { width: 100%; }
    .skill-card:hover { background: #161820; }
    .skill-icon {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .skill-name {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .skill-list {
      font-size: 0.7rem;
      color: var(--muted);
      line-height: 1.9;
    }

    /* PROJECTS */
    #projects {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
    }
    .projects-header { max-width: 600px; margin-bottom: 4rem; }
    .project-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 2rem;
      padding: 2rem 0;
      border-top: 1px solid var(--border);
      transition: all 0.2s;
      position: relative;
    }
    .project-item:last-child { border-bottom: 1px solid var(--border); }
    .project-item:hover { padding-left: 1rem; }
    .project-item:hover .project-num { color: var(--accent); }
    .project-num {
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--border);
      transition: color 0.2s;
      width: 2rem;
    }
    .project-info {}
    .project-name {
      font-family: var(--font-display);
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .project-desc {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.25rem;
    }
    .project-tags { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
    .tag {
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 2px;
    }
    .project-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 1.2rem;
      transition: color 0.2s, transform 0.2s;
      display: inline-block;
    }
    .project-item:hover .project-link { color: var(--accent); transform: translate(4px, -4px); }

    /* CONTACT */
    #contact {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
      text-align: center;
    }
    .contact-inner { max-width: 700px; margin: 0 auto; }
    .contact-big {
      font-family: var(--font-display);
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
      margin: 2rem 0;
    }
    .contact-big span {
      color: transparent;
      -webkit-text-stroke: 2px var(--accent2);
    }
    .contact-email {
      display: inline-block;
      font-size: 1rem;
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid rgba(0,255,136,0.3);
      padding-bottom: 0.25rem;
      transition: border-color 0.2s;
    }
    .contact-email:hover { border-color: var(--accent); }
    .social-links {
      display: flex; justify-content: center; gap: 1.5rem;
      margin-top: 3rem;
    }
    .social-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      transition: color 0.2s;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .social-link:hover { color: var(--accent); }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--border);
      padding: 2rem 3rem;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.65rem;
      color: var(--muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      position: relative; z-index: 1;
    }

    /* ANIMATIONS */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .reveal.visible {
      opacity: 1;
      transform: none;
    }

    /* SCROLLBAR */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

    @media (max-width: 768px) {
      nav { padding: 1rem 1.5rem; }
      nav ul { display: none; }
      #about { grid-template-columns: 1fr; gap: 3rem; padding: 5rem 1.5rem; }
      #hero, #skills, #projects, #contact { padding: 5rem 1.5rem; }
      footer { padding: 1.5rem; flex-direction: column; gap: 0.5rem; }
    }
  </style>
</head>
<body>

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursor-ring"></div>
<div class="grid-bg"></div>

<nav>
  <div class="nav-logo">MarcProDev<span>.</span></div>
  <ul>
    <li><a href="#about">À propos</a></li>
    <li><a href="#skills">Compétences</a></li>
    <li><a href="#projects">Projets</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-number">01</div>
  <div class="hero-content">
    <div class="hero-tag">Disponible pour de nouveaux projets</div>
    <h1>
      Marc-Aurèle
      <span class="highlight">Développeur.</span>
    </h1>
    <p class="hero-desc">
      Je conçois et développe des <strong>expériences numériques performantes</strong> — du backend robuste aux interfaces qui marquent les esprits.
    </p>
    <div class="hero-cta">
      <a href="#projects" class="btn btn-primary">Voir mes projets</a>
      <a href="#contact" class="btn btn-outline">Me contacter</a>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <div class="about-left reveal">
    <div class="section-label">À propos</div>
    <h2>Passionné par le code bien fait.</h2>
    <p class="about-text">
      Développeur full-stack avec <strong>3 années d'expérience</strong>, je travaille à la croisée de la performance technique et de l'expérience utilisateur. J'aime les projets qui challengent mes compétences et qui ont un <strong>impact réel</strong>.
    </p>
    <p class="about-text" style="margin-top:1rem;">
      Basé à <strong>Abidjan</strong>, je collabore avec des clients et des équipes partout dans le monde.
    </p>
  </div>
  <div class="stats-grid reveal" style="transition-delay:0.15s">
    <div class="stat">
      <div class="stat-num">2+</div>
      <div class="stat-label">Années d'expérience</div>
    </div>
    <div class="stat">
      <div class="stat-num">5+</div>
      <div class="stat-label">Projets livrés</div>
    </div>
    <div class="stat">
      <div class="stat-num">+5</div>
      <div class="stat-label">Clients satisfaits</div>
    </div>
    <div class="stat">
      <div class="stat-num">∞</div>
      <div class="stat-label">Lignes de code</div>
    </div>
  </div>
</section>

<!-- SKILLS -->
<section id="skills">
  <div class="skills-header reveal">
    <div class="section-label">Compétences</div>
    <h2>Ce avec quoi je travaille.</h2>
  </div>
  <div class="skills-grid">
    <div class="skill-card reveal">
      <div class="skill-icon">⚡</div>
      <div class="skill-name">Frontend</div>
      <div class="skill-list">Flutter · Angular · Next.js · TypeScript · Tailwind CSS · React · Vue.js</div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.1s">
      <div class="skill-icon">🔧</div>
      <div class="skill-name">Backend</div>
      <div class="skill-list">Laravel ·  Node.js · Python · API REST · GraphQL · WebSockets</div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.2s">
      <div class="skill-icon">🗄️</div>
      <div class="skill-name">Base de données</div>
      <div class="skill-list">PostgreSQL · MongoDB · MySQL · SQLite</div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.3s">
      <div class="skill-icon">☁️</div>
      <div class="skill-name">DevOps & Cloud</div>
      <div class="skill-list">Docker · CI/CD · AWS · Vercel · GitHub Actions · Railway</div>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section id="projects">
  <div class="projects-header reveal">
    <div class="section-label">Projets</div>
    <h2>Ce que j'ai construit.</h2>
  </div>

  <div class="project-item reveal">
    <div class="project-num">01</div>
    <div class="project-info">
      <div class="project-name">Projet Daymond Distribution</div>
      <div class="project-desc">Daymond Distribution est une application mobile révolutionnaire disponible pour une dizaine de pays d'Afrique qui permet à ses utilisateurs de revendre les produits listés sur sa plateforme à prix avantageux sans se soucier des contraintes logistiques ou administratives.</div>
      <div class="project-tags">
        <span class="tag">Flutter</span>
        <span class="tag">Laravel+API+Mysql</span>
        <span class="tag">Firebase(Notifications push)</span>
        <span class="tag">AWS S3</span>
      </div>
    </div>
    <a href="https://play.google.com/store/apps/details?id=com.daymondboutique.distribution_frontend&pcampaignid=web_share" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">02</div>
    <div class="project-info">
      <div class="project-name">Projet Daymond Colaboration</div>
      <div class="project-desc">Daymond Collaboration est la plateforme de référence pour les collaborateurs de la société Daymond.</div>
      <div class="project-tags">
        <span class="tag">Flutter</span>
        <span class="tag">Firebase(Notifications push)</span>
        <span class="tag">Laravel + API + Mysql</span>
        <span class="tag">AWS S3</span>
      </div>
    </div>
    <a href="https://play.google.com/store/apps/details?id=com.innovat.daymond_collaboration_app&pcampaignid=web_share" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">03</div>
    <div class="project-info">
      <div class="project-name">Projet ChopChap</div>
      <div class="project-desc">Application web pour E-commerce</div>
      <div class="project-tags">
        <span class="tag">FastAPI</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">CI/CD · GitHub Actions</span>
      </div>
    </div>
    <a href="https://chopchap.com/" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">04</div>
    <div class="project-info">
      <div class="project-name">Projet Nappes&Designs</div>
      <div class="project-desc">Application web pour la vente de nappes de tables</div>
      <div class="project-tags">
        <span class="tag">Laravel</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">MySQL</span>
      </div>
    </div>
    <a href="https://nappesetdesigns.com/" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">05</div>
    <div class="project-info">
      <div class="project-name">Projet INSFS </div>
      <div class="project-desc">Application web pour la gestions des inscriptions de l'INSFS-Abidjan</div>
      <div class="project-tags">
        <span class="tag">Next.js</span>
        <span class="tag">Laravel + API + Mysql</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">CI/CD · GitHub Actions · vercel deploy · railway</span>
      </div>
    </div>
    <a href="https://insfs-gestion.vercel.app/" class="project-link">↗</a>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="contact-inner reveal">
    <div class="section-label" style="justify-content:center">Contact</div>
    <div class="contact-big">
      Travaillons<br><span>ensemble.</span>
    </div>
    <a href="mailto:marcdevfullstack@gmail.com" class="contact-email">marcdevfullstack@gmail.com</a>
    <div class="social-links">
      <a href="https://github.com/marcdevfullstack-cloud" class="social-link">⟶ GitHub</a>
      <a href="https://www.linkedin.com/in/marc-aur%C3%A8le-adou-5860532b1/" class="social-link">⟶ LinkedIn</a>
      <a href="#" class="social-link">⟶ Twitter</a>
    </div>
  </div>
</section>

<footer>
  <span>© 2025 — Marc-Aurèle Adou</span>
  <span>Développeur Full-Stack</span>
</footer>

<script>
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
</script>
</body>
</html>