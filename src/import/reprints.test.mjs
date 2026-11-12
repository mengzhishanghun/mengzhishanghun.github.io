import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {importContent,parseSource,sourceText} from './import.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const syncBody='本机中文手动同步配置；包含私有路径与媒体权限，禁止提交。\n';
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'reprint-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const site=path.join(root,'site'),vault=path.join(root,'vault');
 const put=(base,name,bytes)=>{const file=path.join(base,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);return file;};
 const media=Buffer.from('approved original image');
 const body='# Test\n\n<strong>Original</strong>\n\n[![Image](X%E5%8E%9F%E6%96%87/00.jpg)](https://example.test/)\n\n```text\n code  \n```\n';
 const raw='---\ntitle: "Test"\nauthor: "Writer"\nsource: "https://x.com/writer/status/123"\n---\n\n'+body;
 const note=raw.replace('---\n\n# Test','slug: guide\nwebsiteRoute: /zh/blog/reprints/guide/\nsitePublish: true\nvisibility: unlisted\nprivateNote: hidden\n---\n\n# Test').replace('X%E5%8E%9F%E6%96%87/00.jpg','%E9%99%84%E4%BB%B6/guide/00.jpg');
 const output=put(site,'src/blog/reprints/content/guide.md',raw),image=put(site,'src/blog/reprints/media/guide/00.jpg',media);
 const input=put(vault,'网站/005-转载/001-Guide.md',note),obImage=put(vault,'附件/guide/00.jpg',media);
 const reprint={id:'reprint:guide',source:'网站/005-转载/001-Guide.md',sourceFingerprint:hash(note),publishedFingerprint:hash(raw),images:[{source:'附件/guide/00.jpg',originalPath:'X原文/00.jpg',sha256:hash(media)}]};
 const publicManifest={version:1,entries:[{slug:'guide',lang:'zh',visibility:'unlisted',source:'content/guide.md',sha256:hash(raw),media:[{originalPath:'X原文/00.jpg',source:'media/guide/00.jpg',websiteUrl:'/media/reprints/guide/00.jpg',sha256:hash(media)}]}]};
 const reprintManifest=put(site,'src/blog/reprints/manifest.json',JSON.stringify(publicManifest,null,2)+'\n');
 const ordinary=sourceText({title:'Ordinary',lang:'zh'},'Ordinary body\n');
 const normalOutput=put(site,'src/blog/content/zh/ordinary.md',ordinary),normalInput=put(vault,'ordinary.md',ordinary);
 const config={version:1,primary:'zh',records:[{id:'blog:ordinary',kind:'blog',lang:'zh',source:'ordinary.md',output:'blog/content/zh/ordinary.md',images:[],publishedFingerprint:hash(ordinary),sourceFingerprint:hash(ordinary)}],reprints:[reprint]};
 const sync=put(site,'src/import/000-sync.local',sourceText(config,syncBody));
 put(site,'src/build/manifest.json',JSON.stringify({version:1,entries:[{id:'blog:ordinary',type:'blog',slug:'ordinary',legacyRoutes:['/blog/ordinary/']}]}));
 return {site,vault,config,sync,raw,note,input,output,image,obImage,normalInput,normalOutput,reprintManifest,save:()=>fs.writeFileSync(sync,sourceText(config,syncBody)),run:opts=>importContent({site,vault,...opts})};
}
function snapshot(root){return Object.fromEntries(fs.readdirSync(root,{withFileTypes:true}).flatMap(item=>{const file=path.join(root,item.name);return item.isDirectory()?Object.entries(snapshot(file)).map(([key,value])=>[item.name+'/'+key,value]):[[item.name,fs.readFileSync(file).toString('base64')]];}));}
test('reprint-only check is zero write; body edits join the existing transaction and repeat without differences',async t=>{
 const x=fixture(t);fs.writeFileSync(x.input,x.note.replace('Original','Edited'));
 const before=snapshot(x.site),checked=await x.run({only:['reprint:guide'],check:true});
 assert.ok(checked.differences.includes('src/blog/reprints/content/guide.md'));assert.deepEqual(snapshot(x.site),before);
 await x.run({only:['reprint:guide']});assert.equal(fs.readFileSync(x.output,'utf8'),x.raw.replace('Original','Edited'));
 assert.deepEqual((await x.run({only:['reprint:guide'],check:true})).differences,[]);
 assert.equal(JSON.parse(fs.readFileSync(x.reprintManifest)).entries[0].sha256,hash(fs.readFileSync(x.output)));
 assert.doesNotMatch(fs.readFileSync(x.output,'utf8'),/privateNote|sitePublish|websiteRoute|附件/);
});
test('default selection imports both groups; exact selectors isolate each group and reject unknown or approval selectors',async t=>{
 const x=fixture(t);fs.writeFileSync(x.input,x.note.replace('Original','Changed'));fs.writeFileSync(x.normalInput,fs.readFileSync(x.normalInput,'utf8').replace('Ordinary body','Ordinary changed'));
 await x.run({only:['blog:ordinary']});assert.equal(fs.readFileSync(x.output,'utf8'),x.raw);
 await x.run({});assert.match(fs.readFileSync(x.output,'utf8'),/Changed/);
 await assert.rejects(()=>x.run({only:['reprint:unknown']}),/未知/);
 await assert.rejects(()=>x.run({only:['blog:ordinary','reprint:guide'],approveMedia:true}),/媒体审批/);
});
for(const [name,mutate,expected] of [
 ['stale public fingerprint',x=>{x.config.reprints[0].publishedFingerprint='0'.repeat(64);x.save();},/转载.*指纹/],
 ['changed public snapshot',x=>fs.appendFileSync(x.output,'manual'),/原文hash/],
 ['changed OB image',x=>fs.writeFileSync(x.obImage,'changed'),/转载.*媒体/],
 ['changed public image',x=>fs.writeFileSync(x.image,'changed'),/媒体hash/],
 ['unapproved image mapping',x=>{x.config.reprints[0].images[0].sha256='0'.repeat(64);x.save();},/转载.*媒体/],
 ['draft reprint',x=>fs.writeFileSync(x.input,x.note.replace('sitePublish: true','sitePublish: true\ndraft: true')),/草稿/],
 ['changed source identity',x=>fs.writeFileSync(x.input,x.note.replace('slug: guide','slug: other')),/转载.*身份/],
 ['unsafe HTML',x=>fs.appendFileSync(x.input,'\n<strong onclick="bad()">bad</strong>'),/HTML/],
 ['unknown local link',x=>fs.appendFileSync(x.input,'\n[private](private.md)'),/本地链接/],
 ['unknown image',x=>fs.appendFileSync(x.input,'\n![new](new.jpg)'),/媒体/],
 ['source traversal',x=>{x.config.reprints[0].source='../outside.md';x.save();},/路径/],
 ['symbolic image directory',x=>{fs.mkdirSync(path.join(x.vault,'actual'));fs.copyFileSync(x.obImage,path.join(x.vault,'actual/00.jpg'));fs.symlinkSync(path.join(x.vault,'actual'),path.join(x.vault,'linked'),'junction');x.config.reprints[0].images[0].source='linked/00.jpg';x.save();fs.writeFileSync(x.input,x.note.replace('%E9%99%84%E4%BB%B6/guide/00.jpg','linked/00.jpg'));},/符号链接/]
])test(`reprints reject ${name} before any mixed-batch write`,async t=>{
 const x=fixture(t);fs.writeFileSync(x.normalInput,fs.readFileSync(x.normalInput,'utf8').replace('Ordinary body','Edit pending'));mutate(x);const before=snapshot(x.site);
 await assert.rejects(()=>x.run({}),expected);assert.deepEqual(snapshot(x.site),before);
});
test('a late private write failure restores mixed outputs in reverse order',async t=>{
 const x=fixture(t);fs.writeFileSync(x.input,x.note.replace('Original','Edited'));fs.appendFileSync(x.normalInput,'\nEdited\n');
 const before=snapshot(x.site),write=fs.writeFileSync,written=[],restored=[];let failed=false;
 fs.writeFileSync=function(file,...args){if(file===x.sync&&!failed){failed=true;throw Error('injected private failure');}if(failed)restored.push(file);else written.push(file);return write.call(this,file,...args);};
 try{await assert.rejects(()=>x.run({}),/injected private failure/);}finally{fs.writeFileSync=write;}
 assert.deepEqual(snapshot(x.site),before);assert.deepEqual(restored,[x.sync,...written.reverse()]);
});
test('AST media projection preserves image syntax and code examples across import and public loading',async t=>{
 const x=fixture(t),old='[![Image](X%E5%8E%9F%E6%96%87/00.jpg)](https://example.test/)',rich='[![alt \\[x\\]](<X%E5%8E%9F%E6%96%87/00.jpg>  \'title\')](https://example.test/)',example='\n```md\n![example](private-example.png)\n```\n';
 const publicRaw=x.raw.replace(old,rich)+example;
 fs.writeFileSync(x.output,publicRaw);
 const manifest=JSON.parse(fs.readFileSync(x.reprintManifest));manifest.entries[0].sha256=hash(publicRaw);fs.writeFileSync(x.reprintManifest,JSON.stringify(manifest,null,2)+'\n');
 x.config.reprints[0].publishedFingerprint=hash(publicRaw);x.save();
 const note=x.note.replace('[![Image](%E9%99%84%E4%BB%B6/guide/00.jpg)](https://example.test/)',rich.replace('X%E5%8E%9F%E6%96%87/00.jpg','%E9%99%84%E4%BB%B6/guide/00.jpg'))+example;
 fs.writeFileSync(x.input,note.replace('Original','Edited'));
 await x.run({only:['reprint:guide']});
 assert.equal(fs.readFileSync(x.output,'utf8'),publicRaw.replace('Original','Edited'));
 const {loadReprints}=await import('../blog/reprints.mjs');assert.equal(loadReprints({site:x.site})[0].media.length,1);
 assert.deepEqual((await x.run({only:['reprint:guide'],check:true})).differences,[]);
});
test('private frontmatter comments are removed without changing the current public header',async t=>{
 const x=fixture(t);fs.writeFileSync(x.input,x.note.replace('title: "Test"','title: "Test" # private title memo').replace('privateNote: hidden','privateNote: hidden # private key memo'));
 await x.run({only:['reprint:guide']});assert.equal(fs.readFileSync(x.output,'utf8'),x.raw);
});
test('taxonomy-only leaves reprint sources and fingerprints untouched',async t=>{
 const x=fixture(t),relative='网站/003-博客/001-Notes/001-Ordinary.md';
 for(const dir of ['001-作品','002-案例','004-文档'])fs.mkdirSync(path.join(x.vault,'网站',dir),{recursive:true});
 fs.mkdirSync(path.dirname(path.join(x.vault,relative)),{recursive:true});
 fs.writeFileSync(path.join(x.vault,relative),sourceText({title:'Ordinary',lang:'zh',slug:'ordinary'},'Taxonomy body'));
 Object.assign(x.config.records[0],{source:relative,slug:'ordinary'});x.config.reprints[0].source='not-present.md';x.save();
 const before=fs.readFileSync(x.sync);await x.run({taxonomyOnly:true});assert.deepEqual(fs.readFileSync(x.sync),before);assert.equal(fs.readFileSync(x.output,'utf8'),x.raw);
});
test('image references remain unsupported and ordinary content still refuses strong HTML',async t=>{
 const x=fixture(t);fs.appendFileSync(x.input,'\n![reference][pic]\n\n[pic]: %E9%99%84%E4%BB%B6/guide/00.jpg\n');
 await assert.rejects(()=>x.run({only:['reprint:guide']}),/媒体引用/);
 const {projectSource}=await import('./import.mjs');await assert.rejects(()=>projectSource({data:{title:'Test'},body:'<strong>text</strong>'},{id:'blog:ordinary',kind:'blog',lang:'zh',images:[]}),/原始HTML/);
});
