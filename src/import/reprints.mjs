import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import YAML from 'yaml';
import {loadReprints,parseReprintBody,isReprintHTML} from '../blog/reprints.mjs';
import {regularPath,safeRelative} from '../build/resources.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const encodePath=value=>value.split('/').map(encodeURIComponent).join('/');
function imageTarget(vault,source,url){
 const value=decodeURIComponent(url),root=path.resolve(vault);
 if(/[\\\0:#?]/.test(value)||value.startsWith('//'))throw Error('转载媒体路径越界');
 const candidates=value.startsWith('/')?[path.resolve(root,value.slice(1))]:[path.resolve(root,value),path.resolve(root,path.posix.dirname(source),value)];
 const found=[];
 for(const file of new Set(candidates)){
  if(!file.startsWith(root+path.sep))continue;
  const relative=path.relative(root,file).replaceAll('\\','/');safeRelative(relative);
  if(fs.existsSync(file))found.push(regularPath(vault,relative));
 }
 if(found.length!==1)throw Error('转载媒体路径缺失或歧义');return found[0];
}
// AST positions bound this scan to one inline image; only its destination changes.
function imageURLRange(body,node){
 const start=node.position.start.offset,segment=body.slice(start,node.position.end.offset);
 let depth=0,index=1;
 for(;index<segment.length;index++){
  const char=segment[index];if(char==='\\'){index++;continue;}
  if(char==='[')depth++;else if(char===']'&&--depth===0)break;
 }
 if(segment[index+1]!=='(')throw Error('转载媒体URL位置不明确');
 index+=2;while(/\s/.test(segment[index]||'')&&index<segment.length)index++;
 if(segment[index]==='<'){
  const begin=++index;for(;index<segment.length;index++){if(segment[index]==='\\')index++;else if(segment[index]==='>')return [start+begin,start+index];}
 }else{
  const begin=index;depth=0;
  for(;index<segment.length;index++){const char=segment[index];if(char==='\\'){index++;continue;}if(char==='(')depth++;else if(char===')'){if(depth===0)return [start+begin,start+index];depth--;}else if(/\s/.test(char)&&depth===0)return [start+begin,start+index];}
 }
 throw Error('转载媒体URL位置不明确');
}
function projectHeader(frontmatter){
 const doc=YAML.parseDocument(frontmatter);if(doc.errors.length)throw Error('转载frontmatter无效');
 const data=doc.toJS();
 if(['title','author','source'].some(key=>typeof data?.[key]!=='string'||!data[key].trim())||!/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(data.source))throw Error('转载归因缺失');
 doc.contents.items=doc.contents.items.filter(pair=>['title','author','source'].includes(pair.key?.value));
 doc.comment=doc.commentBefore=null;doc.contents.comment=doc.contents.commentBefore=null;
 for(const pair of doc.contents.items){
  for(const node of [pair.key,pair.value]){if(!YAML.isScalar(node))throw Error('转载公开字段必须为字符串标量');node.comment=node.commentBefore=null;node.anchor=undefined;}
 }
 return {data,header:doc.toString({lineWidth:0}).trimEnd()};
}
export function prepareReprints({site,vault,records,ordinaryRecords=[]}){
 const files=new Map(),initial=new Map(),updates=[];if(!records.length)return {files,initial,updates};
 const root=path.join(site,'src/blog/reprints'),manifestFile=regularPath(root,'manifest.json'),manifestBytes=fs.readFileSync(manifestFile);
 const manifest=JSON.parse(manifestBytes),entries=loadReprints({site,manifest});initial.set(manifestFile,manifestBytes);
 const seen=new Set(),sources=new Set(ordinaryRecords.map(record=>path.resolve(vault,record.source).toLowerCase()));
 for(const record of records){
  const entry=entries.find(entry=>entry.id===record.id);
  if(!entry||seen.has(record.id))throw Error('转载同步身份缺失或重复');seen.add(record.id);
  const input=regularPath(vault,record.source),sourceKey=input.toLowerCase();
  if(sources.has(sourceKey))throw Error('转载来源映射冲突');sources.add(sourceKey);
  const output=regularPath(root,entry.source),previous=fs.readFileSync(output);initial.set(output,previous);
  if(record.publishedFingerprint!==hash(previous))throw Error('转载公开快照指纹漂移');
  if(!/^[a-f0-9]{64}$/.test(record.sourceFingerprint||''))throw Error('转载来源指纹缺失');
  const inputBytes=fs.readFileSync(input),raw=inputBytes.toString('utf8'),match=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  if(!match)throw Error('转载frontmatter缺失');
  const {data,header}=projectHeader(match[1]);
  if(data.draft===true)throw Error('转载草稿不得同步');
  if(data.slug!==entry.slug||data.websiteRoute!==entry.route||data.sitePublish!==true||data.visibility!=='unlisted')throw Error('转载来源身份不符');
  if(!Array.isArray(record.images)||record.images.length!==entry.media.length)throw Error('转载媒体授权覆盖不完整');
  const images=new Map(),originals=new Set();
  for(const image of record.images){
   const media=entry.media.find(item=>item.originalPath===image.originalPath),source=regularPath(vault,image.source);
   if(!media||image.sha256!==media.sha256||hash(fs.readFileSync(source))!==media.sha256||images.has(source)||originals.has(image.originalPath))throw Error('转载媒体授权或字节漂移');
   images.set(source,image);originals.add(image.originalPath);
  }
  let body=raw.slice(match[0].length).replace(/^\r?\n/,'');
  const {tree,images:nodes}=parseReprintBody(body),edits=[],used=new Set();
  const visit=node=>{
   if(node.type==='html'&&!isReprintHTML(node.value))throw Error('转载含未批准HTML');
   if(['link','definition'].includes(node.type)){
    if(/^(?:https?|mailto|tel):/i.test(node.url)||node.url.startsWith('#')||node.url.startsWith('?')){}else if(/^[a-z][a-z0-9+.-]*:/i.test(node.url)||node.url.startsWith('//'))throw Error('不安全链接协议');else throw Error('转载本地链接未登记');
   }
   for(const child of node.children||[])visit(child);
  };visit(tree);
  for(const node of nodes){
   const target=imageTarget(vault,record.source,node.url),image=images.get(target);
   if(!image||used.has(target))throw Error('转载媒体未登记或重复');used.add(target);
   const [start,end]=imageURLRange(body,node);edits.push([start,end,encodePath(image.originalPath)]);
  }
  if(used.size!==images.size)throw Error('转载媒体覆盖不完整');
  for(const [start,end,value]of edits.sort((a,b)=>b[0]-a[0]))body=body.slice(0,start)+value+body.slice(end);
  const projected='---\n'+header+'\n---\n\n'+body;
  files.set(output,projected);manifest.entries.find(item=>item.slug===entry.slug).sha256=hash(projected);
  updates.push({record,publishedFingerprint:hash(projected),sourceFingerprint:hash(inputBytes)});
 }
 files.set(manifestFile,JSON.stringify(manifest,null,2)+'\n');return {files,initial,updates};
}
