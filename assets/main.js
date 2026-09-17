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
