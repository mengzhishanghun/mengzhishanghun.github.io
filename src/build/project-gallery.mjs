import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {attrs,walk,applyEdits} from './extract-dom.mjs';
import {resourcePath,regularPath,safeRelative} from './resources.mjs';
import {languageCode} from './languages.mjs';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fields(value,allowed){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!allowed.includes(key)))throw new Error('图库字段无效');}
function heroFigure(html){const figures=[];walk(parse(html,{sourceCodeLocationInfo:true}),node=>{if(node.tagName==='figure'&&(attrs(node).class||'').split(/\s+/).includes('project-hero-media'))figures.push(node);});if(figures.length!==1)throw new Error('图库首屏插槽不唯一');return figures[0];}
export function loadProjectGalleries({site,entries,codes,config}){
  if(!entries.some(entry=>['work','case'].includes(entry.type)))return new Map();
  config??=JSON.parse(fs.readFileSync(path.join(site,'src/build/project-galleries.json'),'utf8'));
  fields(config,['version','labels','galleries']);if(config.version!==1||!Array.isArray(config.galleries))throw new Error('图库配置无效');
  const labels=config.labels;
  fields(labels,Object.keys(labels||{}));if(Object.keys(labels).some(code=>!languageCode.test(code)))throw new Error('图库语言无效');for(const code of codes){fields(labels[code],['cover','image','video']);if(['cover','image','video'].some(key=>typeof labels[code][key]!=='string'||!labels[code][key].trim()))throw new Error('图库译文缺失: '+code);}
  const registry=JSON.parse(fs.readFileSync(path.join(site,'src/build/resources.json'),'utf8')).files;
  const checked=(url,expected,frozen=false)=>{
    if(typeof url!=='string'||!/^\/(?:assets|media|_astro)\/[a-zA-Z0-9_./-]+$/.test(url))throw new Error('图库资源地址越界');safeRelative(url.slice(1));
    const record=registry.find(record=>record.outputs.includes(url.slice(1)));if(!record||frozen&&record.mode!=='frozen')throw new Error('图库资源未冻结登记');
    const actual=digest(fs.readFileSync(resourcePath(site,url.slice(1))));if(actual!==record.sha256||expected&&actual!==expected)throw new Error('图库资源hash漂移');return actual;
  };
  const imageURL=url=>/\.(png|jpe?g|webp|gif|avif)$/i.test(url);
  const videoURL=url=>/\.(mp4|webm)$/i.test(url);
  const validateAlt=item=>{fields(item.alt,Object.keys(item.alt||{}));if(codes.some(code=>typeof item.alt[code]!=='string'||!item.alt[code].trim())||Object.keys(item.alt).some(code=>!languageCode.test(code)))throw new Error('图库图片译文缺失');};
  const validateImage=item=>{validateAlt(item);if(!imageURL(item.websiteUrl)||![item.width,item.height].every(n=>Number.isInteger(n)&&n>0))throw new Error('图库图片尺寸或类型无效');};
  const grantConfig=JSON.parse(fs.readFileSync(path.join(site,'src/build/project-media-grants.json'),'utf8'));
  fields(grantConfig,['version','grants']);if(grantConfig.version!==1||!Array.isArray(grantConfig.grants))throw new Error('项目媒体公开授权清单无效');
  const grants=new Map();
  for(const grant of grantConfig.grants){
    fields(grant,['id','entryId','kind','websiteUrl','sha256','basis']);
    if(typeof grant.id!=='string'||!/^[-a-zA-Z0-9:]+$/.test(grant.id)||grants.has(grant.id)||!entries.some(entry=>entry.id===grant.entryId&&['work','case'].includes(entry.type))||grant.basis!=='owner-explicit-publication'||!/^[a-f0-9]{64}$/.test(grant.sha256||'')||!['image','video'].includes(grant.kind))throw new Error('项目媒体公开授权无效或重复');
    checked(grant.websiteUrl,grant.sha256,true);
    if(!(grant.kind==='image'?imageURL(grant.websiteUrl):videoURL(grant.websiteUrl)))throw new Error('项目媒体授权类型不符');
    grants.set(grant.id,grant);
  }
  const configured=new Map();for(const gallery of config.galleries){fields(gallery,['entryId','items']);if(configured.has(gallery.entryId)||!Array.isArray(gallery.items)||!gallery.items.length)throw new Error('图库ID重复或媒体为空');if(!entries.some(e=>e.id===gallery.entryId&&['work','case'].includes(e.type)))throw new Error('图库作品不存在');configured.set(gallery.entryId,gallery.items);}
  const galleries=new Map();galleries.labels=labels;
  for(const entry of entries.filter(e=>['work','case'].includes(e.type))){
    const template=fs.readFileSync(regularPath(path.join(site,'src'),entry.template),'utf8');
    const figure=heroFigure(template);let original;walk(figure,node=>{if(node.tagName==='img'&&!original)original=attrs(node);});if(!original)throw new Error('图库原图缺失: '+entry.id);
    checked(original.src);const base={id:'cover',kind:'image',websiteUrl:original.src,width:Number(original.width)||undefined,height:Number(original.height)||undefined,cover:true};
    const salePages=new Set(Object.values(entry.sources||{}).flatMap(source=>(source.data.workInfo?.channels||[]).filter(c=>c.kind==='sale'&&/^https:\/\/(?:www\.)?fab\.com\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?listings\/[a-zA-Z0-9-]+\/?$/.test(c.href)).map(c=>c.href)));
    const external=(item,poster=false)=>{
      fields(item,poster?['websiteUrl','sha256','sourcePage','width','height','alt']:['id','kind','websiteUrl','sha256','sourcePage','width','height','alt','poster']);
      if(!salePages.has(item.sourcePage)||!/^[a-f0-9]{64}$/.test(item.sha256||''))throw new Error('图库来源页面或hash无效');
      checked(item.websiteUrl,item.sha256,true);
      validateAlt(item);
      if(poster||item.kind==='image'){
        validateImage(item);
        if(item.poster!==undefined)throw new Error('图库图片不得含视频封面');
      }else if(item.kind==='video'){
        if(!videoURL(item.websiteUrl)||!item.poster)throw new Error('图库视频或封面无效');external(item.poster,true);
      }else throw new Error('图库媒体类型无效');return {...item};
    };
    const granted=(item,poster=false)=>{
      fields(item,poster?['grantId','occurrenceId','width','height','alt']:['id','grantId','width','height','alt','poster']);
      let media;
      if(poster&&item.occurrenceId!==undefined){
        fields(item,['occurrenceId','width','height','alt']);
        const record=entry.mediaOccurrences?.find(record=>record.id===item.occurrenceId&&record.state==='public');
        if(!record||!record.id.startsWith(entry.id+':media:'))throw new Error('视频封面未获公开许可');
        checked(record.websiteUrl,record.publicSha256);media={kind:'image',websiteUrl:record.websiteUrl,sha256:record.publicSha256};
      }else{
        const grant=grants.get(item.grantId);
        if(!grant||grant.entryId!==entry.id)throw new Error('图库项目媒体未获公开授权');
        media={kind:grant.kind,websiteUrl:grant.websiteUrl,sha256:grant.sha256};
      }
      const result={...item,...media};validateAlt(result);
      if(poster||result.kind==='image'){
        if(result.kind!=='image'||item.poster!==undefined)throw new Error('视频封面必须是独立公开图片');validateImage(result);
      }else{
        if(!item.poster)throw new Error('项目视频缺少独立封面授权');result.poster=granted(item.poster,true);
      }
      return result;
    };
    const ids=new Set();let videos=0;
    const items=(configured.get(entry.id)||[{id:'cover',hero:true}]).map(item=>{
      fields(item,['id','hero','occurrenceId','grantId','kind','websiteUrl','sha256','sourcePage','width','height','alt','poster']);
      if(typeof item.id!=='string'||!/^[-a-zA-Z0-9]+$/.test(item.id)||ids.has(item.id))throw new Error('图库媒体ID无效或重复');ids.add(item.id);
      if(item.hero!==undefined){fields(item,['id','hero']);if(item.hero!==true)throw new Error('图库原图引用无效');return {...base,id:item.id};}
      if(item.occurrenceId!==undefined){fields(item,['id','occurrenceId']);const record=entry.mediaOccurrences?.find(r=>r.id===item.occurrenceId&&r.state==='public');if(!record)throw new Error('图库媒体未获公开许可');checked(record.websiteUrl,record.publicSha256);return {id:item.id,kind:'image',websiteUrl:record.websiteUrl};}
      const result=item.grantId!==undefined?granted(item):external(item);if(result.kind==='video'&&++videos>1)throw new Error('图库最多一个视频');return result;
    });if(new Set(items.map(item=>item.websiteUrl)).size!==items.length)throw new Error('图库媒体地址重复');galleries.set(entry.id,items);
  }return galleries;
}
export function projectGallery(html,entry,locale,galleries){
  if(!galleries.has(entry.id))return html;
  const figure=heroFigure(html),loc=figure.sourceCodeLocation,items=galleries.get(entry.id),labels=galleries.labels?.[locale];
  const title=entry.sources?.[locale]?.data.title||entry.title||entry.id;
  const alt=item=>item.alt?.[locale]||(item.cover&&labels?title+' · '+labels.cover:title);
  const image=(item,thumbnail=false)=>`<img src="${escape(item.websiteUrl)}" alt="${thumbnail?'':escape(alt(item))}"${item.width?` width="${item.width}" height="${item.height}"`:''} decoding="async"${thumbnail?' loading="lazy"':''}>`;
  const panels=items.map((item,index)=>`<div id="project-gallery-panel-${index}" class="project-gallery-panel" data-gallery-panel="${index}"${index?' hidden':''}>`+(item.kind==='video'?`<video controls playsinline preload="none" poster="${escape(item.poster.websiteUrl)}" aria-label="${escape(alt(item))}"><source src="${escape(item.websiteUrl)}" type="${item.websiteUrl.endsWith('.webm')?'video/webm':'video/mp4'}"></video>`:`<a class="project-gallery-image" data-astro-reload data-media-image data-media-src="${escape(item.websiteUrl)}" data-media-alt="${escape(alt(item))}" href="${escape(item.websiteUrl)}" aria-label="${escape(alt(item))}">${image(item)}</a>`)+`<span class="project-gallery-kind">${escape(labels?.[item.cover?'cover':item.kind]||alt(item))}</span></div>`).join('');
  const thumbs=items.length>1?'<div class="project-gallery-thumbnails">'+items.map((item,index)=>`<button type="button" data-gallery-select="${index}" aria-controls="project-gallery-panel-${index}" aria-pressed="${index===0}" aria-label="${escape(alt(item))} · ${index+1}">${image(item.kind==='video'?item.poster:item,true)}${item.kind==='video'?'<span class="project-gallery-play" aria-hidden="true">▶</span>':''}</button>`).join('')+'</div>':'';
  return applyEdits(html,[[loc.startOffset,loc.endOffset,`<figure class="project-hero-media project-gallery" data-project-gallery>${'<div class="project-gallery-stage">'+panels+'</div>'+thumbs}</figure>`]]).replace('</head>','<link rel="stylesheet" href="/assets/site-ui/project-gallery.css"><script defer src="/assets/site-ui/project-gallery.js"></script></head>');
}
