import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projectSource,importContent,canonicalTextHash,parseSource,sourceText} from './import.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
test('projection removes hidden image source, alt, title and private frontmatter per occurrence',async()=>{
  const source={data:{title:'Title',draft:false,sourcePath:'private/source.md',migrationOrigin:'private'},body:'Before\n\n![private description](private-image.png "private title")\n\nAfter\n'};
  const record={id:'blog:example',kind:'blog',lang:'zh',images:[{id:'blog:example:media:1',ordinal:1,source:'private-image.png',state:'withheld'}]};
  const result=await projectSource(source,record);
  assert.equal(result.body,'Before\n\n![](/media-occurrence/blog%3Aexample%3Amedia%3A1)\n\nAfter\n');
  assert.deepEqual(result.data,{title:'Title',draft:false,lang:'zh'});
  assert.doesNotMatch(result.raw,/private/);
});

for(const [name,body,expected]of [['raw HTML','<img src="/assets/example.png">',/原始HTML/],['dangerous link','[link](javascript:alert(1))',/不安全链接/],['unknown media','![unknown](/assets/unknown.png)',/媒体/],['reference media','![unknown][pic]\n\n[pic]: /assets/unknown.png',/媒体/]])test(`projection refuses ${name}`,async()=>{
  await assert.rejects(()=>projectSource({data:{title:'Title'},body},{id:'case:example',kind:'case',lang:'zh',images:[]}),expected);
});
test('cover path and URL authorizations remain precise',async()=>{
  const record={id:'case:example',kind:'case',lang:'zh',images:[],cover:{source:'approved-source.png',websiteUrl:'/assets/cases/example.png'}};
  await assert.rejects(()=>projectSource({data:{cover:'other.png',websiteCoverUrl:record.cover.websiteUrl},body:'Body'},record),/封面授权/);
  await assert.rejects(()=>projectSource({data:{cover:record.cover.source,websiteCoverUrl:'/assets/cases/other.png'},body:'Body'},record),/封面授权/);
});
test('public source hash is LF canonical without trimming code or normalizing Unicode',()=>{
  const text='---\nvalue: 中文\n---\n\n```\n code  \n```\n';
  assert.equal(canonicalTextHash(text),canonicalTextHash(text.replaceAll('\n','\r\n')));
  assert.notEqual(canonicalTextHash(text),canonicalTextHash(text.trim()));
});
function chapterFixture(t,{filename='001-Setup.md',order=1}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'chapter-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');
  const put=(base,relative,raw)=>{const file=path.join(base,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,raw);};
  for(const dir of ['001-作品','002-案例','003-博客','004-文档'])fs.mkdirSync(path.join(vault,'网站',dir),{recursive:true});
  const work={id:'work:tool',kind:'work',lang:'zh',slug:'tool',source:'网站/001-作品/001-Utility/01-Tool/README.md',output:'works/content/zh/tool.md'};
  const docPage={work:'tool',group:'start',slug:'setup',order};
  const entry={id:'doc:tool:setup',type:'doc',slug:'tool-setup',translationKey:'doc:tool:setup',docPage,legacyRoutes:[]};
  const record={id:entry.id,kind:'doc',lang:'zh',slug:entry.slug,translationKey:entry.translationKey,source:work.source.replace('README.md',`001-Start/${filename}`),output:'docs/content/zh/tool-setup.md',sourceMetadata:{media:['private-image.png']}};
  const manifest={entries:[{id:work.id,type:'work',slug:work.slug,legacyRoutes:['/works/tool/']},entry],docGroups:{tool:[{id:'start',order:1}]}};
  const sync=()=>put(site,'src/import/000-sync.local',sourceText({version:1,primary:'zh',records:[work,record]},''));
  sync();put(site,'src/build/manifest.json',JSON.stringify(manifest));
  put(vault,work.source,sourceText({slug:work.slug},'Work\n'));
  put(site,'src/'+work.output,sourceText({slug:work.slug},'Work\n'));
  const metadata={slug:record.slug,sitePublish:true,tags:['Setup']};
  const writeChapter=(data=metadata,body='Chapter\n')=>put(vault,record.source,sourceText(data,body));
  writeChapter();
  return {site,vault,record,entry,metadata,sync,writeChapter,run:options=>importContent({site,vault,...options}),read:()=>fs.readFileSync(path.join(site,'src',record.output),'utf8'),putDraft:data=>put(vault,record.source.replace('001-Setup.md','002-Private.md'),sourceText(data,'Private\n'))};
}

