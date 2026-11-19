/* Multi-language layer for the Lawson Pediatrics demo.
   The page is written in English; each extra language is one dictionary (English text -> translation).
   Adding a language = add a dictionary below and a button with data-lang="xx" in the nav. */
(function(){
  const SUPPORTED = ['en', 'es'];
  let lang = 'en';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && SUPPORTED.includes(q)) { lang = q; localStorage.setItem('lang', q); }
    else lang = localStorage.getItem('lang') || 'en';
  } catch(_) {}
  if (!SUPPORTED.includes(lang)) lang = 'en';
  window.LANG = lang;

  const DICT = { es: window.I18N_ES || {} };
  const norm = s => s.replace(/\s+/g, ' ').trim();
  window.T = s => (DICT[lang] && DICT[lang][norm(s)]) || s;

  function translate(root){
    const d = DICT[lang]; if (!d) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n =>
      n.parentElement && !/^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) && norm(n.nodeValue) ? 1 : 2 });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      const k = norm(n.nodeValue), v = d[k];
      if (v) { const lead = n.nodeValue.match(/^\s*/)[0], tail = n.nodeValue.match(/\s*$/)[0]; n.nodeValue = lead + v + tail; }
    });
    root.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(el => {
      ['placeholder','aria-label','alt','title'].forEach(a => { const v = el.getAttribute(a); if (v && d[norm(v)]) el.setAttribute(a, d[norm(v)]); });
    });
  }

  document.documentElement.lang = lang;
  if (lang !== 'en') {
    document.title = T(document.title);
    const md = document.querySelector('meta[name=description]'); if (md) md.content = T(md.content);
    translate(document.body);
  }
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
    b.addEventListener('click', () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem('lang', b.dataset.lang); } catch(_) {}
      const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang); location.href = u.toString();
    });
  });
})();
