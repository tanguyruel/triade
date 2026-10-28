/* ==========================================================================
   TRIADE — script du site
   Rôle : lire les fichiers du dossier « content/ » (ce que modifie l'équipe
   depuis /admin) et fabriquer les pages. Aucune bibliothèque externe.
   Pour modifier le TEXTE ou les PHOTOS : ne touchez pas à ce fichier,
   passez par /admin (voir GUIDE.md).
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Petits outils ------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Typographie française : espace insécable avant ? ! : ; » € % et après « (évite un « ? » seul en début de ligne)
  const typo = (s) => s.replace(/ ([?!:;»€%])/g, '\u00a0$1').replace(/(«) /g, '$1\u00a0');

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
    youtube: SVG('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>'),
    mail: SVG('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7.5 8 6 8-6"/>'),
    arrow: SVG('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    back: SVG('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    play: SVG('<path d="M7 5v14l12-7z" fill="currentColor"/>'),
    menu: SVG('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    pin: SVG('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
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
  const num = (s) => parseFloat(String(s ?? '').replace(/[\s  ]/g, '').replace(',', '.'));

  /* ---------- Dates ---------------------------------------------------- */
  const fmtDate = (s) => {
    const d = new Date(String(s).slice(0, 10));
    return isNaN(d) ? '' : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
  };
  // « 9 novembre 2026 à 14 h 30 » si l'heure est renseignée, sinon la date seule
  const fmtMaj = (s) => {
    const d = fmtDate(s);
    if (!d || String(s).length <= 10) return d;
    const t = new Date(String(s).replace(' ', 'T'));   // « 2026-11-09 14:30 » (format de l'éditeur)
    return isNaN(t) ? d : `${d} à ${t.getHours()} h ${String(t.getMinutes()).padStart(2, '0')}`;
  };
  const dayMs = 864e5;
  const todayUTC = () => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); };
  const dayOf = (iso) => Date.parse(String(iso).slice(0, 10));      // minuit UTC du jour indiqué
  const jourDeRoute = (iso, depart) => Math.round((dayOf(iso) - dayOf(depart)) / dayMs) + 1;
  const minutes = (txt) => { const w = String(txt || '').trim().split(/\s+/).filter(Boolean).length; return w ? Math.max(1, Math.round(w / 200)) : 0; };

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
    const t = String(txt || '').replace(/[#>*_]|\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
    return t.length > n ? `${t.slice(0, n).replace(/\s\S*$/, '')}…` : t;
  };

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
    if (!id) return link(u, { class: 'btn btn--ghost' }, icon('play'), 'Voir la vidéo');
    const box = h('div', { class: 'video' });
    box.append(h('button', {
      type: 'button',
      onclick: () => box.replaceChildren(h('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
        title: 'Vidéo', allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true,
      })),
    }, icon('play'), 'Lire la vidéo'));
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
      dlg = h('dialog', { class: 'lightbox', 'aria-label': 'Visionneuse de photos' },
        btn('lb-close', 'Fermer', '×', () => dlg.close()),
        btn('lb-prev', 'Photo précédente', '‹', () => go(-1)),
        btn('lb-next', 'Photo suivante', '›', () => go(1)),
        h('div', { class: 'frame' }, img, cap, count));
      dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('frame')) dlg.close(); });
      dlg.addEventListener('keydown', (e) => { if (items.length > 1 && e.key === 'ArrowRight') go(1); if (items.length > 1 && e.key === 'ArrowLeft') go(-1); });
      dlg.addEventListener('close', () => opener && opener.focus());
      document.body.append(dlg);
    };
    return {
      open(list, index, from) {
        if (!dlg) build();
        items = list; i = index; opener = from; show();
        dlg.showModal();
      },
    };
  })();

  function gallery(photos, label) {
    const items = photos.map((p, n) => ({ src: toPath(p), alt: `${label} — photo ${n + 1}` })).filter((p) => p.src);
    if (!items.length) return null;
    const box = h('div', { class: `gallery n${Math.min(items.length, 3)}` });
    items.forEach((it, n) => {
      const b = h('button', { type: 'button', 'aria-label': `Agrandir : ${it.alt}` },
        h('img', { src: asset(it.src), alt: it.alt, loading: 'lazy', decoding: 'async' }));
      b.addEventListener('click', () => lightbox.open(items, n, b));
      box.append(b);
    });
    return box;
  }

  /* ---------- Réseaux et contact -------------------------------------- */
  function socials(r) {
    const defs = [
      ['email', 'mail', 'Écrire à l’équipe', (v) => `mailto:${v}`, (v) => v],
      ['instagram', 'instagram', 'Instagram', (v) => v, (v) => `@${v.replace(/\/+$/, '').split('/').pop()}`],
      ['tiktok', 'tiktok', 'TikTok', (v) => v, (v) => `@${v.replace(/\/+$/, '').split('/').pop().replace(/^@/, '')}`],
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
    return e ? { texte: [e.lieu, e.pays].filter(Boolean).join(', '), maj: fmtMaj(e.date) } : null;
  };

  /* ---------- En-tête et pied de page (identiques sur toutes les pages) ---------- */
  const NAV = [['aventure', 'L’aventure'], ['suivi', 'Suivi en direct'], ['associations', 'Associations'], ['rencontres', 'Rencontres'], ['journal', 'Journal']];

  async function buildChrome(r) {
    const page = document.body.dataset.page;
    const [carnet, soutiens, presse] = await Promise.all([getJSON('carnet'), getJSON('soutiens'), getJSON('presse')]);
    const pos = lastPosition(list(carnet && carnet.jours));
    const nav = [...NAV];
    if (list(soutiens && soutiens.soutiens).length) nav.push(['soutiens', 'Ils nous aident']);
    if (list(presse && presse.articles).length) nav.push(['presse', 'Presse']);

    const top = $('#site-header');
    if (r.annonce) top.before(h('div', { class: 'annonce', role: 'status' }, ...inline(r.annonce)));

    // Bandeau « position en direct », fixe en haut de toutes les pages
    const diff = Math.round((todayUTC() - dayOf(r.depart)) / dayMs);
    const livebar = h('a', { class: 'livebar', href: 'suivi.html' }, h('i', { class: 'dot', 'aria-hidden': 'true' }),
      pos ? h('span', {}, h('b', {}, 'Position en direct : '), pos.texte, h('span', { class: 'maj' }, ` · mis à jour le ${pos.maj}`))
        : h('span', {}, h('b', {}, 'Départ '), `${r.depart_texte}`, diff < 0 ? h('span', { class: 'maj' }, ` · dans ${-diff} jour${-diff > 1 ? 's' : ''}`) : null));

    const navEl = h('nav', { class: 'nav', id: 'menu', 'aria-label': 'Navigation principale' },
      nav.map(([id, label]) => h('a', { href: `${id}.html`, 'aria-current': page === id ? 'page' : null }, label)));
    const burger = h('button', { class: 'burger', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'menu', 'aria-label': 'Ouvrir le menu' }, icon('menu'));
    burger.addEventListener('click', () => {
      const open = navEl.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    top.replaceWith(h('header', { class: 'site-header' }, livebar, h('div', { class: 'wrap' },
      h('a', { class: 'brand', href: 'index.html', 'aria-label': 'TRIADE, accueil' },
        h('img', { src: 'assets/img/logo-vert.png', alt: 'TRIADE', width: 56, height: 55, onerror: (e) => e.target.replaceWith(h('span', { class: 'brand-name' }, 'TRIADE')) }), h('span', { class: 'brand-name' }, 'TRIADE')),
      h('div', { class: 'bar-right' }, navEl,
        h('a', { class: 'btn btn--nav', href: 'cagnotte.html', 'aria-current': page === 'cagnotte' ? 'page' : null }, 'Soutenir'), burger))));

    const year = new Date().getFullYear();
    $('#site-footer').replaceWith(h('footer', { class: 'site-footer' }, h('div', { class: 'wrap' },
      h('div', { class: 'cols' },
        h('div', {}, h('img', { src: 'assets/img/logo-creme.png', alt: 'TRIADE', width: 85, height: 84, onerror: (e) => e.target.remove() }),
          h('p', { class: 'small' }, 'Three Riders In Adventure Discovering Europe.'),
          h('p', { class: 'small' }, 'Un projet étudiant et associatif.'),
          link('https://institut-agro-montpellier.fr', { class: 'school-chip', 'aria-label': 'L’Institut Agro Montpellier' },
            h('img', { src: 'assets/img/logo-institut-agro.webp', alt: 'L’Institut Agro Montpellier', width: 104, height: 40, loading: 'lazy', onerror: (e) => e.target.parentElement.remove() }))),
        h('div', {}, h('h2', {}, 'Le site'), h('ul', {}, NAV.map(([id, label]) => h('li', {}, h('a', { href: `${id}.html` }, label))),
          h('li', {}, h('a', { href: 'soutiens.html' }, 'Ils nous aident')), h('li', {}, h('a', { href: 'presse.html' }, 'Presse')),
          h('li', {}, h('a', { href: 'cagnotte.html' }, 'Soutenir les associations')))),
        h('div', {}, h('h2', {}, 'Nous suivre'), h('div', { class: 'socials' }, socials(r)))),
      h('div', { class: 'legal' },
        h('span', {}, `© ${year} TRIADE`),
        h('span', {}, h('a', { href: 'mentions.html' }, 'Mentions légales'), ' · ', h('a', { href: 'admin/' }, 'Espace équipe'))))));
  }

  // Remplit les textes et les liens marqués dans les pages : <span data-bind="chiffres_km"> et <a data-href="instagram">
  function bind(r) {
    $$('[data-bind]').forEach((n) => { n.textContent = r[n.dataset.bind] ?? ''; });
    $$('[data-href]').forEach((n) => {
      const v = r[n.dataset.href];
      const u = v ? safeUrl(n.dataset.href === 'email' ? `mailto:${v}` : v) : '';
      if (u) { n.href = u; if (external(u)) { n.target = '_blank'; n.rel = 'noopener'; } } else n.hidden = true;
    });
  }

  // Apparition douce des blocs au défilement (désactivée si la personne a demandé moins d'animations)
  function reveal() {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.pillar, .card, .asso, .fig, .member, .step, .pot, .map, .feature').forEach((n) => { n.classList.add('rv'); io.observe(n); });
  }

  const empty = (title, text) => h('div', { class: 'empty' }, h('b', {}, title), text);
  const statut = (s) => h('span', { class: 'statut', 'data-s': s }, s);
  const spec = (n, text) => h('div', { class: 'spec' }, h('span', {}, `N° ${String(n).padStart(2, '0')}`), text);
  const pill = (text) => h('span', { class: 'pill' }, text);

  /* ---------- Journal : cartes et article ----------------------------- */
  const entryTitle = (e) => e.titre || e.lieu || 'Nouvelles du voyage';
  const entryId = (e) => slug(`${String(e.date).slice(0, 10)}-${entryTitle(e)}`);
  const entryPhotos = (e) => list(e.photos).map(toPath).filter(Boolean);
  const readPill = (e) => (minutes(e.texte) ? pill(`${minutes(e.texte)} min de lecture`) : entryPhotos(e).length ? pill(`${entryPhotos(e).length} photo${entryPhotos(e).length > 1 ? 's' : ''}`) : null);

  function journalCard(e) {
    const photos = entryPhotos(e);
    return h('a', { class: 'card jcard', href: `journal.html#${entryId(e)}` },
      photos[0] ? h('img', { class: 'ph', src: asset(photos[0]), alt: '', loading: 'lazy', decoding: 'async' }) : h('div', { class: 'ph ph--empty', 'aria-hidden': 'true' }, icon('pin')),
      h('div', { class: 'card-body' },
        h('span', { class: 'tag' }, [e.lieu, e.pays].filter(Boolean).join(' · ') || fmtDate(e.date)),
        h('h3', {}, entryTitle(e)),
        e.texte ? h('p', { class: 'extrait' }, extrait(e.texte)) : null,
        h('div', { class: 'jmeta' }, e.auteur ? h('span', { class: 'by' }, `Par ${e.auteur}`) : null, readPill(e), h('span', { class: 'when' }, fmtDate(e.date)))));
  }

  // Grande carte « À la une » : photo plein cadre, lieu, titre, auteur (comme les récits de bikepacking.com)
  function featureCard(e) {
    const photos = entryPhotos(e);
    return h('a', { class: 'feature', href: `journal.html#${entryId(e)}` },
      h('img', { src: asset(photos[0]), alt: '', loading: 'lazy', decoding: 'async' }),
      h('div', { class: 'feature-text' },
        h('span', { class: 'tag' }, icon('pin'), [e.lieu, e.pays].filter(Boolean).join(', ') || fmtDate(e.date)),
        h('h3', {}, entryTitle(e)),
        h('span', { class: 'by' }, [e.auteur ? `Par ${e.auteur}` : null, fmtDate(e.date)].filter(Boolean).join(' · '))));
  }

  /* ---------- Pages --------------------------------------------------- */
  const pages = {};

  // ACCUEIL ------------------------------------------------------------
  pages.accueil = async (r) => {
    const [assosData, etapesData, carnetData, soutiensData] = await Promise.all(['associations', 'etapes', 'carnet', 'soutiens'].map(getJSON));
    const assos = list(assosData && assosData.associations);
    const etapes = list(etapesData && etapesData.etapes);
    const jours = list(carnetData && carnetData.jours).sort(byDateDesc);
    const soutiens = list(soutiensData && soutiensData.soutiens);

    hero(r);
    const diff = Math.round((todayUTC() - dayOf(r.depart)) / dayMs);
    const chip = $('#compte-a-rebours');
    if (chip) {
      chip.textContent = diff < 0 ? `Départ ${r.depart_texte} · dans ${-diff} jour${-diff > 1 ? 's' : ''}` : `En route · jour ${diff + 1}`;
      chip.parentElement.hidden = false;
    }

    // Chiffres clés avec leur objectif : réels s'ils sont renseignés, sinon prévus
    const faites = assos.filter((a) => a.statut === 'Rencontre réalisée').length;
    const fig = (value, label, total, pct) => h('div', { class: 'fig' },
      h('b', {}, value, total ? h('small', {}, ` / ${total}`) : null), h('span', {}, label),
      pct !== undefined ? h('div', { class: 'meter sm', role: 'img', 'aria-label': `${Math.round(pct)} % de l’objectif` }, h('i', { style: `width:${Math.min(100, pct)}%` })) : null);
    const pctOf = (real, plan) => (num(real) >= 0 && num(plan) > 0 ? (num(real) / num(plan)) * 100 : undefined);
    $('#chiffres').replaceChildren(
      diff < 0 ? fig(String(-diff), 'jours avant le départ') : fig(String(diff + 1), 'jours de route'),
      r.reel_km ? fig(r.reel_km, 'km parcourus', r.chiffres_km, pctOf(r.reel_km, r.chiffres_km)) : fig(r.chiffres_km, 'km prévus'),
      r.reel_pays ? fig(r.reel_pays, 'pays traversés', r.chiffres_pays, pctOf(r.reel_pays, r.chiffres_pays)) : fig(r.chiffres_pays, 'pays prévus'),
      faites ? fig(String(faites), 'associations rencontrées', String(assos.length), (faites / assos.length) * 100) : fig(String(assos.length || r.chiffres_associations), 'associations à rencontrer'));

    // Où sommes-nous aujourd'hui ?
    const pos = lastPosition(jours);
    const next = etapes.find((e) => !e.fait);
    const box = $('#position');
    if (box) {
      box.replaceChildren(
        h('small', {}, 'Où sommes-nous aujourd’hui ?'),
        h('b', {}, pos ? pos.texte : 'Pas encore partis'),
        h('div', { class: 'muted small' }, pos ? `Mis à jour le ${pos.maj}` : `Départ de Grasse ${r.depart_texte}`),
        next ? h('div', { class: 'muted small', style: 'margin-top:8px' }, `Prochaine étape : ${next.nom} · ${next.periode}`) : null);
    }

    // À la une + dernières nouvelles
    const news = $('#actus');
    if (jours.length) {
      const une = jours.find((e) => entryPhotos(e).length);
      const autres = jours.filter((e) => e !== une).slice(0, une ? 3 : 3);
      news.replaceChildren(une ? featureCard(une) : null, autres.length ? h('div', { class: 'grid grid--3', style: une ? 'margin-top:20px' : '' }, autres.map(journalCard)) : null);
    } else {
      news.replaceChildren(empty('Le journal s’ouvre au départ', `Premières photos et premiers récits dès ${r.depart_texte}. D’ici là, les préparatifs se suivent sur Instagram.`));
    }

    // Aperçu des associations
    $('#assos-apercu').replaceChildren(...assos.map((a, n) => h('a', { class: 'card assoc-mini', href: `associations.html#${slug(a.nom)}` },
      h('div', { class: 'logo-tile' }, a.logo ? h('img', { src: asset(a.logo), alt: a.nom, loading: 'lazy' }) : h('b', {}, a.nom)),
      h('div', { class: 'card-body' }, spec(n + 1, a.espece), h('h3', {}, a.nom), h('p', { class: 'meta' }, `${a.pays} · ${a.periode}`)))));

    // Soutiens (section masquée tant qu'il n'y en a pas)
    const zone = $('#soutiens');
    if (zone && soutiens.length) {
      $('#soutiens-liste').replaceChildren(...soutiens.map(soutienLogo));
      zone.hidden = false;
    }
  };

  const soutienLogo = (s) => {
    const u = safeUrl(s.url);
    const inner = [s.logo ? h('img', { src: asset(s.logo), alt: s.nom, loading: 'lazy' }) : h('b', {}, s.nom)];
    return h('div', { class: 'card' }, u ? link(u, { class: 'logo-tile', 'aria-label': s.nom }, ...inner) : h('div', { class: 'logo-tile' }, ...inner));
  };

  // SUIVI EN DIRECT ----------------------------------------------------------
  pages.suivi = async (r) => {
    const [data, carnet] = await Promise.all([getJSON('etapes'), getJSON('carnet')]);
    const etapes = list(data && data.etapes);
    const idx = etapes.findIndex((e) => !e.fait);
    const pos = lastPosition(list(carnet && carnet.jours));
    $('#position').replaceChildren(
      h('small', {}, 'Où sommes-nous aujourd’hui ?'), h('b', {}, pos ? pos.texte : 'Pas encore partis'),
      h('div', { class: 'muted small' }, pos ? `Mis à jour le ${pos.maj}` : `Départ de Grasse ${r.depart_texte}`));

    $('#etapes').replaceChildren(...etapes.map((e, n) => h('li', { class: `step${e.association ? ' is-asso' : ''}${e.fait ? ' is-done' : ''}${n === idx && etapes.some((x) => x.fait) ? ' is-current' : ''}` },
      h('b', {}, e.nom, e.association ? h('span', { class: 'badge-asso' }, 'Association') : null),
      h('span', { class: 'w' }, e.periode),
      h('span', { class: 'd' }, e.detail),
      h('span', { class: 'k' }, e.km && e.km !== '0' ? `${e.km} km` : ''))));

    const ps = $('#polarsteps');
    const embed = r.polarsteps_embed ? safeUrl(r.polarsteps_embed) : '';
    const url = r.polarsteps_url ? safeUrl(r.polarsteps_url) : '';
    if (embed) ps.replaceChildren(h('iframe', { class: 'embed', src: embed, title: 'Notre position en direct (Polarsteps)', loading: 'lazy' }), url ? h('p', { class: 'small' }, link(url, {}, 'Ouvrir dans Polarsteps')) : null);
    else if (url) ps.replaceChildren(h('p', {}, 'Notre trajet, nos étapes et nos photos géolocalisées sont sur Polarsteps.'), link(url, { class: 'btn' }, icon('pin'), 'Suivre en direct sur Polarsteps'));
    else ps.replaceChildren(empty('Le suivi en direct ouvre au départ', `Notre position s’affichera ici dès ${r.depart_texte}.`));
  };

  // ASSOCIATIONS ---------------------------------------------------------
  function interviewCard(iv, withAsso) {
    const video = iv.video ? videoBlock(iv.video) : null;
    return h('article', { class: 'interview', 'data-asso': iv.association || '' },
      iv.photo ? h('img', { class: 'ph', src: asset(iv.photo), alt: iv.personne ? `Portrait de ${iv.personne}` : '', loading: 'lazy', decoding: 'async' }) : null,
      h('div', { class: 'interview-body' },
        h('span', { class: 'tag' }, [withAsso ? iv.association : null, iv.date ? fmtDate(iv.date) : null].filter(Boolean).join(' · ')),
        iv.citation ? h('blockquote', {}, iv.citation) : null,
        h('div', { class: 'who' }, h('b', {}, iv.personne || ''), iv.role ? h('span', {}, ` — ${iv.role}`) : null),
        video,
        iv.texte ? h('details', { class: 'texte' }, h('summary', {}, 'Lire l’interview'), markdown(iv.texte)) : null));
  }

  const scrollToHash = () => { if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); } };

  pages.associations = async () => {
    const [a, i] = await Promise.all([getJSON('associations'), getJSON('interviews')]);
    const assos = list(a && a.associations);
    const ivs = list(i && i.interviews).sort(byDateDesc);
    $('#liste').replaceChildren(...assos.map((x, n) => {
      const mine = ivs.filter((iv) => iv.association === x.nom);
      const site = x.site && safeUrl(x.site);
      const don = x.don_url && safeUrl(x.don_url);
      return h('article', { class: 'asso', id: slug(x.nom) },
        h('div', { class: 'asso-side' },
          x.logo ? h('img', { src: asset(x.logo), alt: x.nom, loading: 'lazy' }) : null,
          h('div', {}, statut(x.statut || 'Contact en cours'), h('p', { class: 'small muted', style: 'margin:10px 0 0' }, x.periode))),
        h('div', { class: 'asso-main' },
          spec(n + 1, x.espece),
          h('h2', {}, x.nom),
          h('p', { class: 'meta' }, [x.pays, x.zone].filter(Boolean).join(' · ')),
          markdown(x.description),
          (site || don) ? h('div', { class: 'links' }, site ? link(site, { class: 'btn btn--ghost' }, 'Site de l’association') : null, don ? link(don, { class: 'btn' }, 'Faire un don directement') : null) : null,
          h('div', { class: 'asso-interviews' },
            h('h3', {}, 'Interviews du terrain'),
            mine.length ? h('div', { class: 'grid grid--2' }, mine.map((iv) => interviewCard(iv, false))) : h('p', { class: 'muted small', style: 'margin:0' }, `Interview à venir — rendez-vous ${x.periode.charAt(0).toLowerCase() + x.periode.slice(1)}.`))));
    }));
    scrollToHash();
  };

  // RENCONTRES (toutes les interviews) -----------------------------------------
  pages.rencontres = async (r) => {
    const i = await getJSON('interviews');
    const ivs = list(i && i.interviews).sort(byDateDesc);
    const zone = $('#liste');
    if (!ivs.length) { zone.replaceChildren(empty('Les premières rencontres arrivent', `Dans chaque association, nous interviewons celles et ceux qui font le travail de terrain. Premières interviews dès ${r.depart_texte}.`)); return; }
    const noms = [...new Set(ivs.map((iv) => iv.association).filter(Boolean))];
    const grid = h('div', { class: 'grid grid--2' }, ivs.map((iv) => interviewCard(iv, true)));
    const chips = ['Toutes', ...noms].map((nom, n) => h('button', { type: 'button', 'aria-pressed': String(n === 0) }, nom));
    chips.forEach((c, n) => c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      $$('.interview', grid).forEach((card) => { card.hidden = n > 0 && card.dataset.asso !== noms[n - 1]; });
    }));
    zone.replaceChildren(noms.length > 1 ? h('div', { class: 'filters', role: 'group', 'aria-label': 'Filtrer par association' }, chips) : null, grid);
  };

  // JOURNAL DE BORD : grille de cartes, puis article complet (même page, adresse #…) -------
  pages.journal = async (r) => {
    const data = await getJSON('carnet');
    const jours = list(data && data.jours).sort(byDateDesc);
    const zone = $('#fil');
    const tete = $('#journal-tete');
    const baseTitle = document.title;

    const article = (e) => {
      const photos = entryPhotos(e);
      const n = e.date ? jourDeRoute(e.date, r.depart) : 0;
      const where = [e.lieu, e.pays].filter(Boolean).join(', ');
      document.title = `${entryTitle(e)} — TRIADE`;
      zone.replaceChildren(h('article', { class: 'story' },
        link('journal.html', { class: 'link-arrow back' }, icon('back'), 'Retour au journal'),
        h('header', { class: 'story-head' },
          h('div', { class: 'jmeta' }, where ? h('span', { class: 'tag' }, icon('pin'), where) : null, n >= 1 ? pill(`Jour ${n}`) : null, readPill(e)),
          h('h1', { class: 'h1 story-title' }, entryTitle(e)),
          h('p', { class: 'muted' }, [e.auteur ? `Par ${e.auteur}` : null, fmtMaj(e.date)].filter(Boolean).join(' · '))),
        photos[0] ? h('figure', { class: 'story-cover' }, h('img', { src: asset(photos[0]), alt: `${entryTitle(e)} — photo 1` })) : null,
        e.texte ? markdown(e.texte) : null,
        photos.length > 1 ? gallery(photos.slice(1), entryTitle(e)) : null,
        e.video ? h('div', { style: 'margin-top:24px;max-width:640px' }, videoBlock(e.video)) : null));
    };

    const grid = () => {
      document.title = baseTitle;
      zone.replaceChildren(jours.length ? h('div', { class: 'grid grid--3' }, jours.map(journalCard))
        : empty('Le journal s’ouvre au départ', `Les premiers récits et les premières photos arriveront ${r.depart_texte}.`));
    };

    const render = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const e = id && jours.find((x) => entryId(x) === id);
      tete.hidden = Boolean(e);
      if (e) { article(e); window.scrollTo(0, 0); } else grid();
    };
    addEventListener('hashchange', () => { render(); reveal(); });
    render();
  };

  // ILS NOUS AIDENT (soutiens, après accord écrit) -----------------------------------
  pages.soutiens = async (r) => {
    const data = await getJSON('soutiens');
    const items = list(data && data.soutiens);
    const zone = $('#liste');
    if (!items.length) {
      zone.replaceChildren(empty('Les premiers soutiens arrivent', 'Cette page présentera celles et ceux qui nous aident, avec leur accord. Vous voulez nous aider ? Écrivez-nous.'));
      return;
    }
    zone.replaceChildren(h('div', { class: 'grid grid--3' }, items.map((s) => h('article', { class: 'card soutien' },
      soutienLogo(s).firstElementChild,
      h('div', { class: 'card-body' }, h('h3', {}, s.nom), s.ville ? h('p', { class: 'meta' }, s.ville) : null,
        s.phrase ? h('p', {}, s.phrase) : null,
        s.histoire ? h('details', { class: 'texte' }, h('summary', {}, 'Leur histoire avec TRIADE'), markdown(s.histoire)) : null)))));
  };

  // PRESSE -------------------------------------------------------------------
  pages.presse = async () => {
    const data = await getJSON('presse');
    const items = list(data && data.articles).sort(byDateDesc);
    $('#revue').replaceChildren(items.length
      ? h('ul', { class: 'revue' }, items.map((a) => { const u = safeUrl(a.url); return h('li', {}, h('span', { class: 'tag' }, [a.media, fmtDate(a.date)].filter(Boolean).join(' · ')), u ? link(u, {}, a.titre) : h('span', {}, a.titre)); }))
      : empty('Pas encore d’articles', 'La revue de presse apparaîtra ici.'));
  };

  // CAGNOTTE -----------------------------------------------------------------
  pages.cagnotte = async () => {
    const [c, a] = await Promise.all([getJSON('cagnotte'), getJSON('associations')]);
    const cag = c || {};
    $('#texte').replaceChildren(markdown(cag.texte));
    const zone = $('#don');
    const widget = cag.widget ? safeUrl(cag.widget) : '';
    const url = cag.url ? safeUrl(cag.url) : '';
    const goal = num(cag.objectif), got = num(cag.collecte);
    const euro = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
    const parts = [];
    if (got >= 0 && goal > 0) {
      parts.push(h('div', {}, h('div', { class: 'pot-amount' }, euro(got)), h('p', { class: 'muted', style: 'margin:6px 0 0' }, `collectés sur un objectif de ${euro(goal)}`),
        h('div', { class: 'meter', role: 'img', 'aria-label': `${Math.round((got / goal) * 100)} % de l’objectif atteint` }, h('i', { style: `width:${Math.min(100, (got / goal) * 100)}%` }))));
    }
    if (widget) parts.push(h('iframe', { class: 'embed', src: widget, title: 'Formulaire de don', loading: 'lazy' }));
    else if (url) parts.push(h('div', {}, link(url, { class: 'btn' }, cag.plateforme ? `Faire un don sur ${cag.plateforme}` : 'Faire un don')));
    else parts.push(empty('La cagnotte ouvre bientôt', 'Suivez-nous sur Instagram pour être prévenu(e) dès son ouverture.'));
    zone.replaceChildren(...parts);

    const direct = list(a && a.associations).filter((x) => x.don_url && safeUrl(x.don_url));
    if (direct.length) {
      $('#direct .wrap').replaceChildren(h('h2', { class: 'h2' }, 'Donner directement à une association'),
        h('div', { class: 'grid grid--3', style: 'margin-top:28px' }, direct.map((x) => link(safeUrl(x.don_url), { class: 'card' },
          h('div', { class: 'logo-tile' }, x.logo ? h('img', { src: asset(x.logo), alt: '' }) : null),
          h('div', { class: 'card-body' }, h('h3', {}, x.nom), h('p', { class: 'meta' }, 'Faire un don directement →'))))));
      $('#direct').hidden = false;
    }
  };

  // L'AVENTURE (projet + équipe + contact) -------------------------------------------
  pages.aventure = async (r) => {
    const data = await getJSON('equipe');
    if (data && data.intro) $('#intro').textContent = data.intro;
    $('#membres').replaceChildren(...list(data && data.membres).map((m) => h('article', { class: 'member' },
      m.photo ? h('img', { src: asset(m.photo), alt: `${m.prenom} ${m.nom}`, loading: 'lazy' }) : null,
      h('h3', {}, `${m.prenom} ${m.nom}`),
      m.role ? h('div', { class: 'role' }, m.role) : null,
      m.bio ? h('p', {}, m.bio) : null)));
    $('#contact').replaceChildren(...socials(r));
  };

  pages.mentions = async () => {};

  // Fond photo changeant du haut de l'accueil : actif dès qu'il y a des photos dans Réglages > « Photos du haut de l'accueil »
  function hero(r) {
    const el = $('#hero');
    const photos = list(r.hero_photos).map(toPath).filter(Boolean);
    if (!el || !photos.length) return;
    const imgs = photos.map((p, i) => h('img', { src: asset(p), alt: '', class: i ? '' : 'on', loading: i ? 'lazy' : 'eager', decoding: 'async' }));
    $('.hero-bg', el).replaceChildren(...imgs);
    el.classList.add('has-photos');
    $('.hero-logo', el).src = 'assets/img/logo-creme.png';
    if (imgs.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setInterval(() => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, 6500);
  }

  /* ---------- Démarrage ----------------------------------------------- */
  async function start() {
    const r = await getJSON('reglages');
    const main = $('#contenu');
    if (!r) {
      $('#site-header').replaceWith(h('header', { class: 'site-header' }, h('div', { class: 'wrap' }, h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'brand-name' }, 'TRIADE')))));
      main.prepend(h('div', { class: 'wrap section' }, h('div', { class: 'error', role: 'alert' },
        h('b', {}, 'Le contenu du site n’a pas pu être chargé. '),
        'Si vous avez ouvert ce fichier directement depuis votre ordinateur, utilisez plutôt l’adresse en ligne du site (les navigateurs bloquent la lecture des fichiers locaux).')));
      return;
    }
    await buildChrome(r);
    bind(r);
    const run = pages[document.body.dataset.page];
    if (run) await run(r);
    reveal();
    document.documentElement.classList.add('ready');
  }
  start();
})();
