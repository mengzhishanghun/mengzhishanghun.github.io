import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import YAML from 'yaml';
import {parse} from 'parse5';
import {regularPath,safeRelative} from '../build/resources.mjs';
import {walk,attrs,applyEdits} from '../build/extract-dom.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function loadReprints({site,routes=new Map(),manifest}){
 const root=path.join(site,'src/blog/reprints');
 if(!manifest&&!fs.existsSync(root))return [];
 manifest ||= JSON.parse(fs.readFileSync(regularPath(root,'manifest.json'),'utf8'));
 if(manifest.version!==1||!Array.isArray(manifest.entries))throw Error('转载清单格式无效');
 const sources=new Set(),ids=new Set(),outputs=new Set(),entries=[];
 for(const record of manifest.entries){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)||record.visibility!=='unlisted'||record.lang!=='zh'||!Array.isArray(record.media))throw Error('转载条目无效');
  const id='reprint:'+record.slug,route='/zh/blog/reprints/'+record.slug+'/';
  if(ids.has(id)||routes.has(route))throw Error('转载路由冲突: '+route);ids.add(id);routes.set(route,id);
  if(sources.has(record.source))throw Error('转载来源重复');sources.add(record.source);
  const bytes=fs.readFileSync(regularPath(root,record.source)),raw=bytes.toString('utf8');
  if(hash(bytes)!==record.sha256)throw Error('转载原文hash不符');
  const match=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if(!match)throw Error('转载frontmatter缺失');
  const data=YAML.parse(match[1]),body=raw.slice(match[0].length);
  if(['title','author','source'].some(key=>typeof data[key]!=='string'||!data[key].trim())||!/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(data.source))throw Error('转载归因缺失');
  const imagePaths=[...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m=>decodeURIComponent(m[1]));
  const mediaMap=new Map();
  for(const media of record.media){
   safeRelative(media.originalPath);
   if(!media.websiteUrl?.startsWith('/media/reprints/'+record.slug+'/'))throw Error('转载媒体路径越界');
   safeRelative(media.websiteUrl.slice(1));
   if(mediaMap.has(media.originalPath)||outputs.has(media.websiteUrl))throw Error('转载媒体重复');
   const content=fs.readFileSync(regularPath(root,media.source));
   if(hash(content)!==media.sha256)throw Error('转载媒体hash不符');
   mediaMap.set(media.originalPath,media.websiteUrl);outputs.add(media.websiteUrl);
  }
  if(imagePaths.length!==record.media.length||new Set(imagePaths).size!==record.media.length||imagePaths.some(p=>!mediaMap.has(p)))throw Error('转载媒体覆盖不完整');
  entries.push({...record,id,type:'blog',original:true,route,legacyRoutes:[],languageCodes:['zh'],sources:{zh:{raw,bytes,data,body}},mediaMap,template:'blog/templates/blog--markdown-publishing.html',shellId:'blog:markdown-publishing'});
 }
 const files=fs.readdirSync(path.join(root,'content')).filter(file=>file.endsWith('.md')).map(file=>'content/'+file);
 if(files.length!==sources.size||files.some(file=>!sources.has(file)))throw Error('转载原文清单覆盖不完整');
 return entries;
}
export function reprintTemplate(html,entry,escapeHTML){
 const edits=[];
 walk(parse(html,{sourceCodeLocationInfo:true}),node=>{
  const a=attrs(node),loc=node.sourceCodeLocation;if(!loc)return;
  if((a.class||'').split(/\s+/).includes('note-hero'))edits.push([loc.startOffset,loc.endOffset,'<header class="project-hero note-hero"><p class="project-breadcrumb">转载 · '+escapeHTML(entry.sources.zh.data.author)+' · <a href="'+escapeHTML(entry.sources.zh.data.source)+'">原文</a></p></header>']);
  if(['article-back','outline-mobile-back'].includes(a.class))edits.push([loc.startOffset,loc.endOffset,'<a class="'+a.class+'" href="/zh/blog/" data-fixed-return aria-label="返回博客">返回博客</a>']);
  if(node.tagName==='article'&&loc.attrs?.['aria-labelledby']){const at=loc.attrs['aria-labelledby'];edits.push([at.startOffset,at.endOffset,'aria-label="'+escapeHTML(entry.sources.zh.data.title)+'"']);}
  if(node.tagName==='title')edits.push([loc.startTag.endOffset,loc.endTag.startOffset,escapeHTML(entry.sources.zh.data.title)]);
  if(node.tagName==='meta'&&a.name==='description')edits.push([loc.startOffset,loc.endOffset,'<meta name="description" content="'+escapeHTML(entry.sources.zh.data.title)+'">']);
  if(node.tagName==='head')edits.push([loc.endTag.startOffset,loc.endTag.startOffset,'<meta name="robots" content="noindex">']);
 });return applyEdits(html,edits);
}
