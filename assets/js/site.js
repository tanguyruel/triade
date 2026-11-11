/* ==========================================================================
   TRIADE — script du site
   Rôle : lire les fichiers du dossier « content/ » (ce que modifie l'équipe
   depuis /admin) et fabriquer les pages. Aucune bibliothèque externe.
   Les textes du site existent en 5 langues : voir assets/js/langues.js.
   Pour modifier le TEXTE ou les PHOTOS : ne touchez pas à ce fichier,
   passez par /admin (voir GUIDE.md).
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Langue --------------------------------------------------- */
  const I18N = window.TRIADE_I18N || { langs: [{ code: 'fr', label: 'Français', locale: 'fr-FR' }], ui: {}, contenu: [] };
  const CODES = I18N.langs.map((l) => l.code);
  const storage = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* stockage bloqué : sans gravité */ } },
  };
  // Ordre de choix : ?lang=xx dans l'adresse, puis le choix déjà fait, puis la langue du navigateur, sinon le français.
  const lang = (() => {
    const q = new URLSearchParams(location.search).get('lang');
    if (CODES.includes(q)) { storage.set('triade_lang', q); return q; }
    const saved = storage.get('triade_lang');
    if (CODES.includes(saved)) return saved;
    const nav = (navigator.languages || [navigator.language || 'fr']).map((l) => String(l).slice(0, 2).toLowerCase()).find((c) => CODES.includes(c));
    return nav || 'fr';
  })();
  const loc = (I18N.langs.find((l) => l.code === lang) || I18N.langs[0]).locale;
  const setLang = (code) => {
    storage.set('triade_lang', code);
    const u = new URL(location.href);
    u.searchParams.set('lang', code);
    location.href = u.href;
    if (u.href === location.href) location.reload();
  };

  const P = {};   // valeurs partagées par tous les textes : {km}, {mois}, {periode}, {depart}
  const fill = (s, params) => s.replace(/\{(\w+)\}/g, (m, k) => (params && params[k] !== undefined ? params[k] : P[k] !== undefined ? P[k] : m));
  const t = (key, params) => { const r = I18N.ui[key]; return fill(r ? (r[lang] ?? r.fr) : key, params); };
  // Textes venant des fichiers JSON : la clé est le texte français exact ; sans correspondance, on garde le français.
  const CONTENU = new Map(I18N.contenu.map((r) => [r.fr, r[lang] ?? r.fr]));
  const tc = (s) => (lang === 'fr' || !s ? s : (CONTENU.get(String(s).trim()) ?? s));

  /* ---------- Petits outils ------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Typographie française : espace insécable avant ? ! : ; » € % et après « (évite un « ? » seul en début de ligne)
  const typo = lang === 'fr' ? (s) => s.replace(/ ([?!:;»€%])/g, ' $1').replace(/(«) /g, '$1 ') : (s) => s;

  // Fabrique un élément HTML. Le texte passe toujours par textContent : rien ne peut injecter de code.
  function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(typo(String(c))));
    }
    return node;
  }

  const SVG = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  const ICONS = {
    instagram: SVG('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>'),
    tiktok: SVG('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.3 2.4 2 4.2 5 4.4"/>'),
    komoot: SVG('<circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5z"/>'),
    youtube: SVG('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>'),
    mail: SVG('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7.5 8 6 8-6"/>'),
    arrow: SVG('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    back: SVG('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    play: SVG('<path d="M7 5v14l12-7z" fill="currentColor"/>'),
    menu: SVG('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    pin: SVG('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    globe: SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/>'),
    download: SVG('<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>'),
  };
  const icon = (name) => { const s = document.createElement('span'); s.innerHTML = ICONS[name]; return s.firstElementChild; };

  // Les fichiers JSON sont relus à chaque visite : une modification faite dans /admin apparaît en 1-2 minutes.
  // Chaque fichier n'est demandé qu'une fois par page (mémorisé).
  const memo = new Map();
  const getJSON = (name) => {
    if (!memo.has(name)) {
      memo.set(name, fetch(`content/${name}.json`, { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .catch((err) => { console.error(`Lecture de content/${name}.json impossible :`, err); return null; }));
    }
    return memo.get(name);
  };

  // Chemin d'image : accepte « photos/x.webp » comme « /photos/x.webp » (le site peut vivre dans un sous-dossier).
  const asset = (p) => (!p ? '' : /^(https?:)?\/\//.test(p) ? p : String(p).replace(/^\/+/, ''));
  const toPath = (p) => (typeof p === 'string' ? p : p && p.image) || '';
  const safeUrl = (u) => {
    try {
      const x = new URL(String(u).trim(), location.href);
      return ['http:', 'https:', 'mailto:'].includes(x.protocol) ? x.href : '';
    } catch { return ''; }
  };
  const external = (href) => /^https?:/.test(href) && new URL(href).origin !== location.origin;
  const link = (href, attrs, ...kids) => h('a', { href, ...(external(href) ? { target: '_blank', rel: 'noopener' } : {}), ...attrs }, ...kids);

  const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const list = (v) => (Array.isArray(v) ? v : []);
  const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));
  const num = (s) => parseFloat(String(s ?? '').replace(/\s/g, '').replace(',', '.'));
  const fmtNum = (v) => { const n = num(v); return isNaN(n) ? String(v ?? '') : new Intl.NumberFormat(loc).format(n); };

  /* ---------- Dates ---------------------------------------------------- */
  const fmtDate = (s) => {
    const d = new Date(String(s).slice(0, 10));
    return isNaN(d) ? '' : new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
  };
  // « 9 novembre 2026 à 14 h 30 » si l'heure est renseignée, sinon la date seule
  const fmtMaj = (s) => {
    const d = fmtDate(s);
    if (!d || String(s).length <= 10) return d;
    const x = new Date(String(s).replace(' ', 'T'));   // « 2026-11-09 14:30 » (format de l'éditeur)
    return isNaN(x) ? d : t('at_time', { d, h: x.getHours(), m: String(x.getMinutes()).padStart(2, '0') });
  };
  const dayMs = 864e5;
  const todayUTC = () => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); };
  const dayOf = (iso) => Date.parse(String(iso).slice(0, 10));      // minuit UTC du jour indiqué
  const jourDeRoute = (iso, depart) => Math.round((dayOf(iso) - dayOf(depart)) / dayMs) + 1;
  const minutes = (txt) => { const w = String(txt || '').trim().split(/\s+/).filter(Boolean).length; return w ? Math.max(1, Math.round(w / 200)) : 0; };
  const inDays = (n) => t(n > 1 ? 'in_days_n' : 'in_days_1', { n });

  /* ---------- Mini-Markdown sûr (gras, italique, liens, titres, listes, citations) ---------- */
  function inline(text) {
    const out = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      if (m[1]) { const u = safeUrl(m[2]); out.push(u ? link(u, {}, m[1]) : m[1]); }
      else if (m[3]) out.push(h('strong', {}, m[3]));
      else out.push(h('em', {}, m[4] || m[5]));
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function markdown(src) {
    const box = h('div', { class: 'prose' });
    const blocks = String(src || '').replace(/\r/g, '').trim().split(/\n{2,}/).filter(Boolean);
    for (const b of blocks) {
      const lines = b.split('\n');
      if (/^#{1,4}\s/.test(b)) box.append(h('h3', {}, ...inline(b.replace(/^#+\s*/, ''))));
      else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) box.append(h('ul', {}, lines.map((l) => h('li', {}, ...inline(l.replace(/^\s*[-*]\s+/, ''))))));
      else if (lines.every((l) => /^>\s?/.test(l))) box.append(h('blockquote', {}, ...inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))));
      else box.append(h('p', {}, lines.flatMap((l, i) => (i ? [h('br'), ...inline(l)] : inline(l)))));
    }
    return box;
  }
  // Début de texte sans mise en forme, pour les cartes
  const extrait = (txt, n = 150) => {
    const t2 = String(txt || '').replace(/[#>*_]|\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
    return t2.length > n ? `${t2.slice(0, n).replace(/\s\S*$/, '')}…` : t2;
  };

  // Texte d'interface avec mise en forme légère (*italique*) placé dans un élément
  const setRich = (node, s) => node.replaceChildren(...inline(s).map((x) => (typeof x === 'string' ? typo(x) : x)));

  /* ---------- Vidéo : on ne charge YouTube qu'au clic (respect de la vie privée) ---------- */
  function youtubeId(u) {
    try {
      const x = new URL(u);
      if (x.hostname === 'youtu.be') return x.pathname.slice(1);
      if (x.hostname.endsWith('youtube.com')) return x.searchParams.get('v') || (x.pathname.match(/\/(?:embed|shorts)\/([\w-]{6,})/) || [])[1] || null;
    } catch { /* adresse invalide */ }
    return null;
  }
  function videoBlock(url) {
    const u = safeUrl(url);
    if (!u) return null;
    const id = youtubeId(u);
    if (!id) return link(u, { class: 'btn btn--ghost' }, icon('play'), t('video_see'));
    const box = h('div', { class: 'video' });
    box.append(h('button', {
      type: 'button',
      onclick: () => box.replaceChildren(h('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
        title: t('video_title'), allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true,
      })),
    }, icon('play'), t('video_play')));
    return box;
  }

  /* ---------- Visionneuse de photos ----------------------------------- */
  const lightbox = (() => {
    let dlg, img, cap, count, items = [], i = 0, opener = null;
    const go = (d) => { i = (i + d + items.length) % items.length; show(); };
    const show = () => {
      img.src = asset(items[i].src);
      img.alt = items[i].alt;
      cap.textContent = items[i].alt;
      count.textContent = items.length > 1 ? `${i + 1} / ${items.length}` : '';
    };
    const build = () => {
      img = h('img', { alt: '' });
      cap = h('p');
      count = h('p', { class: 'small', 'aria-live': 'polite' });
      const btn = (cls, label, text, fn) => h('button', { class: `lb-btn ${cls}`, type: 'button', 'aria-label': label, onclick: fn }, text);
      dlg = h('dialog', { class: 'lightbox', 'aria-label': t('lb_label') },
        btn('lb-close', t('lb_close'), '×', () => dlg.close()),
        btn('lb-prev', t('lb_prev'), '‹', () => go(-1)),
        btn('lb-next', t('lb_next'), '›', () => go(1)),
        h('div', { class: 'frame' }, img, cap, count));
      dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('frame')) dlg.close(); });
      dlg.addEventListener('keydown', (e) => { if (items.length > 1 && e.key === 'ArrowRight') go(1); if (items.length > 1 && e.key === 'ArrowLeft') go(-1); });
      dlg.addEventListener('close', () => opener && opener.focus());
      document.body.append(dlg);
    };
    return {
      open(items2, index, from) {
        if (!dlg) build();
        items = items2; i = index; opener = from; show();
        dlg.showModal();
      },
    };
  })();

  function gallery(photos, label) {
    const items = photos.map((p, n) => ({ src: toPath(p), alt: t('photo_alt', { x: label, n: n + 1 }) })).filter((p) => p.src);
    if (!items.length) return null;
    const box = h('div', { class: `gallery n${Math.min(items.length, 3)}` });
    items.forEach((it, n) => {
      const b = h('button', { type: 'button', 'aria-label': t('enlarge', { x: it.alt }) },
        h('img', { src: asset(it.src), alt: it.alt, loading: 'lazy', decoding: 'async' }));
      b.addEventListener('click', () => lightbox.open(items, n, b));
      box.append(b);
    });
    return box;
  }

  /* ---------- Réseaux et contact -------------------------------------- */
  function socials(r) {
    const handle = (v) => `@${v.replace(/\/+$/, '').split('/').pop().replace(/^@/, '')}`;
    const defs = [
      ['email', 'mail', t('soc_email'), (v) => `mailto:${v}`, (v) => v],
      ['instagram', 'instagram', 'Instagram', (v) => v, handle],
      ['tiktok', 'tiktok', 'TikTok', (v) => v, handle],
      ['komoot', 'komoot', 'Komoot', (v) => v, () => 'Komoot'],
      ['youtube', 'youtube', 'YouTube', (v) => v, () => 'YouTube'],
    ];
    return defs.filter(([k]) => r[k]).map(([k, ic, label, href, text]) => {
      const u = safeUrl(href(r[k]));
      return u ? link(u, { class: 'social', 'aria-label': label }, icon(ic), text(r[k])) : null;
    }).filter(Boolean);
  }

  /* ---------- Où sommes-nous ? (dernière entrée du journal qui a un lieu) ---------- */
  const lastPosition = (jours) => {
    const e = jours.slice().sort(byDateDesc).find((x) => x.lieu);
    return e ? { texte: [e.lieu, tc(e.pays)].filter(Boolean).join(', '), maj: fmtMaj(e.date) } : null;
  };

  /* ---------- En-tête et pied de page (identiques sur toutes les pages) ---------- */
  const NAV = [['route', 'nav_route'], ['associations', 'nav_assos'], ['rencontres', 'nav_meetings'], ['soutiens', 'nav_supporters']];

  async function buildChrome(r) {
    const page = document.body.dataset.page;
    const [carnet, presse] = await Promise.all([getJSON('carnet'), getJSON('presse')]);
    const pos = lastPosition(list(carnet && carnet.jours));
    const nav = [...NAV];
    if (list(presse && presse.articles).length) nav.push(['presse', 'nav_press']);

    const top = $('#site-header');
    if (r.annonce) top.before(h('div', { class: 'annonce', role: 'status' }, ...inline(r.annonce)));

    // Bandeau « position en direct », fixe en haut de toutes les pages
    const diff = Math.round((todayUTC() - dayOf(r.depart)) / dayMs);
    const livebar = h('a', { class: 'livebar', href: 'route.html#en-direct' }, h('i', { class: 'dot', 'aria-hidden': 'true' }),
      pos ? h('span', {}, h('b', {}, t('live_pos')), pos.texte, h('span', { class: 'maj' }, t('live_updated', { d: pos.maj })))
        : h('span', {}, h('b', {}, t('departure')), P.depart, diff < 0 ? h('span', { class: 'maj' }, inDays(-diff)) : null));

    const navEl = h('nav', { class: 'nav', id: 'menu', 'aria-label': t('nav_label') },
      nav.map(([id, key]) => h('a', { href: `${id}.html`, 'aria-current': page === id ? 'page' : null }, t(key))));
    const burger = h('button', { class: 'burger', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'menu', 'aria-label': t('menu_open') }, icon('menu'));
    burger.addEventListener('click', () => {
      const open = navEl.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', t(open ? 'menu_close' : 'menu_open'));
    });
    // Choix de la langue : mémorisé, puis la page se recharge dans la langue choisie
    const langue = h('label', { class: 'lang' }, icon('globe'),
      h('select', { 'aria-label': t('lang_label'), onchange: (e) => setLang(e.target.value) },
        I18N.langs.map((l) => h('option', { value: l.code, lang: l.code, selected: l.code === lang }, l.label))));
    top.replaceWith(h('header', { class: 'site-header' }, livebar, h('div', { class: 'wrap' },
      h('a', { class: 'brand', href: 'index.html', 'aria-label': t('home_aria') },
        h('img', { src: 'assets/img/logo-vert.png', alt: 'TRIADE', width: 56, height: 55, onerror: (e) => e.target.replaceWith(h('span', { class: 'brand-name' }, 'TRIADE')) }), h('span', { class: 'brand-name' }, 'TRIADE')),
      h('div', { class: 'bar-right' }, navEl, langue,
        h('a', { class: 'btn btn--nav', href: 'cagnotte.html', 'aria-current': page === 'cagnotte' ? 'page' : null }, t('nav_donate')), burger))));

    const year = new Date().getFullYear();
    $('#site-footer').replaceWith(h('footer', { class: 'site-footer' }, h('div', { class: 'wrap' },
      h('div', { class: 'cols' },
        h('div', {}, h('img', { src: 'assets/img/logo-creme.png', alt: 'TRIADE', width: 85, height: 84, onerror: (e) => e.target.remove() }),
          h('p', { class: 'small' }, 'Three Riders In Adventure Discovering Europe.'),
          h('p', { class: 'small' }, t('foot_project')),
          link('https://www.institut-agro-montpellier.fr', { class: 'school-chip', 'aria-label': 'L’Institut Agro Montpellier' },
            h('img', { src: 'assets/img/logo-institut-agro.webp', alt: 'L’Institut Agro Montpellier', width: 104, height: 40, loading: 'lazy', onerror: (e) => e.target.parentElement.remove() }))),
        h('div', {}, h('h2', {}, t('foot_site')), h('ul', {}, NAV.map(([id, key]) => h('li', {}, h('a', { href: `${id}.html` }, t(key)))),
          h('li', {}, h('a', { href: 'presse.html' }, t('nav_press'))),
          h('li', {}, h('a', { href: 'cagnotte.html' }, t('support_assos'))))),
        h('div', {}, h('h2', {}, t('foot_follow')), h('div', { class: 'socials' }, socials(r)))),
      h('div', { class: 'legal' },
        h('span', {}, `© ${year} TRIADE`),
        h('span', {}, h('a', { href: 'mentions.html' }, t('legal')), ' · ', h('a', { href: 'admin/' }, t('team_space')))))));
  }

  // Remplit les textes et les liens marqués dans les pages : <span data-bind="email"> et <a data-href="instagram">
  function bind(r) {
    $$('[data-bind]').forEach((n) => { n.textContent = r[n.dataset.bind] ?? ''; });
    $$('[data-href]').forEach((n) => {
      const v = r[n.dataset.href];
      const u = v ? safeUrl(n.dataset.href === 'email' ? `mailto:${v}` : v) : '';
      if (u) { n.href = u; if (external(u)) { n.target = '_blank'; n.rel = 'noopener'; } } else n.hidden = true;
    });
  }

  // Traduit les textes fixes des pages : data-i18n="clé" (contenu) et data-i18n-attr="alt:clé;aria-label:clé" (attributs)
  function applyI18n() {
    $$('[data-i18n]').forEach((n) => setRich(n, t(n.dataset.i18n)));
    $$('[data-i18n-attr]').forEach((n) => n.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((x) => x.trim());
      if (attr && key) n.setAttribute(attr, t(key));
    }));
  }

  // Titre de l'onglet et descriptions de partage dans la langue choisie
  function setTitles(page) {
    const titles = {
      accueil: t('title_home'), route: `${t('nav_route')} — TRIADE`, associations: `${t('nav_assos')} — TRIADE`,
      rencontres: `${t('nav_meetings')} — TRIADE`, soutiens: `${t('nav_supporters')} — TRIADE`, presse: `${t('nav_press')} — TRIADE`,
      cagnotte: `${t('cag_eyebrow')} — TRIADE`, mentions: `${t('legal')} — TRIADE`,
    };
    const title = titles[page];
    if (!title) return;
    document.title = title;
    const set = (sel, v) => { const m = $(sel); if (m) m.setAttribute('content', v); };
    set('meta[property="og:title"]', title);
    if (page === 'accueil') { set('meta[name="description"]', t('desc_home')); set('meta[property="og:description"]', t('desc_home')); }
  }

  // Apparition douce des blocs au défilement (désactivée si la personne a demandé moins d'animations)
  function reveal() {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.card, .asso, .fig, .step, .pot, .map, .feature').forEach((n) => { n.classList.add('rv'); io.observe(n); });
  }

  const empty = (title, text) => h('div', { class: 'empty' }, h('b', {}, title), text);
  const statut = (s) => h('span', { class: 'statut', 'data-s': s }, tc(s));
  const spec = (n, text) => h('div', { class: 'spec' }, h('span', {}, `N° ${String(n).padStart(2, '0')}`), text);
  const pill = (text) => h('span', { class: 'pill' }, text);
  const lowerFirst = (s) => (lang === 'fr' ? s.charAt(0).toLowerCase() + s.slice(1) : s);

  /* ---------- Journal : cartes et article ----------------------------- */
  const entryTitle = (e) => e.titre || e.lieu || t('news_default_title');
  const entryId = (e) => slug(`${String(e.date).slice(0, 10)}-${entryTitle(e)}`);
  const entryPhotos = (e) => list(e.photos).map(toPath).filter(Boolean);
  const readPill = (e) => (minutes(e.texte) ? pill(t('read_min', { n: minutes(e.texte) })) : entryPhotos(e).length ? pill(entryPhotos(e).length > 1 ? t('photo_n', { n: entryPhotos(e).length }) : t('photo_1')) : null);
  const where = (e) => [e.lieu, tc(e.pays)].filter(Boolean).join(' · ');

  function journalCard(e) {
    const photos = entryPhotos(e);
    return h('a', { class: 'card jcard', href: `route.html#${entryId(e)}` },
      photos[0] ? h('img', { class: 'ph', src: asset(photos[0]), alt: '', loading: 'lazy', decoding: 'async' }) : h('div', { class: 'ph ph--empty', 'aria-hidden': 'true' }, icon('pin')),
      h('div', { class: 'card-body' },
        h('span', { class: 'tag' }, where(e) || fmtDate(e.date)),
        h('h3', {}, entryTitle(e)),
        e.texte ? h('p', { class: 'extrait' }, extrait(e.texte)) : null,
        h('div', { class: 'jmeta' }, e.auteur ? h('span', { class: 'by' }, t('by', { x: e.auteur })) : null, readPill(e), h('span', { class: 'when' }, fmtDate(e.date)))));
  }

  // Grande carte « À la une » : photo plein cadre, lieu, titre, auteur (comme les récits de bikepacking.com)
  function featureCard(e) {
    const photos = entryPhotos(e);
    return h('a', { class: 'feature', href: `route.html#${entryId(e)}` },
      h('img', { src: asset(photos[0]), alt: '', loading: 'lazy', decoding: 'async' }),
      h('div', { class: 'feature-text' },
        h('span', { class: 'tag' }, icon('pin'), [e.lieu, tc(e.pays)].filter(Boolean).join(', ') || fmtDate(e.date)),
        h('h3', {}, entryTitle(e)),
        h('span', { class: 'by' }, [e.auteur ? t('by', { x: e.auteur }) : null, fmtDate(e.date)].filter(Boolean).join(' · '))));
  }

  const scrollToHash = () => { if (location.hash) { const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el) el.scrollIntoView(); } };

  /* ---------- Pages --------------------------------------------------- */
  const pages = {};

  // ACCUEIL ------------------------------------------------------------
  pages.accueil = async (r) => {
    const [assosData, etapesData, carnetData, soutiensData, equipeData] = await Promise.all(['associations', 'etapes', 'carnet', 'soutiens', 'equipe'].map(getJSON));
    const tetes = $('#equipe-tetes');
    if (tetes) {
      tetes.replaceChildren(...list(equipeData && equipeData.membres).filter((m) => m.photo).map((m) => h('li', {},
        h('img', { src: asset(m.photo), alt: t('portrait_of', { x: m.prenom }), width: 160, height: 160, loading: 'lazy', decoding: 'async' }),
        h('b', {}, m.prenom))));
    }
    const assos = list(assosData && assosData.associations);
    const etapes = list(etapesData && etapesData.etapes);
    const jours = list(carnetData && carnetData.jours).sort(byDateDesc);
    const soutiens = list(soutiensData && soutiensData.soutiens);

    const diff = Math.round((todayUTC() - dayOf(r.depart)) / dayMs);
    const chip = $('#compte-a-rebours');
    if (chip) {
      chip.textContent = diff < 0 ? `${t('departure')}${P.depart}${inDays(-diff)}` : t('on_road', { n: diff + 1 });
      chip.parentElement.hidden = false;
    }

    // Chiffres clés avec leur objectif : réels s'ils sont renseignés, sinon prévus
    const faites = assos.filter((a) => a.statut === 'Rencontre réalisée').length;
    const total = Number(r.chiffres_associations) || assos.length;
    const fig = (value, label, tot, pct) => h('div', { class: 'fig' },
      h('b', {}, value, tot ? h('small', {}, ` / ${tot}`) : null), h('span', {}, label),
      pct !== undefined ? h('div', { class: 'meter sm', role: 'img', 'aria-label': t('meter_aria', { p: Math.round(pct) }) }, h('i', { style: `width:${Math.min(100, pct)}%` })) : null);
    const pctOf = (real, plan) => (num(real) >= 0 && num(plan) > 0 ? (num(real) / num(plan)) * 100 : undefined);
    $('#chiffres').replaceChildren(
      diff < 0 ? fig(String(-diff), t('fig_days_before')) : fig(String(diff + 1), t('fig_days_road')),
      r.reel_km ? fig(fmtNum(r.reel_km), t('fig_km_done'), fmtNum(r.chiffres_km), pctOf(r.reel_km, r.chiffres_km)) : fig(fmtNum(r.chiffres_km), t('fig_km_plan')),
      r.reel_pays ? fig(r.reel_pays, t('fig_countries_done'), r.chiffres_pays, pctOf(r.reel_pays, r.chiffres_pays)) : fig(r.chiffres_pays, t('fig_countries_plan')),
      faites ? fig(String(faites), t('fig_assos_done'), String(total), (faites / total) * 100) : fig(String(total), t('fig_assos_plan')));

    // Où sommes-nous aujourd'hui ?
    const pos = lastPosition(jours);
    const next = etapes.find((e) => !e.fait);
    const box = $('#position');
    if (box) {
      box.replaceChildren(
        h('small', {}, t('pos_where')),
        h('b', {}, pos ? pos.texte : t('pos_none')),
        h('div', { class: 'muted small' }, pos ? t('pos_updated', { d: pos.maj }) : t('pos_start')),
        next ? h('div', { class: 'muted small', style: 'margin-top:8px' }, t('pos_next', { nom: tc(next.nom), periode: tc(next.periode) })) : null);
    }

    // À la une + dernières nouvelles
    const news = $('#actus');
    if (jours.length) {
      const une = jours.find((e) => entryPhotos(e).length);
      const autres = jours.filter((e) => e !== une).slice(0, 3);
      news.replaceChildren(une ? featureCard(une) : null, autres.length ? h('div', { class: 'grid grid--3', style: une ? 'margin-top:20px' : '' }, autres.map(journalCard)) : null);
    } else {
      news.replaceChildren(empty(t('news_empty_t'), t('news_empty')));
    }

    // Aperçu des associations
    // Six blocs : l'association à deux logos (ARCTUROS & Callisto) est séparée en deux cartes
    const blocs = assos.flatMap((a) => {
      if (!a.logo2) return [{ nom: a.nom, logo: a.logo, espece: a.espece_accueil || a.espece, pays: a.pays, periode: a.periode, lien: a.nom }];
      const [n1, n2] = a.nom.split(' & '), [e1, e2] = String(a.espece_accueil || a.espece).split(/ et |\|/);
      const maj = (x) => x.charAt(0).toUpperCase() + x.slice(1);
      return [{ nom: n1, logo: a.logo, espece: maj(e1), pays: a.pays, periode: a.periode, lien: a.nom },
              { nom: n2 || a.nom, logo: a.logo2, espece: maj(e2 || e1), pays: a.pays, periode: a.periode, lien: a.nom }];
    });
    $('#assos-apercu').replaceChildren(...blocs.map((a, n) => h('a', { class: 'card assoc-mini', href: `associations.html#${slug(a.lien)}` },
      h('div', { class: 'logo-tile' }, a.logo ? h('img', { src: asset(a.logo), alt: a.nom, loading: 'lazy' }) : h('b', {}, a.nom)),
      h('div', { class: 'card-body' }, spec(n + 1, tc(a.espece)), h('h3', {}, a.nom), h('p', { class: 'meta' }, `${tc(a.pays)} · ${tc(a.periode)}`)))));

    // Soutiens (section masquée tant qu'il n'y en a pas)
    const zone = $('#soutiens');
    if (zone && soutiens.length) {
      $('#soutiens-liste').replaceChildren(...soutiens.map((s) => h('div', { class: 'card' }, soutienLogo(s))));
      zone.hidden = false;
    }
  };

  const soutienLogo = (s) => {
    const u = safeUrl(s.url);
    const inner = [s.logo ? h('img', { src: asset(s.logo), alt: s.nom, loading: 'lazy' }) : h('b', {}, s.nom)];
    return u ? link(u, { class: 'logo-tile', 'aria-label': s.nom }, ...inner) : h('div', { class: 'logo-tile' }, ...inner);
  };

  // SUR LA ROUTE : position en direct + Polarsteps, photos et vidéos du journal, étape par étape ---------------
  pages.route = async (r) => {
    const [data, carnet] = await Promise.all([getJSON('etapes'), getJSON('carnet')]);
    const etapes = list(data && data.etapes);
    const jours = list(carnet && carnet.jours).sort(byDateDesc);
    const idx = etapes.findIndex((e) => !e.fait);
    const pos = lastPosition(jours);

    // 1. En direct : où sommes-nous, et la carte Polarsteps
    $('#position').replaceChildren(
      h('b', {}, pos ? pos.texte : t('pos_none')),
      h('div', { class: 'muted small' }, pos ? t('pos_updated', { d: pos.maj }) : t('pos_start')));
    const ps = $('#polarsteps');
    const embed = r.polarsteps_embed ? safeUrl(r.polarsteps_embed) : '';
    const url = r.polarsteps_url ? safeUrl(r.polarsteps_url) : '';
    if (embed) ps.replaceChildren(h('iframe', { class: 'embed', src: embed, title: t('ps_embed_title'), loading: 'lazy' }), url ? h('p', { class: 'small' }, link(url, {}, t('ps_open'))) : null);
    else if (url) ps.replaceChildren(h('p', {}, t('ps_text')), link(url, { class: 'btn' }, icon('pin'), t('ps_btn')));
    else ps.replaceChildren(empty(t('ps_empty_t'), t('ps_empty')));

    // 3. Étape par étape
    $('#etapes-liste').replaceChildren(...etapes.map((e, n) => h('li', { class: `step${e.association ? ' is-asso' : ''}${e.fait ? ' is-done' : ''}${n === idx && etapes.some((x) => x.fait) ? ' is-current' : ''}` },
      h('b', {}, tc(e.nom), e.association ? h('span', { class: 'badge-asso' }, t('badge_asso')) : null),
      h('span', { class: 'w' }, tc(e.periode)),
      h('span', { class: 'd' }, tc(e.detail)),
      h('span', { class: 'k' }, e.km && e.km !== '0' ? t('km_unit', { n: e.km }) : ''))));

    // 2. Photos et vidéos : grille de cartes, puis récit complet (même page, adresse #…)
    const zone = $('#fil');
    const tete = $('#photos-tete');
    const autres = $$('.hors-lecture');
    const baseTitle = document.title;

    const article = (e) => {
      const photos = entryPhotos(e);
      const n = e.date ? jourDeRoute(e.date, r.depart) : 0;
      const lieu = [e.lieu, tc(e.pays)].filter(Boolean).join(', ');
      document.title = `${entryTitle(e)} — TRIADE`;
      zone.replaceChildren(h('article', { class: 'story' },
        link('route.html#photos', { class: 'link-arrow back' }, icon('back'), t('back_route')),
        h('header', { class: 'story-head' },
          h('div', { class: 'jmeta' }, lieu ? h('span', { class: 'tag' }, icon('pin'), lieu) : null, n >= 1 ? pill(t('day_n', { n })) : null, readPill(e)),
          h('h1', { class: 'h1 story-title' }, entryTitle(e)),
          h('p', { class: 'muted' }, [e.auteur ? t('by', { x: e.auteur }) : null, fmtMaj(e.date), lang !== 'fr' ? t('orig_note') : null].filter(Boolean).join(' · '))),
        photos[0] ? h('figure', { class: 'story-cover' }, h('img', { src: asset(photos[0]), alt: t('photo_alt', { x: entryTitle(e), n: 1 }) })) : null,
        e.texte ? markdown(e.texte) : null,
        photos.length > 1 ? gallery(photos.slice(1), entryTitle(e)) : null,
        e.video ? h('div', { style: 'margin-top:24px;max-width:640px' }, videoBlock(e.video)) : null));
    };

    const grid = () => {
      document.title = baseTitle;
      zone.replaceChildren(jours.length ? h('div', { class: 'grid grid--3' }, jours.map(journalCard))
        : empty(t('news_empty_t'), t('news_empty')));
    };

    const render = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const e = id && jours.find((x) => entryId(x) === id);
      autres.forEach((s) => { s.hidden = Boolean(e); });
      tete.hidden = Boolean(e);
      $('#photos').hidden = !e && !jours.length;   // pas de section vide avant le départ
      if (e) { article(e); window.scrollTo(0, 0); } else { grid(); scrollToHash(); }
    };
    addEventListener('hashchange', () => { render(); reveal(); });
    render();
  };

  // ASSOCIATIONS ---------------------------------------------------------
  function interviewCard(iv, withAsso) {
    const video = iv.video ? videoBlock(iv.video) : null;
    return h('article', { class: 'interview', 'data-asso': iv.association || '' },
      iv.photo ? h('img', { class: 'ph', src: asset(iv.photo), alt: iv.personne ? t('portrait_of', { x: iv.personne }) : '', loading: 'lazy', decoding: 'async' }) : null,
      h('div', { class: 'interview-body' },
        h('span', { class: 'tag' }, [withAsso ? iv.association : null, iv.date ? fmtDate(iv.date) : null].filter(Boolean).join(' · ')),
        iv.citation ? h('blockquote', {}, iv.citation) : null,
        h('div', { class: 'who' }, h('b', {}, iv.personne || ''), iv.role ? h('span', {}, ` — ${iv.role}`) : null),
        video,
        iv.texte ? h('details', { class: 'texte' }, h('summary', {}, t('read_iv')), markdown(iv.texte)) : null));
  }

  pages.associations = async () => {
    const [a, i] = await Promise.all([getJSON('associations'), getJSON('interviews')]);
    const assos = list(a && a.associations);
    const ivs = list(i && i.interviews).sort(byDateDesc);
    $('#liste').replaceChildren(...assos.map((x, n) => {
      const mine = ivs.filter((iv) => iv.association === x.nom);
      const site = x.site && safeUrl(x.site);
      const don = x.don_url && safeUrl(x.don_url);
      const first = x.nom.split(' & ')[0], second = x.nom.split(' & ')[1];
      const siteOf = (name) => t(/^[AEIOUYÀÂÉÈÊÎÔÛH]/i.test(name) ? 'site_of_v' : 'site_of', { x: name });
      return h('article', { class: 'asso', id: slug(x.nom) },
        h('div', { class: 'asso-side' },
          x.logo ? h('div', { class: 'asso-logos' }, h('img', { src: asset(x.logo), alt: x.logo2 ? first : x.nom, loading: 'lazy' }),
            x.logo2 ? [h('span', { class: 'logo-plus', 'aria-hidden': 'true' }, '+'), h('img', { src: asset(x.logo2), alt: x.logo2_alt || '', loading: 'lazy' })] : null) : null,
          h('div', {}, x.statut && x.statut !== 'Contact en cours' ? statut(x.statut) : null, h('p', { class: 'small muted', style: x.statut && x.statut !== 'Contact en cours' ? 'margin:10px 0 0' : 'margin:0' }, tc(x.periode)))),
        h('div', { class: 'asso-main' },
          illu(x.illustration, x.illustration_alt, 'asso-art'),
          h('div', { class: 'asso-tete' },
            spec(n + 1, tc(x.espece)),
            h('h2', {}, x.nom),
            h('p', { class: 'meta' }, [tc(x.pays), tc(x.zone)].filter(Boolean).join(' · ')),
            markdown(tc(x.description))),
          (site || don) ? h('div', { class: 'links' }, site ? link(site, { class: 'btn btn--ghost' }, x.site2 ? siteOf(first) : t('site_of_a')) : null,
            x.site2 && safeUrl(x.site2) ? link(safeUrl(x.site2), { class: 'btn btn--ghost' }, second ? siteOf(second) : t('site_of_2')) : null, don ? link(don, { class: 'btn' }, t('donate_direct')) : null) : null,
          h('div', { class: 'asso-interviews' },
            h('h3', {}, t('testimonials')),
            mine.length ? h('div', { class: 'grid grid--2' }, mine.map((iv) => interviewCard(iv, false))) : h('p', { class: 'muted small', style: 'margin:0' }, t('testi_soon', { p: lowerFirst(tc(x.periode)) })))));
    }));
    const acces = $('#acces');
    if (acces) acces.replaceChildren(...assos.map((x) => h('a', { href: `#${slug(x.nom)}` }, x.nom)));
    scrollToHash();
  };

  // RENCONTRES (toutes les interviews) -----------------------------------------
  pages.rencontres = async () => {
    const i = await getJSON('interviews');
    const ivs = list(i && i.interviews).sort(byDateDesc);
    const zone = $('#liste');
    if (!ivs.length) { zone.replaceChildren(empty(t('meet_empty_t'), t('meet_empty'))); return; }
    const noms = [...new Set(ivs.map((iv) => iv.association).filter(Boolean))];
    const grid = h('div', { class: 'grid grid--2' }, ivs.map((iv) => interviewCard(iv, true)));
    const chips = [t('filter_all'), ...noms].map((nom, n) => h('button', { type: 'button', 'aria-pressed': String(n === 0) }, nom));
    chips.forEach((c, n) => c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      $$('.interview', grid).forEach((card) => { card.hidden = n > 0 && card.dataset.asso !== noms[n - 1]; });
    }));
    zone.replaceChildren(noms.length > 1 ? h('div', { class: 'filters', role: 'group', 'aria-label': t('filter_label') }, chips) : null, grid);
  };

  // ILS NOUS SOUTIENNENT (sponsors et soutiens ; un emplacement reste toujours ouvert pour les suivants) ----------
  pages.soutiens = async (r) => {
    const data = await getJSON('soutiens');
    const items = list(data && data.soutiens);
    const mail = r.email ? safeUrl(`mailto:${r.email}`) : '';
    const slot = h('article', { class: 'card soutien soutien--libre' },
      h('div', { class: 'card-body' }, h('h3', {}, t('sup_slot_t')), h('p', {}, t('sup_slot')),
        mail ? link(mail, { class: 'btn btn--ghost' }, icon('mail'), t('sup_slot_btn')) : null));
    $('#liste').replaceChildren(h('div', { class: 'grid grid--3' }, items.map((s) => h('article', { class: 'card soutien' },
      s.logo ? soutienLogo(s) : null,   // sans logo, le nom s'affiche une seule fois (titre de la carte)
      h('div', { class: 'card-body' }, h('h3', {}, s.nom), s.ville ? h('p', { class: 'meta' }, s.ville) : null,
        s.phrase ? h('p', {}, tc(s.phrase)) : null,
        s.histoire ? h('details', { class: 'texte' }, h('summary', {}, t('sup_story')), markdown(s.histoire)) : null))), slot));
  };

  // PRESSE -------------------------------------------------------------------
  pages.presse = async () => {
    const data = await getJSON('presse');
    const items = list(data && data.articles).sort(byDateDesc);
    $('#revue').replaceChildren(items.length
      ? h('ul', { class: 'revue' }, items.map((a) => { const u = safeUrl(a.url); return h('li', {}, h('span', { class: 'tag' }, [a.media, fmtDate(a.date)].filter(Boolean).join(' · ')), u ? link(u, {}, a.titre) : h('span', {}, a.titre)); }))
      : empty(t('press_none_t'), t('press_none')));
  };

  // CAGNOTTE -----------------------------------------------------------------
  pages.cagnotte = async () => {
    const [c, a] = await Promise.all([getJSON('cagnotte'), getJSON('associations')]);
    const cag = c || {};
    $('#texte').replaceChildren(markdown(tc(cag.texte)));
    const zone = $('#don');
    const widget = cag.widget ? safeUrl(cag.widget) : '';
    const url = cag.url ? safeUrl(cag.url) : '';
    const goal = num(cag.objectif), got = num(cag.collecte);
    const euro = (v) => new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
    const parts = [];
    if (got >= 0 && goal > 0) {
      parts.push(h('div', {}, h('div', { class: 'pot-amount' }, euro(got)), h('p', { class: 'muted', style: 'margin:6px 0 0' }, t('cag_collected', { x: euro(goal) })),
        h('div', { class: 'meter', role: 'img', 'aria-label': t('cag_goal_aria', { p: Math.round((got / goal) * 100) }) }, h('i', { style: `width:${Math.min(100, (got / goal) * 100)}%` }))));
    }
    if (widget) parts.push(h('iframe', { class: 'embed', src: widget, title: t('cag_form'), loading: 'lazy' }));
    else if (url) parts.push(h('div', {}, link(url, { class: 'btn' }, cag.plateforme ? t('cag_donate_on', { x: cag.plateforme }) : t('cag_donate'))));
    else parts.push(empty(t('cag_soon_t'), t('cag_soon')));
    zone.replaceChildren(...parts);

    const direct = list(a && a.associations).filter((x) => x.don_url && safeUrl(x.don_url));
    if (direct.length) {
      $('#direct .wrap').replaceChildren(h('h2', { class: 'h2' }, t('cag_direct_h')),
        h('div', { class: 'grid grid--3', style: 'margin-top:28px' }, direct.map((x) => link(safeUrl(x.don_url), { class: 'card' },
          h('div', { class: 'logo-tile' }, x.logo ? h('img', { src: asset(x.logo), alt: '' }) : null),
          h('div', { class: 'card-body' }, h('h3', {}, x.nom), h('p', { class: 'meta' }, t('cag_direct_link')))))));
      $('#direct').hidden = false;
    }
  };

  pages.mentions = async () => {};

  /* ---------- Démarrage ----------------------------------------------- */
  // Dessins à l'encre et à l'aquarelle (assets/illustrations/) : dimensions réelles pour éviter les sauts de mise en page.
  const ILLU = { 'arbre': [390, 534], 'cigogne': [322, 534], 'loup': [352, 415], 'lynx-balkans': [376, 453], 'oiseaux-allemagne': [415, 497], 'ours-marsican': [600, 750], 'ours-brun': [380, 463], 'phoque-moine': [417, 344], 'vegetation': [377, 536] };
  const illu = (nom, alt, cls) => ILLU[nom] ? h('img', { class: `illu ${cls || ''}`.trim(), src: `assets/illustrations/${nom}.webp`, alt: alt || '', width: ILLU[nom][0], height: ILLU[nom][1], loading: 'lazy', decoding: 'async' }) : null;

  // Bandeau : paysages qui glissent d'une photo à la suivante (content/bandeau.json, modifiable dans l'Espace équipe).
  // Légende à droite de l'image : lieu (lien Google Maps), étape, crédit. Pas de pastilles de navigation.
  // Sans photo dans le fichier, la zone reste sur fond crème : aucune photo n'est inventée.
  const mapsUrl = (p) => {
    const q = String(p.maps || p.lieu || '').trim();
    if (!q) return '';
    return /^https?:\/\//.test(q) ? safeUrl(q) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  };
  async function bandeau() {
    const zone = $('#bandeau');
    if (!zone) return;
    const data = await getJSON('bandeau');
    const photos = list(data && data.photos).filter((p) => p && p.image);
    if (!photos.length) { zone.classList.add('bandeau--vide'); return; }
    const slides = photos.map((p, n) => h('div', { class: 'bandeau-slide' }, h('img', { src: asset(p.image), alt: '', loading: n ? 'lazy' : 'eager', decoding: 'async' })));
    const track = h('div', { class: 'bandeau-track' }, slides, slides[0].cloneNode(true));   // la copie de la 1re photo permet de boucler sans saut
    const legende = h('div', { class: 'bandeau-legende' });
    zone.prepend(track);
    zone.append(legende);
    let i = 0, timer = null;
    const montre = (n) => {
      const p = photos[n];
      const lieu = tc(p.lieu), href = mapsUrl(p), cred = p.credit || '';
      legende.replaceChildren(
        lieu ? (href ? link(href, { class: 'lieu', 'aria-label': `${lieu} — ${t('maps_open')}`, title: t('maps_open') }, icon('pin'), lieu) : h('b', { class: 'lieu' }, lieu)) : null,
        p.etape ? h('span', { class: 'etape' }, tc(p.etape)) : null,
        cred ? h('span', { class: 'credit' }, p.lien && safeUrl(p.lien) ? link(safeUrl(p.lien), {}, cred) : cred) : null);
    };
    const place = (n, anime) => { track.classList.toggle('glisse', !!anime); track.style.transform = `translateX(${-100 * n}%)`; };
    const suivante = () => {
      i += 1; place(i, true); montre(i % photos.length);
      if (i === photos.length) setTimeout(() => { i = 0; place(0, false); }, 1600);   // retour discret sur la vraie 1re photo
    };
    const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (photos.length > 1 && !calme) timer = setInterval(() => { if (!document.hidden) suivante(); }, Math.max(3, Number(data.intervalle) || 20) * 1000);
    montre(0); place(0, false);
    return timer;
  }

  async function start() {
    const r = await getJSON('reglages');
    const main = $('#contenu');
    document.documentElement.lang = lang;
    if (!r) {
      $('#site-header').replaceWith(h('header', { class: 'site-header' }, h('div', { class: 'wrap' }, h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'brand-name' }, 'TRIADE')))));
      main.prepend(h('div', { class: 'wrap section' }, h('div', { class: 'error', role: 'alert' },
        h('b', {}, 'Le contenu du site n’a pas pu être chargé. '),
        'Si vous avez ouvert ce fichier directement depuis votre ordinateur, utilisez plutôt l’adresse en ligne du site (les navigateurs bloquent la lecture des fichiers locaux).')));
      return;
    }
    // Valeurs communes aux textes : {km}, {mois}, {periode}, {depart}
    Object.assign(P, { km: fmtNum(r.chiffres_km), mois: r.chiffres_mois, periode: tc(r.periode_texte), depart: tc(r.depart_texte) });
    const page = document.body.dataset.page;
    applyI18n();
    setTitles(page);
    await buildChrome(r);
    bind(r);
    bandeau();
    const run = pages[page];
    if (run) await run(r);
    reveal();
    document.documentElement.classList.add('ready');
  }
  start();
})();
