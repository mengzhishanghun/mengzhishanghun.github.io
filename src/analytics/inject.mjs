import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicRoots = new Set(['_astro', 'assets', 'blog-search', 'blog', 'cases', 'contact', 'docs', 'en', 'licenses', 'media', 'support', 'works', 'zh']);
const publicRootFiles = new Set(['favicon.svg', 'index.html', 'site-router.js', '.nojekyll', 'sitemap.xml', 'robots.txt', 'site-languages.json', 'about/index.html']);

export function publicLanguageCodes(config) {
  if(config?.version!==1 || !Array.isArray(config.languages) || !config.languages.length)throw new Error('公开语言配置无效');
  const codes=config.languages.map(language=>language.code);
  if(codes.some(code=>typeof code!=='string' || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(code)) || new Set(codes).size!==codes.length || !codes.includes(config.primary) || !codes.includes(config.fallback))throw new Error('公开语言code无效');
  if(config.languages.some(language=>Object.keys(language).some(key=>!['code','label','htmlLang','searchLanguage','browserTags'].includes(key))))throw new Error('公开语言配置含来源字段');
  return new Set(codes);
}

export function isPublicPath(relative,config) {
  if(relative.includes('\\') || relative.split('/').some(part=>!part || part==='.' || part==='..'))return false;
  const codes=config?publicLanguageCodes(config):new Set();
  return publicRootFiles.has(relative) || publicRoots.has(relative.split('/')[0]) || codes.has(relative.split('/')[0]);
}

export function isPublicHtml(relative, html, config) {
  return isPublicPath(relative,config) && relative !== 'docs/404.html' &&
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
    args.some(arg => arg.startsWith('--') && !['--check','--website-id','--output'].includes(arg)) ||
    !args.includes('--output') || !args[args.indexOf('--output')+1] || args.length !== (check ? 5 : 4)) {
    throw new Error('用法: node src/analytics/inject.mjs --output <静态输出目录> --website-id <真实UUID> [--check]');
  }
  const websiteId = args[idAt + 1];
  const output=path.resolve(args[args.indexOf('--output')+1]);
  const config=JSON.parse(fs.readFileSync(path.join(output,'site-languages.json'),'utf8'));publicLanguageCodes(config);
  const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{const file=path.join(directory,item.name);if(item.isSymbolicLink())throw new Error('输出不得含符号链接');return item.isDirectory()?walk(file):item.isFile()?[path.relative(output,file).replaceAll('\\','/')]:[];});
  const tracked=walk(output).filter(relative=>relative.endsWith('.html'));
  const changes = [];
  let selected = 0;
  for (const relative of tracked) {
    const file = path.join(output, relative);
    const current = fs.readFileSync(file, 'utf8');
    if (!isPublicHtml(relative.replaceAll('\\', '/'), current,config)) continue;
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
