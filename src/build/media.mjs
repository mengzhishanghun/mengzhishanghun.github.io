import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {attrs,walk,extractTemplate,applyEdits} from './extract-dom.mjs';
import {hash,boundedPath} from './build.mjs';
import {resourcePath} from './resources.mjs';
const require=createRequire(new URL('../../package.json',import.meta.url));
const {parse}=require('parse5');
// 在翻译、卡片排序和正文投影完成后统一补足图片入口。
export function projectImageViewers(html,locale) {
  const doc=parse(html,{sourceCodeLocationInfo:true}),edits=[];
  const classes=node=>(attrs(node).class || '').split(/\s+/);
  const closest=(node,test)=>{for(let p=node;p;p=p.parentNode)if(test(p))return p;};
  const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
  const heading=node=>{let title;walk(node,n=>{if(!title&&/^h[1-6]$/.test(n.tagName||''))title=n;});return title;};
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label=alt=>(locale==='en'?'View image: ':'放大查看图片：')+alt;
  const trigger=(src,alt)=>` data-astro-reload data-media-image data-media-src="${escape(src)}" data-media-alt="${escape(alt)}" aria-label="${escape(label(alt))}" href="${escape(src)}"`;
  const replaceTag=(node,tag,omit=[],extra='')=>{
    const loc=node.sourceCodeLocation;
    const attributes=(node.attrs||[]).filter(a=>!omit.includes(a.name)).map(a=>` ${a.name}="${escape(a.value)}"`).join('');
    edits.push([loc.startTag.startOffset,loc.startTag.endOffset,`<${tag}${attributes}${extra}>`]);
    if(loc.endTag)edits.push([loc.endTag.startOffset,loc.endTag.endOffset,`</${tag}>`]);
  };
  walk(doc,image=>{
    if(image.tagName!=='img')return;
    const a=attrs(image),loc=image.sourceCodeLocation;
    if(!a.src||!loc||closest(image,n=>classes(n).some(c=>['hero-backdrop','police-record'].includes(c))))return;
    // 导航卡片的封面沿用整卡跳转，不与正文配图共用放大入口。
    if(closest(image,n=>classes(n).includes('content-card')||Object.hasOwn(attrs(n),'data-feature-panel')))return;
    const existing=closest(image,n=>n.tagName==='a'&&attrs(n)['data-media-image']!==undefined);
    if(existing)return;
    const scope=closest(image,n=>['article','section'].includes(n.tagName));
    const title=scope&&heading(scope),alt=a.alt?.trim()||(title&&text(title).trim())||(locale==='en'?'Image':'图片');
    const link=closest(image,n=>n.tagName==='a');
    if(link) {
      if(attrs(link).href===a.src&&!Object.hasOwn(attrs(link),'download'))replaceTag(link,'a',['href','aria-label'],trigger(a.src,alt));
      else {const end=link.sourceCodeLocation.endOffset;edits.push([end,end,`<a${trigger(a.src,alt)}>${escape(label(alt))}</a>`]);}
      return;
    }
    const holder=closest(image,n=>classes(n).some(c=>['content-cover-link','feature-art'].includes(c)));
    if(holder)replaceTag(holder,'a',['aria-hidden'],trigger(a.src,alt));
    else edits.push([loc.startOffset,loc.startOffset,`<a class="media-image-trigger"${trigger(a.src,alt)}>`],[loc.endOffset,loc.endOffset,'</a>']);
  });
  return applyEdits(html,edits);
}
export function mapMedia(entry,{site}) {
  return (entry.mediaOccurrences || []).map((record,index)=>{
    if(record.id!==entry.id+':media:'+(index+1)||record.ordinal!==index+1||!['withheld','public'].includes(record.state))throw new Error('媒体occurrence身份不符');
    if(Object.keys(record).some(k=>!['id','ordinal','state','websiteUrl','publicSha256','utilityId'].includes(k)))throw new Error('公开媒体清单含私有字段');
    if(record.state==='withheld'&&(record.websiteUrl||record.publicSha256))throw new Error('隐藏媒体权限无效');
    if(record.state==='public'){
      if(!/^\/(?:assets|media|_astro)\//.test(record.websiteUrl||'')||/[?#]|\/\.\.\//.test(record.websiteUrl))throw new Error('公开媒体地址越界');
      if(hash(fs.readFileSync(resourcePath(site,decodeURIComponent(record.websiteUrl.slice(1)))))!==record.publicSha256)throw new Error('公开媒体hash漂移');
    }
    return record;
  });
}
export function exportBodyUtilities(manifest,site,output) {
  const bodyUtilitySlots={},scaffolds={};
  for(const entry of manifest.entries) {
    const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
    let ordinal=0;
    walk(doc,node=>{
      const a=attrs(node),classes=(a.class || '').split(/\s+/);
      const media=node.tagName==='figure' && classes.some(c=>['media-figure','media-withheld'].includes(c)) || node.tagName==='p' && node.childNodes?.some(n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('media-image-trigger'));
      const utility=node.tagName==='button' && (classes.some(c=>/copy/.test(c)) || a['data-copy-code']!==undefined) || node.tagName==='a' && classes.includes('sl-anchor-link');
      if(!media && !utility)return;
      const loc=node.sourceCodeLocation;
      if(!loc)return;
      const id=entry.id+':body-utility:'+ ++ordinal;
      const original=html.slice(loc.startOffset,loc.endOffset);
      const result=extractTemplate('<html><body>'+original+'</body></html>');
      bodyUtilitySlots[id]=result.slots;
      scaffolds[id]=result.template.replace(/^.*?<body>|<\/body>[\s\S]*$/g,'');
    });
  }
  fs.writeFileSync(output,JSON.stringify({version:1,bodyUtilitySlots},null,2)+'\n');
  return {bodyUtilitySlots,scaffolds};
}
export function exportHeadingScaffolds(manifest,site,utilityScaffolds) {
  const output={};
  for(const entry of manifest.entries.filter(e=>e.type==='doc')) {
    const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true}),records=[];
    walk(doc,node=>{
      if(!(attrs(node).class || '').split(/\s+/).includes('sl-heading-wrapper'))return;
      const heading=node.childNodes?.find(n=>/^h[1-6]$/.test(n.tagName || ''));
      const anchor=node.childNodes?.find(n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('sl-anchor-link'));
      if(!heading)throw new Error('文档heading wrapper缺heading: '+entry.id);
      const loc=node.sourceCodeLocation,h=heading.sourceCodeLocation,oldId=attrs(heading).id;
      let template=html.slice(loc.startOffset,loc.endOffset);
      const changes=[[h.startTag.endOffset-loc.startOffset,h.endTag.startOffset-loc.startOffset,'{{headingMarkup}}']];
      if(anchor) {
        const a=anchor.sourceCodeLocation,raw=html.slice(a.startOffset,a.endOffset),extract=extractTemplate('<html><body>'+raw+'</body></html>').template.replace(/^.*?<body>|<\/body>[\s\S]*$/g,'');
        const utilityId=Object.keys(utilityScaffolds).find(id=>id.startsWith(entry.id+':body-utility:') && utilityScaffolds[id]===extract);
        if(!utilityId)throw new Error('文档heading辅助槽缺失: '+entry.id);
        changes.push([a.startOffset-loc.startOffset,a.endOffset-loc.startOffset,'{{anchor}}']);
        records.push({depth:Number(heading.tagName[1]),oldId,utilityId,template:null});
      } else records.push({depth:Number(heading.tagName[1]),oldId,template:null});
      changes.sort((a,b)=>b[0]-a[0]);for(const [start,end,value] of changes)template=template.slice(0,start)+value+template.slice(end);
      records.at(-1).template=template.replace(`id="${oldId}"`,'id="{{headingId}}"');
    });
    output[entry.id]=records;
  }
  return output;
}
export function mapBodyTitle(entry,site) {
  const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
  let record;
  walk(doc,node=>{
    if(!(attrs(node).class || '').split(/\s+/).includes('article-source-title'))return;
    if(record)throw new Error('来源首标题不唯一: '+entry.id);
    const loc=node.sourceCodeLocation;
    record={id:attrs(node).id,tag:node.tagName,template:html.slice(loc.startTag.startOffset,loc.startTag.endOffset)+'{{sourceTitleMarkup}}'+html.slice(loc.endTag.startOffset,loc.endTag.endOffset)};
  });
  return record;
}
export function mapPlainHeadings(entry,site) {
  const html=fs.readFileSync(boundedPath(site,entry.baselineTemplate),'utf8'),doc=parse(html,{sourceCodeLocationInfo:true});
  const records=[];
  let body;
  walk(doc,node=>{if((attrs(node).class || '').split(/\s+/).includes('prose') && node.parentNode?.tagName==='article')body=node;});
  if(!body)return records;
  walk(body,node=>{
    if(!/^h[1-6]$/.test(node.tagName || ''))return;
    const loc=node.sourceCodeLocation;
    records.push({depth:Number(node.tagName[1]),oldId:attrs(node).id,template:html.slice(loc.startTag.startOffset,loc.startTag.endOffset).replace(/id="[^"]*"/,'id="{{headingId}}"')+'{{headingMarkup}}'+html.slice(loc.endTag.startOffset,loc.endTag.endOffset)});
  });
  return records;
}
