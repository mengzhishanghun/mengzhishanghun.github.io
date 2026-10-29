import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {attrs,walk} from './extract-dom.mjs';
import {projectImageViewers} from './media.mjs';
const api=await import('./project-gallery.mjs').catch(()=>({}));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('page-only builds do not require a project gallery registry',t=>{const site=fs.mkdtempSync(path.join(os.tmpdir(),'gallery-page-'));t.after(()=>fs.rmSync(site,{recursive:true,force:true}));assert.equal(api.loadProjectGalleries({site,entries:[{id:'page:home',type:'page'}],codes:['zh']}).size,0);});
function fixture(t){
  const site=fs.mkdtempSync(path.join(os.tmpdir(),'gallery-'));t.after(()=>fs.rmSync(site,{recursive:true,force:true}));
  fs.mkdirSync(path.join(site,'src/build'),{recursive:true});fs.writeFileSync(path.join(site,'src/hero.html'),'<figure class="project-hero-media"><img src="/media/hero.png" width="1600" height="800"></figure>');
  const files=['hero.png','detail.png','video.mp4'].map(name=>{fs.writeFileSync(path.join(site,name),name);return {source:name,outputs:['media/'+name],sha256:sha(name),mode:'frozen'};});
  fs.writeFileSync(path.join(site,'src/build/resources.json'),JSON.stringify({version:1,files}));
  fs.writeFileSync(path.join(site,'src/build/project-media-grants.json'),JSON.stringify({version:1,grants:[]}));
  const entry={id:'work:one',type:'work',template:'hero.html',sources:{zh:{data:{title:'示例',workInfo:{channels:[{kind:'sale',href:'https://www.fab.com/listings/one'}]}}}},mediaOccurrences:[{id:'work:one:media:1',state:'public',websiteUrl:'/media/detail.png',publicSha256:sha('detail.png')},{id:'work:one:media:2',state:'withheld'}]};
  return {site,entry,files,config:{version:1,labels:{zh:{cover:'封面示意图',image:'项目图片',video:'项目视频'}},galleries:[{entryId:entry.id,items:[{id:'cover',hero:true},{id:'detail',occurrenceId:'work:one:media:1'}]}]}};
}
test('gallery resolves only its own public images and preserves a single-image fallback',t=>{
  assert.equal(typeof api.loadProjectGalleries,'function','gallery loader exists');const x=fixture(t);
  const galleries=api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']});assert.equal(galleries.get('work:one').length,2);assert.equal(galleries.get('work:one')[1].websiteUrl,'/media/detail.png');
  const fallback=api.loadProjectGalleries({...x,config:{...x.config,galleries:[]},entries:[x.entry],codes:['zh']});assert.equal(fallback.get('work:one').length,1);assert.equal(fallback.get('work:one')[0].websiteUrl,'/media/hero.png');
});
function ownedFixture(t,type='case'){
  const x=fixture(t);x.entry.id=type+':one';x.entry.type=type;delete x.entry.sources.zh.data.workInfo;x.entry.mediaOccurrences.forEach(record=>{record.id=record.id.replace('work:',type+':');});x.config.galleries[0].entryId=x.entry.id;
  const grants=[{id:'image',entryId:x.entry.id,kind:'image',websiteUrl:'/media/detail.png',sha256:sha('detail.png'),basis:'owner-explicit-publication'},{id:'video',entryId:x.entry.id,kind:'video',websiteUrl:'/media/video.mp4',sha256:sha('video.mp4'),basis:'owner-explicit-publication'}];
  const poster={grantId:'image',width:640,height:480,alt:{zh:'界面'}};
  const image={id:'screenshot',grantId:'image',width:640,height:480,alt:{zh:'项目界面'}};
  const video={id:'demo',grantId:'video',alt:{zh:'项目演示'},poster};
  x.config.galleries[0].items=[{id:'cover',hero:true},image,video];
  const save=()=>fs.writeFileSync(path.join(x.site,'src/build/project-media-grants.json'),JSON.stringify({version:1,grants}));save();
  return {...x,grants,save,image,video,run:()=>api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']})};
}
test('cases and works without a Fab sale can publish explicitly granted images and one video',t=>{for(const type of ['case','work']){const x=ownedFixture(t,type),items=x.run().get(x.entry.id);assert.deepEqual(items.map(item=>item.kind),['image','image','video']);assert.equal(items[2].poster.websiteUrl,'/media/detail.png');const html=api.projectGallery('<figure class="project-hero-media"><img src="/media/hero.png"></figure>',x.entry,'zh',x.run());assert.match(html,/<video controls playsinline preload="none"/);assert.doesNotMatch(html,/autoplay/);}});
test('grant references reject missing authorization, cross-entry IDs, mixed sources and media type drift',t=>{
  const x=ownedFixture(t);for(const patch of [{grantId:'unknown'},{hero:true},{occurrenceId:x.entry.id+':media:1'},{sourcePage:'https://www.fab.com/listings/one'},{websiteUrl:'/media/detail.png'},{sha256:sha('detail.png')},{kind:'image'}]){x.config.galleries[0].items=[{...x.image,...patch}];assert.throws(x.run);}
  x.config.galleries[0].items=[x.image];x.grants[0].entryId='work:other';x.save();assert.throws(()=>api.loadProjectGalleries({...x,entries:[x.entry,{...x.entry,id:'work:other',type:'work'}],codes:['zh']}));x.grants[0].entryId=x.entry.id;x.grants[0].kind='video';x.save();assert.throws(x.run);
});
test('granted media require frozen exact bytes and valid unique grant records',t=>{
  const x=ownedFixture(t);for(const patch of [{basis:'resource-registered'},{privatePath:'secret'},{sha256:sha('wrong')}]){const original={...x.grants[0]};Object.assign(x.grants[0],patch);x.save();assert.throws(x.run);x.grants[0]=original;}
  x.grants.push({...x.grants[0]});x.save();assert.throws(x.run);x.grants.pop();x.save();x.files[1].mode='authored';fs.writeFileSync(path.join(x.site,'src/build/resources.json'),JSON.stringify({version:1,files:x.files}));assert.throws(x.run);x.files[1].mode='frozen';fs.writeFileSync(path.join(x.site,'src/build/resources.json'),JSON.stringify({version:1,files:x.files}));fs.writeFileSync(path.join(x.site,'detail.png'),'changed');assert.throws(x.run);
});
test('granted videos need a separately authorized image poster and share the single-video limit',t=>{
  const x=ownedFixture(t);for(const poster of [undefined,{websiteUrl:'/media/detail.png',width:640,height:480,alt:{zh:'界面'}},{grantId:'video',width:640,height:480,alt:{zh:'界面'}},{occurrenceId:x.entry.id+':media:2',width:640,height:480,alt:{zh:'界面'}}]){x.config.galleries[0].items=[{...x.video,poster}];assert.throws(x.run);}
  x.config.galleries[0].items=[{...x.video,poster:{occurrenceId:x.entry.id+':media:1',width:640,height:480,alt:{zh:'界面'}}}];assert.equal(x.run().get(x.entry.id)[0].poster.websiteUrl,'/media/detail.png');
  fs.writeFileSync(path.join(x.site,'second.mp4'),'second');x.files.push({source:'second.mp4',outputs:['media/second.mp4'],sha256:sha('second'),mode:'frozen'});fs.writeFileSync(path.join(x.site,'src/build/resources.json'),JSON.stringify({version:1,files:x.files}));x.grants.push({...x.grants[1],id:'second-video',websiteUrl:'/media/second.mp4',sha256:sha('second')});x.save();
  x.config.galleries[0].items=[x.video,{...x.video,id:'second',grantId:'second-video'}];assert.throws(x.run);
});
test('repeating an image under another ID does not fabricate a multi-image gallery',t=>{const x=fixture(t);x.config.galleries[0].items=[{id:'first',hero:true},{id:'second',hero:true}];assert.throws(()=>api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']}));});
test('enabled languages must each have gallery labels',t=>{const x=fixture(t);assert.throws(()=>api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh','fr']}));});
test('disabling a language preserves its existing gallery translations',t=>{const x=fixture(t);x.config.labels.en={cover:'Cover',image:'Image',video:'Video'};assert.equal(api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']}).get(x.entry.id).length,2);});
test('English gallery cover uses the translated title instead of the legacy Chinese media attribute',t=>{const x=fixture(t);x.config.labels.en={cover:'Cover illustration',image:'Project image',video:'Project video'};x.entry.sources.en={data:{title:'Example'}};const galleries=api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh','en']});const html=api.projectGallery('<figure class="project-hero-media"><a data-media-alt="中文旧标题"><img src="/media/hero.png"></a></figure>',x.entry,'en',galleries);assert.match(html,/data-media-alt="Example · Cover illustration"/);});
test('gallery rejects withheld, cross-entry, unknown fields, duplicate IDs and authored hash drift',t=>{
  assert.equal(typeof api.loadProjectGalleries,'function');const x=fixture(t),run=()=>api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']});
  for(const item of [{id:'x',occurrenceId:'work:one:media:2'},{id:'x',occurrenceId:'work:two:media:1'},{id:'x',hero:true,privatePath:'secret'},{id:'cover',hero:true}]){x.config.galleries[0].items=[{id:'cover',hero:true},item];assert.throws(run);}
  x.config.galleries[0].items=[{id:'x',occurrenceId:'work:one:media:1'}];x.files[1].mode='authored';fs.writeFileSync(path.join(x.site,'src/build/resources.json'),JSON.stringify({version:1,files:x.files}));fs.writeFileSync(path.join(x.site,'detail.png'),'drift');assert.throws(run);
});
test('external gallery assets require the matching sale page, frozen registration, exact hash and at most one video',t=>{
  assert.equal(typeof api.loadProjectGalleries,'function');const x=fixture(t),asset={id:'video',kind:'video',websiteUrl:'/media/video.mp4',sha256:sha('video.mp4'),sourcePage:'https://www.fab.com/listings/one',alt:{zh:'演示'},poster:{websiteUrl:'/media/detail.png',sha256:sha('detail.png'),sourcePage:'https://www.fab.com/listings/one',width:640,height:480,alt:{zh:'界面'}}};
  const run=()=>api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']});x.config.galleries[0].items=[asset];assert.equal(run().get(x.entry.id)[0].kind,'video');
  for(const patch of [{websiteUrl:'/media/../detail.png'},{websiteUrl:'/media/video.mp4?x'},{websiteUrl:'https://example.com/x'},{websiteUrl:'/media/missing.mp4'},{sha256:sha('wrong')},{sourcePage:'https://www.fab.com/listings/other'}]){x.config.galleries[0].items=[{...asset,...patch}];assert.throws(run);}
  x.config.galleries[0].items=[asset,{...asset,id:'two'}];assert.throws(run);
});
test('Fab localized sale URLs remain exact public-source authorizations',t=>{const x=fixture(t),sourcePage='https://www.fab.com/zh-cn/listings/one';x.entry.sources.zh.data.workInfo.channels[0].href=sourcePage;x.config.galleries[0].items=[{id:'screenshot',kind:'image',websiteUrl:'/media/detail.png',sha256:sha('detail.png'),sourcePage,width:640,height:480,alt:{zh:'界面'}}];assert.equal(api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']}).get(x.entry.id)[0].websiteUrl,'/media/detail.png');});
test('gallery projection retains surrounding content and never makes thumbnail buttons image-viewer anchors',t=>{
  assert.equal(typeof api.projectGallery,'function');const x=fixture(t),galleries=api.loadProjectGalleries({...x,entries:[x.entry],codes:['zh']});
  const html=api.projectGallery('<html><head></head><body><div>left</div><figure class="project-hero-media"><img src="/media/hero.png"></figure><article>body</article></body></html>',x.entry,'zh',galleries);
  assert.match(html,/<div>left<\/div>/);assert.match(html,/<article>body<\/article>/);assert.equal((html.match(/data-gallery-select=/g)||[]).length,2);assert.match(html,/data-media-image/);assert.doesNotMatch(html,/<button[^>]*>\s*<a/);
  const final=projectImageViewers(html,'zh');let thumbnails=0;walk(parse(final),node=>{if(attrs(node)['data-gallery-select']!==undefined){thumbnails++;walk(node,child=>assert.notEqual(child.tagName,'a'));}});assert.equal(thumbnails,2);
});
