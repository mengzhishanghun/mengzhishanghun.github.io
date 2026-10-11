import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(new URL('../content-import/package.json', import.meta.url));
const { parse } = require('parse5');
const acorn = require('acorn');
export function extractScript(source,id) {
  const slots={},edits=[];
  const tree=acorn.parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const visit=node=>{
    if (node.type==='Literal' && typeof node.value==='string' && /[\p{Script=Han}]/u.test(node.value)) {
      const key=id+':'+node.start; slots[key]=node.value;
      edits.push([node.start,node.end,`(window.SiteCopy[${JSON.stringify(key)}]||"")`]);
    }
    if (node.type==='TemplateElement' && /[\p{Script=Han}]/u.test(node.value.cooked || '')) {
      const key=id+':'+node.start; slots[key]=node.value.cooked;
      edits.push([node.start,node.end,`\${window.SiteCopy[${JSON.stringify(key)}]||""}`]);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(child=>{if(child?.type)visit(child);});
      else if(value?.type)visit(value);
    }
  };visit(tree);
  return {script:applyEdits(source,edits),slots};
}
export const attrs = node => Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
export const templateName = id => id.replace(/[^a-zA-Z0-9_-]/g,'--') + '.html';
export function walk(node, fn, key = 'root') {
  fn(node, key);
  (node.childNodes || []).forEach((child, i) => walk(child, fn, `${key}.${child.tagName || child.nodeName}:${i}`));
}
export function applyEdits(html, edits) {
  let last = html.length;
  for (const [start, end, value] of edits.sort((a,b) => b[0] - a[0])) {
    if (end > last || start > end) throw new Error('模板编辑边界重叠');
    html = html.slice(0,start) + value + html.slice(end);
    last = start;
  }
  return html;
}
export function extractTemplate(html,id='inline') {
  const doc = parse(html, {sourceCodeLocationInfo:true});
  const slots = {}, scriptSlots={}, edits = [], excluded = new Set();
  const regions = {};
  const exclude = node => walk(node, child => excluded.add(child));
  walk(doc, (node, key) => {
    const a = attrs(node), classes = (a.class || '').split(/\s+/);
    const body = classes.includes('sl-markdown-content') || classes.includes('prose') && node.parentNode?.tagName === 'article';
    const outline = classes.includes('outline-tree-root');
    if (!body && !outline) return;
    const kind = body ? 'body' : 'outline';
    if (regions[kind]) throw new Error('正文或目录区域不唯一');
    const loc = node.sourceCodeLocation;
    if (!loc?.startTag || !loc.endTag) throw new Error('正文或目录边界缺失');
    regions[kind] = {key, markup:html.slice(loc.startTag.endOffset,loc.endTag.startOffset)};
    edits.push([loc.startTag.endOffset,loc.endTag.startOffset,`{{${kind}}}`]);
    for (const child of node.childNodes || []) exclude(child);
  });
  walk(doc, (node,key) => {
    if (excluded.has(node)) return;
    const loc = node.sourceCodeLocation;
    if (!loc) return;
    const add = (id,value,start,end) => { slots[id] = value; edits.push([start,end,`{{text:${id}}}`]); };
    if (node.nodeName === '#text' && node.value.trim() && !['script','style'].includes(node.parentNode?.tagName)) {
      add(key,node.value,loc.startOffset,loc.endOffset);
    }
    const a = attrs(node);
    if (node.tagName==='script' && !a.src && !a.type?.includes('json') && loc.startTag && loc.endTag) {
      const source=html.slice(loc.startTag.endOffset,loc.endTag.startOffset);
      if(source.trim()) {
        const result=extractScript(source,id+':'+key);
        Object.assign(scriptSlots,result.slots);
        if(Object.keys(result.slots).length)edits.push([loc.startTag.endOffset,loc.endTag.startOffset,result.script]);
      }
    }
    for (const name of ['alt','title','aria-label','placeholder']) {
      if (!a[name]?.trim()) continue;
      const at = loc.attrs?.[name];
      if (at) { const id = `${key}@${name}`; slots[id] = a[name]; edits.push([at.startOffset,at.endOffset,`${name}="{{text:${id}}}"`]); }
    }
    if (node.tagName === 'meta' && ['description','og:title','og:description','twitter:title','twitter:description'].includes(a.name || a.property)) {
      const at = loc.attrs?.content;
      if (at && a.content) { const id = `${key}@content`; slots[id] = a.content; edits.push([at.startOffset,at.endOffset,`content="{{text:${id}}}"`]); }
    }
  });
  return {template:applyEdits(html,edits),slots,scriptSlots,regions};
}
export function exportTemplates({site, map, output, templateDir}) {
  const pages = [],scriptSlots={};
  fs.mkdirSync(templateDir,{recursive:true});
  for (const entry of map.entries) {
    const route = entry.legacyRoutes.find(r => !r.startsWith('/docs/en/'));
    const file = route.endsWith('.html') ? route.slice(1) : route.slice(1) + 'index.html';
    const result = extractTemplate(fs.readFileSync(path.join(site,file),'utf8'),entry.id);
    Object.assign(scriptSlots,result.scriptSlots);
    fs.writeFileSync(path.join(templateDir,templateName(entry.id)),result.template);
    pages.push({id:entry.id,route,slots:result.slots,regions:Object.keys(result.regions)});
  }
  fs.writeFileSync(output,JSON.stringify({version:1,pages,scriptSlots},null,2)+'\n');
  return pages;
}
export function exportScripts(site,output) {
  const scriptSlots={},scripts={};
  for(const directory of ['_astro','assets/site-ui']) {
    for(const name of fs.readdirSync(path.join(site,directory)).filter(n=>n.endsWith('.js'))) {
      if(name.startsWith('language-switch'))continue;
      const relative=directory+'/'+name;
      const result=extractScript(fs.readFileSync(path.join(site,relative),'utf8'),relative);
      if(Object.keys(result.slots).length) {Object.assign(scriptSlots,result.slots);scripts[relative]=result.script;}
    }
  }
  const data={version:1,scriptSlots,scripts};
  fs.writeFileSync(output,JSON.stringify(data,null,2)+'\n');
  return data;
}
export function collectRedirects(site,entries) {
  const redirects=[];
  const scan=dir=>{
    for(const file of fs.readdirSync(dir,{withFileTypes:true})) {
      const abs=path.join(dir,file.name);
      if(file.isDirectory()){scan(abs);continue;}
      if(!file.name.endsWith('.html'))continue;
      const html=fs.readFileSync(abs,'utf8'),doc=parse(html);
      let destination;
      walk(doc,node=>{const a=attrs(node);if(node.tagName==='meta' && a['http-equiv']?.toLowerCase()==='refresh')destination=a.content?.match(/url=(.*)$/)?.[1];});
      if(!destination)continue;
      const route='/'+path.relative(site,abs).replaceAll('\\','/').replace(/index\.html$/,'');
      const entry=entries.find(e=>e.legacyRoutes.includes(destination) || e.legacyRoutes.includes(destination.replace('/docs/en/','/docs/zh/')));
      if(!entry)throw new Error('旧跳转目标不明: '+route+' -> '+destination);
      redirects.push({route,id:entry.id,locale:route.startsWith('/docs/en/')?'en':'zh'});
    }
  };
  for(const root of ['docs','works','blog'])scan(path.join(site,root));
  return redirects;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = name => args[args.indexOf(name)+1];
  if (!args.includes('--map') || !args.includes('--output')) throw new Error('需要 --map <映射JSON> --output <槽位JSON>');
  const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  const pages = exportTemplates({site,map:JSON.parse(fs.readFileSync(option('--map'),'utf8')),output:option('--output'),templateDir:path.join(site,'tools/site-build/templates')});
  console.log(`已提取 ${pages.length} 页外壳与文本槽位`);
}
