import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {walk,attrs} from './extract-dom.mjs';
import {buildSite,preflight} from './build.mjs';
const site=path.resolve(import.meta.dirname,'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(site,'src/build/manifest.json')));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
test('unlisted reprints preserve source and images without entering public discovery',async t=>{
 const validated=preflight({site,manifest});
 assert.equal(validated.reprints?.length,2,'two independent reprints must be loaded');
 const output=fs.mkdtempSync(path.join(os.tmpdir(),'reprints-test-'));
 t.after(()=>{fs.rmSync(output,{recursive:true,force:true});fs.rmSync(output+'-registry.json',{force:true});});
 await buildSite({site,manifest,output,indexSearch:false,registryOutput:path.join(output,'../'+path.basename(output)+'-registry.json')});
 const registry=JSON.parse(fs.readFileSync(output+'-registry.json'));
 assert.equal(registry.articleIds.some(id=>id.startsWith('reprint:')),false);
 const publicHTML=fs.readFileSync(path.join(output,'zh/blog/markdown-publishing/index.html'),'utf8');
 const publicNodes=[];walk(parse(publicHTML),n=>publicNodes.push(n));
 assert.equal(Object.hasOwn(JSON.parse(publicNodes.find(n=>attrs(n)['data-engagement-config']!==undefined).childNodes[0].value),'likesEnabled'),false);
 let images=0;
 for(const entry of validated.reprints){
  assert.equal(digest(entry.sources.zh.bytes),entry.sha256);
  const html=fs.readFileSync(path.join(output,'zh/blog/reprints',entry.slug,'index.html'),'utf8');
  assert.match(html,/<meta name="robots" content="noindex">/);
  assert.match(html,/<strong>/);
  const nodes=[];walk(parse(html),n=>nodes.push(n));
  const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
  const sourceCode=[...entry.sources.zh.body.matchAll(/^```[^\n]*\n([\s\S]*?)^```[^\n]*$/gm)].map(m=>m[1].replace(/\r\n/g,'\n').trimEnd());
  assert.deepEqual(nodes.filter(n=>n.tagName==='pre').map(n=>text(n).trimEnd()),sourceCode,'all original code and prompt blocks must remain complete');
  assert.deepEqual(nodes.filter(n=>n.tagName==='img'&&attrs(n).src?.startsWith('/media/reprints/')).map(n=>attrs(n).src),entry.media.map(m=>m.websiteUrl));
  const backs=nodes.filter(n=>['article-back','outline-mobile-back'].includes(attrs(n).class));
  assert.equal(backs.length,2);
  for(const n of backs){assert.equal(attrs(n).href,'/zh/blog/');assert.equal(attrs(n)['data-fixed-return'],'');}
  const engagement=JSON.parse(nodes.find(n=>attrs(n)['data-engagement-config']!==undefined).childNodes[0].value);
  assert.equal(engagement.likesEnabled,false);
  const runtime=JSON.parse(nodes.find(n=>attrs(n)['data-site-language']!==undefined).childNodes[0].value);
  assert.deepEqual(Object.keys(runtime.urls),['zh']);
  assert.equal(runtime.fallback,'zh');
  assert.ok(nodes.some(n=>n.tagName==='h1'&&n.childNodes.some(c=>c.value===entry.sources.zh.data.title)));
  for(const media of entry.media){assert.equal(digest(fs.readFileSync(path.join(output,media.websiteUrl.slice(1)))),media.sha256);images++;}
  assert.equal(fs.existsSync(path.join(output,'en/blog/reprints',entry.slug,'index.html')),false);
 }
 assert.equal(images,32);
 for(const file of ['zh/index.html','zh/blog/index.html','en/blog/index.html','zh/blog/rss.xml','en/blog/rss.xml','sitemap.xml'])assert.doesNotMatch(fs.readFileSync(path.join(output,file),'utf8'),/\/blog\/reprints\//,file);
 assert.equal(fs.existsSync(path.join(output,'zh/blog/reprints/index.html')),false);
});
test('reprint manifest rejects incomplete media, changed originals, route collisions and traversal',async()=>{
 const {loadReprints}=await import('../blog/reprints.mjs');
 const data=JSON.parse(fs.readFileSync(path.join(site,'src/blog/reprints/manifest.json')));
 for(const [mutate,pattern] of [
  [x=>x.entries[0].media.pop(),/媒体/],
  [x=>x.entries[0].sha256='0'.repeat(64),/hash/],
  [x=>x.entries[0].source='../outside.md',/路径/],
  [x=>x.entries[0].media[0].websiteUrl='/media/../outside.jpg',/路径|媒体/]
 ]){const clone=structuredClone(data);mutate(clone);assert.throws(()=>loadReprints({site,manifest:clone,routes:new Map()}),pattern);}
 assert.throws(()=>loadReprints({site,manifest:data,routes:new Map([['/zh/blog/reprints/'+data.entries[0].slug+'/','existing']])}),/路由/);
});
test('reprint article accessibility names never refer to the borrowed template identity',async()=>{
 const {loadReprints,reprintTemplate}=await import('../blog/reprints.mjs');
 const entry=loadReprints({site})[0];
 const html=reprintTemplate(fs.readFileSync(path.join(site,entry.template.startsWith('src/')?entry.template:'src/'+entry.template),'utf8'),entry,value=>value);
 const nodes=[];walk(parse(html),node=>nodes.push(node));
 const article=nodes.find(node=>node.tagName==='article');
 assert.equal(attrs(article)['aria-labelledby'],undefined);
 assert.equal(attrs(article)['aria-label'],entry.sources.zh.data.title);
});
