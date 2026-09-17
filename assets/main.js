(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var WA = '6581391311';
  var FORMSPREE = 'https://formspree.io/f/xbdabjpg';
  var TITLES = {
    en: 'Sworn French Translator in Singapore — Embassy-listed · Fr·En·Ch',
    fr: 'Traducteur assermenté à Singapour — Ambassades de France et de Suisse · Fr·En·Ch',
    zh: '新加坡宣誓翻译员 — 法国及瑞士大使馆认证 · Fr·En·Ch'
  };
  root.classList.remove('no-js');

  /* ───────── i18n ───────── */
  var lang = 'en';
  function t(key) { var L = window.I18N || {}; return (L[lang] && L[lang][key]) || (L.en && L.en[key]) || ''; }
  function setLang(next, persist) {
    if (!window.I18N || !window.I18N[next]) next = 'en';
    lang = next;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
    d.title = TITLES[lang] || TITLES.en;
    d.querySelectorAll('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v) el.textContent = v; });
    d.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-html')); if (v) el.innerHTML = v; });
    d.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { var v = t(el.getAttribute('data-i18n-placeholder')); if (v) el.placeholder = v; });
    d.querySelectorAll('[data-lang-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === lang)); });
    if (persist) { try { localStorage.setItem('lang', lang); } catch (e) {} }
  }
  d.querySelectorAll('[data-lang-btn]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-btn'), true); }); });
  (function initLang() {
    var saved = null; try { saved = localStorage.getItem('lang'); } catch (e) {}
    var q = new URLSearchParams(location.search).get('lang');
    var nav = (navigator.language || 'en').toLowerCase();
    var guess = nav.indexOf('fr') === 0 ? 'fr' : nav.indexOf('zh') === 0 ? 'zh' : 'en';
    setLang(q || saved || guess, false);
  })();

  /* ───────── theme ───────── */
  var themeBtn = d.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
  });

  /* ───────── nav ───────── */
  var nav = d.getElementById('nav'), burger = d.getElementById('burger'), menu = d.getElementById('mobileMenu'), fab = d.querySelector('.fab');
  function onScroll() {
    var y = window.scrollY || d.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 8);
    if (fab) fab.classList.toggle('is-visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.hidden; menu.hidden = open; burger.setAttribute('aria-expanded', String(!open));
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }); });
  }

  /* active section highlighting */
  var links = Array.prototype.slice.call(d.querySelectorAll('.nav__links a'));
  var sections = links.map(function (a) { return d.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ───────── reveal on scroll ───────── */
  var reveals = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = Math.min((i % 6) * 40, 200) + 'ms'; io.observe(el); });
  } else { root.classList.add('no-io'); }

  /* ───────── marquee width ───────── */
  var mq = d.querySelector('.marquee-list');
  if (mq) {
    var items = Array.prototype.slice.call(mq.children);
    items.forEach(function (li) { mq.appendChild(li.cloneNode(true)); });
    function sizeMarquee() {
      var w = 0; items.forEach(function (li) { w += li.getBoundingClientRect().width + 32; });
      mq.style.setProperty('--marquee-w', w + 'px');
    }
    sizeMarquee(); window.addEventListener('resize', sizeMarquee);
    d.fonts && d.fonts.ready && d.fonts.ready.then(sizeMarquee);
  }

  /* ───────── FAQ: close others (accordion) ───────── */
  d.querySelectorAll('.faq__item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) d.querySelectorAll('.faq__item[open]').forEach(function (o) { if (o !== item) o.open = false; });
    });
  });

  /* ───────── quote form ───────── */
  var form = d.getElementById('quoteForm'), success = d.getElementById('formSuccess'), err = d.getElementById('formError');
  var dz = d.getElementById('dropzone'), fileInput = d.getElementById('fFile'), dzText = d.getElementById('dzText');
  function setFile(file) {
    if (!file) return;
    dz.classList.add('has-file'); dzText.textContent = file.name; dzText.removeAttribute('data-i18n');
  }
  if (dz && fileInput) {
    fileInput.addEventListener('change', function () { setFile(fileInput.files[0]); });
    ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('is-over'); }); });
    dz.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files[0]) { try { fileInput.files = e.dataTransfer.files; } catch (x) {} setFile(e.dataTransfer.files[0]); } });
  }
  function checked(id) { return Array.prototype.slice.call(d.querySelectorAll('#' + id + ' input:checked')).map(function (i) { return i.value; }).join(', '); }
  function waMessage(v) {
    var m = t('wa.hello') + ' ' + v.name + '.\n';
    if (v.email) m += 'Email: ' + v.email + '\n';
    if (v.phone) m += 'Tel: ' + v.phone + '\n';
    if (v.document) m += 'Document: ' + v.document + '\n';
    if (v.language_direction) m += 'Language: ' + v.language_direction + '\n';
    if (v.for) m += 'For: ' + v.for + '\n';
    if (v.urgency) m += 'Urgency: ' + v.urgency + '\n';
    if (v.notes) m += 'Notes: ' + v.notes;
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(m);
  }
  function showError(msg, field) { err.textContent = msg; err.hidden = false; if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); } }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true; form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    var v = {
      name: d.getElementById('fName').value.trim(), email: d.getElementById('fEmail').value.trim(), phone: d.getElementById('fTel').value.trim(),
      language_direction: d.getElementById('fLang').value, document: checked('fDoc'), for: checked('fFor'), urgency: checked('fUrg'), notes: d.getElementById('fNotes').value.trim()
    };
    if (!v.name) return showError(t('f.err.name'), d.getElementById('fName'));
    if (!v.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return showError(t('f.err.email'), d.getElementById('fEmail'));

    var btn = d.getElementById('submitBtn'); btn.setAttribute('aria-busy', 'true');
    var fd = new FormData();
    Object.keys(v).forEach(function (k) { if (v[k]) fd.append(k, v[k]); });
    fd.append('_subject', 'Quote request — ' + v.name);
    fd.append('site_language', lang);
    if (fileInput && fileInput.files[0]) fd.append('upload', fileInput.files[0]);
    var waUrl = waMessage(v);
    var successLink = d.getElementById('successWA'); if (successLink) successLink.href = waUrl;

    function done() {
      btn.removeAttribute('aria-busy');
      form.hidden = true; success.hidden = false; success.classList.add('is-in');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.open(waUrl, '_blank', 'noopener');
    }
    fetch(FORMSPREE, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
      .then(function (res) {
        if (res.ok) return done();
        return res.json().then(function (j) { throw new Error(j && j.errors ? j.errors.map(function (x) { return x.message; }).join(', ') : 'error'); }, function () { throw new Error('error'); });
      })
      .catch(function () { btn.removeAttribute('aria-busy'); showError(t('f.err.send')); window.open(waUrl, '_blank', 'noopener'); });
  });

  /* ───────── misc ───────── */
  var y = d.getElementById('year'); if (y) y.textContent = String(new Date().getFullYear());
})();

