import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildSite,localeRoute} from './build.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'bilingual-build-test-'));
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  const vault = path.join(root,'vault'), output = path.join(root,'published');
  fs.mkdirSync(vault); fs.mkdirSync(output); fs.writeFileSync(path.join(output,'sentinel'),'unchanged');
  const zh = '---\ntitle: 中文\ndraft: false\n---\n\n## 章节\n\n内容\n';
  const en = `---\ntitle: English\ndraft: false\ntranslationKey: 'page:home'\nsourceHash: ${hash(zh)}\ngeneratedBodyHash: ${hash('## Chapter\n\nContent')}\ntranslationStatus: translated\n---\n\n## Chapter\n\nContent\n`;
  fs.writeFileSync(path.join(vault,'zh.md'),zh); fs.writeFileSync(path.join(vault,'en.md'),en);
  return {vault,output,site:root,manifest:{version:1,entries:[{id:'page:home',type:'page',slug:'home',legacyRoutes:['/'],locales:{zh:{source:'zh.md'},en:{source:'en.md'}},template:'home.html',media:[]}]}};
}
for (const [name, mutate, message] of [
  ['missing Chinese source', x => fs.unlinkSync(path.join(x.vault,'zh.md')), /来源缺失/],
  ['missing English translation', x => fs.unlinkSync(path.join(x.vault,'en.md')), /译文缺失/],
  ['duplicate public routes', x => x.manifest.entries.push({...x.manifest.entries[0],id:'page:duplicate'}), /路由重复/],
  ['media outside allowed root', x => x.manifest.entries[0].media.push({path:'../private.png',publish:true}), /媒体越界/],
  ['stale English translation', x => fs.appendFileSync(path.join(x.vault,'zh.md'),'Changed'), /译文过期/],
  ['manually modified English needs review', x => fs.appendFileSync(path.join(x.vault,'en.md'),'Manual'), /人工修改/],
]) test(`rejects ${name} before changing published tree`, async t => {
  const x = fixture(t); mutate(x);
  await assert.rejects(() => buildSite(x),message);
  assert.deepEqual(fs.readdirSync(x.output),['sentinel']);
  assert.equal(fs.readFileSync(path.join(x.output,'sentinel'),'utf8'),'unchanged');
});
test('builds both locale pages and check detects changes without modifying output', async t => {
  const x = fixture(t);
  const templates = path.join(x.site,'templates'); fs.mkdirSync(templates);
  fs.writeFileSync(path.join(templates,'home.html'),'<html lang="zh"><head><title>{{text:title}}</title></head><body><header><div class="header-actions"></div></header><article><div class="prose">{{body}}</div></article></body></html>');
  x.templateRoot = templates;
  x.copy = {zh:{shellSlots:{'page:home':{title:'中文'}},languageLabels:{group:'语言',zh:'中文',en:'EN',zhAria:'中文',enAria:'英文'}},en:{shellSlots:{'page:home':{title:'English'}},languageLabels:{group:'Language',zh:'中文',en:'EN',zhAria:'Chinese',enAria:'English'}}};
  await buildSite(x);
  assert.match(fs.readFileSync(path.join(x.output,'zh/index.html'),'utf8'),/内容/);
  assert.match(fs.readFileSync(path.join(x.output,'en/index.html'),'utf8'),/Content/);
  assert.equal((await buildSite({...x,check:true})).differences.length,0);
  fs.writeFileSync(path.join(x.output,'en/index.html'),'drift');
  assert.ok((await buildSite({...x,check:true})).differences.includes('en/index.html'));
  assert.equal(fs.readFileSync(path.join(x.output,'en/index.html'),'utf8'),'drift');
});
test('documentation routes use leading locale and retain chapter hierarchy', () => {
  assert.equal(localeRoute({legacyRoutes:['/docs/zh/guides/ue-tools/simple-websocket-guide/']},'en'),'/en/docs/guides/ue-tools/simple-websocket-guide/');
});
