import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {attrs,walk} from './extract-dom.mjs';
import {localeRoute} from './build.mjs';
const require=createRequire(new URL('../content-import/package.json',import.meta.url));
const {parse}=require('parse5');
export function validateRuntime({manifest,output,site}) {
  const errors=[],counts={pages:0,media:0,headings:0,codeFrames:0,inlineScripts:0};
  for(const entry of manifest.entries)for(const locale of ['zh','en']) {
    const route=localeRoute(entry,locale),relative=route.slice(1)+(route.endsWith('.html')?'':'index.html');
    const doc=parse(fs.readFileSync(path.join(output,relative),'utf8')),ids=new Set();
    walk(doc,n=>{if(attrs(n).id)ids.add(attrs(n).id)});
    let runtime,records;counts.pages++;
    const visit=(node,skip=false)=>{
      const a=attrs(node);skip ||= ['script','style','code','pre','svg'].includes(node.tagName);
      if(locale==='en' && !skip && node.nodeName==='#text' && /[\p{Script=Han}]/u.test(node.value) && !/^\s*(中文|梦之殇魂|.*备.*号.*?)\s*$/.test(node.value))errors.push({route,kind:'untranslatedText',value:node.value.trim()});
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
        if(!fs.existsSync(path.join(output,file)) && !fs.existsSync(path.join(site,file)))errors.push({route,kind:'missingLocalFile',target});
      }
      for(const child of node.childNodes || [])visit(child,skip);
    };visit(doc);
    if(runtime?.locale!==locale || runtime?.urls?.[locale]!==route)errors.push({route,kind:'languageRuntime'});
    if(entry.id==='page:works-index' && records) {
      const categories=new Map();for(const record of records) {const list=categories.get(record.categoryId) || [];list.push(record.order);categories.set(record.categoryId,list);}
      for(const [category,orders] of categories)if(orders.some((n,i)=>i>0 && n<orders[i-1]))errors.push({route,kind:'workOrder',category,orders});
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
