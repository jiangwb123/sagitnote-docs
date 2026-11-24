/* ============================================================
   Sagitnote Landing Page — i18n Engine
   Language detection, text replacement, language switcher
   ============================================================ */

(function () {
  'use strict';

  // --- Supported languages (option labels shown in their own language) ---
  var LANGUAGES = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' }
  ];
  var LANG_CODES = LANGUAGES.map(function (l) { return l.code; });
  var LANG_TAGS = { zh: 'zh-CN', en: 'en', de: 'de', fr: 'fr', es: 'es', pt: 'pt' };

  // --- Detect language ---
  // Priority: 1) stored preference 2) browser language (zh* → zh, de* → de, fr* → fr, es* → es, pt* → pt, else en)
  function detectLang() {
    try {
      var stored = localStorage.getItem('wpzl_website_lang');
      if (LANG_CODES.indexOf(stored) !== -1) return stored;
    } catch (e) {}

    var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.indexOf('zh') === 0) return 'zh';
    if (navLang.indexOf('de') === 0) return 'de';
    if (navLang.indexOf('fr') === 0) return 'fr';
    if (navLang.indexOf('es') === 0) return 'es';
    if (navLang.indexOf('pt') === 0) return 'pt';
    return 'en';
  }

  var currentLang = detectLang();

  // --- Apply translations ---
  function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = LANG_TAGS[lang] || 'en';

    // Update all elements with data-i18n attribute
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      var mode = el.getAttribute('data-i18n-mode'); // 'html' or omit for text
      var translation = wpzl_lang[key] && wpzl_lang[key][lang];

      if (translation !== undefined) {
        if (mode === 'html') {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    }

    // Translate <title> and meta description (SEO：英文模式下不再残留中文标题)
    var metaTitle = wpzl_lang['meta.title'] && wpzl_lang['meta.title'][lang];
    if (metaTitle !== undefined) document.title = metaTitle;
    var metaDescEl = document.querySelector('meta[name="description"]');
    var metaDescText = wpzl_lang['meta.desc'] && wpzl_lang['meta.desc'][lang];
    if (metaDescEl && metaDescText !== undefined) metaDescEl.setAttribute('content', metaDescText);

    // Sync language dropdowns (nav + footer); options always show their own language
    var langSelects = document.querySelectorAll('select[data-lang-select]');
    for (var j = 0; j < langSelects.length; j++) {
      langSelects[j].value = lang;
    }

    // Point legal links (Privacy Policy / Terms of Service) at the page for the current language.
    // Legal pages exist in zh and en only — de/fr fall back to the English version.
    var legalLinks = document.querySelectorAll('[data-legal-link]');
    for (var k = 0; k < legalLinks.length; k++) {
      var base = legalLinks[k].getAttribute('data-legal-link');
      legalLinks[k].setAttribute('href', ((lang === 'zh') ? base + '-zh' : base) + '.html');
    }

    // Point docs links at the help documentation for the current language.
    // Docs site exists in zh and en only — de/fr fall back to /docs/en/.
    var docsLinks = document.querySelectorAll('[data-docs-link]');
    for (var d = 0; d < docsLinks.length; d++) {
      docsLinks[d].setAttribute('href', '/docs/' + ((lang === 'zh') ? 'zh' : 'en') + '/');
    }

    // Persist preference
    try {
      localStorage.setItem('wpzl_website_lang', lang);
    } catch (e) {}
  }

  // --- Switch language (from dropdown) ---
  function setLang(lang) {
    if (LANG_CODES.indexOf(lang) === -1) return;
    applyTranslations(lang);
  }

  // Cycle through languages (kept for debugging / keyboard use)
  function toggleLang(e) {
    if (e) e.preventDefault();
    var idx = LANG_CODES.indexOf(currentLang);
    applyTranslations(LANG_CODES[(idx + 1) % LANG_CODES.length]);
  }

  // --- Install dialog（商店一键安装优先；官网直装包为备用：下载 zip → 开发者模式加载指引） ---
  // 文件名单一来源：install-zip.js 的 window.SAGITNOTE_INSTALL_ZIP（发版只改那一个文件），
  // 本文件与帮助文档页均自动跟随，不要在这里写死文件名。
  var INSTALL_ZIP = window.SAGITNOTE_INSTALL_ZIP || '#';
  // 官方插件商店链接（商店 ID 若变化需同步更新）
  var STORE_URL_CHROME = 'https://chromewebstore.google.com/detail/sagitnote/llajphjgjgmplakjdjoaghojmgogghic';
  var STORE_URL_EDGE = 'https://microsoftedge.microsoft.com/addons/detail/nkepoeakeihkniefgjeofdfhmfmdaedd';

  function ensureInstallModal() {
    var root = document.getElementById('install-modal');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'install-modal';
    root.className = 'install-modal';
    root.innerHTML = '' +
      '<div class="install-modal-overlay" data-install-close></div>' +
      '<div class="install-modal-card" role="dialog" aria-modal="true">' +
      '  <button type="button" class="install-modal-close" data-install-close aria-label="Close">&times;</button>' +
      '  <h3 class="install-modal-title" data-i18n="dialog.title"></h3>' +
      '  <p class="install-modal-intro" data-i18n="dialog.intro"></p>' +
      '  <p class="install-modal-store-lead" data-i18n="dialog.store.lead"></p>' +
      '  <div class="install-modal-store-btns">' +
      '    <a class="btn btn-primary" id="install-modal-store-chrome" target="_blank" rel="noopener">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="12" r="3.6"/><path d="M12 2.8v5.6"/><path d="M20.9 16.2l-4.9-2.8"/><path d="M3.1 16.2l4.9-2.8"/></svg>' +
      '      <span data-i18n="dialog.store.chrome"></span>' +
      '    </a>' +
      '    <a class="btn btn-outline" id="install-modal-store-edge" target="_blank" rel="noopener">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4"/><path d="M12 2.8c2.6 2.4 4 5.7 4 9.2s-1.4 6.8-4 9.2c-2.6-2.4-4-5.7-4-9.2s1.4-6.8 4-9.2z"/></svg>' +
      '      <span data-i18n="dialog.store.edge"></span>' +
      '    </a>' +
      '  </div>' +
      '  <div class="install-modal-divider" data-i18n="dialog.zip.lead"></div>' +
      '  <ol class="install-modal-steps">' +
      '    <li data-i18n="dialog.step1"></li>' +
      '    <li data-i18n="dialog.step2" data-i18n-mode="html"></li>' +
      '    <li data-i18n="dialog.step3"></li>' +
      '    <li data-i18n="dialog.step4"></li>' +
      '  </ol>' +
      '  <a class="btn btn-outline install-modal-download" data-install-zip download>' +
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      '    <span data-i18n="dialog.download"></span>' +
      '  </a>' +
      '  <p class="install-modal-note" data-i18n="dialog.note"></p>' +
      '</div>';
    root.querySelector('.install-modal-download').setAttribute('href', INSTALL_ZIP);
    root.querySelector('#install-modal-store-chrome').setAttribute('href', STORE_URL_CHROME);
    root.querySelector('#install-modal-store-edge').setAttribute('href', STORE_URL_EDGE);
    root.addEventListener('click', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-install-close')) hideInstallModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('open')) hideInstallModal();
    });
    document.body.appendChild(root);
    return root;
  }

  function showInstallModal() {
    var root = ensureInstallModal();
    root.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function hideInstallModal() {
    var root = document.getElementById('install-modal');
    if (root) root.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 兼容旧调用名
  function showInstallDialog() { showInstallModal(); }

  // --- Initialize on DOM ready ---
  function init() {
    // 先注入安装弹窗（内部文本带 data-i18n，交给下方 applyTranslations 统一填充/随语言切换刷新）
    ensureInstallModal();

    applyTranslations(currentLang);

    // Bind language dropdowns (nav + footer)
    var langSelects = document.querySelectorAll('select[data-lang-select]');
    for (var i = 0; i < langSelects.length; i++) {
      langSelects[i].value = currentLang;
      langSelects[i].addEventListener('change', function (e) {
        setLang(e.target.value);
      });
    }

    // Bind install buttons（商店按钮 #btn-chrome/#btn-edge 在 HTML 中直连商店链接，不在此绑定）
    var installButtons = document.querySelectorAll('#btn-install, #btn-install-bottom, .btn-install');
    for (var j = 0; j < installButtons.length; j++) {
      installButtons[j].addEventListener('click', function (e) {
        e.preventDefault();
        showInstallDialog();
      });
    }

    // Scroll-triggered reveal animations
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.advanced-card').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.step').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.pricing-card').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.usecase-card').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.trust-item').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.faq-item').forEach(function (el) { observer.observe(el); });

    var privacyContent = document.querySelector('.privacy-content');
    var privacyVisual = document.querySelector('.privacy-visual');
    if (privacyContent) observer.observe(privacyContent);
    if (privacyVisual) observer.observe(privacyVisual);
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.wpzl_i18n_setLang = setLang;
  window.wpzl_i18n_toggleLang = toggleLang;
  window.wpzl_i18n_getLang = function () { return currentLang; };

})();