test('flat minimal chapter imports public metadata and remains outside standalone taxonomy',async t=>{
  const fixture=chapterFixture(t);
  await fixture.run({only:[fixture.record.id]});
  const raw=fixture.read(),{data,body}=parseSource(raw);
  assert.deepEqual(data,{title:'Setup',type:'doc',...fixture.metadata,draft:false,workIds:['tool'],docPage:fixture.entry.docPage,documentKind:'product-manual',websiteRoute:'/zh/works/tool/docs/setup/',lang:'zh',translationKey:fixture.record.id});
  assert.equal(body,'Chapter\n');assert.doesNotMatch(raw,/sourceMetadata|private-image/);
  const taxonomy=await fixture.run({taxonomyOnly:true,check:true});
  assert.deepEqual(taxonomy.differences,['build/taxonomy.json']);
  await fixture.run({taxonomyOnly:true});
  const snapshot=JSON.parse(fs.readFileSync(path.join(fixture.site,'src/build/taxonomy.json'),'utf8'));
  assert.equal(snapshot.sections.doc,undefined);
  assert.deepEqual(snapshot.sections.work.categories[0].entities,['work:tool']);
  fixture.writeChapter(data);
  assert.deepEqual((await fixture.run({only:[fixture.record.id],check:true})).differences,['src/import/000-sync.local']);
});

test('dated chapter imports its full date as the public title and keeps its route',async t=>{
  const fixture=chapterFixture(t,{filename:'2024-02-29.md',order:79759771});
  await fixture.run({only:[fixture.record.id]});
  const {data}=parseSource(fixture.read());
  assert.equal(data.title,'2024-02-29');
  assert.equal(data.docPage.order,79759771);
  assert.equal(data.websiteRoute,'/zh/works/tool/docs/setup/');
});

test('chapter import and taxonomy refuse conflicting legacy fields and unpublished minimal sources',async t=>{
  const fixture=chapterFixture(t);
  for(const [key,value] of Object.entries({title:'Other',type:'blog',documentKind:'other',draft:true,workIds:['other'],websiteRoute:'/zh/docs/wrong/',docPage:{...fixture.entry.docPage,order:2},lang:'en',translationKey:'other',slug:'other',sitePublish:false})){
    fixture.writeChapter({...fixture.metadata,[key]:value});
    for(const options of [{only:[fixture.record.id],check:true},{taxonomyOnly:true,check:true}])await assert.rejects(()=>fixture.run(options),/章节同步发布权限或身份不符/,key);
  }
});

test('work chapter cannot fall back to standalone import when its chapter registration disappears',async t=>{
  const fixture=chapterFixture(t),only=[fixture.record.id];
  await fixture.run({only});
  const raw=fixture.read(),manifestFile=path.join(fixture.site,'src/build/manifest.json');
  const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  const entry=manifest.entries.find(entry=>entry.id===fixture.record.id);
  delete entry.docPage;entry.legacyRoutes=['/docs/tool-setup/'];manifest.docGroups={};
  fs.writeFileSync(manifestFile,JSON.stringify(manifest));
  for(const options of [{only,check:true},{only},{taxonomyOnly:true,check:true}])await assert.rejects(()=>fixture.run(options),/章节来源登记缺失/);
  assert.equal(fixture.read(),raw);

  const original=path.join(fixture.vault,fixture.record.source);
  fixture.record.source='网站/004-文档/001-Manuals/001-Setup.md';
  fs.mkdirSync(path.dirname(path.join(fixture.vault,fixture.record.source)),{recursive:true});
  fs.renameSync(original,path.join(fixture.vault,fixture.record.source));
  fixture.sync();fixture.writeChapter({title:'Standalone',type:'doc',...fixture.metadata});
  await fixture.run({only});
  assert.equal(parseSource(fixture.read()).data.title,'Standalone');
  await fixture.run({taxonomyOnly:true,check:true});
});

test('flat unregistered chapter requires both private draft flags',async t=>{
  const fixture=chapterFixture(t);
  fixture.putDraft({draft:true,sitePublish:false});
  await fixture.run({taxonomyOnly:true,check:true});
  for(const data of [{draft:true},{sitePublish:false},{draft:true,sitePublish:true}]){
    fixture.putDraft(data);await assert.rejects(()=>fixture.run({taxonomyOnly:true,check:true}),/未登记分类来源/);
  }
});

test('frozen chapter allows its original projection and rejects changed projection in check and import',async t=>{
  const fixture=chapterFixture(t);
  const data={title:'Setup',type:'doc',slug:fixture.record.slug,draft:false,sitePublish:true,tags:['Setup'],workIds:['tool'],docPage:fixture.entry.docPage,documentKind:'product-manual',websiteRoute:'/zh/works/tool/docs/setup/',lang:'zh',translationKey:fixture.record.id};
  const frozen=sourceText(data,'Chapter\n');
  fixture.record.frozenProjectionSha256=canonicalTextHash(frozen);fixture.sync();
  await fixture.run({only:[fixture.record.id]});assert.equal(fixture.read(),frozen);
  await fixture.run({taxonomyOnly:true,check:true});
  fixture.writeChapter(fixture.metadata,'Changed\n');
  for(const check of [true,false])await assert.rejects(()=>fixture.run({only:[fixture.record.id],check}),/冻结投影/);
  assert.equal(fixture.read(),frozen);
});

