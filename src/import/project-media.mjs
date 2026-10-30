import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {walk,attrs} from '../build/extract-dom.mjs';
import {regularPath,safeRelative} from '../build/resources.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=value=>JSON.stringify(value,null,2)+'\n';
export function mediaInfo(bytes,extension){
 const ext=extension.toLowerCase();let width,height;
 if(ext==='.mp4'&&bytes.length>=16&&bytes.toString('ascii',4,8)==='ftyp')return {kind:'video'};
 if(ext==='.webm'&&bytes.length>=8&&bytes.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))&&bytes.includes(Buffer.from('webm')))return {kind:'video'};
 if(ext==='.png'&&bytes.length>=24&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&bytes.toString('ascii',12,16)==='IHDR'){width=bytes.readUInt32BE(16);height=bytes.readUInt32BE(20);}
 if(['.jpg','.jpeg'].includes(ext)&&bytes[0]===255&&bytes[1]===216){let i=2;while(i+9<bytes.length){if(bytes[i++]!==255)break;const marker=bytes[i++];if(marker===217||marker===218)break;const length=bytes.readUInt16BE(i);if(length<2||i+length>bytes.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){height=bytes.readUInt16BE(i+3);width=bytes.readUInt16BE(i+5);break;}i+=length;}}
 if(ext==='.webp'&&bytes.length>=30&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'){
 const type=bytes.toString('ascii',12,16);if(type==='VP8X'){width=bytes.readUIntLE(24,3)+1;height=bytes.readUIntLE(27,3)+1;}else if(type==='VP8 '&&bytes.subarray(23,26).equals(Buffer.from([157,1,42]))){width=bytes.readUInt16LE(26)&16383;height=bytes.readUInt16LE(28)&16383;}else if(type==='VP8L'&&bytes[20]===47){const n=bytes.readUInt32LE(21);width=(n&16383)+1;height=((n>>>14)&16383)+1;}}
 if(!Number.isInteger(width)||width<1||!Number.isInteger(height)||height<1)throw Error('媒体签名、类型或尺寸无效');return {kind:'image',width,height};
}
function selectedPaths(source){
 const result=[];for(const role of ['cover','video','videoPoster']){const value=source.data[role];if(value!==undefined&&typeof value!=='string')throw Error('媒体字段必须为字符串');if(value)result.push({role,ordinal:1,source:value});}
 if(source.data.gallery!==undefined){if(!Array.isArray(source.data.gallery)||source.data.gallery.some(v=>typeof v!=='string'||!v))throw Error('gallery必须是有序路径列表');source.data.gallery.forEach((value,i)=>result.push({role:'gallery',ordinal:i+1,source:value}));}
 if(source.data.video&&!source.data.videoPoster||source.data.videoPoster&&!source.data.video)throw Error('视频必须有独立封面');if(source.data.video===source.data.videoPoster&&source.data.video)throw Error('视频必须有独立封面');return result;
}
function resolveMedia(vault,record,value){
 if(/[\\\0:#?]/.test(value)||value.startsWith('//'))throw Error('媒体路径越界');
 const root=path.resolve(vault),raw=value.startsWith('/')?[path.resolve(root,value.slice(1))]:[path.resolve(root,value),path.resolve(root,path.posix.dirname(record.source),value)];
 const candidates=[];let bounded=false;
 for(const file of new Set(raw)){if(!file.startsWith(root+path.sep))continue;bounded=true;const relative=path.relative(root,file).replaceAll('\\','/');safeRelative(relative);if(fs.existsSync(file))candidates.push({path:relative,file:regularPath(vault,relative)});}
 if(!bounded)throw Error('媒体路径越界');const unique=[...new Map(candidates.map(c=>[c.file,c])).values()];if(unique.length!==1)throw Error('媒体路径缺失或歧义');return unique[0];
}
export function createMediaPlan({site,vault,manifest}){
 const names=['resources','project-media-grants','project-galleries'];let registries;
  const files=new Map(),initial=new Map();
 const load=()=>registries??=Object.fromEntries(names.map(name=>{const file=regularPath(site,'src/build/'+name+'.json'),bytes=fs.readFileSync(file);initial.set(file,bytes);return [name,JSON.parse(bytes)];}));
 function existing(url){if(typeof url!=='string'||!/^\/(?:assets|media|_astro)\/[A-Za-z0-9_./-]+$/.test(url))throw Error('媒体公开地址越界');safeRelative(url.slice(1));const resources=load().resources.files,found=resources.filter(r=>r.outputs.includes(url.slice(1)));if(found.length!==1)throw Error('媒体公开资源未精确登记');const resource=found[0],file=path.join(site,resource.source);if(!files.has(file))regularPath(site,resource.source);if(!initial.has(file))initial.set(file,fs.readFileSync(file));const bytes=files.get(file)??initial.get(file);if(hash(bytes)!==resource.sha256)throw Error('媒体公开hash漂移');return {resource,bytes,sha256:hash(bytes)};}
 function coverURL(record,entry){if(record.cover)return record.cover.websiteUrl;const template=fs.readFileSync(regularPath(path.join(site,'src'),entry.template),'utf8');const urls=[];walk(parse(template),node=>{if(node.tagName==='figure'&&(attrs(node).class||'').split(/\s+/).includes('project-hero-media'))walk(node,child=>{if(child.tagName==='img')urls.push(attrs(child).src);});});if(urls.length!==1)throw Error('封面模板不能唯一定位');return urls[0];}
 function itemMedia(item,entry){
   if(item.hero)return null;
   if(item.occurrenceId){const occurrence=entry.mediaOccurrences?.find(o=>o.id===item.occurrenceId&&o.state==='public');if(!occurrence)throw Error('既有图库occurrence授权漂移');return {websiteUrl:occurrence.websiteUrl,sha256:occurrence.publicSha256};}
   if(item.grantId){const grant=load()['project-media-grants'].grants.find(g=>g.id===item.grantId&&g.entryId===entry.id);if(!grant||grant.basis!=='owner-explicit-publication')throw Error('既有图库grant授权漂移');return {websiteUrl:grant.websiteUrl,sha256:grant.sha256};}
   if(!item.sourcePage||!item.sha256)throw Error('既有图库来源授权缺失');return {websiteUrl:item.websiteUrl,sha256:item.sha256};
 }
 function approve(source,record){
 const selection=selectedPaths(source);if(!selection.length&&!Object.hasOwn(source.data,'gallery')&&!Object.hasOwn(source.data,'video'))return;
 const entry=manifest.entries.find(e=>e.id===record.id);if(!entry)throw Error('媒体公开实体缺失');let total=0;
 record.projectMedia=selection.map(item=>{const resolved=resolveMedia(vault,record,item.source),bytes=fs.readFileSync(resolved.file);total+=bytes.length;if(bytes.length>50_000_000||total>150_000_000)throw Error('媒体大小超限');const info=mediaInfo(bytes,path.extname(resolved.path));if((item.role==='video')!==(info.kind==='video'))throw Error('媒体用途与类型不符');const sha256=hash(bytes);let websiteUrl,publicSha256=null,reuseItem;
 if(item.role==='cover'){websiteUrl=coverURL(record,entry);const previous=existing(websiteUrl);if(path.extname(websiteUrl).toLowerCase()!==path.extname(resolved.path).toLowerCase()&&!(['.jpg','.jpeg'].includes(path.extname(websiteUrl).toLowerCase())&&['.jpg','.jpeg'].includes(path.extname(resolved.path).toLowerCase())))throw Error('封面公开类型不一致，请人工审核');if(record.cover?.publicSha256&&record.cover.publicSha256!==previous.sha256)throw Error('封面hash漂移');if(entry.cover&&entry.cover.sha256!==previous.sha256)throw Error('封面manifest漂移');publicSha256=previous.sha256;}
  else {
 const gallery=load()['project-galleries'].galleries.find(g=>g.entryId===record.id);
 for(const candidate of gallery?.items||[]){const media=itemMedia(candidate,entry);if(media?.sha256===sha256){if(existing(media.websiteUrl).sha256!==sha256)throw Error('既有图库hash漂移');websiteUrl=media.websiteUrl;publicSha256=sha256;if(item.role!=='videoPoster')reuseItem=structuredClone(candidate);break;}}
 websiteUrl??='/media/imported/projects/'+sha256+path.extname(resolved.path).toLowerCase();const match=load().resources.files.find(r=>r.outputs.includes(websiteUrl.slice(1)));if(match)publicSha256=existing(websiteUrl).sha256;}
 return {...item,path:resolved.path,sha256,websiteUrl,publicSha256,...(reuseItem?{reuseItem}:{}),...(item.role==='cover'?{manifestCover:entry.cover??null}:{}),...(info.kind==='image'?{width:info.width,height:info.height}:{})};});
 const video=record.projectMedia.find(i=>i.role==='video'),poster=record.projectMedia.find(i=>i.role==='videoPoster');
 if(video?.reuseItem?.kind==='video'){
   const previous=itemMedia(video.reuseItem.poster,entry);
   if(previous.sha256===poster.sha256){poster.websiteUrl=previous.websiteUrl;poster.publicSha256=existing(previous.websiteUrl).sha256;poster.reusePoster=structuredClone(video.reuseItem.poster);}
   else delete video.reuseItem;
 }
 }
 function project(source,record){
 const selection=selectedPaths(source);if(!selection.length&&!Object.hasOwn(source.data,'gallery')&&!Object.hasOwn(source.data,'video')&&!record.projectMedia)return null;
 if(!Array.isArray(record.projectMedia)||record.projectMedia.length!==selection.length)throw Error('项目媒体未获精确授权');const entry=manifest.entries.find(e=>e.id===record.id),config=load();const owned=[];let total=0;
 const alt=kind=>Object.fromEntries(Object.entries(config['project-galleries'].labels).map(([code,labels])=>[code,labels[kind]]));
 const values=selection.map((item,index)=>{const approved=record.projectMedia[index];if(['role','ordinal','source'].some(k=>approved[k]!==item[k]))throw Error('项目媒体授权漂移');const resolved=resolveMedia(vault,record,item.source),bytes=fs.readFileSync(resolved.file);if(resolved.path!==approved.path||hash(bytes)!==approved.sha256)throw Error('项目媒体字节或路径漂移');total+=bytes.length;if(bytes.length>50_000_000||total>150_000_000)throw Error('媒体大小超限');const info=mediaInfo(bytes,path.extname(resolved.path));if((item.role==='video')!==(info.kind==='video')||info.kind==='image'&&(approved.width!==info.width||approved.height!==info.height))throw Error('媒体类型或尺寸漂移');
 let previous=config.resources.files.find(r=>r.outputs.includes(approved.websiteUrl.slice(1)));if(previous){const current=existing(approved.websiteUrl);if(current.sha256!==approved.sha256&&current.sha256!==approved.publicSha256)throw Error('媒体公开hash漂移');if(current.sha256!==approved.sha256&&previous.outputs.length!==1)throw Error('共享媒体替换需人工审核');files.set(path.join(site,previous.source),bytes);previous.sha256=approved.sha256;previous.mode='frozen';}else {if(approved.publicSha256!==null)throw Error('媒体公开资源漂移');if(item.role==='cover')throw Error('封面资源缺失');existingURL(approved.websiteUrl);const relative='src/shared/project-media/'+approved.sha256+path.extname(approved.websiteUrl);const target=path.join(site,relative);let parent=path.resolve(site);for(const part of relative.split('/')){parent=path.join(parent,part);if(fs.existsSync(parent)&&fs.lstatSync(parent).isSymbolicLink())throw Error('媒体目标符号链接越界');}if(fs.existsSync(target)&&hash(fs.readFileSync(regularPath(site,relative)))!==approved.sha256)throw Error('媒体目标冲突');if(!initial.has(target))initial.set(target,fs.existsSync(target)?fs.readFileSync(target):null);files.set(target,bytes);config.resources.files.push({source:relative,outputs:[approved.websiteUrl.slice(1)],sha256:approved.sha256,mode:'frozen'});}
 if(item.role==='cover'){if(entry.cover&&(entry.cover.websiteUrl!==approved.websiteUrl||![approved.sha256,approved.publicSha256].includes(entry.cover.sha256))||approved.manifestCover&&!entry.cover)throw Error('封面manifest漂移');entry.cover={websiteUrl:approved.websiteUrl,sha256:approved.sha256};record.cover={source:item.source,websiteUrl:approved.websiteUrl,publicSha256:approved.sha256};return null;}
   if(approved.reusePoster){const video=record.projectMedia.find(i=>i.role==='video');if(!video?.reuseItem||JSON.stringify(video.reuseItem.poster)!==JSON.stringify(approved.reusePoster))throw Error('既有视频封面授权漂移');return structuredClone(approved.reusePoster);}
 if(approved.reuseItem){const old=load()['project-galleries'].galleries.find(g=>g.entryId===record.id)?.items.find(i=>JSON.stringify(i)===JSON.stringify(approved.reuseItem));if(!old)throw Error('既有图库授权漂移');const previous=itemMedia(old,entry);if(previous.websiteUrl!==approved.websiteUrl||previous.sha256!==approved.sha256)throw Error('既有图库授权漂移');if(old.grantId)owned.push(old.grantId);return structuredClone(old);}
 const identity=item.role==='gallery'?approved.sha256:item.ordinal;const grantId=record.id+':ob:'+item.role+':'+identity;const grant={id:grantId,entryId:record.id,kind:info.kind,websiteUrl:approved.websiteUrl,sha256:approved.sha256,basis:'owner-explicit-publication'};const old=config['project-media-grants'].grants.findIndex(g=>g.id===grantId);if(old>=0)config['project-media-grants'].grants[old]=grant;else config['project-media-grants'].grants.push(grant);owned.push(grantId);return {id:'ob-'+item.role+(item.role==='gallery'?'-'+identity:''),grantId,...(info.kind==='image'?{width:info.width,height:info.height}:{}),alt:alt(info.kind)};});
 const video=values[selection.findIndex(i=>i.role==='video')],poster=values[selection.findIndex(i=>i.role==='videoPoster')];if(video){const {id,...rest}=poster;video.poster=rest;}
 const galleries=config['project-galleries'].galleries;let gallery=galleries.find(g=>g.entryId===record.id);const imported=values.filter((v,i)=>v&&['video','gallery'].includes(selection[i].role));
 if(Object.hasOwn(source.data,'gallery')||Object.hasOwn(source.data,'video')){const urls=selection.filter(i=>['video','gallery'].includes(i.role)).map(i=>record.projectMedia[selection.indexOf(i)].websiteUrl);if(new Set(urls).size!==urls.length)throw Error('图库媒体地址重复');const items=[...imported];if(!items.length)items.push({id:'cover',hero:true});if(!gallery&&imported.length){gallery={entryId:record.id,items};galleries.push(gallery);}else if(gallery)gallery.items=items;}
 if(Object.hasOwn(source.data,'gallery')||Object.hasOwn(source.data,'video'))config['project-media-grants'].grants=config['project-media-grants'].grants.filter(g=>!g.id.startsWith(record.id+':ob:')||owned.includes(g.id));
 return record.cover;
 }
 function existingURL(url){if(!/^\/media\/imported\/projects\/[a-f0-9]{64}\.(png|jpe?g|webp|mp4|webm)$/.test(url))throw Error('媒体公开地址越界');}
 function finish(){if(!registries)return files;for(const name of names)files.set(path.join(site,'src/build',name+'.json'),json(registries[name]));files.set(path.join(site,'src/build/manifest.json'),json(manifest));return files;}
 return {approve,project,finish,initial};
}
