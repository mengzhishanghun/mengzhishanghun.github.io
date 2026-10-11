import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {attrs,walk} from './extract-dom.mjs';
import {localeRoute} from './build.mjs';
const require=createRequire(new URL('../content-import/package.json',import.meta.url));
const {parse}=require('parse5');
const normalized=value=>value.replace(/\s+/g,'');
function body(doc) {
  let found;
  walk(doc,n=>{if((attrs(n).class || '').split(/\s+/).some(c=>['sl-markdown-content','prose'].includes(c)) && (attrs(n).class?.includes('sl-markdown-content') || n.parentNode?.tagName==='article'))found=n;});
  return found;
}
function visibleText(node) {
  if(!node)return '';
  if(['style','script','svg','button'].includes(node.tagName) || (attrs(node).class || '').split(/\s+/).includes('sl-anchor-link'))return '';
  if(node.nodeName==='#text')return node.value;
  return (node.childNodes || []).map(visibleText).join('');
}
function structure(node) {
  if(!node)return '';
  if(['style','script'].includes(node.tagName))return '';
  const a=attrs(node),cls=(a.class || '').split(/\s+/).filter(Boolean).join('.');
  const prefix=node.tagName?node.tagName+(cls?'.'+cls:''):'';
  return prefix+'('+(node.childNodes || []).filter(n=>n.tagName).map(structure).join(',')+')';
}
export function validateBuild({manifest,site,output}) {
  const reports=[],broken=[],routes=new Set(manifest.entries.flatMap(e=>['zh','en'].map(l=>localeRoute(e,l))));
  const approved=new Set(['blog:cnblogs-19197541','blog:cnblogs-19165484','blog:cnblogs-19165541','blog:cnblogs-19136345']);
  for(const entry of manifest.entries) {
    const route=localeRoute(entry,'zh'),relative=route.slice(1)+(route.endsWith('.html')?'':'index.html');
    const old=parse(fs.readFileSync(path.join(site,entry.baselineTemplate),'utf8'));
    const next=parse(fs.readFileSync(path.join(output,relative),'utf8'));
    const a=body(old),b=body(next);
    const before=normalized(visibleText(a)),after=normalized(visibleText(b));
    let at=0;while(at<before.length && before[at]===after[at])at++;
    reports.push({id:entry.id,textEqual:before===after,approvedSourceRestoration:approved.has(entry.id),structureEqual:structure(a)===structure(b),...(before===after?{}:{firstDifference:at,oldSnippet:before.slice(Math.max(0,at-30),at+130),newSnippet:after.slice(Math.max(0,at-30),at+130)})});
    for(const locale of ['zh','en']) {
      const page=localeRoute(entry,locale),file=page.slice(1)+(page.endsWith('.html')?'':'index.html'),doc=parse(fs.readFileSync(path.join(output,file),'utf8'));
      walk(doc,node=>{
        const a=attrs(node);
        for(const key of ['href','src']) {
          const raw=a[key];if(!raw?.startsWith('/') || raw.startsWith('//'))continue;
          const target=decodeURIComponent(raw.split(/[?#]/)[0]);
          const relative=target.slice(1)+(target.endsWith('/')?'index.html':'');
          if(!routes.has(target) && !fs.existsSync(path.join(output,relative)) && !fs.existsSync(path.join(site,relative)))broken.push({page,target});
        }
      });
    }
  }
  return {reports,broken,textDifferences:reports.filter(r=>!r.textEqual),unexpectedTextDifferences:reports.filter(r=>!r.textEqual && !r.approvedSourceRestoration),structureDifferences:reports.filter(r=>!r.structureEqual)};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const here=path.dirname(fileURLToPath(import.meta.url)),args=process.argv.slice(2),value=n=>args[args.indexOf(n)+1];
  const manifest=JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8'));
  const result=validateBuild({manifest,site:path.resolve(here,'../..'),output:value('--output')});
  fs.writeFileSync(value('--report'),JSON.stringify(result,null,2)+'\n');
  console.log(`中文语义差异 ${result.textDifferences.length}，结构差异 ${result.structureDifferences.length}，不可达链接 ${result.broken.length}`);
  if(result.unexpectedTextDifferences.length || result.broken.length)process.exitCode=1;
}