test('import refuses full foreign frontmatter drift and unknown media before any writes',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'public-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');fs.mkdirSync(path.join(site,'src/en'),{recursive:true});fs.mkdirSync(path.join(vault,'网站'),{recursive:true});
  const foreign='---\nlang: en\ntitle: Original\n---\n\nBody\n',primary='---\ntitle: Source\ndraft: false\n---\n\nBody\n';
  fs.writeFileSync(path.join(site,'src/en/example.md'),foreign.replace('Original','Changed'));fs.writeFileSync(path.join(vault,'primary.md'),primary);
  const sync={version:1,primary:'zh',records:[{id:'blog:example',kind:'blog',lang:'zh',source:'primary.md',output:'zh/example.md',images:[]}],foreignFingerprints:{'en/example.md':sha(foreign)}};
  fs.mkdirSync(path.join(site,'src/build'),{recursive:true});fs.writeFileSync(path.join(site,'src/build/manifest.json'),JSON.stringify({entries:[{id:'blog:example',legacyRoutes:['/blog/example/']}]}));
  fs.mkdirSync(path.join(site,'src/import'),{recursive:true});
  fs.writeFileSync(path.join(site,'src/import/000-sync.local'),'---\n'+JSON.stringify(sync)+'\n---\n');
  await assert.rejects(()=>importContent({site,vault}),/外语.*人工修改/);
  assert.equal(fs.existsSync(path.join(site,'src/zh/example.md')),false);
  fs.writeFileSync(path.join(site,'src/en/example.md'),foreign);fs.writeFileSync(path.join(vault,'primary.md'),primary+'\n![unknown](unknown.png)\n');
  await assert.rejects(()=>importContent({site,vault}),/媒体/);
  assert.equal(fs.existsSync(path.join(site,'src/zh/example.md')),false);
});

test('missing project local config rejects without falling back to Obsidian or writing output',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'local-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');fs.mkdirSync(path.join(vault,'网站'),{recursive:true});fs.mkdirSync(site);
  fs.writeFileSync(path.join(vault,'网站/000-sync.md'),'---\nversion: 1\nprimary: zh\nrecords: []\n---\n');
  await assert.rejects(()=>importContent({site,vault}),/同步配置缺失/);assert.deepEqual(fs.readdirSync(site),[]);
});

test('taxonomy-only does not project body or change sync fingerprints',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'taxonomy-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');
  fs.mkdirSync(path.join(site,'src/import'),{recursive:true});fs.mkdirSync(path.join(site,'src/build'),{recursive:true});
  fs.mkdirSync(path.join(vault,'网站/003-博客/001-UE开发'),{recursive:true});
  for(const dir of ['001-作品','002-案例','004-文档'])fs.mkdirSync(path.join(vault,'网站',dir),{recursive:true});
  const source='网站/003-博客/001-UE开发/001-Example.md';
  fs.mkdirSync(path.join(site,'src/blog/content/zh'),{recursive:true});fs.writeFileSync(path.join(site,'src/blog/content/zh/example.md'),'---\ncategoryId: ue\ncategoryName: UE\n---\nPublic body');
  fs.writeFileSync(path.join(vault,source),'---\nslug: example\ntitle: Private title\n---\n\n<img src="private.png">');
  const config={version:1,primary:'zh',records:[{id:'blog:example',kind:'blog',slug:'example',lang:'zh',source,output:'blog/content/zh/example.md',sourceFingerprint:'historical'}]};
  const raw='---\n'+JSON.stringify(config)+'\n---\n';fs.writeFileSync(path.join(site,'src/import/000-sync.local'),raw);
  fs.writeFileSync(path.join(site,'src/build/manifest.json'),JSON.stringify({entries:[{id:'blog:example',type:'blog',slug:'example',legacyRoutes:['/blog/example/']}]}));
  const result=await importContent({site,vault,taxonomyOnly:true});
  assert.equal(result.files,1);assert.equal(fs.readFileSync(path.join(site,'src/import/000-sync.local'),'utf8'),raw);
  const snapshot=JSON.parse(fs.readFileSync(path.join(site,'src/build/taxonomy.json'),'utf8'));
  assert.equal(snapshot.sections.blog.categories[0].name,'UE开发');assert.deepEqual(snapshot.sections.blog.categories[0].entities,['blog:example']);
  assert.doesNotMatch(JSON.stringify(snapshot),/Private title|private.png|sourceFingerprint|网站\//);
});
for(const kind of ['page','common'])test(`retired ${kind} records reject before any output writes`,async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'retired-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');fs.mkdirSync(path.join(site,'src/import'),{recursive:true});fs.mkdirSync(vault);
  const config={version:1,primary:'zh',records:[{id:kind==='page'?'page:home':'site-copy',kind,lang:'zh',source:'missing.md',output:'zh/missing.md'}]};
  fs.writeFileSync(path.join(site,'src/import/000-sync.local'),'---\n'+JSON.stringify(config)+'\n---\n');
  await assert.rejects(()=>importContent({site,vault}),/页面与公共文案.*仓库/);assert.equal(fs.existsSync(path.join(site,'src/zh')),false);
});
