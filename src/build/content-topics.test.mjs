import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {preflight} from './build.mjs';import {generatedPage} from './interaction-fixtures.mjs';
import {projectContentTopics} from './content-topics.mjs';
const site=new URL('../../',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'),manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
test('verified work and case projections use the approved themes and preserve source search terms',()=>{
  const {entries}=preflight({site,manifest});
  for(const [type,slug,zh,en]of [['work','simple-config-exclude',['数据与配置','开发与发布'],['Data & Configuration','Development & Release']],['case','driving-simulator-three-screen',['仿真与控制','渲染与显示'],['Simulation & Control','Rendering & Display']]]){
    const entry=entries.find(e=>e.type===type&&e.slug===slug);assert.deepEqual(entry.projectedTags?.zh?.tags,zh);assert.deepEqual(entry.projectedTags?.en?.tags,en);
    for(const locale of ['zh','en'])for(const word of [...entry.sources[locale].data.tags||[],...entry.sources[locale].data.searchTags||[]])assert.ok(entry.projectedTags[locale].searchTags.includes(word));
  }
});
for(const [route,count,topics]of [['works',24,8],['cases',10,7]])test(`${route} emits one or two public themes per card with shared aliases and all-tag display`,()=>{
  for(const locale of ['zh','en']){const f=generatedPage(`${locale}/${route}/index.html`),root=f.select('[data-content-index]'),node=f.select('[data-content-index-data]'),records=JSON.parse(node.childNodes.map(n=>n.value||'').join(''));assert.equal(records.length,count);assert.equal(new Set(records.flatMap(r=>r.tags)).size,topics);assert.equal(f.attrs(root)['data-content-tags-display'],'all');const aliases=JSON.parse(f.attrs(root)['data-content-topic-aliases']);assert.ok(Object.keys(aliases).length>=topics);
    for(const record of records){assert.ok(record.tags.length>=1&&record.tags.length<=2);const card=f.select(`[data-slug="${record.slug}"]`),legacy=f.attrs(card)['data-content-legacy-tags'];assert.ok(Array.isArray(JSON.parse(legacy)));const tags=f.nodes.find(n=>['.content-card-tags','.work-card-tags'].some(selector=>f.matches(n,selector))&&f.closest(n,'[data-content-card]')===card),text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');assert.deepEqual(tags.childNodes.filter(n=>n.tagName).map(text),record.tags);}
  }
});
test('generic work projection rejects missing mappings, missing labels and ambiguous legacy names',()=>{
  const original=preflight({site,manifest}),data=JSON.parse(fs.readFileSync(new URL('../works/topics.json',import.meta.url))),id='work:simple-config-exclude';
  for(const [change,message]of [[topics=>delete topics.articles[id],/映射缺失/],[(_topics,copy)=>delete copy.en.scriptSlots['work-topic:editor-assets'],/译名缺失/],[(_topics,copy)=>copy.en.scriptSlots['work-topic:editor-assets']=original.copy.zh.scriptSlots['work-topic:data-configuration'],/跨语别名冲突/],[(_topics,copy)=>copy.en.scriptSlots['work-topic:editor-assets']=original.entries.find(e=>e.id===id).sources.zh.data.tags[0],/同名集合冲突/]]){const topics=structuredClone(data),copy=structuredClone(original.copy);change(topics,copy);assert.throws(()=>projectContentTopics({site,entries:original.entries,config:original.config,copy,topics,type:'work',indexId:'page:works-index',topicsPath:'src/works/topics.json',labelPrefix:'work-topic'}),message);}
});
