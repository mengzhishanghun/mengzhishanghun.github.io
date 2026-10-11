import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildSite,localeRoute,preflight,sourceTags} from './build.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'bilingual-build-test-'));
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  const vault = path.join(root,'vault'), output = path.join(root,'published');
  fs.mkdirSync(vault); fs.mkdirSync(output); fs.writeFileSync(path.join(output,'sentinel'),'unchanged');
  const zh = '---\nlang: zh\ntitle: 中文\ndraft: false\n---\n\n## 章节\n\n内容\n';
  const en = `---\nlang: en\ntitle: English\ndraft: false\ntranslationKey: 'page:home'\nsourceHash: ${hash(zh)}\ngeneratedBodyHash: ${hash('## Chapter\n\nContent')}\ntranslationStatus: translated\n---\n\n## Chapter\n\nContent\n`;
  for(const code of ['zh','en'])fs.mkdirSync(path.join(vault,'网站',code==='zh'?'001-zh':'002-en'),{recursive:true});
  fs.writeFileSync(path.join(vault,'网站/001-zh/zh.md'),zh);fs.writeFileSync(path.join(vault,'网站/002-en/en.md'),en);
  const label={group:'Language',switchAria:'Switch to {language}'};
  const data=code=>({lang:code,language:{code,label:code==='zh'?'中文':'EN',htmlLang:code==='zh'?'zh-CN':'en',searchLanguage:code,browserTags:[code+'-*']},languageLabels:label,shellSlots:{'page:home':{title:code==='zh'?'中文':'English'}},scriptSlots:{},bodyUtilitySlots:{}});
  const primary='---\n'+JSON.stringify(data('zh'))+'\n---\n\nCopy\n';
  fs.writeFileSync(path.join(vault,'网站/001-zh/000-texts.md'),primary);
  fs.writeFileSync(path.join(vault,'网站/002-en/000-texts.md'),'---\n'+JSON.stringify({...data('en'),translationKey:'site-copy',sourceHash:hash(primary),translationStatus:'translated',generatedBodyHash:hash('Copy')})+'\n---\n\nCopy\n');
  const languages=['zh','en'].map((code,i)=>({root:(i+1).toString().padStart(3,'0')+'-'+code,enabled:true,commonSource:'000-texts.md',sources:{'page:home':code+'.md'}}));
  fs.writeFileSync(path.join(vault,'网站/000-languages.md'),'---\n'+JSON.stringify({version:1,primary:'zh',fallback:'en',languages})+'\n---\n');
  return {vault,output,site:root,manifest:{version:1,entries:[{id:'page:home',type:'page',slug:'home',legacyRoutes:['/'],locales:{zh:{source:'zh.md'},en:{source:'en.md'}},template:'home.html',media:[]}]}};
}
for (const [name, mutate, message] of [
  ['missing Chinese source', x => fs.unlinkSync(path.join(x.vault,'网站/001-zh/zh.md')), /来源缺失/],
  ['missing English translation', x => fs.unlinkSync(path.join(x.vault,'网站/002-en/en.md')), /译文缺失/],
  ['duplicate public routes', x => x.manifest.entries.push({...x.manifest.entries[0],id:'page:duplicate'}), /路由重复|语言来源映射缺失/],
  ['media outside allowed root', x => x.manifest.entries[0].media.push({path:'../private.png',publish:true}), /媒体越界/],
  ['stale English translation', x => fs.appendFileSync(path.join(x.vault,'网站/001-zh/zh.md'),'Changed'), /译文过期/],
  ['manually modified English needs review', x => fs.appendFileSync(path.join(x.vault,'网站/002-en/en.md'),'Manual'), /人工修改/],
  ['explicit wrong primary language',x=>{const p=path.join(x.vault,'网站/001-zh/zh.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('lang: zh','lang: en'))},/来源语言不符/],
  ['draft main source',x=>{const p=path.join(x.vault,'网站/001-zh/zh.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('draft: false','draft: true'))},/草稿不得发布/],
]) test(`rejects ${name} before changing published tree`, async t => {
  const x = fixture(t); mutate(x);
  await assert.rejects(() => buildSite(x),message);
  assert.deepEqual(fs.readdirSync(x.output),['sentinel']);
  assert.equal(fs.readFileSync(path.join(x.output,'sentinel'),'utf8'),'unchanged');
});

test('historical primary sources may omit lang and draft',t=>{
  const x=fixture(t),p=path.join(x.vault,'网站/001-zh/zh.md'),en=path.join(x.vault,'网站/002-en/en.md'),original=fs.readFileSync(p,'utf8');
  const updated=original.replace('lang: zh\n','').replace('draft: false\n','');fs.writeFileSync(p,updated);
  fs.writeFileSync(en,fs.readFileSync(en,'utf8').replace(hash(original),hash(updated)));
  assert.equal(preflight(x).entries.length,1);
});

test('locale tags replace stale JSON and visible tags, including clearing and independent search values',async t=>{
  const x=fixture(t),p=path.join(x.vault,'网站/001-zh/zh.md'),en=path.join(x.vault,'网站/002-en/en.md'),original=fs.readFileSync(p,'utf8');
  const updated=original.replace('title: 中文','title: 中文\ntags: [新标签, 新标签]\nsearchTags: [检索, 新标签, 检索]');fs.writeFileSync(p,updated);
  fs.writeFileSync(en,fs.readFileSync(en,'utf8').replace('title: English','title: English\ntags: []\nsearchTags: [only-search, only-search]').replace(hash(original),hash(updated)));
  const templates=path.join(x.site,'templates');fs.mkdirSync(templates);x.templateRoot=templates;
  fs.writeFileSync(path.join(templates,'home.html'),'<html lang="zh"><head></head><body><header><div class="header-actions"></div></header><article>{{body}}<ul class="work-card-tags"><li class="tag">stale</li></ul></article><div data-content-card data-slug="home"><div class="content-card-tags"><span class="tag">stale</span></div></div><script type="application/json" data-content-index-data>[{"slug":"home","tags":["stale"],"searchTags":["stale-search"]}]</script></body></html>');
  await buildSite(x);
  const zh=fs.readFileSync(path.join(x.output,'zh/index.html'),'utf8'),english=fs.readFileSync(path.join(x.output,'en/index.html'),'utf8');
  const record=html=>JSON.parse(html.match(/data-content-index-data>([^<]+)<\/script>/)[1])[0];
  assert.deepEqual(record(zh).tags,['新标签']);assert.deepEqual(record(zh).searchTags,['新标签','检索']);
  assert.deepEqual(record(english).tags,[]);assert.deepEqual(record(english).searchTags,['only-search']);
  assert.match(zh,/<ul class="work-card-tags"><li class="tag">新标签<\/li><\/ul>/);
  assert.match(zh,/<div class="content-card-tags"><span class="tag">新标签<\/span><\/div>/);
  assert.match(english,/<ul class="work-card-tags"><\/ul>/);assert.match(english,/<div class="content-card-tags"><\/div>/);
  assert.doesNotMatch(zh+english,/stale/);
  assert.deepEqual(sourceTags({data:{tags:['add','add'],searchTags:['search','add']}}),{tags:['add'],searchTags:['add','search']});
});
test('builds both locale pages and check detects changes without modifying output', async t => {
  const x = fixture(t);
  const templates = path.join(x.site,'templates'); fs.mkdirSync(templates);
  fs.writeFileSync(path.join(templates,'home.html'),'<html lang="zh"><head><title>{{text:title}}</title></head><body><header><div class="header-actions"></div></header><article><div class="prose">{{body}}</div></article></body></html>');
  x.templateRoot = templates;
  await buildSite(x);
  assert.match(fs.readFileSync(path.join(x.output,'zh/index.html'),'utf8'),/内容/);
  assert.match(fs.readFileSync(path.join(x.output,'en/index.html'),'utf8'),/Content/);
  assert.equal((await buildSite({...x,check:true})).differences.length,0);
  fs.writeFileSync(path.join(x.output,'en/index.html'),'drift');
  assert.ok((await buildSite({...x,check:true})).differences.includes('en/index.html'));
  assert.equal(fs.readFileSync(path.join(x.output,'en/index.html'),'utf8'),'drift');
});

test('shell CRLF normalization is idempotent and preserves template pre/code and script literal bytes',async t=>{
  const x=fixture(t),templates=path.join(x.site,'templates');fs.mkdirSync(templates);x.templateRoot=templates;
  const literal='<pre><code>line  \r\nnext\t \r\n</code></pre>';
  const script='const sample=`literal\r\n text`;';
  fs.writeFileSync(path.join(templates,'home.html'),'<html lang="zh"><head><style>.a {color:red}\r\n.b {color:blue}</style></head><body><header><div class="header-actions"></div></header><div>\r\n</div><script>\r\n'+script+'</script>'+literal+'<article>{{body}}</article></body></html>');
  await buildSite(x);
  const html=fs.readFileSync(path.join(x.output,'zh/index.html'),'utf8');
  assert.match(html,/<style>\.a \{color:red\}\n\.b \{color:blue\}<\/style>/);
  assert.ok(html.includes(literal));
  assert.ok(html.includes('<script>\n'+script+'</script>'));assert.ok(html.includes('<div>\n</div>'));
  assert.equal((await buildSite({...x,check:true})).differences.length,0);
});

function threeLanguages(t) {
  const x=fixture(t),configFile=path.join(x.vault,'网站/000-languages.md');
  const parse=file=>JSON.parse(fs.readFileSync(file,'utf8').split('\n')[1]);
  const config=parse(configFile),common=parse(path.join(x.vault,'网站/002-en/000-texts.md'));
  const language={code:'fr',label:'Français',htmlLang:'fr',searchLanguage:'fr',browserTags:['fr','fr-*']};
  const directory=path.join(x.vault,'网站/003-fr');fs.mkdirSync(directory);
  const zh=fs.readFileSync(path.join(x.vault,'网站/001-zh/zh.md'),'utf8'),body='## Chapitre\n\nTexte français';
  fs.writeFileSync(path.join(directory,'fr.md'),`---\nlang: fr\ntitle: Français\ntranslationKey: page:home\nsourceHash: ${hash(zh)}\ngeneratedBodyHash: ${hash(body)}\ntranslationStatus: translated\n---\n\n${body}\n`);
  fs.writeFileSync(path.join(directory,'000-texts.md'),'---\n'+JSON.stringify({...common,lang:'fr',language,shellSlots:{'page:home':{title:'Français'}}})+'\n---\n\nCopy\n');
  config.languages.push({root:'003-fr',enabled:true,commonSource:'000-texts.md',sources:{'page:home':'fr.md'}});
  fs.writeFileSync(configFile,'---\n'+JSON.stringify(config)+'\n---\n');
  const templates=path.join(x.site,'templates');fs.mkdirSync(templates);
  fs.writeFileSync(path.join(templates,'home.html'),'<html lang="zh"><head><title>{{text:title}}</title></head><body><header><div class="header-actions"></div></header><article>{{body}}</article></body></html>');
  x.templateRoot=templates;
  return {x,configFile,config};
}
test('adding a third language only to Obsidian produces HTML, RSS, real Pagefind and SEO',async t=>{
  const {x}=threeLanguages(t),result=await buildSite(x);
  assert.equal(result.pages,3);
  const html=fs.readFileSync(path.join(x.output,'fr/index.html'),'utf8');
  assert.match(html,/Texte français/);assert.match(html,/<option value="fr"[^>]* selected/);
  for(const file of ['fr/blog/rss.xml','fr/blog-search/pagefind.js','site-languages.json','sitemap.xml'])assert.ok(fs.existsSync(path.join(x.output,file)));
  const publicConfig=fs.readFileSync(path.join(x.output,'site-languages.json'),'utf8');
  assert.doesNotMatch(publicConfig,/sources|commonSource|网站|root/);
  assert.match(fs.readFileSync(path.join(x.output,'sitemap.xml'),'utf8'),/hreflang="fr"/);
});
for(const [name,mutate,expected] of [
  ['missing third source',({x})=>fs.unlinkSync(path.join(x.vault,'网站/003-fr/fr.md')),/译文缺失/],
  ['duplicate language code',({x})=>{const p=path.join(x.vault,'网站/003-fr/000-texts.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('\"code\":\"fr\"','\"code\":\"en\"'))},/code无效或重复/],
  ['unsafe language root',({config})=>{config.languages[2].root='../private'},/root越界/],
  ['missing common copy',({x})=>fs.unlinkSync(path.join(x.vault,'网站/003-fr/000-texts.md')),/公共/],
  ['wrong translation key',({x})=>{const p=path.join(x.vault,'网站/003-fr/fr.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('page:home','wrong'))},/身份不符/],
  ['third source hash mismatch',({x})=>{const p=path.join(x.vault,'网站/003-fr/fr.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/sourceHash: [^\n]+/,'sourceHash: wrong'))},/过期/],
  ['missing common slot',({x})=>{const p=path.join(x.vault,'网站/003-fr/000-texts.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('"title":"Français"','"other":"Français"'))},/公共文案槽缺失/],
  ['ambiguous browser match',({x})=>{const p=path.join(x.vault,'网站/003-fr/000-texts.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('["fr","fr-*"]','["en-US"]'))},/浏览器语言规则歧义/],
  ['unsupported browser wildcard',({x})=>{const p=path.join(x.vault,'网站/003-fr/000-texts.md');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('["fr","fr-*"]','["f*"]'))},/语言元数据缺失/],
])test(`rejects ${name} before touching published tree`,async t=>{
  const state=threeLanguages(t);mutate(state);fs.writeFileSync(state.configFile,'---\n'+JSON.stringify(state.config)+'\n---\n');
  await assert.rejects(()=>buildSite(state.x),expected);
  assert.deepEqual(fs.readdirSync(state.x.output),['sentinel']);
});
test('documentation routes use leading locale and retain chapter hierarchy', () => {
  assert.equal(localeRoute({legacyRoutes:['/docs/zh/guides/ue-tools/simple-websocket-guide/']},'en'),'/en/docs/guides/ue-tools/simple-websocket-guide/');
});

function supplementFixture(t,key='supplement:004-文档/001-UE工具/guide.md') {
  const x=fixture(t),zhPath='网站/001-zh/004-文档/001-UE工具/guide.md',enPath='网站/002-en/004-Docs/001-UE-Tools/guide.md';
  const zh='---\nlang: zh\n---\n\n中文补充\n';
  const en=`---\nlang: en\ntranslationKey: ${key}\nsourceHash: ${hash(zh)}\ntranslationStatus: translated\ngeneratedBodyHash: ${hash('English supplement')}\n---\n\nEnglish supplement\n`;
  for(const [relative,body] of [[zhPath,zh],[enPath,en]]) {fs.mkdirSync(path.dirname(path.join(x.vault,relative)),{recursive:true});fs.writeFileSync(path.join(x.vault,relative),body);}
  const mainZhFile=path.join(x.vault,'网站/001-zh/zh.md');const originalZh=fs.readFileSync(mainZhFile,'utf8');const mainZh=originalZh.replace('---\n',`---\nsupplementSources:\n  - ${zhPath}\n`);fs.writeFileSync(mainZhFile,mainZh);
  x.manifest.entries[0].supplementTranslationKeys=[key];
  const main=fs.readFileSync(path.join(x.vault,'网站/002-en/en.md'),'utf8').replace('---\n',`---\nsupplementSources:\n  - ${enPath}\n`).replace(hash(originalZh),hash(mainZh));
  fs.writeFileSync(path.join(x.vault,'网站/002-en/en.md'),main);
  return {x,enPath};
}
for(const key of ['supplement:004-文档/001-UE工具/guide.md','004-文档/001-UE工具/guide'])test(`explicit English supplements preserve stable key ${key}`,t=>{
  const {x}=supplementFixture(t,key);
  assert.equal(preflight(x).entries[0].supplements[0].en.data.lang,'en');
});
for(const mismatch of ['missing','missingKey','wrongIdentity','wrongPair'])test(`rejects ${mismatch} supplement before touching output`,async t=>{
  const {x,enPath}=supplementFixture(t);
  const file=path.join(x.vault,mismatch==='missing'?'网站/002-en/en.md':enPath);
  const raw=fs.readFileSync(file,'utf8');
  if(mismatch==='missingKey')delete x.manifest.entries[0].supplementTranslationKeys;
  else if(mismatch==='wrongPair') {
    const other=enPath.replace('guide.md','other.md');fs.writeFileSync(path.join(x.vault,other),raw.replace('supplement:004-文档/001-UE工具/guide.md','supplement:other'));
    fs.writeFileSync(path.join(x.vault,'网站/002-en/en.md'),fs.readFileSync(path.join(x.vault,'网站/002-en/en.md'),'utf8').replace(enPath,other));
  } else fs.writeFileSync(file,mismatch==='missing'?raw.replace(/supplementSources:\n  - [^\n]+\n/,'supplementSources: []\n'):raw.replace('supplement:004-文档/001-UE工具/guide.md','supplement:wrong'));
  await assert.rejects(()=>buildSite(x),['missing','missingKey'].includes(mismatch)?/补充来源列表/:/补充译文身份/);
  assert.deepEqual(fs.readdirSync(x.output),['sentinel']);assert.equal(fs.readFileSync(path.join(x.output,'sentinel'),'utf8'),'unchanged');
});

test('draft supplemental source refuses publication before changing output',async t=>{
  const {x,enPath}=supplementFixture(t),file=path.join(x.vault,enPath);
  fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('lang: en','lang: en\ndraft: true'));
  await assert.rejects(()=>buildSite(x),/补充草稿不得发布/);
  assert.deepEqual(fs.readdirSync(x.output),['sentinel']);
});
