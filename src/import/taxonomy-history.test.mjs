import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createTaxonomy} from './taxonomy.mjs';
import {projectTaxonomy} from '../build/taxonomy.mjs';
test('category moves preserve every earlier query and allocate a fresh ID when membership changes',t=>{
  const vault=fs.mkdtempSync(path.join(os.tmpdir(),'category-history-'));t.after(()=>fs.rmSync(vault,{recursive:true,force:true}));
  for(const root of ['001-作品','002-案例','003-博客','004-文档'])fs.mkdirSync(path.join(vault,'网站',root),{recursive:true});
  const manifest={entries:[{id:'work:one',type:'work',slug:'one'},{id:'work:two',type:'work',slug:'two'}]};
  const records=['one','two'].map(slug=>({id:'work:'+slug,kind:'work',lang:'zh',slug,translationKey:slug,output:'works/content/zh/'+slug+'.md',source:'网站/001-作品/001-Utility/'+slug+'.md'}));
  const previous={version:1,sections:Object.fromEntries(['work','case','blog','doc'].map(type=>[type,{categories:[],legacyQueries:{},entityOrder:[]}]))};
  previous.sections.work={categories:[{id:'old-utility',name:'Utility',order:1,entities:['work:one'],supplements:[]},{id:'old-writing',name:'Writing',order:2,entities:['work:two'],supplements:[]}],legacyQueries:{oldest:{name:'Earlier',entities:['work:two']},empty:{name:'Empty',entities:[]}},entityOrder:['work:two','work:one']};
  fs.mkdirSync(path.join(vault,'网站/001-作品/001-Utility'));for(const [i,r]of records.entries()){r.source=r.source.replace(/\/(one|two)\.md$/,'/00'+(i+1)+'-$1.md');fs.writeFileSync(path.join(vault,r.source),JSON.stringify({slug:r.slug}));}
  const generate=p=>createTaxonomy({site:vault,vault,config:{primary:'zh',records},manifest,parseSource:raw=>({data:JSON.parse(raw)}),previous:p});
  const first=generate(previous);assert.deepEqual(first.sections.work.legacyQueries['old-utility'].entities,['work:one']);assert.deepEqual(first.sections.work.legacyQueries['old-writing'].entities,['work:two']);assert.deepEqual(first.sections.work.legacyQueries.oldest.entities,['work:two']);assert.notEqual(first.sections.work.categories[0].id,'old-utility');assert.deepEqual(first.sections.work.entityOrder,['work:two','work:one']);
  const second=generate(first);assert.deepEqual(second.sections.work.legacyQueries['old-writing'].entities,['work:two']);assert.equal(second.sections.work.categories[0].id,first.sections.work.categories[0].id);assert.deepEqual(second.sections.work.legacyQueries.empty.entities,[]);
  assert.deepEqual(second,first,'unchanged source must produce an identical snapshot on the next generation');
  assert.deepEqual(previous.sections.work.categories[0].entities,['work:one']);assert.equal(previous.sections.work.legacyQueries['old-utility'],undefined);
  const project=taxonomy=>projectTaxonomy({site:vault,entries:structuredClone(manifest.entries),config:{primary:'zh',languages:[{code:'zh'}]},copy:{},taxonomy});assert.doesNotThrow(()=>project(second));
  const orphan=structuredClone(second);orphan.sections.work.legacyQueries.oldest.entities.push('work:missing');assert.throws(()=>project(orphan),/旧分类集合无效/);
});

