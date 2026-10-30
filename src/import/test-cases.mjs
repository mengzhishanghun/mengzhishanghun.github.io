import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import YAML from 'yaml';
import {readLanguages,languageSource} from '../build/languages.mjs';
import {localeRoute} from '../build/build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here,'../..');
const sourceRoot=path.join(site,'src');
const outputAt=process.argv.indexOf('--output');
if(outputAt>=0&&!process.argv[outputAt+1])throw Error('--output 必须指定目录');
const output=path.resolve(site,outputAt>=0?process.argv[outputAt+1]:'dist/site');
const manifest=JSON.parse(fs.readFileSync(path.resolve(here,'../build/manifest.json'),'utf8'));
const config=readLanguages(sourceRoot,manifest.entries.map(e=>e.id)),primary=config.languages.find(l=>l.code===config.primary);
const attrs = n => Object.fromEntries((n.attrs || []).map(x => [x.name,x.value]));
function find(node,predicate) {
  const matches = [];
  const walk = n => { if (predicate(n,attrs(n))) matches.push(n); for (const child of n.childNodes || []) walk(child); };
  walk(node);
  return matches;
}
function one(node,predicate) { const found = find(node,predicate); assert.equal(found.length,1); return found[0]; }
function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
const list = parse(fs.readFileSync(path.join(output,'zh/cases/index.html'),'utf8'));
const records = JSON.parse(text(one(list,(n,a) => a['data-content-index-data'] !== undefined)));
const projectSlugs=['driving-simulation','flight-simulation','motion-platform-filming','digital-human-interaction','herbal-exhibition'];
assert.deepEqual(records.map(x=>x.slug),projectSlugs);
assert.equal(new Set(records.map(x => x.slug)).size,5);
assert.equal(find(list,(n,a) => a['data-content-card'] !== undefined).length,5);
assert.ok(records.every(record=>record.categoryName==='UE项目'));
for (const [category,count] of [[records[0].categoryId,'5']]) {
  const button = one(list,(n,a) => n.tagName === 'button' && a['data-category'] === category);
  assert.equal(text(one(button,(n,a) => a.class?.split(' ').includes('content-category-count'))),count);
}
const searchScript = one(list,(n,a) => n.tagName === 'script' && a.src?.includes('/ContentIndex.'));
const searchCode = fs.readFileSync(path.join(output,attrs(searchScript).src.slice(1)),'utf8');
const helperURL=searchCode.match(/^import[^;]+from\s+"([^"]+)";/)?.[1];
const helperCode=helperURL?fs.readFileSync(path.join(output,helperURL.slice(1)),'utf8').replace(/^export /gm,''):'';
// Execute the shipped ranking function; the document stub suppresses only UI initialization.
const context = vm.createContext({document:{documentElement:{lang:"zh-CN"},addEventListener(){},querySelectorAll(){return [];}},window:{SiteLanguageCode:"zh",SitePrimaryCode:"zh"}});
vm.runInContext(helperCode+searchCode.replace(/^import[^;]+;\s*/,''),context);
for (const entry of manifest.entries.filter(e=>e.type==='case')) {
  const source = fs.readFileSync(path.join(sourceRoot,languageSource(primary,primary.sources[entry.id])),'utf8');
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  const data = YAML.parse(match[1]);
  if(data.status==='开发中'||data.workInfo?.stage==='developing'){assert.equal(fs.existsSync(path.join(output,localeRoute(entry,'zh').slice(1),'index.html')),false);continue;}
  const record = records.find(x => x.slug === data.slug);
  assert.ok(record);
  assert.equal(record.description,data.description);
  assert.ok(data.tags.every(tag=>record.searchTags.includes(tag)));
  assert.ok(record.body.length>0);
  const card = one(list,(n,a) => a['data-content-card'] !== undefined && a['data-slug'] === data.slug);
  assert.equal(attrs(card).href,localeRoute(entry,'zh'));
  assert.equal(text(one(card,n => n.tagName === 'h2')),data.title);
  const markup = fs.readFileSync(path.join(output,localeRoute(entry,'zh').slice(1),'index.html'),'utf8');
  const doc = parse(markup), h1 = one(doc,n => n.tagName === 'h1');
  assert.equal(text(h1),data.title);
  assert.equal(attrs(h1).id,'detail-' + data.slug);
  assert.equal(attrs(one(doc,n => n.tagName === 'article'))['aria-labelledby'],attrs(h1).id);
  assert.equal(attrs(one(doc,(n,a) => n.tagName === 'link' && a.rel === 'canonical')).href,'https://mzsh.me' + localeRoute(entry,'zh'));
  assert.equal(find(doc,(n,a) => n.tagName === 'script' && a['data-mzsh-analytics'] !== undefined).length,1);
  one(doc,(n,a) => n.tagName === 'link' && a.href === '/assets/reading-area.css');
  const prose = one(doc,(n,a) => a.class?.split(' ').includes('prose'));
  assert.equal(record.body.replace(/\s+/g,''),text(prose).replace(/\s+/g,''));
  const headings=[...source.slice(match[0].length).matchAll(/^## (.+)$/gm)].map(m=>m[1].trim());
  assert.ok(headings.includes('项目介绍')&&headings.includes('我负责的工作'));
  assert.deepEqual(find(prose,n => n.tagName==='h2').map(text),headings);
  const coverUrl = entry.cover.websiteUrl;
  assert.equal(data.websiteCoverUrl,coverUrl);
  assert.ok(fs.statSync(path.join(output,coverUrl.slice(1))).isFile());
  const heroMedia = one(doc,(n,a) => a.class?.split(' ').includes('project-hero-media'));
  const trigger = one(heroMedia,(n,a) => a['data-media-image'] !== undefined);
  assert.equal(attrs(trigger).href,coverUrl);
  assert.equal(attrs(trigger)['data-media-src'],coverUrl);
  assert.equal(attrs(one(heroMedia,n => n.tagName === 'img')).src,coverUrl);
  assert.equal(attrs(one(card,n => n.tagName === 'img')).src,coverUrl);
  context.record = record;
  context.query = data.title;
  assert.ok(vm.runInContext('o(record,n(query)).score',context) > 0,'项目无法被实际搜索函数命中');
}
console.log('公开项目案例的路由、卡片、正文、封面、放大链接、分类与搜索：通过');
