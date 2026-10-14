import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {preflight} from './build.mjs';import {generatedPage} from './interaction-fixtures.mjs';
import {projectBlogTopics} from '../blog/topics.mjs';
const site=new URL('../../',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'),manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
const checked=()=>preflight({site,manifest});
test('verified blog projection supplies reviewed topics and retains source search vocabulary',()=>{
  const {entries}=checked(),entry=entries.find(e=>e.id==='blog:cnblogs-19136316');
  assert.deepEqual(entry.projectedTags?.zh?.tags,['动画与数字人','编辑器工具']);assert.deepEqual(entry.projectedTags?.en?.tags,['Animation & Digital Humans','Editor Tools']);
  for(const locale of ['zh','en'])for(const tag of [...entry.sources[locale].data.tags,...entry.sources[locale].data.searchTags || []])assert.ok(entry.projectedTags[locale].searchTags.includes(tag));
});
test('blog JSON and card labels share the projected topic labels',()=>{
  for(const locale of ['zh','en']){
    const index=generatedPage(`${locale}/blog/index.html`),node=index.select('[data-content-index-data]'),records=JSON.parse(node.childNodes.map(n=>n.value||'').join(''));
    assert.equal(records.length,48);for(const record of records){assert.ok(record.tags.length>=1&&record.tags.length<=2);const card=index.select(`[data-slug="${record.slug}"]`),legacy=index.attrs(card)['data-content-legacy-tags'];assert.ok(legacy);assert.ok(Array.isArray(JSON.parse(legacy)));const container=index.nodes.find(n=>index.matches(n,'.content-card-tags')&&index.closest(n,'[data-content-card]')===card),text=n=>n.nodeName==='#text'?n.value:(n.childNodes || []).map(text).join('');assert.deepEqual(container.childNodes.filter(n=>n.tagName).map(text),record.tags);}
    assert.equal(new Set(records.flatMap(r=>r.tags)).size,12);
  }
});
test('missing mapping, duplicate assignment, missing translation and old-name membership conflicts stop projection',()=>{
  const original=checked(),topics=JSON.parse(fs.readFileSync(new URL('../blog/topics.json',import.meta.url))),id='blog:cnblogs-19136316';
  for(const [change,message]of [
    [(data)=>delete data.articles[id],/映射缺失/],
    [(data)=>data.articles[id].topics=[data.articles[id].topics[0],data.articles[id].topics[0]],/映射缺失或重复/],
    [(_data,copy)=>delete copy.en.scriptSlots['blog-topic:animation-digital-humans'],/译名缺失/],
    [(_data,copy)=>copy.zh.scriptSlots['blog-topic:animation-digital-humans']=original.entries.find(e=>e.id===id).sources.zh.data.tags[0],/同名集合冲突/],
    [(_data,copy)=>copy.en.scriptSlots['blog-topic:animation-digital-humans']=original.copy.zh.scriptSlots['blog-topic:blueprints-reflection'],/跨语别名冲突/],
    [(_data,copy)=>copy.en.scriptSlots['blog-topic:animation-digital-humans']=original.entries.find(e=>e.id===id).sources.zh.data.tags[0],/同名集合冲突/]
  ]){const data=structuredClone(topics),copy=structuredClone(original.copy);change(data,copy);assert.throws(()=>projectBlogTopics({site,entries:original.entries,config:original.config,copy,topics:data}),message);}
});
test('built blog alias tables canonicalize both languages using stable topic identities',()=>{const data=JSON.parse(fs.readFileSync(new URL('../blog/topics.json',import.meta.url))),fixtures=Object.fromEntries(['zh','en'].map(locale=>[locale,generatedPage(`${locale}/blog/index.html`)]));for(const locale of ['zh','en']){const f=fixtures[locale],aliases=JSON.parse(f.attrs(f.select('[data-content-index]'))['data-content-topic-aliases']);for(const id of data.topics)for(const from of ['zh','en'])assert.equal(aliases[fixtures[from].copy['blog-topic:'+id]],f.copy['blog-topic:'+id]);}});
