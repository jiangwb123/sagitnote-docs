#!/usr/bin/env node
/* ============================================================
   Sagitnote 官网 sitemap 生成器
   ------------------------------------------------------------
   用法：在 website/ 目录执行  node gen-sitemap.mjs
   产物：website/sitemap.xml（随官网部署到站点根目录）

   数据源（单一来源，勿在此硬编码清单）：
   - docs/assets/docs-nav.js  → 帮助文档导航（draft: true 的条目自动跳过）
   - 本目录下的静态页 → 首页 / 法务页

   何时重跑：新增/改名/删除 docs 页面、法务页，或改域名。
   URL 规范与页面内 <link rel="canonical"> 保持一致：
   - docs 语言首页用目录形式 /docs/en/、/docs/zh/（无 .html）
   - 其余 docs 页用 /docs/<lang>/<id>.html
   ============================================================ */

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://jiangwb123.github.io/sagitnote-docs';

// --- 从 docs-nav.js 读导航（普通 var 赋值脚本，用 vm 沙箱取值） ---
const navSrc = readFileSync(path.join(ROOT, 'docs', 'assets', 'docs-nav.js'), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(navSrc, sandbox);
const NAV = sandbox.WPZL_DOCS_NAV;
if (!Array.isArray(NAV)) throw new Error('docs-nav.js 未导出 WPZL_DOCS_NAV');

// --- 工具 ---
const lastmod = (rel) => statSync(path.join(ROOT, rel)).mtime.toISOString().slice(0, 10);
const entry = (loc, rel, alternates = []) => {
  const links = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hl}" href="${a.href}"/>`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod(rel)}</lastmod>`,
    ...(links ? [links] : []),
    '  </url>'
  ].join('\n');
};

const entries = [];

// --- 首页（单 URL 多语言，无 alternate 可标） ---
entries.push(entry(`${BASE}/`, 'index.html'));

// --- 帮助文档：en/zh 互为 alternate，x-default 指向 /docs/ 语言选择器（与页面内 hreflang 声明一致） ---
const DOC_IDS = NAV.flatMap((g) => g.items).filter((it) => !it.draft);
for (const item of DOC_IDS) {
  const enRel = item.id === 'index' ? 'docs/en/index.html' : `docs/en/${item.id}.html`;
  const zhRel = item.id === 'index' ? 'docs/zh/index.html' : `docs/zh/${item.id}.html`;
  const enUrl = item.id === 'index' ? `${BASE}/docs/en/` : `${BASE}/docs/en/${item.id}.html`;
  const zhUrl = item.id === 'index' ? `${BASE}/docs/zh/` : `${BASE}/docs/zh/${item.id}.html`;
  const alternates = [
    { hl: 'en', href: enUrl },
    { hl: 'zh', href: zhUrl },
    { hl: 'x-default', href: `${BASE}/docs/` }
  ];
  entries.push(entry(enUrl, enRel, alternates));
  entries.push(entry(zhUrl, zhRel, alternates));
}

// --- 法务页：en/zh 成对互指，x-default 指向英文版（与页面内 hreflang 声明一致） ---
const LEGAL_PAIRS = [
  ['privacy-policy.html', 'privacy-policy-zh.html'],
  ['terms-of-service.html', 'terms-of-service-zh.html']
];
for (const [enFile, zhFile] of LEGAL_PAIRS) {
  const enUrl = `${BASE}/${enFile}`;
  const zhUrl = `${BASE}/${zhFile}`;
  const alternates = [
    { hl: 'en', href: enUrl },
    { hl: 'zh', href: zhUrl },
    { hl: 'x-default', href: enUrl }
  ];
  entries.push(entry(enUrl, enFile, alternates));
  entries.push(entry(zhUrl, zhFile, alternates));
}

// --- DMCA（无语言变体） ---
entries.push(entry(`${BASE}/dmca.html`, 'dmca.html'));

// --- SEO 专题页（英文单语，无语言变体；新增页面在此登记） ---
const GUIDE_PAGES = [
  'markup-io-alternative.html',
  'weava-alternative.html',
  'annotate-word-documents-online.html',
  'visual-feedback-for-ai-coding-assistants.html'
];
for (const file of GUIDE_PAGES) {
  entries.push(entry(`${BASE}/${file}`, file));
}

// --- 输出 ---
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  entries.join('\n') +
  '\n</urlset>\n';

writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml 已生成：${entries.length} 个 URL`);
