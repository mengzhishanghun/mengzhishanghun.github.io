import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {walk,attrs} from './extract-dom.mjs';
import {buildSite,preflight} from './build.mjs';
import * as builder from './build.mjs';
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
  for(const image of nodes.filter(n=>n.tagName==='img'&&attrs(n).src?.startsWith('/media/reprints/'))){
   let link=image.parentNode;while(link&&link.tagName!=='a')link=link.parentNode;
   assert.ok(link,'each reprint image must be the enlargement action itself');
   assert.equal(attrs(link).href,attrs(image).src,'clicking the image must not navigate to X');
   assert.ok(Object.hasOwn(attrs(link),'data-media-image'),'use the shared blog image viewer');
   assert.equal(attrs(link)['data-media-src'],attrs(image).src);
  }
  const backs=nodes.filter(n=>['article-back','outline-mobile-back'].includes(attrs(n).class));
  assert.equal(backs.length,2);
  for(const n of backs){const first=validated.entries.find(e=>e.id==='page:blog-index').taxonomy.categories[0].id;assert.equal(attrs(n).href,'/zh/blog/?category='+encodeURIComponent(first));assert.equal(attrs(n)['data-fixed-return'],undefined);assert.equal(attrs(n)['aria-label'],'返回');assert.equal(JSON.parse(attrs(n)['data-return-policy']).skipCache,true);}
  assert.equal(nodes.some(n=>(attrs(n).class||'').split(/\s+/).includes('note-hero')),false);
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


test('reprint shell removes the extra hero and leaves both standard return controls intact',async()=>{
 const {loadReprints,reprintTemplate}=await import('../blog/reprints.mjs');const entry=loadReprints({site})[0];
 const template=fs.readFileSync(path.join(site,'src',entry.template),'utf8'),html=reprintTemplate(template,entry,value=>value);
 const controls=markup=>{const result=[];walk(parse(markup,{sourceCodeLocationInfo:true}),node=>{if(['article-back','outline-mobile-back'].includes(attrs(node).class)){const loc=node.sourceCodeLocation;result.push(markup.slice(loc.startOffset,loc.endOffset));}});return result;};
 assert.deepEqual(controls(html),controls(template));
 const nodes=[];walk(parse(html),node=>nodes.push(node));assert.equal(nodes.some(n=>(attrs(n).class||'').split(/\s+/).includes('note-hero')),false);
});
function returnFixture(){return [{id:'page:blog-index',legacyRoutes:['/blog/'],taxonomy:{categories:[{id:'first',entities:['blog:first']},{id:'second',entities:['blog:member']}],legacyQueries:{old:{entities:['blog:member']},unrelated:{entities:['blog:first']}}}}];}
test('return projection derives membership, first-category order and compatible historical queries',()=>{
 assert.equal(typeof builder.articleReturnTarget,'function');const entries=returnFixture();
 assert.deepEqual(builder.articleReturnTarget({id:'blog:member'},'/zh/blog/','zh',entries),{href:'/zh/blog/?category=second',policy:{path:'/zh/blog/',firstCategory:'first',compatibleCategories:['second','old'],skipCache:false}});
 const unlisted={id:'reprint:other'};assert.equal(builder.articleReturnTarget(unlisted,'/zh/blog/','zh',entries).href,'/zh/blog/?category=first');
 entries[0].taxonomy.categories.reverse();const projected=builder.articleReturnTarget(unlisted,'/zh/blog/','zh',entries);assert.equal(projected.href,'/zh/blog/?category=second');assert.deepEqual(projected.policy.compatibleCategories,[]);assert.equal(projected.policy.skipCache,true);
});
test('return projection preserves explicit and non-list destinations, refuses ambiguity and handles empty lists',()=>{
 assert.equal(typeof builder.articleReturnTarget,'function');const entries=returnFixture(),entry={id:'blog:member'};
 for(const href of ['/zh/blog/?category=old&q=explicit#cards','/zh/blog/#outline','/zh/works/tool/'])assert.deepEqual(builder.articleReturnTarget(entry,href,'zh',entries),{href});
 assert.throws(()=>builder.articleReturnTarget(entry,'/zh/blog/','zh',[]),/返回列表/);
 entries[0].taxonomy.categories[0].entities.push(entry.id);assert.throws(()=>builder.articleReturnTarget(entry,'/zh/blog/','zh',entries),/多个分类/);
 entries[0].taxonomy.categories=[];const result=builder.articleReturnTarget(entry,'/zh/blog/','zh',entries);assert.equal(result.href,'/zh/blog/');assert.equal(result.policy.firstCategory,null);assert.equal(result.policy.skipCache,true);
});

test('generated public article and reprint returns carry category policies without extra reprint chrome',async()=>{
 const {projectPublication}=await import('./publication.mjs'),validated=preflight({site,manifest}),published=projectPublication({...validated,site,redirects:manifest.redirects}).entries;
 const output=path.join(site,process.env.SITE_OUTPUT||'dist/site');
 const types={blog:'blog',work:'works',case:'cases'};
 for(const entry of [...published.filter(e=>Object.hasOwn(types,e.type)),...validated.reprints])for(const locale of entry.languageCodes){
  const html=fs.readFileSync(path.join(output,builder.localeRoute(entry,locale).slice(1),'index.html'),'utf8'),nodes=[];walk(parse(html),node=>nodes.push(node));
  const backs=nodes.filter(n=>['article-back','outline-mobile-back'].includes(attrs(n).class));assert.equal(backs.length,2,entry.id);
  const index=published.find(e=>e.id==='page:'+types[entry.type]+'-index'),categories=index.taxonomy.categories,member=categories.find(c=>c.entities.includes(entry.id)),expected=member?.id??categories[0]?.id;
  for(const back of backs){const a=attrs(back),url=new URL(a.href,'https://mzsh.me');assert.equal(url.pathname,'/'+locale+'/'+types[entry.type]+'/');assert.equal(url.searchParams.get('category'),expected??null);assert.equal(a['aria-label'],locale==='zh'?'返回':'Back');assert.equal(a['data-fixed-return'],undefined);
   const policy=JSON.parse(a['data-return-policy']);assert.deepEqual(Object.keys(policy).sort(),['compatibleCategories','firstCategory','path','skipCache']);assert.equal(policy.path,url.pathname);assert.equal(policy.firstCategory,categories[0]?.id??null);assert.equal(policy.skipCache,!member);assert.equal(policy.compatibleCategories.includes(member?.id),!!member);
  }
  if(entry.original)assert.equal(nodes.some(n=>(attrs(n).class||'').split(/\s+/).includes('note-hero')),false);
 }
});
