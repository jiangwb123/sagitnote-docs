// ============================================================
// Single source of truth for the direct-install zip filename —
// after each release, change only the ZIP value below!
// ============================================================
// Consumers (all follow automatically):
//   - Landing page install modal (i18n.js ensureInstallModal)
//   - Docs download links (<a data-install-zip> in docs pages)
// The path is computed page-relative, so it works both at the
// site root and under /docs/<lang>/ subdirectories.
(function () {
  var ZIP = 'downloads/sagitnote-1.1.3-web.zip';
  var prefix = /\/docs\/(en|zh)\//.test(location.pathname) ? '../../' : '';
  window.SAGITNOTE_INSTALL_ZIP = prefix + ZIP;

  function apply() {
    var anchors = document.querySelectorAll('a[data-install-zip]');
    for (var i = 0; i < anchors.length; i++) {
      if (window.SAGITNOTE_INSTALL_ZIP) anchors[i].setAttribute('href', window.SAGITNOTE_INSTALL_ZIP);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
