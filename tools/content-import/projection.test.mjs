import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projectSource,importContent,canonicalTextHash} from './import.mjs';
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
test('import refuses full foreign frontmatter drift and unknown media before any writes',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'public-import-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const site=path.join(root,'site'),vault=path.join(root,'vault');fs.mkdirSync(path.join(site,'content/en'),{recursive:true});fs.mkdirSync(path.join(vault,'网站'),{recursive:true});
  const foreign='---\nlang: en\ntitle: Original\n---\n\nBody\n',primary='---\ntitle: Source\ndraft: false\n---\n\nBody\n';
  fs.writeFileSync(path.join(site,'content/en/example.md'),foreign.replace('Original','Changed'));fs.writeFileSync(path.join(vault,'primary.md'),primary);
  const sync={version:1,primary:'zh',records:[{id:'blog:example',kind:'blog',lang:'zh',source:'primary.md',output:'zh/example.md',images:[]}],foreignFingerprints:{'en/example.md':sha(foreign)}};
  fs.writeFileSync(path.join(vault,'网站/000-sync.md'),'---\n'+JSON.stringify(sync)+'\n---\n');
  await assert.rejects(()=>importContent({site,vault}),/外语.*人工修改/);
  assert.equal(fs.existsSync(path.join(site,'content/zh/example.md')),false);
  fs.writeFileSync(path.join(site,'content/en/example.md'),foreign);fs.writeFileSync(path.join(vault,'primary.md'),primary+'\n![unknown](unknown.png)\n');
  await assert.rejects(()=>importContent({site,vault}),/媒体/);
  assert.equal(fs.existsSync(path.join(site,'content/zh/example.md')),false);
});
