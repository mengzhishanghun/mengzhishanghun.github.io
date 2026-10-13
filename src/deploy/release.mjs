import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {safeRelative,regularPath} from '../build/resources.mjs';
import {publicLanguageCodes} from '../analytics/inject.mjs';
const manifestPath='src/deploy/release-manifest.json',provenancePath='release-provenance.json';
const previews=new Set(['design-preview/index.html','design-preview/docs/index.html']);
const roots=new Set(['_astro','assets','blog-search','blog','cases','contact','docs','en','licenses','media','support','works','zh']);
const rootFiles=new Set(['.nojekyll','favicon.svg','index.html','site-router.js','sitemap.xml','robots.txt','site-languages.json']);
const suffixes=new Set(['.html','.css','.js','.json','.xml','.svg','.png','.jpg','.jpeg','.webp','.ico','.txt','.pagefind','.pf_fragment','.pf_index','.pf_meta']);
const digest=(b,type='sha256')=>createHash(type).update(b).digest('hex');
const blob=b=>digest(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b]),'sha1');
const exact=(value,fields)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===fields.length&&fields.every(k=>Object.hasOwn(value,k));
function filesIn(root){
  if(fs.lstatSync(root).isSymbolicLink()||!fs.statSync(root).isDirectory())throw new Error('输出必须为普通目录');
  const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{const file=path.join(directory,item.name);if(item.isSymbolicLink()||!item.isFile()&&!item.isDirectory())throw new Error('输出不得含非普通文件');return item.isDirectory()?walk(file):[path.relative(root,file).replaceAll('\\','/')];});
  return walk(root).sort();
}
function languageCodes(siteOutput){const file=path.join(siteOutput,'site-languages.json');return fs.existsSync(file)?publicLanguageCodes(JSON.parse(fs.readFileSync(file,'utf8'))):new Set();}
function targetFor(relative,codes){
  safeRelative(relative);if(previews.has(relative))return 'pages-only';
  if(relative.split('/').some(p=>p.startsWith('.'))&&relative!=='.nojekyll'||/(?:\.openai|\.env|private|audit|source\.zip)/i.test(relative)||!rootFiles.has(relative)&&!roots.has(relative.split('/')[0])&&!codes.has(relative.split('/')[0])||!suffixes.has(path.posix.extname(relative).toLowerCase())&&!rootFiles.has(relative))throw new Error('非公开路径: '+relative);
  return 'both';
}
function validateManifest(manifest,codes){
  if(!exact(manifest,['version','files'])||manifest.version!==1||!Array.isArray(manifest.files)||!manifest.files.length||Buffer.byteLength(JSON.stringify(manifest))>8*1024*1024)throw new Error('发布清单格式或大小无效');
  let previous='',total=0;
  for(const record of manifest.files){
    if(!exact(record,['path','size','gitBlob','sha256','target'])||typeof record.path!=='string'||record.path<=previous||!Number.isSafeInteger(record.size)||record.size<0||record.size>50_000_000||!/^[a-f0-9]{40}$/.test(record.gitBlob)||!/^[a-f0-9]{64}$/.test(record.sha256)||targetFor(record.path,codes)!==record.target)throw new Error('发布记录无效、重复或未排序');
    total+=record.size;previous=record.path;
  }
  if(total>150_000_000)throw new Error('发布大小超限');
}
export function createReleaseManifest({siteOutput}){
  const codes=languageCodes(siteOutput),files=filesIn(siteOutput).filter(p=>p!==provenancePath).map(relative=>{const bytes=fs.readFileSync(regularPath(siteOutput,relative));return {path:relative,size:bytes.length,gitBlob:blob(bytes),sha256:digest(bytes),target:targetFor(relative,codes)};});
  const manifest={version:1,files};validateManifest(manifest,codes);return manifest;
}
function validateProvenance(value){
  if(!exact(value,['version','sourceCommit','manifestPath','manifestSha256'])||value.version!==1||value.manifestPath!==manifestPath||!/^[a-f0-9]{40}$/.test(value.sourceCommit)||!/^[a-f0-9]{64}$/.test(value.manifestSha256))throw new Error('发布来源元数据无效');
}
export function verifyRelease({siteOutput,manifest,manifestBytes}){
  validateManifest(manifest,languageCodes(siteOutput));
  const actual=filesIn(siteOutput),metadata=actual.includes(provenancePath),expected=manifest.files.map(r=>r.path);
  if(metadata){const bytes=fs.readFileSync(regularPath(siteOutput,provenancePath));if(bytes.length>4096)throw new Error('发布来源元数据超限');const provenance=JSON.parse(bytes);validateProvenance(provenance);if(manifestBytes&&provenance.manifestSha256!==digest(manifestBytes))throw new Error('发布来源清单摘要不符');}
  if(JSON.stringify(actual.filter(p=>p!==provenancePath))!==JSON.stringify(expected))throw new Error('发布文件集合不符');
  for(const record of manifest.files){const bytes=fs.readFileSync(regularPath(siteOutput,record.path));if(bytes.length!==record.size||blob(bytes)!==record.gitBlob||digest(bytes)!==record.sha256)throw new Error('发布字节不符: '+record.path);}
  return true;
}
export function writeProvenance({siteOutput,sourceCommit,manifestBytes}){
  if(!Buffer.isBuffer(manifestBytes))manifestBytes=Buffer.from(manifestBytes);
  if(manifestBytes.length>8*1024*1024)throw new Error('发布清单超限');
  const provenance={version:1,sourceCommit,manifestPath,manifestSha256:digest(manifestBytes)};validateProvenance(provenance);
  verifyRelease({siteOutput,manifest:JSON.parse(manifestBytes)});
  fs.writeFileSync(path.join(siteOutput,provenancePath),JSON.stringify(provenance,null,2)+'\n');return provenance;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),value=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined,siteOutput=path.resolve(value('--output')||'dist/site'),file=path.resolve(value('--manifest')||manifestPath);
  if(args.includes('--create'))fs.writeFileSync(file,JSON.stringify(createReleaseManifest({siteOutput}),null,2)+'\n');
  const manifestBytes=fs.readFileSync(file);verifyRelease({siteOutput,manifest:JSON.parse(manifestBytes),manifestBytes});
  if(args.includes('--source-commit'))writeProvenance({siteOutput,sourceCommit:value('--source-commit'),manifestBytes});
  console.log('发布清单与完整输出字节一致');
}
