import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {attrs,walk} from './extract-dom.mjs';
import {localeRoute,preflight} from './build.mjs';
import {projectPublication,isHiddenURL} from './publication.mjs';
import {projectDocumentAnchorAliases,resolveDocumentAlias} from './work-documents.mjs';
const require=createRequire(new URL('../../package.json',import.meta.url));
const {parse}=require('parse5');
export function validateRuntime({manifest,output,site,languageConfig,validateAliases=true,publication}) {
  const errors=[],counts={pages:0,media:0,headings:0,codeFrames:0,inlineScripts:0};
  const config=languageConfig || JSON.parse(fs.readFileSync(path.join(output,'site-languages.json'),'utf8'));
  if(publication){
    for(const route of [...publication.hiddenRoutes,...publication.hiddenResources]){
      const file=route.slice(1)+(route.endsWith('/')?'index.html':'');
      if(fs.existsSync(path.join(output,file)))errors.push({route,kind:'hiddenOutput'});
    }
    manifest={...manifest,entries:publication.entries,redirects:publication.redirects};
  }
  const pageIDs=new Map(),entryIDs=new Map(),pages=new Map(),fragmentLinks=[];
  for(const entry of manifest.entries)for(const {code:locale} of config.languages) {
    const route=localeRoute(entry,locale),relative=route.slice(1)+(route.endsWith('.html')?'':'index.html');
    const doc=parse(fs.readFileSync(path.join(output,relative),'utf8')),ids=new Map();
    walk(doc,n=>{const id=attrs(n).id;if(id)ids.set(id,(ids.get(id)||0)+1)});
    pageIDs.set(route,ids);entryIDs.set(entry.id+':'+locale,ids);
    let runtime,records;counts.pages++;
    const visit=(node,skip=false)=>{
      const a=attrs(node);skip ||= ['script','style','code','pre','svg'].includes(node.tagName);
      if(locale==='en' && !skip && node.nodeName==='#text' && /[\p{Script=Han}]/u.test(node.value) && !config.languages.some(l=>l.label===node.value.trim()) && !/^\s*(梦之殇魂|.*备.*号.*?)\s*$/.test(node.value))errors.push({route,kind:'untranslatedText',value:node.value.trim()});
      if(node.tagName==='script' && a['data-site-language']!==undefined)runtime=JSON.parse(node.childNodes.map(n=>n.value || '').join(''));
      if(node.tagName==='script' && a['data-content-index-data']!==undefined)records=JSON.parse(node.childNodes.map(n=>n.value || '').join(''));
      if(node.tagName==='script' && !a.src && (!a.type || a.type==='module')) {
        counts.inlineScripts++;
        try { require('acorn').parse(node.childNodes.map(n=>n.value || '').join(''),{ecmaVersion:'latest',sourceType:'module'}); }
        catch(error) { errors.push({route,kind:'scriptSyntax',message:error.message}); }
      }
      if(/^h[1-6]$/.test(node.tagName || ''))counts.headings++;
      if((a.class || '').split(/\s+/).includes('media-figure'))counts.media++;
      if(node.tagName==='figure' && (a.class || '').split(/\s+/).includes('frame')) {
        counts.codeFrames++;
        if(entry.type==='doc' && !(a.class || '').split(/\s+/).includes('not-content'))errors.push({route,kind:'codeFrameClass'});
      }
      if(a.href?.includes('#')){
        try{
          const url=new URL(a.href,'https://mzsh.me'+route);
          if(url.origin==='https://mzsh.me'&&url.hash)fragmentLinks.push({route,target:a.href,url});
        }catch{ /* Local path validity is checked below. */ }
      }
      for(const key of ['href','src']) {
        const value=a[key];if(!value || /^(?:[a-z]+:|\/\/|#)/i.test(value))continue;
        if(publication&&isHiddenURL(value,publication))errors.push({route,kind:'hiddenLink',target:value});
        const url=new URL(value,'https://mzsh.me'+route),target=decodeURIComponent(url.pathname);
        const file=target.slice(1)+(target.endsWith('/')?'index.html':'');
        if(!fs.existsSync(path.join(output,file)))errors.push({route,kind:'missingLocalFile',target});
      }
      for(const child of node.childNodes || [])visit(child,skip);
    };visit(doc);
    pages.set(route,{entry,locale,runtime});
    if(runtime?.locale!==locale || runtime?.urls?.[locale]!==route || config.languages.some(l=>!runtime?.urls?.[l.code]) || !runtime?.languages || runtime.primary!==config.primary || runtime.fallback!==config.fallback)errors.push({route,kind:'languageRuntime'});
    if(entry.id==='page:works-index' && records) {
      const categories=new Map();for(const record of records) {const list=categories.get(record.categoryId) || [];list.push(record.order);categories.set(record.categoryId,list);}
      for(const [category,orders] of categories)if(orders.some((n,i)=>i>0 && n<orders[i-1]))errors.push({route,kind:'workOrder',category,orders});
    }
  }
  const codes=config.languages.map(({code})=>code),projected=new Map();
  for(const [route,{entry,runtime}]of pages){
    try{
      if(!projected.has(entry.id))projected.set(entry.id,projectDocumentAnchorAliases(entry,{entries:manifest.entries,codes,pageIds:entryIDs,route:localeRoute}));
      if(!isDeepStrictEqual(runtime?.anchorAliases,projected.get(entry.id)))errors.push({route,kind:'documentAnchorAlias'});
    }catch(error){errors.push({route,kind:'documentAnchorAlias',message:error.message});}
  }
  for(const {route,target,url}of fragmentLinks){
    const page=pages.get(url.pathname);
    if(!page||route!==url.pathname&&!page.entry.docPage)continue;
    let id;
    try{id=decodeURIComponent(url.hash.slice(1));}catch{id=url.hash.slice(1);}
    const aliases=projected.get(page.entry.id)?.[page.locale];
    if(!pageIDs.get(url.pathname).has(id)&&!(aliases&&Object.hasOwn(aliases,id)&&isDeepStrictEqual(page.runtime?.anchorAliases?.[page.locale]?.[id],aliases[id])))errors.push({route,kind:'missingAnchor',target});
  }
  if(validateAliases){
    counts.aliases=0;const aliases=new Map([['/',null]]);
    for(const entry of manifest.entries)for(const route of entry.legacyRoutes)if(route!=='/')aliases.set(route,entry);
    for(const alias of manifest.redirects || [])aliases.set(alias.route,manifest.entries.find(e=>e.id===alias.id));
    for(const [pathname,entry]of aliases){
      const relative=pathname.slice(1)+(pathname.endsWith('.html')?'':'index.html'),file=path.join(output,relative);counts.aliases++;
      if(!fs.existsSync(file)){errors.push({route:pathname,kind:'missingAlias'});continue;}
      const raw=fs.readFileSync(file,'utf8');let runtime;walk(parse(raw),n=>{if(n.tagName==='script'&&attrs(n)['data-site-language']!==undefined)runtime=JSON.parse(n.childNodes.map(c=>c.value || '').join(''))});
      const explicit=pathname.match(/^\/docs\/([^/]+)\//)?.[1] || pathname.split('/')[1],expectedLocale=config.languages.some(l=>l.code===explicit)?explicit:null;
      if(runtime?.redirect?.pathname!==pathname || runtime.redirect.locale!==expectedLocale || runtime.primary!==config.primary || runtime.fallback!==config.fallback || JSON.stringify(runtime.languages)!==JSON.stringify(config.languages) || /location\.replace|http-equiv=["']refresh/i.test(raw))errors.push({route:pathname,kind:'aliasRuntime'});
      for(const {code}of config.languages){
        const target=entry?localeRoute(entry,code):'/'+code+'/';
        if(runtime?.urls?.[code]!==target || target===pathname || !pageIDs.has(target))errors.push({route:pathname,kind:'aliasTarget',code});
        for(const value of Object.values(runtime?.anchors?.[code] || {})){
          const targetPage=pages.get(value?.path);
          const valid=typeof value==='string'?pageIDs.get(target)?.get(value)===1:entry?.docPage&&targetPage?.locale===code&&(targetPage.entry.docPage?.work??(targetPage.entry.type==='work'?targetPage.entry.slug:null))===entry.docPage.work&&typeof value.anchor==='string'&&(!value.anchor||pageIDs.get(value.path).get(value.anchor)===1);
          if(!valid)errors.push({route:pathname,kind:'aliasAnchor',code,value});
        }
        for(const [oldId,newId]of Object.entries(manifest.redirects?.find(alias=>alias.route===pathname)?.anchorOverrides?.[code] || {})){
          try{
            const expected=typeof newId==='string'?newId:resolveDocumentAlias(newId,{entries:manifest.entries,locale:code,route:localeRoute,work:entry?.docPage?.work,pageIds:entryIDs});
            if(!isDeepStrictEqual(runtime?.anchors?.[code]?.[oldId],expected))errors.push({route:pathname,kind:'aliasAnchorOverride',code,oldId,newId});
          }catch(error){errors.push({route:pathname,kind:'aliasAnchorOverride',code,oldId,newId,message:error.message});}
        }
      }
    }
  }
  return {counts,errors};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const here=path.dirname(fileURLToPath(import.meta.url)),args=process.argv.slice(2),value=n=>args[args.indexOf(n)+1];
  const manifest=JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8')),site=path.resolve(here,'../..');
  const publication=projectPublication({...preflight({manifest,site}),site,redirects:manifest.redirects});
  const result=validateRuntime({manifest,publication,output:value('--output'),site});
  if(args.includes('--report'))fs.writeFileSync(value('--report'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result.counts)+`，运行契约错误 ${result.errors.length}`);
  if(result.errors.length)process.exitCode=1;
}
