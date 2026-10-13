import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {attrs,walk} from './extract-dom.mjs';
import {localeRoute} from './build.mjs';
const require=createRequire(new URL('../../package.json',import.meta.url));
const {parse}=require('parse5');
export function validateRuntime({manifest,output,site,languageConfig,validateAliases=true}) {
  const errors=[],counts={pages:0,media:0,headings:0,codeFrames:0,inlineScripts:0};
  const config=languageConfig || JSON.parse(fs.readFileSync(path.join(output,'site-languages.json'),'utf8'));
  const pageIDs=new Map();
  for(const entry of manifest.entries)for(const {code:locale} of config.languages) {
    const route=localeRoute(entry,locale),relative=route.slice(1)+(route.endsWith('.html')?'':'index.html');
    const doc=parse(fs.readFileSync(path.join(output,relative),'utf8')),ids=new Set();
    walk(doc,n=>{if(attrs(n).id)ids.add(attrs(n).id)});
    pageIDs.set(route,ids);
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
      if(a.href?.startsWith('#') && a.href.length>1 && !ids.has(decodeURIComponent(a.href.slice(1))))errors.push({route,kind:'missingAnchor',target:a.href});
      for(const key of ['href','src']) {
        const value=a[key];if(!value || /^(?:[a-z]+:|\/\/|#)/i.test(value))continue;
        const url=new URL(value,'https://mzsh.me'+route),target=decodeURIComponent(url.pathname);
        const file=target.slice(1)+(target.endsWith('/')?'index.html':'');
        if(!fs.existsSync(path.join(output,file)))errors.push({route,kind:'missingLocalFile',target});
      }
      for(const child of node.childNodes || [])visit(child,skip);
    };visit(doc);
    if(runtime?.locale!==locale || runtime?.urls?.[locale]!==route || config.languages.some(l=>!runtime?.urls?.[l.code]) || !runtime?.languages || runtime.primary!==config.primary || runtime.fallback!==config.fallback)errors.push({route,kind:'languageRuntime'});
    if(entry.id==='page:works-index' && records) {
      const categories=new Map();for(const record of records) {const list=categories.get(record.categoryId) || [];list.push(record.order);categories.set(record.categoryId,list);}
      for(const [category,orders] of categories)if(orders.some((n,i)=>i>0 && n<orders[i-1]))errors.push({route,kind:'workOrder',category,orders});
    }
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
        for(const id of Object.values(runtime?.anchors?.[code] || {}))if(!pageIDs.get(target)?.has(id))errors.push({route:pathname,kind:'aliasAnchor',code,id});
        for(const [oldId,newId]of Object.entries(manifest.redirects?.find(alias=>alias.route===pathname)?.anchorOverrides?.[code] || {}))if(runtime?.anchors?.[code]?.[oldId]!==newId)errors.push({route:pathname,kind:'aliasAnchorOverride',code,oldId,newId});
      }
    }
  }
  return {counts,errors};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const here=path.dirname(fileURLToPath(import.meta.url)),args=process.argv.slice(2),value=n=>args[args.indexOf(n)+1];
  const result=validateRuntime({manifest:JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8')),output:value('--output'),site:path.resolve(here,'../..')});
  if(args.includes('--report'))fs.writeFileSync(value('--report'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result.counts)+`，运行契约错误 ${result.errors.length}`);
  if(result.errors.length)process.exitCode=1;
}
