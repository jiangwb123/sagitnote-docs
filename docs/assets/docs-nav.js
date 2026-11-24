/* ============================================================
   Sagitnote Docs — navigation data (single source of truth)
   ------------------------------------------------------------
   Every docs page declares  <body data-doc-id="..." data-doc-lang="en|zh">
   and docs.js renders the sidebar from this array.

   draft: true   → page not written yet; rendered muted & non-clickable
                  with a "coming soon" badge. draft: false = published.
   hrefs are plain file names inside /docs/<lang>/; docs.js builds
   the cross-language path (../<lang>/<file>).
   ============================================================ */

var WPZL_DOCS_NAV = [
  {
    group: { en: 'Getting Started', zh: '快速上手' },
    items: [
      {
        id: 'index',
        title: { en: 'Welcome & Quick Start', zh: '欢迎与快速上手' },
        href: { en: 'index.html', zh: 'index.html' },
        draft: false
      },
      {
        id: 'annotation-tools',
        title: { en: 'Annotation Tools', zh: '网页标注工具' },
        href: { en: 'annotation-tools.html', zh: 'annotation-tools.html' },
        draft: false
      },
      {
        id: 'manager-page',
        title: { en: 'Annotation Manager', zh: '标注管理器' },
        href: { en: 'manager-page.html', zh: 'manager-page.html' },
        draft: false
      }
    ]
  },
  {
    group: { en: 'Going Deeper', zh: '标注进阶' },
    items: [
      { id: 'text-highlights', title: { en: 'Text Highlights', zh: '文本高亮' }, href: { en: 'text-highlights.html', zh: 'text-highlights.html' }, draft: false },
      { id: 'screenshots-and-image-rects', title: { en: 'Screenshots & Image Rectangles', zh: '截图与图片矩形' }, href: { en: 'screenshots-and-image-rects.html', zh: 'screenshots-and-image-rects.html' }, draft: false },
      { id: 'element-marks-and-frames', title: { en: 'Element Marks & Embedded Frames', zh: '元素标记与内嵌区域' }, href: { en: 'element-marks-and-frames.html', zh: 'element-marks-and-frames.html' }, draft: false },
      { id: 'keyboard-shortcuts', title: { en: 'Keyboard Shortcuts', zh: '快捷键' }, href: { en: 'keyboard-shortcuts.html', zh: 'keyboard-shortcuts.html' }, draft: false }
    ]
  },
  {
    group: { en: 'Organizing & Backup', zh: '整理与备份' },
    items: [
      { id: 'folders-and-favorites', title: { en: 'Folders & Favorites', zh: '文件夹与收藏' }, href: { en: 'folders-and-favorites.html', zh: 'folders-and-favorites.html' }, draft: false },
      { id: 'backup-import-export', title: { en: 'Backup, Import & Export', zh: '备份、导入与导出' }, href: { en: 'backup-import-export.html', zh: 'backup-import-export.html' }, draft: false }
    ]
  },
  {
    group: { en: 'Sync & Sharing', zh: '同步与分享' },
    items: [
      { id: 'cloud-sync', title: { en: 'Cloud Sync', zh: '云同步' }, href: { en: 'cloud-sync.html', zh: 'cloud-sync.html' }, draft: false },
      { id: 'sharing-links', title: { en: 'Sharing Links', zh: '分享链接' }, href: { en: 'sharing-links.html', zh: 'sharing-links.html' }, draft: false },
      { id: 'plans-and-limits', title: { en: 'Plans & Limits', zh: '版本与限额' }, href: { en: 'plans-and-limits.html', zh: 'plans-and-limits.html' }, draft: false }
    ]
  },
  {
    group: { en: 'Documents & PDF', zh: '文档与 PDF' },
    items: [
      { id: 'own-documents', title: { en: 'Your Own Documents', zh: '自建文档' }, href: { en: 'own-documents.html', zh: 'own-documents.html' }, draft: false },
      { id: 'annotating-pdfs', title: { en: 'Annotating PDFs', zh: 'PDF 批注' }, href: { en: 'annotating-pdfs.html', zh: 'annotating-pdfs.html' }, draft: false },
      { id: 'snapshots', title: { en: 'Page Snapshots', zh: '页面快照' }, href: { en: 'snapshots.html', zh: 'snapshots.html' }, draft: false }
    ]
  },
  {
    group: { en: 'Help', zh: '帮助' },
    items: [
      { id: 'troubleshooting', title: { en: 'Troubleshooting', zh: '问题排查' }, href: { en: 'troubleshooting.html', zh: 'troubleshooting.html' }, draft: false },
      { id: 'faq', title: { en: 'FAQ', zh: '常见问题' }, href: { en: 'faq.html', zh: 'faq.html' }, draft: false },
      { id: 'contact-support', title: { en: 'Contact Support', zh: '联系支持' }, href: { en: 'contact-support.html', zh: 'contact-support.html' }, draft: false }
    ]
  }
];
