import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import YAML from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here,'../..');
const position = process.argv.indexOf('--vault');
if (position < 0 || !process.argv[position + 1]) throw new Error('必须指定 --vault');
const vault = path.resolve(process.argv[position + 1]);
const manifest = JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8'));
const attrs = n => Object.fromEntries((n.attrs || []).map(x => [x.name,x.value]));
function find(node,predicate) {
  const matches = [];
  const walk = n => { if (predicate(n,attrs(n))) matches.push(n); for (const child of n.childNodes || []) walk(child); };
  walk(node);
  return matches;
}
function one(node,predicate) { const found = find(node,predicate); assert.equal(found.length,1); return found[0]; }
function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
const list = parse(fs.readFileSync(path.join(site,'cases/index.html'),'utf8'));
const records = JSON.parse(text(one(list,(n,a) => a['data-content-index-data'] !== undefined)));
assert.equal(records.length,10);
assert.equal(new Set(records.map(x => x.slug)).size,10);
assert.deepEqual(records.slice(0,7).map(x => x.slug),['driving-simulator-three-screen','ai-digital-human-integration','flying-car-simulator','motion-capture-robot-control','six-dof-motion-platform','plugin-release-workflow','markdown-publishing']);
assert.equal(find(list,(n,a) => a['data-content-card'] !== undefined).length,10);
assert.equal(records.filter(x => x.categoryId === 'ue-projects').length,8);
assert.equal(records.filter(x => x.categoryId === 'desktop-automation').length,2);
for (const [category,count] of [['ue-projects','8'],['desktop-automation','2']]) {
  const button = one(list,(n,a) => n.tagName === 'button' && a['data-category'] === category);
  assert.equal(text(one(button,(n,a) => a.class?.split(' ').includes('content-category-count'))),count);
}
const searchScript = one(list,(n,a) => n.tagName === 'script' && a.src?.includes('/ContentIndex.'));
const searchCode = fs.readFileSync(path.join(site,attrs(searchScript).src.slice(1)),'utf8');
// Execute the shipped ranking function; the document stub suppresses only UI initialization.
const context = vm.createContext({document:{addEventListener(){},querySelectorAll(){return [];}}});
vm.runInContext(searchCode,context);
for (const entry of manifest.cases) {
  const source = fs.readFileSync(path.join(vault,'网站',entry.source),'utf8');
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  const data = YAML.parse(match[1]);
  const record = records.find(x => x.slug === data.slug);
  assert.ok(record);
  assert.equal(record.description,data.description);
  assert.deepEqual(record.tags,data.tags);
  assert.equal(record.body,source.slice(match[0].length).replace(/\r\n/g,'\n').trim());
  const card = one(list,(n,a) => a['data-content-card'] !== undefined && a['data-slug'] === data.slug);
  assert.equal(attrs(card).href,entry.route);
  assert.equal(text(one(card,n => n.tagName === 'h2')),data.title);
  const markup = fs.readFileSync(path.join(site,entry.route.slice(1),'index.html'),'utf8');
  const doc = parse(markup), h1 = one(doc,n => n.tagName === 'h1');
  assert.equal(text(h1),data.title);
  assert.equal(attrs(h1).id,'detail-' + data.slug);
  assert.equal(attrs(one(doc,n => n.tagName === 'article'))['aria-labelledby'],attrs(h1).id);
  assert.equal(attrs(one(doc,(n,a) => n.tagName === 'link' && a.rel === 'canonical')).href,'https://mzsh.me' + entry.route);
  assert.equal(find(doc,(n,a) => n.tagName === 'script' && a['data-mzsh-analytics'] !== undefined).length,1);
  one(doc,(n,a) => n.tagName === 'link' && a.href === '/assets/reading-area.css');
  const prose = one(doc,(n,a) => a.class?.split(' ').includes('prose'));
  assert.deepEqual(find(prose,n => /^h[1-6]$/.test(n.tagName || '')).map(n => [n.tagName,text(n)]),['背景介绍','复现环境','具体问题','解决方案','最终总结'].map(x => ['h2',x]));
  if (entry.createFromTemplate) {
    assert.ok(!markup.includes('driving-simulator-three-screen'));
    assert.equal(find(doc,(n,a) => a.class?.split(' ').includes('project-title-secondary')).length,0);
    assert.equal(find(doc,(n,a) => a.class?.split(' ').includes('project-hero-media')).length,0);
    assert.equal(find(card,n => n.tagName === 'img').length,0);
    context.record = record;
    context.query = data.tags[0];
    assert.ok(vm.runInContext('o(record,n(query)).score',context) > 0,'新增案例无法被实际搜索函数命中');
  }
}
console.log('十条案例路由、唯一卡片/JSON、分类 8+2、来源正文、模板清理、分析脚本与新案例搜索：通过');
