import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicRoots = new Set(['_astro', 'assets', 'blog-search', 'blog', 'cases', 'contact', 'docs', 'en', 'licenses', 'media', 'support', 'works', 'zh']);
const publicRootFiles = new Set(['favicon.svg', 'index.html', 'site-router.js', '.nojekyll']);

export function isPublicPath(relative) {
  return publicRootFiles.has(relative) || publicRoots.has(relative.split('/')[0]);
}

export function isPublicHtml(relative, html) {
  return isPublicPath(relative) && relative !== 'docs/404.html' &&
    /\.html$/i.test(relative) &&
    !/<meta\b(?=[^>]*\bhttp-equiv\s*=\s*["']?refresh\b)[^>]*>/i.test(html);
}

export function injectHtml(html, websiteId) {
  if (!uuid.test(websiteId)) throw new Error('website-id 必须是真实 Umami 站点 UUID');
  const existing = html.match(/<script\b[^>]*\bdata-mzsh-analytics\b[^>]*><\/script>/i);
  if (existing) {
    if (!existing[0].includes(`data-website-id="${websiteId}"`)) {
      throw new Error('页面已有不同的 Umami 站点 ID');
    }
    return html;
  }
  if (!/<\/head>/i.test(html)) throw new Error('页面缺少 head 结束标签');
  const script = `<script defer src="/assets/analytics.js" data-mzsh-analytics data-website-id="${websiteId}"></script>`;
  return html.replace(/<\/head>/i, `${script}</head>`);
}

function main(args) {
  const check = args.includes('--check');
  const idAt = args.indexOf('--website-id');
  if (idAt < 0 || !args[idAt + 1] || !uuid.test(args[idAt + 1]) ||
    args.some((arg, index) => arg.startsWith('--') && arg !== '--check' && arg !== '--website-id') ||
    args.length !== (check ? 3 : 2)) {
    throw new Error('用法: node tools/analytics/inject.mjs --website-id <真实UUID> [--check]');
  }
  const websiteId = args[idAt + 1];
  const tracked = execFileSync('git', ['ls-files', '-z', '--', '*.html'], { cwd: root })
    .toString('utf8').split('\0').filter(Boolean);
  const changes = [];
  let selected = 0;
  for (const relative of tracked) {
    const file = path.join(root, relative);
    const current = fs.readFileSync(file, 'utf8');
    if (!isPublicHtml(relative.replaceAll('\\', '/'), current)) continue;
    selected++;
    const next = injectHtml(current, websiteId);
    if (next !== current) changes.push([file, next]);
  }
  if (check) {
    if (changes.length) throw new Error(`${changes.length}/${selected} 个公开页面尚未接入`);
  } else {
    for (const [file, next] of changes) fs.writeFileSync(file, next);
  }
  console.log(`公开页面 ${selected}，${check ? '待接入' : '本次接入'} ${changes.length}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
