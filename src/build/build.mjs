import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {pathToFileURL} from 'node:url';
import {attrs,walk,applyEdits,templateName} from './extract-dom.mjs';
import {readLanguages,languageSource,publicLanguages} from './languages.mjs';
import {mapMedia} from './media.mjs';
import {assertPublicFields} from './source-schema.mjs';
import {articleTypes,validateArticleIdentities,shareRoute} from '../engagement/article-identities.mjs';
import {loadResources,regularPath,resourcePath,safeRelative} from './resources.mjs';
import {renderWorkMetadata,renderWorkCardStatuses} from '../works/metadata.mjs';
import {projectBlogTopics} from '../blog/topics.mjs';
import {projectContentTopics} from './content-topics.mjs';
const require = createRequire(new URL('../../package.json',import.meta.url));
const YAML = require('yaml');
const {parse,parseFragment,serialize} = require('parse5');
const acorn=require('acorn');
const here = path.dirname(fileURLToPath(import.meta.url));
const indexContentTypes=new Map([['page:blog-index','blog'],['page:works-index','work'],['page:cases-index','case']]);
const {createMarkdownProcessor} = await import(pathToFileURL(require.resolve('@astrojs/markdown-remark')));
const {default:rehypeExpressiveCode} = await import(pathToFileURL(require.resolve('rehype-expressive-code')));
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJSON = value => JSON.stringify(value).replace(/</g,'\\u003c');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const textHash = value => hash(String(value).replaceAll('\r\n','\n'));
export function boundedPath(root,relative,label='路径') {
  try{safeRelative(relative);}catch{throw new Error(`${label}越界: ${relative}`);}
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
  regularPath(vault,relative);const bytes = fs.readFileSync(abs), raw = bytes.toString('utf8');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) throw new Error(`frontmatter缺失: ${relative}`);
  return {abs,bytes,raw,data:YAML.parse(match[1]),body:raw.slice(match[0].length)};
}
export function sourceTags(source) {
  const tags=source.data.tags ?? [],search=source.data.searchTags ?? [];
  if(![tags,search].every(list=>Array.isArray(list) && list.every(value=>typeof value==='string' && value.trim())))throw new Error('来源标签必须为字符串数组');
  return {tags:[...new Set(tags)],searchTags:[...new Set([...tags,...search])]};
}
export function contentTags(entry,locale) {
  return entry.projectedTags?.[locale] || sourceTags(entry.sources[locale]);
}
export function preflight({sourceRoot,site,manifest}) {
  validateArticleIdentities(manifest.entries,JSON.parse(fs.readFileSync(path.join(here,'../engagement/article-identities.json'),'utf8')));
  sourceRoot ||= path.join(site,'src');
  const config=readLanguages(sourceRoot,manifest.entries.map(e=>e.id)),{primary,languages}=config;
  const codes=languages.map(l=>l.code),routes=new Map(),entries=[],ids=new Set();
  const verifyTranslation=(source,original,key,label)=>{
    if(source.data.translationKey!==key)throw new Error(label+'身份不符');
    if(source.data.sourceHash!==textHash(original.raw) || source.data.translationStatus!=='translated')throw new Error(label+'过期');
    if(source.data.generatedBodyHash!==textHash(source.body.trim()))throw new Error(label+'存在人工修改，保留并等待审核');
  };
  const validList=list=>Array.isArray(list) && list.every(v=>typeof v==='string' && v.trim()) && new Set(list).size===list.length;
  for(const entry of manifest.entries) {
    if(ids.has(entry.id))throw new Error('内容ID重复: '+entry.id);ids.add(entry.id);
    for(const route of [...entry.legacyRoutes,...codes.map(code=>localeRoute(entry,code))]) {
      if(!/^\/[a-zA-Z0-9/_-]*(?:\.html)?\/?$/.test(route))throw new Error('非法路由: '+route);
      if(routes.has(route) && routes.get(route)!==entry.id)throw new Error('路由重复: '+route);routes.set(route,entry.id);
    }
    mapMedia(entry,{site});
    if(entry.cover){
      if(!/^\/(?:assets|media)\//.test(entry.cover.websiteUrl || '') || /[?#]|\/\.\.\//.test(entry.cover.websiteUrl))throw new Error('封面地址越界');
      if(hash(fs.readFileSync(resourcePath(site,entry.cover.websiteUrl.slice(1))))!==entry.cover.sha256)throw new Error('封面hash漂移');
    }
    const sources=Object.fromEntries(languages.map(lang=>[lang.code,readSource(sourceRoot,languageSource(lang,lang.sources[entry.id]),lang.code===primary?'来源':'译文')]));
    for(const lang of languages) {
      assertPublicFields(sources[lang.code].data);
      if(sources[lang.code].data.translationKey!==(entry.translationKey || entry.id))throw new Error('来源身份不符: '+entry.id);
      if(sources[lang.code].data.draft===true)throw new Error('草稿不得发布: '+entry.id);
      if((lang.code!==primary || sources[lang.code].data.lang!==undefined) && sources[lang.code].data.lang!==lang.code)throw new Error('来源语言不符: '+entry.id);
      sourceTags(sources[lang.code]);
      if(entry.cover && sources[lang.code].data.websiteCoverUrl!==entry.cover.websiteUrl)throw new Error('来源封面地址不符');
      if(lang.code!==primary)verifyTranslation(sources[lang.code],sources[primary],entry.translationKey || entry.id,'译文');
    }
    const lists=Object.fromEntries(languages.map(lang=>[lang.code,sources[lang.code].data.supplementSources ?? []])),keys=entry.supplementTranslationKeys ?? [];
    if(!validList(keys) || languages.some(l=>!validList(lists[l.code]) || lists[l.code].length!==keys.length))throw new Error('补充来源列表不符: '+entry.id);
    const supplements=keys.map((key,index)=>{
      const pair=Object.fromEntries(languages.map(lang=>{
        const relative=lists[lang.code][index];
        if(lang.root&&!relative.startsWith(lang.root+'/'))throw new Error('补充译文路径越界');
        const source=readSource(sourceRoot,relative,lang.code===primary?'补充来源':'补充译文');
        assertPublicFields(source.data);
        if(source.data.translationKey!==key)throw new Error('补充译文身份不符');
        if(source.data.draft===true)throw new Error('补充草稿不得发布: '+entry.id);
        if(source.data.lang!==lang.code)throw new Error('补充译文身份不符');
        return [lang.code,source];
      }));
      for(const lang of languages)if(lang.code!==primary)verifyTranslation(pair[lang.code],pair[primary],key,'补充译文');
      return pair;
    });
    entries.push({...entry,sources,supplements,languageCodes:codes});
  }
  const common=Object.fromEntries(languages.map(lang=>[lang.code,readSource(sourceRoot,languageSource(lang,lang.commonSource),'公共来源')]));
  for(const lang of languages) {
    assertPublicFields(common[lang.code].data,true);
    if(common[lang.code].data.translationKey!=='site-copy')throw new Error('公共来源身份不符');
    if(common[lang.code].data.language?.code!==lang.code)throw new Error('公共来源语言不符');
    if(lang.code!==primary)verifyTranslation(common[lang.code],common[primary],'site-copy','公共译文');
  }
  const copy=Object.fromEntries(languages.map(lang=>[lang.code,common[lang.code].data]));
  for(const lang of languages) {
    const item=copy[lang.code],base=copy[primary];
    if(typeof item.languageLabels?.group!=='string' || typeof item.languageLabels?.switchAria!=='string' || !item.languageLabels.switchAria.includes('{language}'))throw new Error('公共语言文案缺失');
    for(const group of ['shellSlots','scriptSlots','bodyUtilitySlots']) {
      if(!item[group] || typeof item[group]!=='object')throw new Error('公共文案槽缺失: '+group);
      const checkSlots=(original,translated)=>{for(const [key,value] of Object.entries(original)){if(typeof value==='string'){if(typeof translated?.[key]!=='string')throw new Error('公共文案槽缺失: '+key)}else if(value && typeof value==='object')checkSlots(value,translated?.[key])}};
      checkSlots(base[group],item[group]);
    }
  }
  projectBlogTopics({site,entries,config,copy});
  projectContentTopics({site,entries,config,copy,type:'work',indexId:'page:works-index',topicsPath:'src/works/topics.json',labelPrefix:'work-topic'});
  projectContentTopics({site,entries,config,copy,type:'case',indexId:'page:cases-index',topicsPath:'src/cases/topics.json',labelPrefix:'case-topic'});
  return {routes,entries,config,copy};
}
function routeFile(route) { return route.slice(1) + (route.endsWith('.html') ? '' : 'index.html'); }
function mapURL(url,locale,entries) {
  if (!url || /^(?:mailto:|tel:|data:|#)/i.test(url)) return url;
  const local = url.replace(/^https:\/\/mzsh\.me(?=\/)/,'');
  if (!local.startsWith('/') || local.startsWith('//')) return url;
  const match = local.match(/^([^?#]+)(.*)$/), pathname = match[1], suffix = match[2];
  for (const entry of entries) {
    if ([...entry.legacyRoutes,...(entry.languageCodes || []).map(l => localeRoute(entry,l))].includes(pathname)) return localeRoute(entry,locale)+suffix;
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
          if(!occurrence || '/media-occurrence/'+encodeURIComponent(occurrence.id)!==node.url)throw new Error('媒体occurrence歧义: '+entry.id+' '+mediaOrdinal);
          if(!occurrence.utilityId){if(occurrence.state!=='public')throw new Error('隐藏媒体缺占位模板');node.url=occurrence.websiteUrl;return;}
          const token='MZSH_MEDIA_OCCURRENCE_'+mediaOrdinal;
          tokens.push({token,occurrence});
          node.type='text';node.value=token;delete node.url;delete node.alt;
          return;
        }
        throw new Error('未知媒体公开权限: '+entry.id);
      }
      if (node.type === 'link') {
        if(entry.relativeLinkTargets?.[node.url])node.url=entry.relativeLinkTargets[node.url];
        else if(/^(?:\.{1,2}\/)*CHANGELOG\.md$/i.test(node.url)) {
          const note=processor.copy[locale].missingPublicFileNote;
          if(typeof note!=='string')throw new Error('缺失公共文件提示来源: '+entry.id);
          const label=(node.children || []).map(n=>n.value || '').join('');
          node.type='text';node.value=label+note;delete node.url;delete node.children;
        } else {if(/^(?:javascript|data|file|obsidian):/i.test(node.url))throw new Error('不安全链接');node.url = mapURL(node.url,locale,processor.entries);}
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
      if(node.nodeName==='#text' && ['Terminal window',processor.copy[processor.primary].codeLabels.terminalWindow].includes(node.value))edits.push([loc.startOffset,loc.endOffset,escapeHTML(labels.terminalWindow)]);
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
      const id=locale===processor.primary?record.oldId:headings[i].slug;
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
function translationDictionary(copy,entries,locale,primary) {
  const dict = new Map();
  for(const [id,slots] of Object.entries(copy[primary].shellSlots || {})) for(const [key,value] of Object.entries(slots)) if(typeof copy[locale].shellSlots?.[id]?.[key]==='string') dict.set(value,copy[locale].shellSlots[id][key]);
  for(const [key,value] of Object.entries(copy[primary].scriptSlots || {})) if(typeof copy[locale].scriptSlots?.[key]==='string') dict.set(value,copy[locale].scriptSlots[key]);
  for(const entry of entries) for(const field of ['title','description','categoryName','status','coverAlt']) if(typeof entry.sources[primary].data[field]==='string' && typeof entry.sources[locale].data[field]==='string') {
    const value=entry.sources[locale].data[field];
    if(locale===primary || !/[\p{Script=Han}]/u.test(value) || !dict.has(entry.sources[primary].data[field]))dict.set(entry.sources[primary].data[field],value);
  }
  return dict;
}
function localizeJSON(value,dict,entries,locale,contentType) {
  if(typeof value==='string') return mapURL(dict.get(value) ?? value,locale,entries);
  if(Array.isArray(value)) {
    const result=value.map(v=>localizeJSON(v,dict,entries,locale,contentType));
    if(result.length && result.every(v=>v && typeof v==='object' && entries.some(e=>e.type==='work' && e.slug===v.slug)))result.sort((a,b)=>entries.find(e=>e.type==='work' && e.slug===a.slug).cardOrder-entries.find(e=>e.type==='work' && e.slug===b.slug).cardOrder);
    return result;
  }
  if(value && typeof value==='object') {
    const result=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localizeJSON(v,dict,entries,locale,contentType)]));
    const match=entries.find(e=>e.slug===value.slug && (value.type || contentType ? e.type===(value.type || contentType) : true));
    if(match) for(const field of ['title','description','categoryName','status','order']) if(field in value && match.sources[locale].data[field]!==undefined)result[field]=localizeJSON(match.sources[locale].data[field],dict,entries,locale);
    if(match && 'body' in value)result.body=match.searchBodies?.[locale] || '';
    if(match && ('tags' in value || 'searchTags' in value)){const {tags,searchTags}=contentTags(match,locale);Object.assign(result,{tags,searchTags});}
    if(match && 'coverAlt' in value)result.coverAlt=match.sources[locale].data.coverAlt ?? '';
    return result;
  }
  return value;
}
function completeHTML(html,entry,locale,entries,labels,anchors,scriptSlots,dict,scriptURLs,config,engagementLabels) {
  const doc = parse(html,{sourceCodeLocationInfo:true}), edits=[], excluded=new Set();
  const contentType=indexContentTypes.get(entry.id);
  const urls=Object.fromEntries(config.languages.map(l=>[l.code,localeRoute(entry,l.code)]));
  const runtime={...publicLanguages(config),locale,urls,anchors,labels};
  const nav='<label class="site-language-switch"><select data-site-language-select data-current="'+locale+'" aria-label="'+escapeHTML(labels.group)+'">'+config.languages.map(l=>'<option value="'+l.code+'" data-site-locale="'+l.code+'"'+(l.code===locale?' selected':'')+'>'+escapeHTML(l.label)+'</option>').join('')+'</select></label>';
  let actions = 0;
  let engagementBodies=0,engagementSlots=0;
  const article=articleTypes.has(entry.type);
  const contentIndex=['page:blog-index','page:works-index','page:cases-index'].includes(entry.id);
  const neutral=article?shareRoute(entry,locale,localeRoute(entry,locale)):null;
  if(article && ![...entry.legacyRoutes,...(config.shareAliases || [])].includes(neutral))throw new Error('通用分享入口未登记: '+neutral);
  walk(doc,node => {
    if(excluded.has(node))return;
    const a=attrs(node),loc=node.sourceCodeLocation;
    if (!loc) return;
    if(contentType && a['data-content-index']!==undefined)edits.push([loc.startTag.endOffset-1,loc.startTag.endOffset-1,' data-content-tags-display="all" data-content-topic-aliases="'+escapeHTML(safeJSON(entry.topicAliases?.[locale] || {}))+'"']);
    if(contentIndex && a['data-content-card']!==undefined && loc.attrs?.hidden)edits.push([loc.attrs.hidden.startOffset,loc.attrs.hidden.endOffset,'']);
    if(contentIndex && ['content-category-nav','content-filter'].some(cls=>(a.class || '').split(/\s+/).includes(cls)) && a.hidden===undefined)edits.push([loc.startTag.endOffset-1,loc.startTag.endOffset-1,' hidden']);
    if(contentIndex && a['data-content-pagination']!==undefined && a.hidden===undefined)edits.push([loc.startTag.endOffset-1,loc.startTag.endOffset-1,' hidden']);
    if(node.tagName==='a' && a.href==='/about/' && (attrs(node.parentNode).class || '').split(/\s+/).includes('header-actions')) {
      edits.push([loc.startOffset,loc.endOffset,'']);
      walk(node,child=>excluded.add(child));
      return;
    }
    if(article && ['prose','sl-markdown-content'].some(cls=>(a.class || '').split(/\s+/).includes(cls)) && (node.parentNode?.tagName==='article' || (a.class || '').includes('sl-markdown-content'))) {
      engagementBodies++;
    }
    if(article && (a.class || '').split(/\s+/).includes('article-back') && (attrs(node.parentNode).class || '').split(/\s+/).includes('article-sidebar')) {
      engagementSlots++;
      if(!engagementLabels || Object.values(engagementLabels).some(v=>typeof v!=='string'))throw new Error('互动文案缺失');
      const data={id:entry.id,origin:'https://mzsh.me',url:'https://mzsh.me'+neutral,title:entry.sources[config.fallback].data.title,labels:engagementLabels};
      const markup='<section class="article-engagement" data-article-engagement data-pagefind-ignore="true" aria-label="'+escapeHTML(engagementLabels.group)+'"><div class="article-engagement-actions"><button type="button" data-engagement-like aria-pressed="false" hidden><svg class="article-engagement-icon article-engagement-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg><span class="article-engagement-sr-only" data-engagement-like-label>'+escapeHTML(engagementLabels.like)+'</span> <span data-engagement-count aria-label="'+escapeHTML(engagementLabels.count)+'">—</span></button><button type="button" data-engagement-share aria-label="'+escapeHTML(engagementLabels.share)+'" title="'+escapeHTML(engagementLabels.share)+'"><svg class="article-engagement-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg><span class="article-engagement-sr-only">'+escapeHTML(engagementLabels.share)+'</span></button><p class="article-engagement-status" data-engagement-status aria-live="polite" role="status"></p></div><label class="article-engagement-manual" data-engagement-manual hidden>'+escapeHTML(engagementLabels.manualLabel)+'<input type="url" data-engagement-url readonly value="'+escapeHTML(data.url)+'"></label><script type="application/json" data-engagement-config>'+safeJSON(data)+'</script><noscript><label class="article-engagement-manual">'+escapeHTML(engagementLabels.manualLabel)+'<input type="url" readonly value="'+escapeHTML(data.url)+'"></label></noscript></section>';
      edits.push([loc.startTag.startOffset,loc.startTag.startOffset,'<div class="article-detail-controls">']);
      edits.push([loc.endTag.endOffset,loc.endTag.endOffset,markup+'</div>']);
    }
    if(node.nodeName==='#text') {
      const raw=html.slice(loc.startOffset,loc.endOffset);
      let protectedText=false;
      for(let parent=node.parentNode;parent;parent=parent.parentNode)if(['pre','code','textarea'].includes(parent.tagName))protectedText=true;
      const normalized=protectedText?raw:node.parentNode?.tagName==='script'?(attrs(node.parentNode).type?.includes('json')?raw:raw.replace(/^\s+/,space=>space.replaceAll('\r\n','\n'))):node.parentNode?.tagName==='style'||!raw.trim()?raw.replaceAll('\r\n','\n'):raw;
      if(normalized!==raw)edits.push([loc.startOffset,loc.endOffset,normalized]);
    }
    if (node.tagName==='html' && loc.attrs?.lang) edits.push([loc.attrs.lang.startOffset,loc.attrs.lang.endOffset,`lang="${config.languages.find(l=>l.code===locale).htmlLang}"`]);
    if ((a.class || '').split(/\s+/).includes('header-actions')) {actions++;edits.push([loc.endTag.startOffset,loc.endTag.startOffset,nav]);}
    if (node.tagName==='head') {
      if(contentIndex)edits.push([loc.endTag.startOffset,loc.endTag.startOffset,'<link rel="stylesheet" href="/assets/site-ui/content-index.css">']);
      edits.push([loc.startTag.endOffset,loc.startTag.endOffset,`<script>window.SiteCopy=${safeJSON(scriptSlots || {})};window.SiteLanguageCode=${safeJSON(locale)};window.SitePrimaryCode=${safeJSON(config.primary)}</script>`]);
      edits.push([loc.endTag.startOffset,loc.endTag.startOffset,`<link rel="stylesheet" href="/assets/site-ui/language-switch.css">`+config.languages.map(({code:l})=>`<link rel="alternate" hreflang="${l}" href="https://mzsh.me${urls[l]}">`).join('')]);
      if(article)edits.push([loc.endTag.startOffset,loc.endTag.startOffset,'<link rel="stylesheet" href="/assets/site-ui/engagement.css"><script defer src="/assets/site-ui/engagement.js"></script>']);
    }
    if (node.tagName==='body') edits.push([loc.endTag.startOffset,loc.endTag.startOffset,`<script type="application/json" data-site-language>${safeJSON(runtime)}</script><script defer src="/assets/site-ui/language-switch.js"></script>`]);
    if(node.tagName==='script' && scriptURLs?.has(a.src) && loc.attrs?.src)edits.push([loc.attrs.src.startOffset,loc.attrs.src.endOffset,`src="${scriptURLs.get(a.src)}"`]);
    if(node.tagName==='script' && a.type==='application/json' && loc.startTag && loc.endTag) {
      const raw=html.slice(loc.startTag.endOffset,loc.endTag.startOffset);
      if(raw.trim()) edits.push([loc.startTag.endOffset,loc.endTag.startOffset,safeJSON(localizeJSON(JSON.parse(raw),dict,entries,locale,contentType))]);
    }
    if(['content-card-tags','work-card-tags'].some(cls=>(a.class || '').split(/\s+/).includes(cls)) && loc.startTag && loc.endTag) {
      let card=node;while(card && attrs(card)['data-content-card']===undefined)card=card.parentNode;
      const target=card?entries.find(e=>e.slug===attrs(card)['data-slug'] && (!contentType || e.type===contentType)):entry;
      if(!target)throw new Error('标签卡片来源缺失');
      const child=node.childNodes.find(n=>n.tagName),tag=child?.tagName || (node.tagName==='ul'?'li':'span');
      const open=child?.sourceCodeLocation?.startTag?html.slice(child.sourceCodeLocation.startTag.startOffset,child.sourceCodeLocation.startTag.endOffset):'<'+tag+'>';
      edits.push([loc.startTag.endOffset,loc.endTag.startOffset,contentTags(target,locale).tags.map(text=>open+escapeHTML(text)+'</'+tag+'>').join('')]);
    }
    if(a['data-content-card']!==undefined && a['data-slug']){
      const item=contentType?entries.find(e=>e.type===contentType&&e.slug===a['data-slug']):null;
      if(item)edits.push([loc.startTag.endOffset-1,loc.startTag.endOffset-1,' data-content-legacy-tags="'+escapeHTML(safeJSON(contentTags(item,locale).legacyTags))+'"']);
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
  if(article && engagementBodies!==1)throw new Error('文章互动正文容器不是唯一: '+entry.id);
  if(article && engagementSlots!==1)throw new Error('文章互动侧栏插槽不是唯一: '+entry.id);
  return applyEdits(html,edits);
}
function redirect({pathname,entry,explicitLocale=null,anchors={},config,labels}) {
  const locale=config.languages.find(l=>l.code===(explicitLocale || config.primary));
  const urls=Object.fromEntries(config.languages.map(l=>[l.code,entry?localeRoute(entry,l.code):'/'+l.code+'/']));
  const target=urls[locale.code],runtime={...publicLanguages(config),urls,anchors,labels,redirect:{pathname,locale:explicitLocale}};
  return '<!DOCTYPE html><html lang="'+locale.htmlLang+'"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><link rel="canonical" href="https://mzsh.me'+target+'"><title>'+escapeHTML(labels.group)+'</title></head><body><a href="'+target+'">'+escapeHTML(locale.label)+'</a><script type="application/json" data-site-language>'+safeJSON(runtime)+'</script><script defer src="/assets/site-ui/language-switch.js"></script></body></html>';
}
export function normalizeScriptEntries(entries) {
  if(!Array.isArray(entries))throw new Error('脚本清单必须为数组');
  const sources=new Map(),owners=new Map();
  const validPath=value=>typeof value==='string' && /^[a-zA-Z0-9_./-]+\.js$/.test(value) && !value.includes('\\') && value.split('/').every(part=>part && part!=='.' && part!=='..');
  for(const entry of entries) {
    const record=typeof entry==='string'?{source:entry,aliases:[]}:entry;
    if(!record || Array.isArray(record) || typeof record!=='object' || Object.keys(record).some(key=>!['source','aliases'].includes(key)) || !validPath(record.source) || (record.aliases!==undefined && !Array.isArray(record.aliases)))throw new Error('脚本条目无效或路径越界');
    const urls=['/'+record.source,...(record.aliases || [])];
    for(const url of urls) {
      if(typeof url!=='string' || !url.startsWith('/') || !validPath(url.slice(1)))throw new Error('脚本别名无效或路径越界');
      if(owners.has(url) && owners.get(url)!==record.source)throw new Error('脚本别名跨来源冲突: '+url);
      owners.set(url,record.source);
    }
    let normalized=sources.get(record.source);
    if(!normalized)sources.set(record.source,normalized={source:record.source,urls:[]});
    for(const url of urls)if(!normalized.urls.includes(url))normalized.urls.push(url);
  }
  return [...sources.values()];
}
export async function buildSite(options) {
  const {site,manifest,output,check=false}=options;
  const {entries,config,copy}=preflight(options),{primary,languages}=config,codes=languages.map(l=>l.code);
  let profile=null;
  if(entries.some(entry=>entry.id==='page:about')){
    profile=JSON.parse(fs.readFileSync(regularPath(options.sourceRoot || path.join(site,'src'),'about/profile.json'),'utf8'));
    if(Object.keys(profile).length!==1||!Number.isInteger(profile.birthYear)||profile.birthYear<1||profile.birthYear>9999)throw new Error('关于我出生年配置无效');
  }
  config.shareAliases=(manifest.redirects || []).map(alias=>alias.route);
  const resources = !options.templateRoot?loadResources({site}):new Map(), files=new Map(), rendered = new Map();
  const scriptURLs=new Map(),scriptManifest=path.join(here,'scripts.json');
  if(!options.templateRoot && fs.existsSync(scriptManifest)) for(const {source:relative,urls} of normalizeScriptEntries(JSON.parse(fs.readFileSync(scriptManifest,'utf8')))) {
    let code=fs.readFileSync(regularPath(path.join(here,'../shared/i18n/scripts'),relative),'utf8');
    const edits=[],tree=acorn.parse(code,{ecmaVersion:'latest',sourceType:'module'});
    const visit=node=>{
      const source=node.source,value=source?.type==='Literal'?source.value:source?.type==='TemplateLiteral' && source.expressions.length===0?source.quasis[0].value.cooked:null;
      if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type) && typeof value==='string' && value.startsWith('.')) {
        const absolute=path.posix.join('/',path.posix.dirname(relative),value);edits.push([source.start,source.end,JSON.stringify(absolute)]);
      }
      for(const value of Object.values(node))if(Array.isArray(value))value.forEach(x=>{if(x?.type)visit(x)});else if(value?.type)visit(value);
    };visit(tree);code=applyEdits(code,edits);
    const target='assets/site-ui/i18n/'+path.posix.basename(relative).replace(/\.js$/,'.'+hash(code).slice(0,12)+'.js');
    files.set(target,Buffer.from(code));for(const url of urls)scriptURLs.set(url,'/'+target);
  }
  for (const entry of entries) for (const locale of codes) rendered.set(entry.id+':'+locale,await renderBody(entry,locale,{entries,copy,primary},site));
  const orderedWorks=entries.filter(e=>e.type==='work').sort((a,b)=>(a.sources[primary].data.categoryOrder ?? 0)-(b.sources[primary].data.categoryOrder ?? 0)||(a.sources[primary].data.order ?? 0)-(b.sources[primary].data.order ?? 0));
  orderedWorks.forEach((e,i)=>e.cardOrder=i);
  for(const entry of entries) {
    entry.searchBodies={};
    for(const locale of codes) {
      let text='';
      const visit=node=>{if(['script','style'].includes(node.tagName))return;if(node.nodeName==='#text')text+=node.value+' ';else for(const child of node.childNodes || [])visit(child)};
      visit(parseFragment(rendered.get(entry.id+':'+locale).code));entry.searchBodies[locale]=text.trim();
    }
  }
  for (const entry of entries) for (const locale of codes) {
    const result=rendered.get(entry.id+':'+locale), other=rendered.get(entry.id+':'+primary);
    if (result.headings.length!==other.headings.length) throw new Error('章节映射歧义: '+entry.id);
    const slots=copy[locale].shellSlots?.[entry.id], dict=translationDictionary(copy,entries,locale,primary);
    if (!slots) throw new Error('外壳译文缺失: '+entry.id+' '+locale);
    const file=regularPath(options.templateRoot || options.sourceRoot || path.join(site,'src'),entry.template);
    let html=fs.readFileSync(file,'utf8').replaceAll('/blog-search/',`/${locale}/blog-search/`);
    html=html.replace(/\{\{text:([^}]+)\}\}/g,(_,key)=>{if(typeof slots[key]!=='string') throw new Error('文本槽缺失: '+entry.id+' '+locale+' '+key);const original=copy[primary].shellSlots[entry.id]?.[key];return escapeHTML(dict.get(original) ?? slots[key]);});
    if(entry.id==='page:works-index')html=renderWorkCardStatuses(html,entries,locale,copy[locale].workLabels);
    if(entry.type==='work')html=renderWorkMetadata(html,entry.sources[locale].data,copy[locale].workLabels);
    if(entry.id==='page:about')html=html.replaceAll('{{profile:birthYear}}',String(profile.birthYear));
    html=html.replace('{{body}}',result.code).replace('{{outline}}',outline(result.headings));
    if (/\{\{(?:text|body|outline|profile)/.test(html)) throw new Error('模板槽未解析: '+entry.id);
    const anchors = Object.fromEntries(codes.map(l=>[l,Object.fromEntries(result.headings.map((h,i)=>[h.slug,rendered.get(entry.id+':'+l).headings[i].slug]))]));
    html=completeHTML(html,entry,locale,entries,copy[locale].languageLabels,anchors,copy[locale].scriptSlots,dict,scriptURLs,config,copy[locale].engagementLabels);
    files.set(routeFile(localeRoute(entry,locale)),Buffer.from(html));
  }
  const aliases=new Map();
  for(const alias of [...entries.flatMap(e=>e.legacyRoutes.filter(route=>route!=='/').map(route=>({route,id:e.id}))),...manifest.redirects || []]) {
    if(!/^\/[a-zA-Z0-9/_-]*(?:\.html)?\/?$/.test(alias.route))throw new Error('旧链路径无效');
    const entry=entries.find(e=>e.id===alias.id);if(!entry)throw new Error('旧链目标缺失: '+alias.route);
    if(files.has(routeFile(alias.route)))throw new Error('旧链覆盖正文或资源: '+alias.route);
    if(aliases.has(alias.route) && aliases.get(alias.route).id!==entry.id)throw new Error('旧链目标冲突');
    aliases.set(alias.route,{...alias,entry});
  }
  const aliasPageIDs=new Map();
  for(const entry of entries)for(const code of codes){
    const ids=new Map();walk(parse(files.get(routeFile(localeRoute(entry,code))).toString()),node=>{const id=attrs(node).id;if(id)ids.set(id,(ids.get(id)||0)+1)});
    aliasPageIDs.set(entry.id+':'+code,ids);
  }
  for(const [pathname,{entry,anchorOverrides}]of aliases) {
    const oldCode=pathname.match(/^\/docs\/([^/]+)\//)?.[1] || pathname.split('/')[1],explicitLocale=codes.includes(oldCode)?oldCode:null;
    const source=rendered.get(entry.id+':'+(explicitLocale || primary)).headings,anchors={};
    for(const code of codes){const target=rendered.get(entry.id+':'+code).headings,map={};
      if(source.length!==target.length)throw new Error('旧链章节映射歧义');
      const sourceIDs=aliasPageIDs.get(entry.id+':'+(explicitLocale || primary)),targetIDs=aliasPageIDs.get(entry.id+':'+code);
      source.forEach((h,i)=>{if(!sourceIDs.has(h.slug))return;if(sourceIDs.get(h.slug)!==1 || targetIDs.get(target[i].slug)!==1 || (map[h.slug] && map[h.slug]!==target[i].slug))throw new Error('旧链章节映射缺失或歧义');map[h.slug]=target[i].slug});anchors[code]=map;
      const url=localeRoute(entry,code);if(!files.has(routeFile(url)) || url===pathname)throw new Error('旧链目标缺失或循环');
    }
    if(anchorOverrides!==undefined){
      const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
      if(!object(anchorOverrides))throw new Error('旧链锚点覆盖配置无效');
      for(const [code,map]of Object.entries(anchorOverrides)){
        if(!codes.includes(code)||!object(map))throw new Error('旧链锚点覆盖语言或映射无效');
        for(const [oldId,newId]of Object.entries(map)){
          if(!oldId.trim()||typeof newId!=='string'||!newId.trim()||aliasPageIDs.get(entry.id+':'+code).get(newId)!==1)throw new Error('旧链锚点覆盖目标缺失或歧义');
          anchors[code][oldId]=newId;
        }
      }
    }
    files.set(routeFile(pathname),Buffer.from(redirect({pathname,entry,explicitLocale,anchors,config,labels:copy[explicitLocale || primary].languageLabels})));
  }
  files.set('index.html',Buffer.from(redirect({pathname:'/',config,labels:copy[primary].languageLabels})));
  files.set('site-languages.json',Buffer.from(safeJSON(publicLanguages(config))+'\n'));
  files.set('robots.txt',Buffer.from('User-agent: *\nAllow: /\nSitemap: https://mzsh.me/sitemap.xml\n'));
  files.set('sitemap.xml',Buffer.from('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+entries.filter(e=>e.slug!=='not-found').flatMap(e=>codes.map(l=>'<url><loc>https://mzsh.me'+localeRoute(e,l)+'</loc>'+codes.map(a=>'<xhtml:link rel="alternate" hreflang="'+a+'" href="https://mzsh.me'+localeRoute(e,a)+'"/>').join('')+'</url>')).join('')+'</urlset>\n'));
  for(const locale of codes) {
    const blogs=entries.filter(e=>e.type==='blog').sort((a,b)=>String(b.sources[locale].data.date || '').localeCompare(String(a.sources[locale].data.date || '')));
    const title=copy[locale].shellSlots?.['page:blog-index'];
    const rssTitle=Object.entries(title || {}).find(([key])=>key.includes('title'))?.[1] || blogs[0]?.sources[locale].data.title || '';
    const rss='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>'+escapeHTML(rssTitle)+'</title><link>https://mzsh.me/'+locale+'/blog/</link><description>'+escapeHTML(rssTitle)+'</description><language>'+locale+'</language>'+blogs.map(e=>'<item><title>'+escapeHTML(e.sources[locale].data.title)+'</title><link>https://mzsh.me'+localeRoute(e,locale)+'</link><guid>https://mzsh.me'+localeRoute(e,locale)+'</guid><description>'+escapeHTML(e.sources[locale].data.description || '')+'</description></item>').join('')+'</channel></rss>\n';
    files.set(locale+'/blog/rss.xml',Buffer.from(rss));
  }
  if(options.indexSearch!==false) {
    const pagefind=await import(new URL('../../node_modules/pagefind/lib/index.js',import.meta.url));
    try {
      for(const locale of codes) {
        const created=await pagefind.createIndex({forceLanguage:languages.find(l=>l.code===locale).searchLanguage});
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
  for(const [relative,bytes]of resources){if(files.has(relative))throw new Error('生成产物覆盖资源: '+relative);files.set(relative,bytes);}
  const differences=[];
  const registry=Buffer.from(JSON.stringify({version:1,articleIds:entries.filter(e=>articleTypes.has(e.type)).map(e=>e.id)},null,2)+'\n');
  const registryOutput=options.registryOutput || path.join(site,'dist/services/engagement/articles.json');
  if(path.resolve(registryOutput).startsWith(path.resolve(output)+path.sep))throw new Error('服务registry不得进入静态输出');
  if(!options.templateRoot&&fs.existsSync(output)){
    if(fs.lstatSync(output).isSymbolicLink())throw new Error('输出目录不得为符号链接');
    const existing=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(item=>{const file=path.join(directory,item.name);if(item.isSymbolicLink()||!item.isDirectory()&&!item.isFile())throw new Error('输出不得含非普通文件');return item.isDirectory()?existing(file):[path.relative(output,file).replaceAll('\\','/')];});
    const extra=existing(output).filter(relative=>!files.has(relative));
    if(extra.length&&!check)throw new Error('未登记输出，保留原文件并停止: '+extra.join(', '));
    differences.push(...extra.map(relative=>'extra:'+relative));
  }
  for (const [relative,bytes] of files) {
    const file=boundedPath(output,relative);
    if (!fs.existsSync(file)||!fs.readFileSync(file).equals(bytes)) differences.push(relative);
  }
  if (!check) for (const [relative,bytes] of files) {
    const file=boundedPath(output,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
  }
  if(!check){fs.mkdirSync(path.dirname(registryOutput),{recursive:true});fs.writeFileSync(registryOutput,registry);}
  return {pages:entries.length*codes.length,differences,files:[...files.keys()]};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), value = name => args[args.indexOf(name)+1];
  if (args.includes('--vault')) throw new Error('--vault仅用于显式手动导入；构建仅读取仓库src/');
  const manifest = JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8'));
  const result=await buildSite({sourceRoot:path.resolve(here,'..'),site:path.resolve(here,'../..'),manifest,output:args.includes('--output') ? path.resolve(value('--output')) : path.resolve(here,'../../dist/site'),check:args.includes('--check')});
  console.log(`语言页面 ${result.pages}，受管产物 ${result.files.length}，${args.includes('--check')?'差异':'写出'} ${result.differences.length}`);
  if(args.includes('--check') && result.differences.length)process.exitCode=1;
}
