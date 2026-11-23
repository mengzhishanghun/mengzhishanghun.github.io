import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {preflight} from './build.mjs';
import {generatedPage} from './interaction-fixtures.mjs';
import {projectTaxonomy} from './taxonomy.mjs';
const site=new URL('../../',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
test('taxonomy refuses a missing snapshot instead of dropping category controls',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'missing-taxonomy-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  assert.throws(()=>projectTaxonomy({site:root,entries:[],config:{primary:'zh',languages:[]},copy:{}}),/分类快照缺失/);
});
for(const type of ['work','case','blog','doc'])test(`taxonomy refuses a missing ${type} section before projecting any entity`,()=>{
  const taxonomy=JSON.parse(fs.readFileSync(new URL('./taxonomy.json',import.meta.url))),entries=[{id:'work:example',type:'work',slug:'example'}];delete taxonomy.sections[type];
  assert.throws(()=>projectTaxonomy({site,entries,config:{primary:'zh',languages:[]},copy:{},taxonomy}),/分类分区缺失/);
  assert.equal(entries[0].projectedCategory,undefined);
});
test('OB category projection covers every entity once, preserves empty categories and old query sets',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
  const {entries}=preflight({site,manifest});
  const snapshot=JSON.parse(fs.readFileSync(new URL('./taxonomy.json',import.meta.url)));
  for(const [type,section]of Object.entries(snapshot.sections)){
    const index=entries.find(e=>e.id==='page:'+({work:'works',case:'cases',blog:'blog'}[type])+'-index');
    assert.deepEqual(index.taxonomy.categories.map(c=>({id:c.id,name:c.name,entities:c.entities})),section.categories.map(c=>({id:c.id,name:c.name,entities:c.entities})));
    const ids=index.taxonomy.categories.flatMap(c=>c.entities);assert.equal(new Set(ids).size,ids.length);
    assert.deepEqual([...ids].sort(),entries.filter(e=>e.type===type).map(e=>e.id).sort());
    for(const item of entries.filter(e=>e.type===type)){assert.ok(item.projectedCategory.zh.name);assert.ok(item.projectedCategory.en.name);}
  }
  const blog=entries.find(e=>e.id==='page:blog-index').taxonomy;
  for(const [id,query]of Object.entries(snapshot.sections.blog.legacyQueries))assert.deepEqual(blog.legacyQueries[id].entities,query.entities);
  assert.notEqual(blog.categories.find(c=>c.name==='C++').id,'cpp');
  assert.equal(entries.find(e=>e.id==='work:shaniu').projectedCategory.zh.name,'AI工具');
  assert.ok(entries.filter(entry=>entry.type==='doc').every(entry=>entry.docPage));
  assert.equal(snapshot.legacyOnly.length,0);assert.doesNotMatch(JSON.stringify(snapshot),/sourceFingerprint|publishedFingerprint|[A-Z]:[\\/]|网站\//);
});

test('category projection retains an empty category without creating an entity',()=>{
  const original=preflight({site,manifest:JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)))}),taxonomy=JSON.parse(fs.readFileSync(new URL('./taxonomy.json',import.meta.url)));
  const section=taxonomy.sections.blog;section.categories.push({id:'empty',name:'Empty',order:Math.max(...section.categories.map(c=>c.order))+1,entities:[],supplements:[]});
  original.copy.en.scriptSlots['category:Empty']='Empty';projectTaxonomy({...original,site,taxonomy});
  assert.deepEqual(original.entries.find(e=>e.id==='page:blog-index').taxonomy.categories.at(-1).entities,[]);
});
test('generated work index uses the rendered card order in every category',()=>{
  for(const locale of ['zh','en']){const f=generatedPage(locale+'/works/index.html'),node=f.select('[data-content-index-data]'),records=JSON.parse(node.childNodes.map(n=>n.value||'').join(''));
    for(const record of records)assert.equal(record.order,Number(f.attrs(f.select('[data-slug="'+record.slug+'"]')).style.match(/order:\s*(\d+)/)[1]));
  }
});
test('taxonomy rejects missing translations, duplicate ownership and old-query collisions',()=>{
  const original=preflight({site,manifest:JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)))}),snapshot=JSON.parse(fs.readFileSync(new URL('./taxonomy.json',import.meta.url)));
  for(const [change,error]of [[(t,c)=>delete c.en.scriptSlots['category:UE开发'],/分类译名缺失/],[(t)=>t.sections.work.categories[1].entities.push(t.sections.work.categories[0].entities[0]),/实体缺失或重复/],[(t)=>t.sections.blog.categories.find(c=>c.name==='UE开发').id='cpp',/新旧分类ID集合冲突/]]){
    const taxonomy=structuredClone(snapshot),copy=structuredClone(original.copy);change(taxonomy,copy);assert.throws(()=>projectTaxonomy({...original,site,taxonomy,copy}),error);
  }
});
