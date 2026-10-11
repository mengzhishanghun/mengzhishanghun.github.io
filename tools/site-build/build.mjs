import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {pathToFileURL} from 'node:url';
import {attrs,walk,applyEdits,templateName} from './extract-dom.mjs';
const require = createRequire(new URL('../content-import/package.json',import.meta.url));
const YAML = require('yaml');
const {parse,parseFragment,serialize} = require('parse5');
const acorn=require('acorn');
const here = path.dirname(fileURLToPath(import.meta.url));
const {createMarkdownProcessor} = await import(pathToFileURL(require.resolve('@astrojs/markdown-remark')));
const {default:rehypeExpressiveCode} = await import(pathToFileURL(require.resolve('rehype-expressive-code')));
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJSON = value => JSON.stringify(value).replace(/</g,'\\u003c');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export function boundedPath(root,relative,label='路径') {
  if (!relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').includes('..')) throw new Error(`${label}越界: ${relative}`);
  const result = path.resolve(root,relative);
  if (!result.startsWith(path.resolve(root)+path.sep)) throw new Error(`${label}越界: ${relative}`);
  return result;
}
export function localeRoute(entry,locale) {
  const original = entry.legacyRoutes[0];
  if (original === '/') return `/${locale}/`;
  if (original === '/docs/404.html') return `/${locale}/docs/404.html`;
  return `/${locale}` + original.replace(/^\/docs\/(?:zh|en)\//,'/docs/');
}
export function readSource(vault,relative,label) {
  const abs = boundedPath(vault,relative,'来源路径');
  if (!fs.existsSync(abs)) throw new Error(`${label}缺失: ${relative}`);
  const bytes = fs.readFileSync(abs), raw = bytes.toString('utf8');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) throw new Error(`frontmatter缺失: ${relative}`);
  return {abs,bytes,raw,data:YAML.parse(match[1]),body:raw.slice(match[0].length)};
}
export function preflight({vault,site,manifest}) {
  const routes = new Map(), entries = [], ids = new Set();
  for (const entry of manifest.entries) {
    if (ids.has(entry.id)) throw new Error('内容ID重复: '+entry.id);
    ids.add(entry.id);
    for (const route of [...entry.legacyRoutes,...['zh','en'].map(locale => localeRoute(entry,locale))]) {
      if (!/^\/[a-zA-Z0-9/_-]*(?:\.html)?\/?$/.test(route)) throw new Error('非法路由: '+route);
      if (routes.has(route) && routes.get(route) !== entry.id) throw new Error('路由重复: '+route);
      routes.set(route,entry.id);
    }
    for (const media of entry.media || []) {
      if (media.path) {
        const file = boundedPath(vault,media.path,'媒体');
        if (!fs.existsSync(file)) throw new Error('媒体缺失: '+media.path);
        if (media.sha256 && hash(fs.readFileSync(file)) !== media.sha256) throw new Error('媒体hash变化: '+media.path);
      }
      if (media.websiteUrl && media.publish !== false) {
        const url = decodeURIComponent(media.websiteUrl);
        if (!url.startsWith('/') || url.startsWith('//')) throw new Error('媒体越界: '+url);
        if (!fs.existsSync(boundedPath(site,url.slice(1),'媒体'))) throw new Error('公开媒体缺失: '+url);
      }
    }
    for(const occurrence of entry.mediaOccurrences || []) {
      if(hash(fs.readFileSync(boundedPath(vault,occurrence.vaultPath,'媒体')))!==occurrence.sourceSha256)throw new Error('媒体来源hash漂移: '+occurrence.id);
      if(occurrence.state==='public' && hash(fs.readFileSync(boundedPath(site,occurrence.websiteUrl.slice(1),'媒体')))!==occurrence.publicSha256)throw new Error('公开媒体hash漂移: '+occurrence.id);
    }
    const zh = readSource(vault,entry.locales.zh.source,'来源');
    const en = readSource(vault,entry.locales.en.source,'译文');
    if (en.data.sourceHash !== hash(zh.bytes) || en.data.translationStatus !== 'translated') throw new Error('译文过期: '+entry.id);
    if (en.data.translationKey !== (entry.translationKey || entry.id)) throw new Error('译文身份不符: '+entry.id);
    if (en.data.generatedBodyHash !== hash(en.body.trim())) throw new Error('译文存在人工修改，保留并等待审核: '+entry.id);
    const supplements=[];
    for(const relative of entry.supplementSources || []) {
      const supplementalZh=readSource(vault,relative,'补充来源'),supplementalEn=readSource(vault,relative.replace('/zh/','/en/'),'补充译文');
      if(supplementalEn.data.sourceHash!==hash(supplementalZh.bytes)||supplementalEn.data.translationStatus!=='translated')throw new Error('补充译文过期: '+relative);
      if(supplementalEn.data.generatedBodyHash!==hash(supplementalEn.body.trim()))throw new Error('补充译文存在人工修改: '+relative);
      supplements.push({zh:supplementalZh,en:supplementalEn});
    }
    entries.push({...entry,sources:{zh,en},supplements});
  }
  return {routes,entries};
}
function routeFile(route) { return route.slice(1) + (route.endsWith('.html') ? '' : 'index.html'); }
function mapURL(url,locale,entries) {
  if (!url || /^(?:mailto:|tel:|data:|#)/i.test(url)) return url;
  const local = url.replace(/^https:\/\/mzsh\.me(?=\/)/,'');
  if (!local.startsWith('/') || local.startsWith('//')) return url;
  const match = local.match(/^([^?#]+)(.*)$/), pathname = match[1], suffix = match[2];
  for (const entry of entries) {
    if ([...entry.legacyRoutes,...['zh','en'].map(l => localeRoute(entry,l))].includes(pathname)) return localeRoute(entry,locale)+suffix;
    if (pathname.startsWith('/docs/en/') && entry.legacyRoutes.includes(pathname.replace('/docs/en/','/docs/zh/'))) return localeRoute(entry,locale)+suffix;
  }
  if (pathname === '/docs/' || pathname === '/docs/zh/' || pathname === '/docs/en/') {
    const first = entries.find(e => e.id === 'page:works-index');
    if (first) return localeRoute(first,locale)+suffix;
  }
  if (pathname === '/blog/rss.xml') return `/${locale}/blog/rss.xml`+suffix;
  if(pathname.startsWith('/blog-search/'))return `/${locale}`+pathname+suffix;
  return url;
}
function withoutSourceAttribution(source) {
  const parts=source.body.trim().split(/\n\s*\n/),last=parts.at(-1);
  if(source.data.sourceUrl && source.data.date && last?.includes(source.data.sourceUrl) && last.includes(String(source.data.date)))parts.pop();
  return parts.join('\n\n');
}
async function renderBody(entry,locale,processor,site) {
  const source = entry.sources[locale];
  let mediaOrdinal=0;
  const tokens=[];
  const mediaPlugin = () => tree => {
    const visit = node => {
      if (node.type === 'html') throw new Error('来源含未批准HTML: '+entry.id);
      if (node.type === 'image') {
        if(entry.mediaOccurrences) {
          const occurrence=entry.mediaOccurrences[mediaOrdinal++];
          if(!occurrence || decodeURIComponent(occurrence.source)!==decodeURIComponent(node.url))throw new Error('媒体occurrence歧义: '+entry.id+' '+mediaOrdinal);
          const token='MZSH_MEDIA_OCCURRENCE_'+mediaOrdinal;
          tokens.push({token,occurrence});
          node.type='text';node.value=token;delete node.url;delete node.alt;
          return;
        }
        const ref = (entry.sourceMediaReferences || []).find(r => decodeURIComponent(r.source) === decodeURIComponent(node.url));
        let url = ref?.websiteUrl || (node.url.startsWith('/') && !node.url.startsWith('/附件/') ? node.url : null);
        if (!url || !fs.existsSync(boundedPath(site,decodeURIComponent(url.slice(1)),'媒体'))) throw new Error('未知媒体公开权限: '+entry.id+' '+node.url);
        node.url = url;
      }
      if (node.type === 'link') {
        if(entry.relativeLinkTargets?.[node.url])node.url=entry.relativeLinkTargets[node.url];
        else if(/^(?:\.{1,2}\/)*CHANGELOG\.md$/i.test(node.url)) {
          const note=processor.copy[locale].missingPublicFileNote;
          if(typeof note!=='string')throw new Error('缺失公共文件提示来源: '+entry.id);
          const label=(node.children || []).map(n=>n.value || '').join('');
          node.type='text';node.value=label+note;delete node.url;delete node.children;
        } else node.url = mapURL(node.url,locale,processor.entries);
      }
      if (node.type === 'heading' && entry.type==='blog') node.depth=Math.min(6,node.depth+1);
      if (node.type === 'code' && node.lang==='blueprint')node.lang='text';
      if (node.type === 'code' && node.lang==='C')node.lang='plaintext';
      for (const child of node.children || []) visit(child);
    }; visit(tree);
  };
  const markdown = await createMarkdownProcessor({syntaxHighlight:entry.type==='blog'?'shiki':false,shikiConfig:{theme:'github-dark'},remarkPlugins:[mediaPlugin],rehypePlugins:entry.type==='blog'?[]:[rehypeExpressiveCode]});
  let body = withoutSourceAttribution(source).replace(/^\s*# [^\n]+\n/,'');
  if(entry.type==='page' && entry.slug==='not-found')body=source.body.trim().split(/\n\s*\n/).at(-1);
  if(entry.type==='blog')body=body.replace(/^(`{3,})C\+\+\s*$/gm,'$1plaintext');
  if(entry.type==='blog')body=body.replace(/\n原文于 \d{4}-\d{2}-\d{2} 发表于\[[^\]]+\]\([^\n]+\)\。?\s*$/,'');
  if(entry.supplements?.length) {
    const headingRecords=JSON.parse(fs.readFileSync(path.join(here,'heading-scaffolds.json'),'utf8'))[entry.id];
    const delimiter=headingRecords.find(r=>r.oldId==='使用说明补充');
    const labels=Object.values(processor.copy[locale].bodyUtilitySlots?.[delimiter?.utilityId] || {});
    const label=labels.map(v=>v.match(/“([^”]+)”/)?.[1]).find(Boolean);
    if(!label)throw new Error('补充章节辅助来源缺失: '+entry.id);
    body+='\n\n'+(entry.supplementDivider?'---\n\n':'')+'## '+label;
    for(const supplemental of entry.supplements)body+='\n\n'+withoutSourceAttribution(supplemental[locale]).replace(/^\s*# ([^\n]+)\n/,'## $1\n');
  }
  const result = await markdown.render(body);
  let code=result.code;
  if(entry.bodyTitle) {
    const first=source.body.match(/^\s*# ([^\n]+)/)?.[1];
    if(!first)throw new Error('来源首标题缺失: '+entry.id);
    const titleProcessor=await createMarkdownProcessor({syntaxHighlight:false});
    const titleHTML=(await titleProcessor.render(first)).code.replace(/^<p>|<\/p>\s*$/g,'');
    code=entry.bodyTitle.template.replace('{{sourceTitleMarkup}}',titleHTML)+code;
  }
  const scaffoldFile=path.join(here,'body-utility-scaffolds.json');
  const scaffolds=tokens.length?JSON.parse(fs.readFileSync(scaffoldFile,'utf8')):{};
  for(const {token,occurrence} of tokens) {
    const slots=processor.copy[locale].bodyUtilitySlots?.[occurrence.utilityId];
    if(!slots)throw new Error('正文媒体辅助译文缺失: '+occurrence.utilityId);
    let markup=scaffolds[occurrence.utilityId].replace(/\{\{text:([^}]+)\}\}/g,(_,key)=>{if(typeof slots[key]!=='string')throw new Error('正文辅助slot缺失: '+occurrence.utilityId+' '+key);return escapeHTML(slots[key]);});
    if(markup.startsWith('<p>')) {
      const fragment=parseFragment(markup,{sourceCodeLocationInfo:true});let anchor;
      walk(fragment,n=>{if(n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('media-image-trigger'))anchor=n;});
      if(anchor)markup=markup.slice(anchor.sourceCodeLocation.startOffset,anchor.sourceCodeLocation.endOffset);
    }
    code=code.includes('<p>'+token+'</p>') && /^<(?:figure|div)\b/.test(markup) ? code.replace('<p>'+token+'</p>',markup) : code.replace(token,markup);
  }
  code=serialize(parseFragment(code));
  const codeScaffoldFile=path.join(here,'code-scaffolds.json');
  const codeScaffolds=fs.existsSync(codeScaffoldFile)?JSON.parse(fs.readFileSync(codeScaffoldFile,'utf8'))[entry.id]:null;
  if(codeScaffolds) {
    const fragment=parseFragment(code,{sourceCodeLocationInfo:true}),edits=[];
    const text=node=>node.nodeName==='#text'?node.value:(node.childNodes || []).map(text).join('');
    const normalized=value=>value.replace(/\r\n/g,'\n').replace(/\n$/,'');
    let ordinal=0;
    walk(fragment,node=>{
      if(node.tagName!=='pre')return;
      const content=node.childNodes.find(n=>n.tagName==='code');if(!content)return;
      const record=codeScaffolds[ordinal++],lines=[];
      walk(content,n=>{if((attrs(n).class || '').split(/\s+/).includes('ec-line'))lines.push(text(n));});
      if(!record || normalized(record.code)!==normalized(lines.length?lines.join('\n'):text(content)))return;
      let root=node;
      if(node.parentNode?.tagName==='figure' && (attrs(node.parentNode.parentNode).class || '').split(/\s+/).includes('expressive-code'))root=node.parentNode.parentNode;
      const loc=root.sourceCodeLocation;edits.push([loc.startOffset,loc.endOffset,record.markup]);
    });code=applyEdits(code,edits);
  }
  if(entry.type==='doc') {
    const labels=processor.copy[locale].codeLabels;
    if(!labels)throw new Error('代码辅助文案缺失: '+locale);
    const fragment=parseFragment(code,{sourceCodeLocationInfo:true}),edits=[];
    walk(fragment,node=>{
      const a=attrs(node),loc=node.sourceCodeLocation;
      if(!loc)return;
      if(node.tagName==='figure' && (a.class || '').split(/\s+/).includes('frame') && !(a.class || '').split(/\s+/).includes('not-content') && loc.attrs?.class)edits.push([loc.attrs.class.startOffset,loc.attrs.class.endOffset,`class="${escapeHTML(a.class+' not-content')}"`]);
      if(node.nodeName==='#text' && ['Terminal window',processor.copy.zh.codeLabels.terminalWindow].includes(node.value))edits.push([loc.startOffset,loc.endOffset,escapeHTML(labels.terminalWindow)]);
      if(node.tagName==='button' && (attrs(node.parentNode).class || '').split(/\s+/).includes('copy'))for(const [key,value] of [['title',labels.copyTitle],['data-copied',labels.copied]]) {
        const at=loc.attrs?.[key];if(at)edits.push([at.startOffset,at.endOffset,`${key}="${escapeHTML(value)}"`]);
      }
    });code=applyEdits(code,edits);
  }
  if(entry.mediaOccurrences && mediaOrdinal!==entry.mediaOccurrences.length)throw new Error('媒体occurrence数量漂移: '+entry.id);
  const headings=result.metadata.headings;
  if(['doc','blog'].includes(entry.type)) {
    const records=JSON.parse(fs.readFileSync(path.join(here,'heading-scaffolds.json'),'utf8'))[entry.id];
    if(records?.length!==headings.length)throw new Error('heading结构不能唯一配对: '+entry.id+' source='+headings.length+' DOM='+records?.length);
    const fragment=parseFragment(code,{sourceCodeLocationInfo:true}),nodes=[];
    walk(fragment,node=>{if(/^h[1-6]$/.test(node.tagName || ''))nodes.push(node)});
    const edits=[];
    nodes.forEach((node,i)=>{
      const record=records[i],loc=node.sourceCodeLocation;
      const id=locale==='zh'?record.oldId:headings[i].slug;
      let template=record.template.replaceAll('{{headingId}}',escapeHTML(id)).replace('{{headingMarkup}}',code.slice(loc.startTag.endOffset,loc.endTag.startOffset));
      if(record.utilityId) {
        const slots=processor.copy[locale].bodyUtilitySlots[record.utilityId];
        let anchor=scaffolds[record.utilityId] || JSON.parse(fs.readFileSync(scaffoldFile,'utf8'))[record.utilityId];
        anchor=anchor.replace(/\{\{text:([^}]+)\}\}/g,(_,key)=>escapeHTML(slots[key]));
        anchor=anchor.replace(/href="#[^"]*"/,`href="#${escapeHTML(id)}"`);
        template=template.replace('{{anchor}}',anchor);
      }
      edits.push([loc.startOffset,loc.endOffset,template]);headings[i]={...headings[i],slug:id,depth:record.depth};
    });
    code=applyEdits(code,edits);
  }
  return {code,headings};
}
function outline(headings) {
  const roots=[], stack=[];
  for (const h of headings) {
    const node = {...h,children:[]};
    while (stack.length && stack.at(-1).depth >= h.depth) stack.pop();
    (stack.length ? stack.at(-1).children : roots).push(node); stack.push(node);
  }
  const list = (items,root) => items.map(h => `<li class="outline-node" data-heading-depth="${h.depth}"><a href="#${encodeURIComponent(h.slug)}" class="outline-link${root?' outline-root-link':''}">${escapeHTML(h.text)}</a>${h.children.length?'<ol class="outline-tree">'+list(h.children,false)+'</ol>':''}</li>`).join('');
  return list(roots,true);
}
function translationDictionary(copy,entries,locale) {
  const dict = new Map();
  for(const [id,slots] of Object.entries(copy.zh.shellSlots || {})) for(const [key,value] of Object.entries(slots)) if(typeof copy[locale].shellSlots?.[id]?.[key]==='string') dict.set(value,copy[locale].shellSlots[id][key]);
  for(const [key,value] of Object.entries(copy.zh.scriptSlots || {})) if(typeof copy[locale].scriptSlots?.[key]==='string') dict.set(value,copy[locale].scriptSlots[key]);
  for(const entry of entries) for(const field of ['title','description','categoryName','status','coverAlt']) if(typeof entry.sources.zh.data[field]==='string' && typeof entry.sources[locale].data[field]==='string') {
    const value=entry.sources[locale].data[field];
    if(locale!=='en' || !/[\p{Script=Han}]/u.test(value) || !dict.has(entry.sources.zh.data[field]))dict.set(entry.sources.zh.data[field],value);
  }
  return dict;
}
function localizeJSON(value,dict,entries,locale) {
  if(typeof value==='string') return mapURL(dict.get(value) ?? value,locale,entries);
  if(Array.isArray(value)) {
    const result=value.map(v=>localizeJSON(v,dict,entries,locale));
    if(result.length && result.every(v=>v && typeof v==='object' && entries.some(e=>e.type==='work' && e.slug===v.slug)))result.sort((a,b)=>entries.find(e=>e.type==='work' && e.slug===a.slug).cardOrder-entries.find(e=>e.type==='work' && e.slug===b.slug).cardOrder);
    return result;
  }
  if(value && typeof value==='object') {
    const result=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localizeJSON(v,dict,entries,locale)]));
    const match=entries.find(e=>e.slug===value.slug && (value.type ? e.type===value.type : true));
    if(match) for(const field of ['title','description','categoryName','status','order']) if(field in value && match.sources[locale].data[field]!==undefined)result[field]=localizeJSON(match.sources[locale].data[field],dict,entries,locale);
    if(match && 'body' in value)result.body=match.searchBodies?.[locale] || '';
    return result;
  }
  return value;
}
function completeHTML(html,entry,locale,entries,labels,anchors,scriptSlots,dict,scriptURLs) {
  const doc = parse(html,{sourceCodeLocationInfo:true}), edits=[];
  const urls = Object.fromEntries(['zh','en'].map(l => [l,localeRoute(entry,l)]));
  const runtime = {locale,urls,anchors,labels};
  const nav = `<nav class="site-language-switch" aria-label="${escapeHTML(labels.group)}">`+['zh','en'].map(l => `<a data-site-locale="${l}" href="${urls[l]}" lang="${l}" hreflang="${l}" data-active="${l===locale}" aria-label="${escapeHTML(labels[l+'Aria'])}">${escapeHTML(labels[l])}</a>`).join('')+'</nav>';
  let actions = 0;
  walk(doc,node => {
    const a=attrs(node),loc=node.sourceCodeLocation;
    if (!loc) return;
    if (node.tagName==='html' && loc.attrs?.lang) edits.push([loc.attrs.lang.startOffset,loc.attrs.lang.endOffset,`lang="${locale==='zh'?'zh-CN':'en'}"`]);
    if ((a.class || '').split(/\s+/).includes('header-actions')) {actions++;edits.push([loc.endTag.startOffset,loc.endTag.startOffset,nav]);}
    if (node.tagName==='head') {
      edits.push([loc.startTag.endOffset,loc.startTag.endOffset,`<script>window.SiteCopy=${safeJSON(scriptSlots || {})}</script>`]);
      edits.push([loc.endTag.startOffset,loc.endTag.startOffset,`<link rel="stylesheet" href="/assets/site-ui/language-switch.css">`+['zh','en'].map(l=>`<link rel="alternate" hreflang="${l}" href="https://mzsh.me${urls[l]}">`).join('')]);
    }
    if (node.tagName==='body') edits.push([loc.endTag.startOffset,loc.endTag.startOffset,`<script type="application/json" data-site-language>${safeJSON(runtime)}</script><script defer src="/assets/site-ui/language-switch.js"></script>`]);
    if(node.tagName==='script' && scriptURLs?.has(a.src) && loc.attrs?.src)edits.push([loc.attrs.src.startOffset,loc.attrs.src.endOffset,`src="${scriptURLs.get(a.src)}"`]);
    if(node.tagName==='script' && a.type==='application/json' && loc.startTag && loc.endTag) {
      const raw=html.slice(loc.startTag.endOffset,loc.endTag.startOffset);
      if(raw.trim()) edits.push([loc.startTag.endOffset,loc.endTag.startOffset,safeJSON(localizeJSON(JSON.parse(raw),dict,entries,locale))]);
    }
    if(a['data-content-card']!==undefined && a['data-slug'] && a.style && loc.attrs?.style) {
      const work=entries.find(e=>e.type==='work' && e.slug===a['data-slug']);
      if(work && work.cardOrder!==undefined)edits.push([loc.attrs.style.startOffset,loc.attrs.style.endOffset,`style="${escapeHTML(a.style.replace(/order:\s*\d+/,'order:'+work.cardOrder))}"`]);
    }
    for(const attribute of node.attrs || []) {
      if(!/[\p{Script=Han}]/u.test(attribute.value) || ['href','action'].includes(attribute.name))continue;
      const translated=dict.get(attribute.value),at=loc.attrs?.[attribute.name];
      if(translated!==undefined && at) edits.push([at.startOffset,at.endOffset,`${attribute.name}="${escapeHTML(translated)}"`]);
    }
    for (const name of ['href','action']) {
      if (!a[name] || !loc.attrs?.[name]) continue;
      let value = mapURL(a[name],locale,entries);
      if (node.tagName==='link' && a.rel==='canonical') value='https://mzsh.me'+urls[locale];
      if (value!==a[name]) edits.push([loc.attrs[name].startOffset,loc.attrs[name].endOffset,`${name}="${escapeHTML(value)}"`]);
    }
  });
  if (actions!==1) throw new Error('header-actions不是唯一: '+entry.id);
  return applyEdits(html,edits);
}
function redirect(target,labels,root=false) {
  const runtime = root ? {root:true,urls:{zh:'/zh/',en:'/en/'}} : null;
  const js = root ? '' : `<script>location.replace(${safeJSON(target)}+location.search+location.hash)</script>`;
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><link rel="canonical" href="https://mzsh.me${target}"><title>${escapeHTML(labels.group)}</title></head><body><a href="${target}">${escapeHTML(labels.zh)}</a>${js}${root?'<script type="application/json" data-site-language>'+safeJSON(runtime)+'</script><script defer src="/assets/site-ui/language-switch.js"></script>':''}</body></html>`;
}
export async function buildSite(options) {
  const {site,vault,manifest,output,check=false}=options;
  const {entries} = preflight(options);
  let copy = options.copy;
  if (!copy) {
    const zh=readSource(vault,manifest.common.locales.zh.source,'公共来源'),en=readSource(vault,manifest.common.locales.en.source,'公共译文');
    if (en.data.sourceHash!==hash(zh.bytes) || en.data.translationStatus!=='translated') throw new Error('公共译文过期');
    if(en.data.translationKey!=='site-copy')throw new Error('公共译文身份不符');
    if(en.data.generatedBodyHash!==hash(en.body.trim()))throw new Error('公共译文存在人工修改，保留并等待审核');
    copy={zh:zh.data,en:en.data};
  }
  const files = new Map(), rendered = new Map();
  const scriptURLs=new Map(),scriptManifest=path.join(here,'scripts.json');
  if(!options.templateRoot && fs.existsSync(scriptManifest)) for(const relative of JSON.parse(fs.readFileSync(scriptManifest,'utf8'))) {
    let code=fs.readFileSync(boundedPath(path.join(here,'scripts'),relative),'utf8');
    const edits=[],tree=acorn.parse(code,{ecmaVersion:'latest',sourceType:'module'});
    const visit=node=>{
      if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type) && node.source?.type==='Literal' && node.source.value.startsWith('.')) {
        const absolute=path.posix.join('/',path.posix.dirname(relative),node.source.value);edits.push([node.source.start,node.source.end,JSON.stringify(absolute)]);
      }
      for(const value of Object.values(node))if(Array.isArray(value))value.forEach(x=>{if(x?.type)visit(x)});else if(value?.type)visit(value);
    };visit(tree);code=applyEdits(code,edits);
    const target='assets/site-ui/i18n/'+path.posix.basename(relative).replace(/\.js$/,'.'+hash(code).slice(0,12)+'.js');
    files.set(target,Buffer.from(code));scriptURLs.set('/'+relative,'/'+target);
  }
  for (const entry of entries) for (const locale of ['zh','en']) rendered.set(entry.id+':'+locale,await renderBody(entry,locale,{entries,copy},site));
  const orderedWorks=entries.filter(e=>e.type==='work').sort((a,b)=>(a.sources.zh.data.categoryOrder ?? 0)-(b.sources.zh.data.categoryOrder ?? 0)||(a.sources.zh.data.order ?? 0)-(b.sources.zh.data.order ?? 0));
  orderedWorks.forEach((e,i)=>e.cardOrder=i);
  for(const entry of entries) {
    entry.searchBodies={};
    for(const locale of ['zh','en']) {
      let text='';
      const visit=node=>{if(['script','style'].includes(node.tagName))return;if(node.nodeName==='#text')text+=node.value+' ';else for(const child of node.childNodes || [])visit(child)};
      visit(parseFragment(rendered.get(entry.id+':'+locale).code));entry.searchBodies[locale]=text.trim();
    }
  }
  for (const entry of entries) for (const locale of ['zh','en']) {
    const result=rendered.get(entry.id+':'+locale), other=rendered.get(entry.id+':'+(locale==='zh'?'en':'zh'));
    if (result.headings.length!==other.headings.length) throw new Error('章节映射歧义: '+entry.id);
    const slots=copy[locale].shellSlots?.[entry.id], dict=translationDictionary(copy,entries,locale);
    if (!slots) throw new Error('外壳译文缺失: '+entry.id+' '+locale);
    const file=path.join(options.templateRoot || path.join(here,'templates'),entry.template);
    let html=fs.readFileSync(file,'utf8').replaceAll('/blog-search/',`/${locale}/blog-search/`);
    html=html.replace(/\{\{text:([^}]+)\}\}/g,(_,key)=>{if(typeof slots[key]!=='string') throw new Error('文本槽缺失: '+entry.id+' '+locale+' '+key);const original=copy.zh.shellSlots[entry.id]?.[key];return escapeHTML(dict.get(original) ?? slots[key]);});
    html=html.replace('{{body}}',result.code).replace('{{outline}}',outline(result.headings));
    if (/\{\{(?:text|body|outline)/.test(html)) throw new Error('模板槽未解析: '+entry.id);
    const anchors = Object.fromEntries(['zh','en'].map(l=>[l,Object.fromEntries(result.headings.map((h,i)=>[h.slug,rendered.get(entry.id+':'+l).headings[i].slug]))]));
    html=completeHTML(html,entry,locale,entries,copy[locale].languageLabels,anchors,copy[locale].scriptSlots,dict,scriptURLs);
    files.set(routeFile(localeRoute(entry,locale)),Buffer.from(html));
  }
  for (const entry of entries) for (const route of entry.legacyRoutes) if (route!=='/') files.set(routeFile(route),Buffer.from(redirect(localeRoute(entry,'zh'),copy.zh.languageLabels)));
  for(const alias of manifest.redirects || []) {
    const entry=entries.find(e=>e.id===alias.id);
    if(!entry)throw new Error('旧链目标缺失: '+alias.route);
    const target=localeRoute(entry,alias.locale);
    if(alias.route===target)throw new Error('旧链循环: '+alias.route);
    files.set(routeFile(alias.route),Buffer.from(redirect(target,copy[alias.locale].languageLabels)));
  }
  files.set('index.html',Buffer.from(redirect('/zh/',copy.zh.languageLabels,true)));
  files.set('robots.txt',Buffer.from('User-agent: *\nAllow: /\nSitemap: https://mzsh.me/sitemap.xml\n'));
  files.set('sitemap.xml',Buffer.from('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+entries.filter(e=>e.slug!=='not-found').flatMap(e=>['zh','en'].map(l=>'<url><loc>https://mzsh.me'+localeRoute(e,l)+'</loc>'+['zh','en'].map(a=>'<xhtml:link rel="alternate" hreflang="'+a+'" href="https://mzsh.me'+localeRoute(e,a)+'"/>').join('')+'</url>')).join('')+'</urlset>\n'));
  for(const locale of ['zh','en']) {
    const blogs=entries.filter(e=>e.type==='blog').sort((a,b)=>String(b.sources[locale].data.date || '').localeCompare(String(a.sources[locale].data.date || '')));
    const title=copy[locale].shellSlots?.['page:blog-index'];
    const rssTitle=Object.entries(title || {}).find(([key])=>key.includes('title'))?.[1] || blogs[0]?.sources[locale].data.title || '';
    const rss='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>'+escapeHTML(rssTitle)+'</title><link>https://mzsh.me/'+locale+'/blog/</link><description>'+escapeHTML(rssTitle)+'</description><language>'+locale+'</language>'+blogs.map(e=>'<item><title>'+escapeHTML(e.sources[locale].data.title)+'</title><link>https://mzsh.me'+localeRoute(e,locale)+'</link><guid>https://mzsh.me'+localeRoute(e,locale)+'</guid><description>'+escapeHTML(e.sources[locale].data.description || '')+'</description></item>').join('')+'</channel></rss>\n';
    files.set(locale+'/blog/rss.xml',Buffer.from(rss));
  }
  if(!options.templateRoot) {
    const pagefind=await import(new URL('../content-import/node_modules/pagefind/lib/index.js',import.meta.url));
    try {
      for(const locale of ['zh','en']) {
        const created=await pagefind.createIndex({forceLanguage:locale==='zh'?'zh-cn':'en'});
        if(created.errors.length || !created.index)throw new Error('Pagefind创建失败: '+created.errors.join(';'));
        for(const entry of entries.filter(e=>e.slug!=='not-found')) {
          const route=localeRoute(entry,locale),result=await created.index.addHTMLFile({url:route,content:files.get(routeFile(route)).toString('utf8')});
          if(result.errors.length)throw new Error('Pagefind失败: '+route+' '+result.errors.join(';'));
        }
        const result=await created.index.getFiles();
        if(result.errors.length)throw new Error('Pagefind产物失败: '+result.errors.join(';'));
        for(const file of result.files)files.set(locale+'/blog-search/'+file.path,Buffer.from(file.content));
      }
    }finally{await pagefind.close();}
  }
  const differences=[];
  for (const [relative,bytes] of files) {
    const file=boundedPath(output,relative);
    if (!fs.existsSync(file)||!fs.readFileSync(file).equals(bytes)) differences.push(relative);
  }
  if (!check) for (const [relative,bytes] of files) {
    const file=boundedPath(output,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
  }
  return {pages:entries.length*2,differences,files:[...files.keys()]};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), value = name => args[args.indexOf(name)+1];
  if (!args.includes('--vault')) throw new Error('必须指定 --vault <路径>');
  const manifest = JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8'));
  const result=await buildSite({vault:path.resolve(value('--vault')),site:path.resolve(here,'../..'),manifest,output:args.includes('--output') ? path.resolve(value('--output')) : path.resolve(here,'../..'),check:args.includes('--check')});
  console.log(`双语页面 ${result.pages}，受管产物 ${result.files.length}，${args.includes('--check')?'差异':'写出'} ${result.differences.length}`);
  if(args.includes('--check') && result.differences.length)process.exitCode=1;
}
