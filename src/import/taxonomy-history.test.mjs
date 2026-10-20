import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
