<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Marc-Aurèle Adou — Développeur Full-Stack</title>
  <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #03060f;
      --bg2: #060b1a;
      --surface: #0a1128;
      --surface2: #0d1535;
      --border: #162040;
      --border2: #1e2e58;

      --blue: #1a6bff;
      --blue-light: #4d8fff;
      --blue-glow: rgba(26,107,255,0.18);

      --orange: #ff6b1a;
      --orange-light: #ff8a45;
      --orange-glow: rgba(255,107,26,0.18);

      --yellow: #ffd21a;
      --yellow-light: #ffe566;
      --yellow-glow: rgba(255,210,26,0.15);

      --text: #eef2ff;
      --text2: #8fa3d4;
      --text3: #4a5f8a;

      --font-display: 'Clash Display', 'Space Grotesk', sans-serif;
      --font-body: 'Space Grotesk', sans-serif;
      --font-mono: 'DM Mono', monospace;

      --radius: 4px;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      overflow-x: hidden;
      cursor: none;
    }

    /* ─── CURSOR ─── */
    #cursor {
      position: fixed; width: 10px; height: 10px;
      background: var(--orange); border-radius: 50%;
      pointer-events: none; z-index: 9999;
      transform: translate(-50%,-50%);
      transition: transform 0.1s, background 0.2s;
      mix-blend-mode: screen;
    }
    #cursor-ring {
      position: fixed; width: 40px; height: 40px;
      border: 1.5px solid rgba(26,107,255,0.5);
      border-radius: 50%; pointer-events: none; z-index: 9998;
      transform: translate(-50%,-50%);
    }
    body:has(a:hover) #cursor { background: var(--yellow); transform: translate(-50%,-50%) scale(1.6); }
    body:has(a:hover) #cursor-ring { border-color: var(--yellow); transform: translate(-50%,-50%) scale(1.2); }

    /* ─── BACKGROUND ─── */
    .bg-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(100px); z-index: 0;
    }
    .bg-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(26,107,255,0.12) 0%, transparent 70%);
      top: -200px; left: -100px;
    }
    .bg-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(255,107,26,0.09) 0%, transparent 70%);
      bottom: 10%; right: -100px;
    }
    .bg-orb-3 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(255,210,26,0.07) 0%, transparent 70%);
      top: 50%; left: 30%;
    }
    .grid-bg {
      position: fixed; inset: 0; z-index: 0;
      background-image:
        linear-gradient(rgba(26,107,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(26,107,255,0.04) 1px, transparent 1px);
      background-size: 64px 64px;
    }

    /* ─── NAV ─── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 3rem;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(24px) saturate(1.5);
      background: rgba(3,6,15,0.75);
    }
    .nav-logo {
      font-family: var(--font-display);
      font-size: 1.1rem; font-weight: 700;
      letter-spacing: -0.02em;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .nav-logo .dot { color: var(--orange); }
    .nav-logo .badge {
      font-family: var(--font-mono); font-size: 0.6rem;
      font-weight: 400; padding: 0.15rem 0.5rem;
      background: var(--blue-glow);
      border: 1px solid rgba(26,107,255,0.3);
      color: var(--blue-light); border-radius: 2px;
      letter-spacing: 0.08em;
    }
    nav ul { list-style: none; display: flex; gap: 2.5rem; align-items: center; }
    nav a {
      color: var(--text2); text-decoration: none;
      font-size: 0.75rem; letter-spacing: 0.08em;
      text-transform: uppercase; font-weight: 500;
      transition: color 0.2s;
    }
    nav a:hover { color: var(--text); }
    .nav-cv {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, var(--orange), #ff4d00);
      color: #fff !important; font-weight: 600 !important;
      border-radius: var(--radius);
      box-shadow: 0 0 20px rgba(255,107,26,0.3);
      transition: all 0.2s !important;
    }
    .nav-cv:hover { transform: translateY(-2px); box-shadow: 0 4px 28px rgba(255,107,26,0.45) !important; }

    /* ─── SECTION WRAPPERS ─── */
    section { position: relative; z-index: 1; }

    /* ─── HERO ─── */
    #hero {
      min-height: 100vh;
      display: flex; flex-direction: column; justify-content: center;
      padding: 7rem 3rem 4rem;
      overflow: hidden;
    }
    .hero-availability {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-family: var(--font-mono); font-size: 0.68rem;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--blue-light);
      padding: 0.35rem 0.9rem;
      border: 1px solid rgba(26,107,255,0.3);
      background: rgba(26,107,255,0.07);
      border-radius: 2px; margin-bottom: 2.5rem;
      width: fit-content;
      animation: fadeUp 0.7s ease both;
    }
    .hero-availability .pulse {
      width: 6px; height: 6px; background: #00e676;
      border-radius: 50%; animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,230,118,0.5); }
      50% { box-shadow: 0 0 0 6px rgba(0,230,118,0); }
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(4rem, 9vw, 9rem);
      font-weight: 700;
      line-height: 0.92;
      letter-spacing: -0.04em;
      animation: fadeUp 0.7s 0.08s ease both;
    }
    .hero-title .name-line {
      display: block;
      background: linear-gradient(135deg, #fff 0%, #c4d4ff 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-title .role-line {
      display: block;
      background: linear-gradient(135deg, var(--blue) 0%, var(--orange) 60%, var(--yellow) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-sub {
      display: flex; align-items: flex-start; gap: 3rem;
      margin-top: 3rem;
      animation: fadeUp 0.7s 0.16s ease both;
    }
    .hero-desc {
      font-size: 0.9rem; color: var(--text2);
      line-height: 1.85; max-width: 420px;
    }
    .hero-desc strong { color: var(--text); }
    .hero-divider { width: 1px; background: var(--border2); align-self: stretch; flex-shrink: 0; }
    .hero-meta {
      display: flex; flex-direction: column; gap: 1.25rem;
      padding-top: 0.25rem;
    }
    .hero-meta-item {
      display: flex; flex-direction: column; gap: 0.2rem;
    }
    .hero-meta-label {
      font-family: var(--font-mono); font-size: 0.6rem;
      color: var(--text3); letter-spacing: 0.15em; text-transform: uppercase;
    }
    .hero-meta-val { font-size: 0.82rem; font-weight: 500; color: var(--text); }
    .hero-meta-val.accent { color: var(--blue-light); }

    .hero-cta {
      display: flex; gap: 1rem; margin-top: 3.5rem;
      animation: fadeUp 0.7s 0.24s ease both;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 2rem; font-family: var(--font-body);
      font-size: 0.78rem; font-weight: 600; text-decoration: none;
      border-radius: var(--radius); letter-spacing: 0.04em;
      transition: all 0.22s; cursor: none;
    }
    .btn-blue {
      background: linear-gradient(135deg, var(--blue), #0050d8);
      color: #fff;
      box-shadow: 0 0 30px rgba(26,107,255,0.3);
    }
    .btn-blue:hover { transform: translateY(-3px); box-shadow: 0 6px 36px rgba(26,107,255,0.45); }
    .btn-ghost {
      border: 1px solid var(--border2); color: var(--text2);
    }
    .btn-ghost:hover { border-color: rgba(255,107,26,0.5); color: var(--orange-light); }
    .btn-cv-hero {
      background: linear-gradient(135deg, var(--orange), #d44a00);
      color: #fff;
      box-shadow: 0 0 24px rgba(255,107,26,0.25);
    }
    .btn-cv-hero:hover { transform: translateY(-3px); box-shadow: 0 6px 32px rgba(255,107,26,0.4); }

    /* ─── FLOATING CARD ─── */
    .hero-card {
      position: absolute; right: 3rem; top: 50%;
      transform: translateY(-50%);
      background: var(--surface);
      border: 1px solid var(--border2);
      border-radius: 8px; padding: 1.5rem;
      width: 240px;
      animation: floatCard 6s ease-in-out infinite;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px var(--blue-glow);
    }
    @keyframes floatCard {
      0%,100% { transform: translateY(-50%) translateY(0); }
      50% { transform: translateY(-50%) translateY(-12px); }
    }
    .hero-card-title { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text3); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }
    .skill-pill {
      display: inline-flex; align-items: center; gap: 0.35rem;
      font-size: 0.65rem; padding: 0.3rem 0.6rem;
      border-radius: 2px; margin: 0.2rem;
      font-family: var(--font-mono); font-weight: 400;
    }
    .pill-blue { background: rgba(26,107,255,0.15); color: var(--blue-light); border: 1px solid rgba(26,107,255,0.2); }
    .pill-orange { background: rgba(255,107,26,0.15); color: var(--orange-light); border: 1px solid rgba(255,107,26,0.2); }
    .pill-yellow { background: rgba(255,210,26,0.12); color: var(--yellow-light); border: 1px solid rgba(255,210,26,0.2); }
    .hero-card-code {
      margin-top: 1rem; padding: 0.75rem;
      background: rgba(0,0,0,0.3); border-radius: 4px;
      font-family: var(--font-mono); font-size: 0.58rem;
      line-height: 1.7; color: var(--text3);
    }
    .hero-card-code .c-blue { color: var(--blue-light); }
    .hero-card-code .c-orange { color: var(--orange-light); }
    .hero-card-code .c-yellow { color: var(--yellow-light); }
    .hero-card-code .c-green { color: #52d9a0; }

    /* ─── ABOUT ─── */
    #about {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem; align-items: start;
    }
    .section-eyebrow {
      display: flex; align-items: center; gap: 0.75rem;
      font-family: var(--font-mono); font-size: 0.65rem;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--orange); margin-bottom: 1.5rem;
    }
    .section-eyebrow::before { content: '//'; opacity: 0.5; }
    h2.section-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 700; line-height: 1.05;
      letter-spacing: -0.03em;
    }
    .about-text {
      font-size: 0.87rem; color: var(--text2);
      line-height: 1.95; margin-top: 1.5rem;
    }
    .about-text strong { color: var(--text); }
    .about-text + .about-text { margin-top: 0.85rem; }

    .about-location {
      display: flex; align-items: center; gap: 0.6rem;
      margin-top: 2rem; font-size: 0.8rem; color: var(--text3);
      font-family: var(--font-mono);
    }
    .about-location .loc-pin { color: var(--orange); }

    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 1px; background: var(--border);
      border: 1px solid var(--border);
    }
    .stat {
      background: var(--surface);
      padding: 2.5rem 2rem;
      position: relative; overflow: hidden;
      transition: background 0.25s;
    }
    .stat::after {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--orange));
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .stat:hover::after { transform: scaleX(1); }
    .stat:hover { background: var(--surface2); }
    .stat-num {
      font-family: var(--font-display);
      font-size: 3.5rem; font-weight: 700; line-height: 1;
      background: linear-gradient(135deg, var(--blue-light), var(--orange));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-label {
      font-family: var(--font-mono); font-size: 0.62rem;
      color: var(--text3); letter-spacing: 0.12em;
      text-transform: uppercase; margin-top: 0.5rem;
    }

    /* ─── SKILLS ─── */
    #skills {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
    }
    .skills-head { margin-bottom: 4rem; }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1px; background: var(--border);
      border: 1px solid var(--border);
    }
    .skill-card {
      background: var(--surface);
      padding: 2.5rem 2rem;
      position: relative; overflow: hidden;
      transition: background 0.25s;
    }
    .skill-card:hover { background: var(--surface2); }
    .skill-card::before {
      content: ''; position: absolute;
      bottom: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, var(--blue), var(--orange), var(--yellow));
      opacity: 0; transition: opacity 0.3s;
    }
    .skill-card:hover::before { opacity: 1; }
    .skill-icon-wrap {
      width: 44px; height: 44px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; margin-bottom: 1.25rem;
    }
    .icon-blue { background: rgba(26,107,255,0.12); border: 1px solid rgba(26,107,255,0.2); }
    .icon-orange { background: rgba(255,107,26,0.12); border: 1px solid rgba(255,107,26,0.2); }
    .icon-yellow { background: rgba(255,210,26,0.1); border: 1px solid rgba(255,210,26,0.2); }
    .icon-purple { background: rgba(130,80,255,0.12); border: 1px solid rgba(130,80,255,0.2); }
    .skill-name {
      font-family: var(--font-display);
      font-size: 1.05rem; font-weight: 600;
      margin-bottom: 0.75rem;
    }
    .skill-list {
      font-size: 0.72rem; color: var(--text3);
      line-height: 2; font-family: var(--font-mono);
    }
    .skill-list .tag-inline {
      display: inline-block;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border2);
      padding: 0.1rem 0.4rem; border-radius: 2px;
      margin: 0.1rem;
    }

    /* ─── PROJECTS ─── */
    #projects {
      padding: 8rem 3rem;
      border-top: 1px solid var(--border);
    }
    .projects-head { margin-bottom: 4rem; }
    .project-item {
      display: grid;
      grid-template-columns: 60px 1fr auto;
      align-items: center; gap: 2rem;
      padding: 2rem 1.5rem;
      border-top: 1px solid var(--border);
      transition: all 0.25s;
      position: relative; overflow: hidden;
    }
    .project-item::before {
      content: ''; position: absolute;
      left: 0; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(180deg, var(--blue), var(--orange));
      transform: scaleY(0); transform-origin: bottom;
      transition: transform 0.3s ease;
    }
    .project-item:hover::before { transform: scaleY(1); }
    .project-item:last-child { border-bottom: 1px solid var(--border); }
    .project-item:hover { background: rgba(255,255,255,0.018); padding-left: 2rem; }
    .project-num {
      font-family: var(--font-display);
      font-size: 0.72rem; font-weight: 700;
      color: var(--border2); transition: color 0.25s;
      letter-spacing: 0.05em;
    }
    .project-item:hover .project-num { color: var(--orange); }
    .project-name {
      font-family: var(--font-display);
      font-size: clamp(1.1rem, 2.2vw, 1.7rem);
      font-weight: 700; letter-spacing: -0.02em;
      margin-bottom: 0.3rem;
    }
    .project-desc { font-size: 0.75rem; color: var(--text2); line-height: 1.7; margin-bottom: 0.75rem; max-width: 580px; }
    .project-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .tag {
      font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 0.18rem 0.55rem;
      border: 1px solid var(--border2); color: var(--text3);
      border-radius: 2px; font-family: var(--font-mono);
      transition: all 0.2s;
    }
    .project-item:hover .tag { border-color: rgba(26,107,255,0.3); color: var(--blue-light); }
    .project-link {
      color: var(--text3); text-decoration: none;
      font-size: 1.1rem; transition: all 0.2s;
      display: inline-flex; align-items: center;
      width: 36px; height: 36px; border-radius: 50%;
      border: 1px solid var(--border2);
      justify-content: center;
    }
    .project-item:hover .project-link {
      color: var(--yellow); border-color: var(--yellow);
      transform: translate(3px,-3px);
      background: rgba(255,210,26,0.08);
    }

    /* ─── CONTACT ─── */
    #contact {
      padding: 8rem 3rem 6rem;
      border-top: 1px solid var(--border);
    }
    .contact-inner { max-width: 760px; margin: 0 auto; text-align: center; }
    .contact-big {
      font-family: var(--font-display);
      font-size: clamp(3rem, 7vw, 6.5rem);
      font-weight: 700; letter-spacing: -0.04em; line-height: 1.0;
      margin: 2rem 0;
    }
    .contact-big .grad {
      background: linear-gradient(135deg, var(--blue) 0%, var(--orange) 50%, var(--yellow) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .contact-desc { font-size: 0.88rem; color: var(--text2); line-height: 1.85; max-width: 460px; margin: 0 auto 2.5rem; }
    .contact-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .contact-email-badge {
      display: inline-flex; align-items: center; gap: 0.6rem;
      padding: 1rem 1.75rem;
      border: 1px solid var(--border2);
      border-radius: var(--radius);
      color: var(--text); text-decoration: none;
      font-size: 0.85rem; font-weight: 500;
      transition: all 0.22s;
      background: var(--surface);
    }
    .contact-email-badge:hover {
      border-color: var(--blue);
      background: rgba(26,107,255,0.08);
      transform: translateY(-2px);
    }
    .social-links {
      display: flex; justify-content: center; gap: 1rem; margin-top: 3rem;
    }
    .social-link {
      color: var(--text3); text-decoration: none;
      font-size: 0.68rem; letter-spacing: 0.15em;
      text-transform: uppercase; font-family: var(--font-mono);
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.6rem 1.1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: all 0.2s;
    }
    .social-link:hover { color: var(--blue-light); border-color: rgba(26,107,255,0.3); background: rgba(26,107,255,0.05); }

    /* ─── CV SECTION ─── */
    .cv-section {
      margin-top: 4rem;
      padding: 2rem;
      background: var(--surface);
      border: 1px solid var(--border2);
      border-radius: 8px;
      position: relative; overflow: hidden;
    }
    .cv-section::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--orange), var(--yellow));
    }
    .cv-section-title {
      font-family: var(--font-mono); font-size: 0.62rem;
      color: var(--text3); letter-spacing: 0.18em; text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .cv-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .cv-info { font-size: 0.82rem; color: var(--text2); }
    .cv-info span { color: var(--text); font-weight: 500; }
    .btn-download {
      display: inline-flex; align-items: center; gap: 0.6rem;
      padding: 0.9rem 1.8rem;
      background: linear-gradient(135deg, var(--orange) 0%, #d44a00 100%);
      color: #fff; font-weight: 600; font-size: 0.78rem;
      text-decoration: none; border-radius: var(--radius);
      box-shadow: 0 0 28px rgba(255,107,26,0.3);
      transition: all 0.22s;
      letter-spacing: 0.03em;
    }
    .btn-download:hover { transform: translateY(-3px); box-shadow: 0 6px 36px rgba(255,107,26,0.45); }
    .btn-download svg { width: 16px; height: 16px; }

    /* ─── FOOTER ─── */
    footer {
      border-top: 1px solid var(--border);
      padding: 2rem 3rem;
      display: flex; justify-content: space-between; align-items: center;
      position: relative; z-index: 1;
    }
    .footer-left { font-size: 0.65rem; color: var(--text3); font-family: var(--font-mono); letter-spacing: 0.1em; }
    .footer-right { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; color: var(--text3); font-family: var(--font-mono); }
    .footer-dot { color: var(--orange); }

    /* ─── ANIMATIONS ─── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal {
      opacity: 0; transform: translateY(40px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal.visible { opacity: 1; transform: none; }

    /* ─── SCROLLBAR ─── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border2); }
    ::-webkit-scrollbar-thumb:hover { background: var(--blue); }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 900px) {
      nav { padding: 1rem 1.5rem; }
      nav ul { gap: 1.5rem; }
      .nav-cv { display: none; }
      #hero { padding: 6rem 1.5rem 3rem; }
      .hero-card { display: none; }
      .hero-sub { flex-direction: column; gap: 2rem; }
      .hero-divider { display: none; }
      #about { grid-template-columns: 1fr; gap: 3rem; padding: 5rem 1.5rem; }
      #skills, #projects, #contact { padding: 5rem 1.5rem; }
      footer { padding: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
    }
    @media (max-width: 600px) {
      nav ul { display: none; }
      .project-item { grid-template-columns: 40px 1fr auto; gap: 1rem; }
    }
  </style>
</head>
<body>

<div id="cursor"></div>
<div id="cursor-ring"></div>

<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>
<div class="bg-orb bg-orb-3"></div>
<div class="grid-bg"></div>

<!-- NAV -->
<nav>
  <div class="nav-logo">
    MarcProDev<span class="dot">.</span>
    <span class="badge">Abidjan · CI</span>
  </div>
  <ul>
    <li><a href="#about">À propos</a></li>
    <li><a href="#skills">Stack</a></li>
    <li><a href="#projects">Projets</a></li>
    <li><a href="#contact">Contact</a></li>
    <li>
      <a href="marc-aurele-adou-cv.pdf" download class="nav-cv">
        ↓ Télécharger CV
      </a>
    </li>
  </ul>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-availability">
    <span class="pulse"></span>
    Disponible pour nouveaux projets
  </div>
  <h1 class="hero-title">
    <span class="name-line">Marc-Aurèle</span>
    <span class="role-line">Développeur.</span>
  </h1>
  <div class="hero-sub">
    <p class="hero-desc">
      Je conçois des <strong>expériences numériques performantes</strong> — du backend robuste aux interfaces mémorables. Full-Stack · Mobile · Web.
    </p>
    <div class="hero-divider"></div>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <span class="hero-meta-label">Localisation</span>
        <span class="hero-meta-val">Abidjan, Côte d'Ivoire</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Entreprise</span>
        <span class="hero-meta-val accent">Afrinovatech</span>
      </div>
      <div class="hero-meta-item">
        <span class="hero-meta-label">Expérience</span>
        <span class="hero-meta-val">3 années</span>
      </div>
    </div>
  </div>
  <div class="hero-cta">
    <a href="#projects" class="btn btn-blue">Voir mes projets →</a>
    <a href="marc-aurele-adou-cv.pdf" download class="btn btn-cv-hero">↓ Mon CV</a>
    <a href="#contact" class="btn btn-ghost">Me contacter</a>
  </div>

  <!-- Floating Code Card -->
  <div class="hero-card">
    <div class="hero-card-title">// tech stack</div>
    <div>
      <span class="skill-pill pill-blue">Flutter</span>
      <span class="skill-pill pill-orange">Laravel</span>
      <span class="skill-pill pill-blue">Next.js</span>
      <span class="skill-pill pill-yellow">Firebase</span>
      <span class="skill-pill pill-orange">Node.js</span>
      <span class="skill-pill pill-blue">TypeScript</span>
    </div>
    <div class="hero-card-code">
      <span class="c-blue">const</span> dev = {<br>
      &nbsp;&nbsp;name: <span class="c-green">'Marc-Aurèle'</span>,<br>
      &nbsp;&nbsp;focus: <span class="c-orange">'Full-Stack'</span>,<br>
      &nbsp;&nbsp;open: <span class="c-yellow">true</span><br>
      }
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <div class="reveal">
    <div class="section-eyebrow">À propos</div>
    <h2 class="section-title">Passionné par le code<br>qui a de l'impact.</h2>
    <p class="about-text">
      Développeur full-stack avec <strong>2+ années d'expérience</strong> au sein d'<strong>Afrinovatech</strong>, je travaille à la croisée de la performance technique et de l'expérience utilisateur.
    </p>
    <p class="about-text">
      J'aime les projets <strong>concrets</strong> — ceux qui résolvent de vrais problèmes pour de vraies personnes. Du mobile Flutter au backend Laravel, je construis des produits livrés et maintenus.
    </p>
    <div class="about-location">
      <span class="loc-pin">◉</span>
      Basé à Abidjan — collabore partout dans le monde
    </div>
  </div>
  <div class="stats-grid reveal" style="transition-delay:0.12s">
    <div class="stat">
      <div class="stat-num">3</div>
      <div class="stat-label">Années d'expérience</div>
    </div>
    <div class="stat">
      <div class="stat-num">7+</div>
      <div class="stat-label">Projets livrés</div>
    </div>
    <div class="stat">
      <div class="stat-num">5+</div>
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
  <div class="skills-head reveal">
    <div class="section-eyebrow">Stack technique</div>
    <h2 class="section-title">Ce avec quoi<br>je construis.</h2>
  </div>
  <div class="skills-grid">
    <div class="skill-card reveal">
      <div class="skill-icon-wrap icon-blue">⚡</div>
      <div class="skill-name">Frontend | Mobile & Web</div>
      <div class="skill-list">
        <span class="tag-inline">Flutter</span>
        <span class="tag-inline">Angular</span>
        <span class="tag-inline">Next.js</span>
        <span class="tag-inline">React</span>
        <span class="tag-inline">Vue.js</span>
        <span class="tag-inline">TypeScript</span>
        <span class="tag-inline">Tailwind CSS</span>
      </div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.08s">
      <div class="skill-icon-wrap icon-orange">🔧</div>
      <div class="skill-name">Backend | Mobile & Web</div>
      <div class="skill-list">
        <span class="tag-inline">Laravel</span>
        <span class="tag-inline">Node.js</span>
        <span class="tag-inline">FastAPI</span>
        <span class="tag-inline">Python</span>
        <span class="tag-inline">REST API</span>
        <span class="tag-inline">GraphQL</span>
        <span class="tag-inline">WebSockets</span>
      </div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.16s">
      <div class="skill-icon-wrap icon-yellow">🗄️</div>
      <div class="skill-name">Base de données</div>
      <div class="skill-list">
        <span class="tag-inline">PostgreSQL</span>
        <span class="tag-inline">MySQL</span>
        <span class="tag-inline">MongoDB</span>
        <span class="tag-inline">SQLite</span>
        <span class="tag-inline">Firebase</span>
      </div>
    </div>
    <div class="skill-card reveal" style="transition-delay:0.24s">
      <div class="skill-icon-wrap icon-purple">☁️</div>
      <div class="skill-name">DevOps & Cloud</div>
      <div class="skill-list">
        <span class="tag-inline">Docker</span>
        <span class="tag-inline">AWS S3</span>
        <span class="tag-inline">GitHub Actions</span>
        <span class="tag-inline">Vercel</span>
        <span class="tag-inline">Railway</span>
        <span class="tag-inline">CI/CD</span>
      </div>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section id="projects">
  <div class="projects-head reveal">
    <div class="section-eyebrow">Projets</div>
    <h2 class="section-title">Ce que j'ai<br>construit.</h2>
  </div>

  <div class="project-item reveal">
    <div class="project-num">01</div>
    <div class="project-info">
      <div class="project-name">Daymond Distribution</div>
      <div class="project-desc">Application mobile disponible dans une dizaine de pays africains — permet à des revendeurs de commercialiser des produits sans contrainte logistique ni administrative.</div>
      <div class="project-tags">
        <span class="tag">Flutter</span>
        <span class="tag">Laravel · API · MySQL</span>
        <span class="tag">Firebase FCM</span>
        <span class="tag">AWS S3</span>
      </div>
    </div>
    <a href="https://play.google.com/store/apps/details?id=com.daymondboutique.distribution_frontend" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">02</div>
    <div class="project-info">
      <div class="project-name">Daymond Collaboration</div>
      <div class="project-desc">Plateforme dédiée aux collaborateurs de la société Daymond — gestion interne, notifications temps réel et communication unifiée.</div>
      <div class="project-tags">
        <span class="tag">Flutter</span>
        <span class="tag">Firebase FCM</span>
        <span class="tag">Twilio</span>
        <span class="tag">Laravel · API · MySQL</span>
        <span class="tag">AWS S3</span>
      </div>
    </div>
    <a href="https://play.google.com/store/apps/details?id=com.innovat.daymond_collaboration_app" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">03</div>
    <div class="project-info">
      <div class="project-name">ChopChap</div>
      <div class="project-desc">Application web e-commerce avec déploiement CI/CD automatisé via GitHub Actions.</div>
      <div class="project-tags">
        <span class="tag">FastAPI</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">CI/CD</span>
        <span class="tag">GitHub Actions</span>
      </div>
    </div>
    <a href="https://chopchap.com/" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">04</div>
    <div class="project-info">
      <div class="project-name">Nappes & Designs</div>
      <div class="project-desc">Boutique en ligne spécialisée dans la vente de nappes de tables — interface produit complète avec gestion de catalogue.</div>
      <div class="project-tags">
        <span class="tag">Laravel</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">MySQL</span>
      </div>
    </div>
    <a href="https://nappesetdesigns.com/" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">05</div>
    <div class="project-info">
      <div class="project-name">INSFS — Gestion des inscriptions</div>
      <div class="project-desc">Application web de gestion des inscriptions de l'INSFS-Abidjan — déploiement full CI/CD sur Vercel et Railway.</div>
      <div class="project-tags">
        <span class="tag">Next.js</span>
        <span class="tag">Laravel · API · MySQL</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">Vercel · Railway</span>
      </div>
    </div>
    <a href="https://insfs-gestion.vercel.app/" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">06</div>
    <div class="project-info">
      <div class="project-name">Afrinovatech — Landing Page</div>
      <div class="project-desc">Site vitrine officiel d'Afrinovatech présentant les services et l'expertise de l'équipe.</div>
      <div class="project-tags">
        <span class="tag">Web</span>
      </div>
    </div>
    <a href="https://www.afriknovatech.com/" target="_blank" class="project-link">↗</a>
  </div>

  <div class="project-item reveal">
    <div class="project-num">07</div>
    <div class="project-info">
      <div class="project-name">Olave App — by Afrinovatech</div>
      <div class="project-desc">Application mobile de gestion de lavage intelligent — suivi des commandes, notifications push et tableau de bord opérateur.</div>
      <div class="project-tags">
        <span class="tag">Flutter · Dart</span>
        <span class="tag">Laravel · API REST · MySQL</span>
        <span class="tag">Infomaniak</span>
        <span class="tag">Cloudinary</span>
        <span class="tag">FCM Push</span>
      </div>
    </div>
    <a href="https://olave-ci.vercel.app/" target="_blank" class="project-link">↗</a>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="contact-inner reveal">
    <div class="section-eyebrow" style="justify-content:center">Contact</div>
    <div class="contact-big">
      Travaillons<br><span class="grad">ensemble.</span>
    </div>
    <p class="contact-desc">
      Disponible pour des projets freelance, des collaborations ou de nouvelles opportunités. Parlons de ce que vous construisez.
    </p>
    <div class="contact-actions">
      <a href="mailto:marcdevfullstack@gmail.com" class="contact-email-badge">
        ✉ marcdevfullstack@gmail.com
      </a>
    </div>

    <!-- CV DOWNLOAD BLOCK -->
    <div class="cv-section">
      <div class="cv-section-title">// Curriculum Vitae</div>
      <div class="cv-row">
        <div class="cv-info">
          <span>Marc-Aurèle Adou</span> — Développeur Full-Stack &amp; Mobile<br>
          <span style="color:var(--text3);font-size:0.75rem;font-family:var(--font-mono)">PDF · Mis à jour 2025</span>
        </div>
        <a href="marc-aurele-adou-cv.pdf" download="Marc-Aurele-Adou-CV.pdf" class="btn-download">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger mon CV
        </a>
      </div>
    </div>

    <div class="social-links">
      <a href="https://github.com/marcdevfullstack-cloud" target="_blank" class="social-link">⟶ GitHub</a>
      <a href="https://www.linkedin.com/in/marc-aur%C3%A8le-adou-5860532b1/" target="_blank" class="social-link">⟶ LinkedIn</a>
    </div>
  </div>
</section>

<footer>
  <div class="footer-left">© 2025 — Marc-Aurèle Adou</div>
  <div class="footer-right">
    Développeur Full-Stack <span class="footer-dot">◉</span> Afrinovatech
  </div>
</footer>

<script>
  // Custom Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 50);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => obs.observe(el));

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a:not(.nav-cv)');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
    });
  });
</script>
</body>
</html>