function reprintCategoryFixture(t){
 const vault=fs.mkdtempSync(path.join(os.tmpdir(),'unlisted-category-'));t.after(()=>fs.rmSync(vault,{recursive:true,force:true}));
 for(const root of ['001-作品','002-案例','003-博客','004-文档'])fs.mkdirSync(path.join(vault,'网站',root),{recursive:true});
 const put=(relative,data)=>{const file=path.join(vault,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data));};
 const ordinary={id:'blog:public',kind:'blog',lang:'zh',slug:'public',source:'网站/003-博客/001-Notes/001-Public.md',output:'blog/public.md'};
 const reprint={id:'reprint:guide',source:'网站/003-博客/006-转载/001-Guide.md'};
 const metadata={slug:'guide',websiteRoute:'/zh/blog/reprints/guide/',sitePublish:true,visibility:'unlisted'};
 put(ordinary.source,{slug:'public'});put(reprint.source,metadata);
 const config={primary:'zh',records:[ordinary],reprints:[reprint]},manifest={entries:[{id:'blog:public',type:'blog',slug:'public'}]};
 const previous={version:1,sections:Object.fromEntries(['work','case','blog','doc'].map(type=>[type,{categories:[],legacyQueries:{},entityOrder:[]}]))};
 const run=()=>createTaxonomy({site:vault,vault,config,manifest,previous,parseSource:raw=>({data:JSON.parse(raw)})});
 return {vault,config,manifest,previous,metadata,put,run,reprint};
}
test('work README is classified while nested chapters are verified and excluded from categories',t=>{
 const x=reprintCategoryFixture(t),docPage={work:'tool',group:'start',slug:'setup',order:1};
 const work={id:'work:tool',slug:'tool',kind:'work',lang:'zh',source:'网站/001-作品/001-Utility/01-Tool/README.md',output:'works/tool.md'};
 const chapter={id:'doc:tool:setup',slug:'tool-setup',kind:'doc',lang:'zh',translationKey:'doc:tool:setup',source:'网站/001-作品/001-Utility/01-Tool/文档/001-Start/001-Setup.md',output:'docs/setup.md'};
 const data={docPage,title:'Setup',slug:chapter.slug,type:'doc',workIds:['tool'],sitePublish:true};
 x.manifest.entries.push({id:work.id,slug:'tool',type:'work'},{id:chapter.id,slug:chapter.slug,type:'doc',translationKey:chapter.translationKey,docPage});
 x.manifest.docGroups={tool:[{id:'start',order:1,titles:{zh:'Start'}}]};
 x.config.records.push(work,chapter);x.put(work.source,{slug:'tool'});x.put(chapter.source,data);
 assert.deepEqual(Object.keys(x.run().sections),['work','case','blog']);
 assert.deepEqual(x.run().sections.work.categories[0].entities,[work.id]);
 x.put(chapter.source,{...data,sitePublish:false});assert.throws(x.run,/发布权限/);
 x.put(chapter.source,data);
 const privateDraft=chapter.source.replace('001-Setup.md','002-Private.md');
 x.put(privateDraft,{title:'Private notes',draft:true,sitePublish:false});
 assert.deepEqual(Object.keys(x.run().sections),['work','case','blog']);
 x.put(privateDraft,{...data,draft:true});assert.throws(x.run,/未登记/);
 x.put(privateDraft,{...data,sitePublish:false});assert.throws(x.run,/未登记/);
 x.put(privateDraft,{draft:true,sitePublish:false});
 x.put('网站/001-作品/001-Utility/01-Tool/002-Outside.md',{draft:true,sitePublish:false});assert.throws(x.run,/未登记/);
});
test('registered unlisted blog sources omit only their direct category while retaining public and historical categories',t=>{
 const x=reprintCategoryFixture(t);x.previous.sections.blog.legacyQueries.empty={name:'Historical empty',entities:[]};
 const taxonomy=x.run();assert.deepEqual(taxonomy.sections.blog.categories.map(c=>c.name),['Notes']);
 assert.deepEqual(taxonomy.sections.blog.categories[0].entities,['blog:public']);assert.deepEqual(taxonomy.sections.blog.legacyQueries.empty.entities,[]);
 assert.equal(Object.values(taxonomy.sections.blog.legacyQueries).some(q=>q.name==='转载'),false);
});
for(const [name,mutate,expected] of [
 ['unknown source in hidden folder',x=>x.put('网站/003-博客/006-转载/002-Unknown.md',{visibility:'unlisted'}),/未登记/],
 ['ordinary record sharing hidden folder',x=>{const record={...x.config.records[0],id:'blog:mixed',slug:'mixed',source:'网站/003-博客/006-转载/002-Mixed.md',output:'blog/mixed.md'};x.config.records.push(record);x.manifest.entries.push({id:record.id,type:'blog',slug:'mixed'});x.put(record.source,{slug:'mixed'});},/混用/],
 ['duplicate registered source',x=>x.config.reprints.push({...x.reprint,id:'reprint:duplicate'}),/重复/],
 ['public category becoming hidden',x=>x.previous.sections.blog.categories.push({id:'old-reprints',name:'转载',order:6,entities:[],supplements:[]}),/公开分类/],
 ['historically public category becoming hidden',x=>{x.previous.sections.blog.legacyQueries.old={name:'转载',entities:[]};},/公开分类/],
 ['source with public visibility',x=>x.put(x.reprint.source,{...x.metadata,visibility:'public'}),/隐藏转载.*身份/],
 ['source with wrong stable route',x=>x.put(x.reprint.source,{...x.metadata,websiteRoute:'/zh/blog/guide/'}),/隐藏转载.*身份/],
 ['duplicate category number despite hidden status',x=>fs.mkdirSync(path.join(x.vault,'网站/003-博客/006-Other')),/编号或名称重复/]
])test(`unlisted taxonomy refuses ${name}`,t=>{const x=reprintCategoryFixture(t);mutate(x);assert.throws(x.run,expected);});
test('external reprints need not exist and absent reprint configuration preserves category behavior',t=>{
 const x=reprintCategoryFixture(t);fs.unlinkSync(path.join(x.vault,x.reprint.source));fs.rmdirSync(path.dirname(path.join(x.vault,x.reprint.source)));
 x.config.reprints=[{id:'reprint:external',source:'网站/005-转载/not-present.md'}];const external=x.run();
 delete x.config.reprints;assert.deepEqual(x.run(),external);assert.deepEqual(external.sections.blog.categories.map(c=>c.name),['Notes']);
});
test('bootstrap refuses hiding a category already published in the legacy index template',t=>{
 const x=reprintCategoryFixture(t),template=path.join(x.vault,'src/blog/templates/page--blog-index.html');
 fs.mkdirSync(path.dirname(template),{recursive:true});fs.writeFileSync(template,'<div data-content-group data-category="old-reprints" data-category-name="转载"></div>');
 const output=path.join(x.vault,'src/blog/public.md');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,'{}');
 assert.throws(()=>createTaxonomy({site:x.vault,vault:x.vault,config:x.config,manifest:x.manifest,parseSource:raw=>({data:JSON.parse(raw)})}),/公开分类/);
});


