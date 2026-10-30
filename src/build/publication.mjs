import {parse} from 'parse5';
import fs from 'node:fs';
import path from 'node:path';
import {attrs,walk,applyEdits} from './extract-dom.mjs';
import {regularPath} from './resources.mjs';
export const isDeveloping=(entry,primary='zh')=>['work','case'].includes(entry.type)&&(entry.sources[primary].data.status==='开发中'||entry.sources[primary].data.workInfo?.stage==='developing');
const route=(entry,code)=>'/'+code+(entry.legacyRoutes[0]==='/'?'/':entry.legacyRoutes[0].replace(/^\/docs\/(?:zh|en)\//,'/docs/'));
export function projectPublication({entries,config,redirects=[] ,galleries=new Map(),site}){
 const hidden=entries.filter(e=>isDeveloping(e,config.primary)),hiddenIDs=new Set(hidden.map(e=>e.id));
 for(const alias of redirects)if(!entries.some(e=>e.id===alias.id))throw Error('旧链目标缺失: '+alias.route);
 const published=entries.filter(e=>!hiddenIDs.has(e.id)).map(entry=>{
  if(!entry.taxonomy)return entry;
  const taxonomy=entry.taxonomy,keep=id=>!hiddenIDs.has(id);
  return {...entry,taxonomy:{...taxonomy,categories:taxonomy.categories.map(c=>({...c,entities:c.entities.filter(keep),supplements:c.supplements.filter(s=>keep(s.owner))})).filter(c=>c.entities.length),entityOrder:taxonomy.entityOrder.filter(keep),legacyQueries:Object.fromEntries(Object.entries(taxonomy.legacyQueries).map(([id,q])=>[id,{...q,entities:q.entities.filter(keep),slugs:q.entities.filter(keep).map(id=>entries.find(e=>e.id===id).slug)}]))}};
 });
 const hiddenRoutes=new Set([...hidden.flatMap(e=>[...e.legacyRoutes,...e.languageCodes.map(code=>route(e,code))]),...redirects.filter(a=>hiddenIDs.has(a.id)).map(a=>a.route)]);
 const owners=new Map(),own=(url,id)=>{if(!url)return;const ids=owners.get(url)||new Set();ids.add(id);owners.set(url,ids);};
 for(const entry of entries){
  let displayed;
  if(['page:works-index','page:cases-index','page:blog-index'].includes(entry.id)&&entry.mediaOccurrences?.length){
   const html=fs.readFileSync(regularPath(path.join(site,'src'),entry.template),'utf8');
   const filtered=filterPublicationHTML(html,{hidden,hiddenRoutes,hiddenResources:new Set()});displayed=new Set();
   walk(parse(filtered),node=>{const a=attrs(node);for(const key of ['src','poster','href'])if(a[key])displayed.add(a[key]);for(const value of (a.srcset||'').split(',')){const url=value.trim().split(/\s+/)[0];if(url)displayed.add(url);}});
  }
  own(entry.cover?.websiteUrl,entry.id);
  for(const occurrence of entry.mediaOccurrences||[])if(occurrence.state==='public'&&(!displayed||displayed.has(occurrence.websiteUrl)))own(occurrence.websiteUrl,entry.id);
  for(const item of galleries.get(entry.id)||[]){own(item.websiteUrl,entry.id);own(item.poster?.websiteUrl,entry.id);}
 }
 const hiddenResources=new Set([...owners].filter(([,ids])=>[...ids].every(id=>hiddenIDs.has(id))).map(([url])=>url));
 return {entries:published,hidden,hiddenIDs,hiddenRoutes,hiddenResources,redirects:redirects.filter(a=>!hiddenIDs.has(a.id))};
}
export function isHiddenURL(value,projection){
 if(!value)return false;
 try{const url=new URL(value,'https://mzsh.me');return url.origin==='https://mzsh.me'&&(projection.hiddenRoutes.has(decodeURIComponent(url.pathname))||projection.hiddenResources.has(decodeURIComponent(url.pathname)));}catch{return false;}
}
export function filterPublicationHTML(html,projection){
 const edits=[],excluded=new Set(),doc=parse(html,{sourceCodeLocationInfo:true});
 const remove=node=>{const loc=node.sourceCodeLocation;if(!loc)return;edits.push([loc.startOffset,loc.endOffset,'']);walk(node,n=>excluded.add(n));};
 walk(doc,node=>{
  if(excluded.has(node))return;const a=attrs(node),loc=node.sourceCodeLocation;if(!loc)return;
  if(a['data-content-card']!==undefined&&projection.hidden.some(e=>e.slug===a['data-slug'])){remove(node);return;}
  if(node.tagName==='script'&&a.type==='application/json'&&loc.endTag){
   const raw=html.slice(loc.startTag.endOffset,loc.endTag.startOffset);if(!raw.trim())return;
   const filter=value=>Array.isArray(value)?value.filter(v=>!v||typeof v!=='object'||!projection.hidden.some(e=>e.id===v.id||e.slug===v.slug&&(!v.type||v.type===e.type))).map(filter):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,filter(v)])):value;
   edits.push([loc.startTag.endOffset,loc.endTag.startOffset,JSON.stringify(filter(JSON.parse(raw))).replace(/</g,'\\u003c')]);return;
  }
  if(node.tagName==='a'&&isHiddenURL(a.href,projection)){
   if((a.class||'').split(/\s+/).some(c=>['content-card','featured-card','work-action'].includes(c))){remove(node);return;}
   if(loc.startTag&&loc.endTag){
    const classes=(a.class||'').split(/\s+/);
    const start=classes.includes('article-back')?'<span class="article-back">':'';
    edits.push([loc.startTag.startOffset,loc.startTag.endOffset,start],[loc.endTag.startOffset,loc.endTag.endOffset,start?'</span>':'']);
   }return;
  }
  if(['img','source','video'].includes(node.tagName)&&['src','poster'].some(key=>isHiddenURL(a[key],projection))){remove(node);}
 });return applyEdits(html,edits);
}
