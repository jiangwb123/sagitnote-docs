/* ============================================================
   Sagitnote Docs — page behaviour
   Sidebar rendering, active state, right-hand "On this page"
   TOC with scroll spy, mobile drawer, language switch.
   Vanilla JS, no dependencies.
   ============================================================ */

(function () {
  'use strict';

  var body = document.body;
  var docId = body.getAttribute('data-doc-id') || 'index';
  var docLang = body.getAttribute('data-doc-lang') || 'en';
  var otherLang = (docLang === 'zh') ? 'en' : 'zh';

  /* ---------- Helpers ---------- */

  function findEntry(id) {
    for (var g = 0; g < WPZL_DOCS_NAV.length; g++) {
      var items = WPZL_DOCS_NAV[g].items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) return items[i];
      }
    }
    return null;
  }

  // Path of a doc entry as seen from the current page
  // (pages live in /docs/<lang>/, so siblings need no prefix and
  //  the other language needs ../<lang>/).
  function entryPath(entry, lang) {
    var file = entry.href[lang] || entry.href.en;
    return (lang === docLang) ? file : ('../' + lang + '/' + file);
  }

  /* ---------- Sidebar ---------- */

  function renderSidebar() {
    var host = document.getElementById('docsSidebarNav');
    if (!host) return;

    var html = '';
    for (var g = 0; g < WPZL_DOCS_NAV.length; g++) {
      var group = WPZL_DOCS_NAV[g].group;
      var items = WPZL_DOCS_NAV[g].items;
      html += '<div class="docs-nav-group">';
      html += '<div class="docs-nav-group-title">' + esc(group[docLang] || group.en) + '</div>';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var title = esc(item.title[docLang] || item.title.en);
        if (item.draft) {
          html += '<span class="docs-nav-link is-draft"><span>' + title +
                  '</span><span class="docs-nav-soon">' + SOON_LABEL[docLang] + '</span></span>';
        } else {
          var isActive = (item.id === docId) ? ' is-active' : '';
          html += '<a class="docs-nav-link' + isActive + '" href="' + entryPath(item, docLang) + '">' + title + '</a>';
        }
      }
      html += '</div>';
    }
    host.innerHTML = html;
  }

  var SOON_LABEL = { en: 'Coming soon', zh: '整理中' };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Language switch (same page, other language) ---------- */

  function wireLangSwitch() {
    var link = document.getElementById('docsLangSwitch');
    if (!link) return;
    var entry = findEntry(docId);
    var fallback = findEntry('index');
    var target = (entry && !entry.draft && entry.href[otherLang]) ? entry : fallback;
    link.setAttribute('href', entryPath(target, otherLang));
    link.textContent = (docLang === 'zh') ? 'English' : 'zh';
    link.addEventListener('click', function () {
      // Remember the choice so the marketing site and the /docs/
      // redirector follow the user's explicit preference.
      try { localStorage.setItem('wpzl_website_lang', otherLang); } catch (e) {}
    });
  }

  /* ---------- Right "On this page" TOC + scroll spy ---------- */

  function renderToc() {
    var toc = document.getElementById('docsToc');
    if (!toc) return;
    var headings = document.querySelectorAll('.docs-main .docs-h2, .docs-main .docs-h3');
    if (!headings.length) { toc.style.display = 'none'; return; }

    var list = document.getElementById('docsTocList');
    var html = '';
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (!h.id) continue;
      var isH3 = h.tagName === 'H3';
      html += '<a class="docs-toc-link' + (isH3 ? ' docs-toc-link--h3' : '') +
              '" data-toc-target="' + h.id + '" href="#' + h.id + '">' + esc(h.textContent) + '</a>';
    }
    list.innerHTML = html;

    var links = list.querySelectorAll('.docs-toc-link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var current = null;
    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) { current = entries[k].target.id; break; }
      }
      for (var m = 0; m < links.length; m++) {
        var on = links[m].getAttribute('data-toc-target') === current;
        links[m].classList.toggle('is-current', on);
      }
    }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });

    for (var n = 0; n < headings.length; n++) {
      if (headings[n].id) observer.observe(headings[n]);
    }
  }

  /* ---------- Mobile drawer ---------- */

  function wireDrawer() {
    var sidebar = document.getElementById('docsSidebar');
    var btn = document.getElementById('docsMenuBtn');
    var shade = document.getElementById('docsShade');
    if (!sidebar || !btn || !shade) return;

    function close() {
      sidebar.classList.remove('is-open');
      shade.classList.remove('is-visible');
    }
    btn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      shade.classList.toggle('is-visible', open);
    });
    shade.addEventListener('click', close);
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Init ---------- */

  function init() {
    renderSidebar();
    wireLangSwitch();
    renderToc();
    wireDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