test('pending sources require exact local authorization without creating empty public categories or queries',t=>{
 const x=reprintCategoryFixture(t),source='网站/001-作品/006-Private/001-Unpublished.md';
 x.put(source,{draft:false,sitePublish:true});
 const file=path.join(x.vault,source),bytes=fs.readFileSync(file),sha256=createHash('sha256').update(bytes).digest('hex');
 x.previous.sections.work.legacyQueries.published={name:'Published empty',entities:[]};
 assert.throws(x.run,/未登记/);
 x.config.pendingSources=[{source,sha256}];
 const section=x.run().sections.work;
 assert.deepEqual(section.categories,[]);
 assert.deepEqual(section.legacyQueries,{published:{name:'Published empty',entities:[]}});
 fs.appendFileSync(file,'\n');assert.throws(x.run,/待发布.*摘要/);fs.writeFileSync(file,bytes);
 const renamed=file.replace('001-Unpublished','002-Unpublished');fs.renameSync(file,renamed);assert.throws(x.run,/待发布.*缺失/);fs.renameSync(renamed,file);
 x.config.pendingSources.push({source,sha256});assert.throws(x.run,/待发布.*重复/);x.config.pendingSources.pop();
 x.config.records.push({source});assert.throws(x.run,/待发布.*冲突/);x.config.records.pop();
 x.config.reprints.push({source});assert.throws(x.run,/待发布.*冲突/);x.config.reprints.pop();
 x.config.pendingSources=[{source:source.replace('006-Private/','../'),sha256}];assert.throws(x.run,/越界/);
 x.config.pendingSources=[{source,sha256}];x.put('网站/001-作品/006-Private/002-Unknown.md',{});assert.throws(x.run,/未登记/);
});