/* ═══════════════════════════════════════════
   Delight layer
═══════════════════════════════════════════ */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;

  /* scroll progress + sticky mobile CTA */
  var bar = d.getElementById('progress'), sticky = d.getElementById('stickyCta'), contact = d.getElementById('contact');
  function onScroll() {
    var h = root.scrollHeight - innerHeight, y = scrollY;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (sticky) {
      var nearForm = contact && contact.getBoundingClientRect().top < innerHeight * .6;
      sticky.classList.toggle('is-on', y > 600 && !nearForm);
    }
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* hero words rise in (re-split on language change) */
  var title = d.querySelector('.hero__title');
  function splitTitle() {
    if (!title || reduce) return;
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(part)); return; }
            var w = d.createElement('span'); w.className = 'w'; var inner = d.createElement('span'); inner.style.setProperty('--i', i++); inner.textContent = part; w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    }
    // Chinese has no spaces: split per character
    if (root.getAttribute('data-lang') === 'zh') {
      Array.prototype.slice.call(title.childNodes).forEach(function (n) {
        function chars(node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (c) {
            if (c.nodeType === 3) { var frag = d.createDocumentFragment(); c.textContent.split('').forEach(function (ch) { var w = d.createElement('span'); w.className = 'w'; var s = d.createElement('span'); s.style.setProperty('--i', i++); s.textContent = ch; w.appendChild(s); frag.appendChild(w); }); node.replaceChild(frag, c); }
            else if (c.nodeType === 1 && c.tagName !== 'BR') chars(c);
          });
        }
        if (n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'BR')) chars(n.nodeType === 3 ? title : n);
      });
      return;
    }
    walk(title);
  }
  splitTitle();
  d.querySelectorAll('[data-lang-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.classList.remove('lang-fade'); void root.offsetWidth; root.classList.add('lang-fade');
      setTimeout(function () { root.classList.remove('lang-fade'); }, 400);
      requestAnimationFrame(splitTitle);
    });
  });

  /* dark mode circular wipe from the toggle */
  var tbtn = d.getElementById('themeToggle');
  if (tbtn && d.startViewTransition && !reduce) {
    tbtn.addEventListener('click', function (e) {
      var r = tbtn.getBoundingClientRect();
      root.style.setProperty('--tx', (r.left + r.width / 2) + 'px'); root.style.setProperty('--ty', (r.top + r.height / 2) + 'px');
    }, true);
    // wrap the existing handler in a view transition
    var orig = tbtn.onclick; // (none) — re-dispatch through startViewTransition
    tbtn.addEventListener('click', function (e) {
      if (e.__vt) return;
      e.stopImmediatePropagation(); e.preventDefault();
      d.startViewTransition(function () { var ev = new MouseEvent('click', { bubbles: true }); ev.__vt = true; tbtn.dispatchEvent(ev); });
    }, { capture: true });
  }

  /* count-up stats */
  var nums = d.querySelectorAll('.stats strong');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var final = e.target.textContent.trim(); if (!/^\d+$/.test(final)) return;
        var target = +final, start = performance.now(), dur = 1200, from = target > 100 ? target - 60 : 0;
        e.target.classList.add('is-counting');
        (function tick(t) { var p = Math.min((t - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3); e.target.textContent = Math.round(from + (target - from) * ease); if (p < 1) requestAnimationFrame(tick); else e.target.classList.remove('is-counting'); })(start);
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* cursor spotlight on cards */
  if (fine) d.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* magnetic primary buttons */
  if (fine && !reduce) d.querySelectorAll('.hero__cta .btn, #submitBtn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); var x = (e.clientX - r.left - r.width / 2) * .18, y = (e.clientY - r.top - r.height / 2) * .3; b.style.transform = 'translate(' + x + 'px,' + y + 'px)'; });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  /* click a service card or tier -> prefill the form */
  function goToForm(afterScroll) {
    var f = d.getElementById('contact'); f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(afterScroll, reduce ? 0 : 600);
  }
  function flash(input) { var s = input.nextElementSibling; s.classList.remove('is-flash'); void s.offsetWidth; s.classList.add('is-flash'); }
  d.querySelectorAll('[data-prefill-doc]').forEach(function (c) {
    function act() {
      c.classList.remove('is-picked'); void c.offsetWidth; c.classList.add('is-picked');
      var v = c.getAttribute('data-prefill-doc');
      goToForm(function () { var i = d.querySelector('#fDoc input[value="' + v + '"]'); if (i) { i.checked = true; flash(i); } var n = d.getElementById('fName'); n && n.focus({ preventScroll: true }); });
    }
    c.addEventListener('click', act);
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  d.querySelectorAll('[data-prefill-urg]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-prefill-urg');
      goToForm(function () { var i = d.querySelector('#fUrg input[value="' + v + '"]'); if (i) { i.checked = true; flash(i); } });
    });
  });

  /* FAQ height animation */
  d.querySelectorAll('.faq__item').forEach(function (item) {
    var sum = item.querySelector('summary'), body = item.querySelector('.faq__a');
    if (!sum || !body || reduce || !body.animate) return;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.open) {
        var h = body.offsetHeight;
        body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'ease-out' }).onfinish = function () { item.open = false; };
      } else {
        item.open = true; var h2 = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  });

  /* WhatsApp bubble says hello once */
  var fab = d.querySelector('.fab'), tip = d.getElementById('fabTip');
  var greeted = false; try { greeted = sessionStorage.getItem('greeted') === '1'; } catch (e) {}
  if (fab && tip && !greeted) setTimeout(function () {
    if (!fab.classList.contains('is-visible')) return;
    var L = window.I18N || {}, lang = root.getAttribute('data-lang') || 'en';
    tip.textContent = (L[lang] && L[lang]['fab.tip']) || tip.textContent;
    fab.classList.add('wiggle'); tip.classList.add('is-on');
    try { sessionStorage.setItem('greeted', '1'); } catch (e) {}
    setTimeout(function () { tip.classList.remove('is-on'); fab.classList.remove('wiggle'); }, 5000);
  }, 9000);

  /* stamp on success */
  var success = d.getElementById('formSuccess');
  if (success) new MutationObserver(function () {
    if (success.hidden) return;
    var st = success.querySelector('.stamp'); var L = window.I18N || {}, lang = root.getAttribute('data-lang') || 'en';
    var sub = st && st.querySelector('small'); if (sub && L[lang] && L[lang]['stamp.sub']) sub.textContent = L[lang]['stamp.sub'];
    if (st) { st.classList.add('is-on'); success.classList.add('shake'); }
  }).observe(success, { attributes: true, attributeFilter: ['hidden'] });
})();
