import {parse} from 'parse5';
import {attrs,walk} from './extract-dom.mjs';

const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const fields=(value,keys)=>object(value)&&Object.keys(value).length===keys.length&&keys.every(key=>Object.hasOwn(value,key));
const slug=value=>typeof value==='string'&&slugPattern.test(value);
const order=value=>Number.isSafeInteger(value)&&value>0;
const text=value=>typeof value==='string'&&value.trim()&&!/[\u0000-\u001f]/.test(value);
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function assertDocPage(page){
  if(!fields(page,['work','group','slug','order'])||![page.work,page.group,page.slug].every(slug)||!order(page.order))throw Error('文档章节元数据无效');
}

export function validateDocumentSource(data,entry){
  if(entry.docPage===undefined){if(data.docPage!==undefined)throw Error('文档章节未经登记');return;}
  assertDocPage(data.docPage);
  if(!Object.keys(entry.docPage).every(key=>data.docPage[key]===entry.docPage[key])||data.type!=='doc'||data.slug!==entry.slug||!text(data.title)||!Array.isArray(data.workIds)||data.workIds.length!==1||data.workIds[0]!==entry.docPage.work)throw Error('章节来源元数据或所属作品不符: '+entry.id);
}

export function documentCatalog(entries,groups={},codes){
  if(!object(groups))throw Error('文档分组配置无效');
  const works=new Set(entries.filter(entry=>entry.type==='work').map(entry=>entry.slug)),catalog=new Map(),chapterSlugs=new Set();
  for(const [work,list]of Object.entries(groups)){
    if(!works.has(work)||!Array.isArray(list)||!list.length)throw Error('文档分组缺少所属作品: '+work);
    const groupIds=new Set(),groupOrders=new Set();
    for(const group of list){
      if(!fields(group,['id','order','titles'])||!slug(group.id)||groupIds.has(group.id)||!order(group.order)||groupOrders.has(group.order)||!fields(group.titles,codes)||!codes.every(code=>text(group.titles[code])))throw Error('文档分组编号、身份或译名无效: '+work);
      groupIds.add(group.id);groupOrders.add(group.order);
    }
    catalog.set(work,[...list].sort((a,b)=>a.order-b.order).map(group=>({...group,chapters:[]})));
  }
  for(const entry of entries.filter(item=>item.docPage!==undefined)){
    const page=entry.docPage;assertDocPage(page);
    const id=`doc:${page.work}:${page.slug}`,publicSlug=`${page.work}-${page.slug}`;
    if(entry.type!=='doc'||entry.id!==id||entry.translationKey!==id||entry.slug!==publicSlug||chapterSlugs.has(publicSlug)||entries.some(other=>other!==entry&&other.slug===publicSlug)||entry.template!=='docs/templates/document.html'||!Array.isArray(entry.legacyRoutes)||entry.legacyRoutes.length)throw Error('章节身份、模板或旧链无效: '+entry.id);
    chapterSlugs.add(publicSlug);
    const group=catalog.get(page.work)?.find(item=>item.id===page.group);
    if(!group)throw Error('章节分组未登记: '+entry.id);
    if(group.chapters.some(chapter=>chapter.docPage.order===page.order))throw Error('章节顺序重复: '+entry.id);
    group.chapters.push(entry);
  }
  for(const list of catalog.values())for(const group of list){
    if(!group.chapters.length)throw Error('文档分组没有章节: '+group.id);
    group.chapters.sort((a,b)=>a.docPage.order-b.docPage.order);
  }
  return catalog;
}

export function documentLayout(entry,locale,entries,catalog,route){
  const work=entries.find(item=>item.type==='work'&&item.slug===entry.docPage.work);
  const back=work||entries.find(item=>item.id==='page:works-index');
  if(!back)throw Error('章节缺少作品返回入口: '+entry.id);
  const groups=catalog.get(entry.docPage.work).map(group=>({title:group.titles[locale],chapters:group.chapters.map(item=>({href:route(item,locale),title:item.sources[locale].data.title,current:item.id===entry.id}))}));
  const chapters=groups.flatMap(group=>group.chapters),index=chapters.findIndex(item=>item.current);
  return {groups,back:{href:route(back,locale),title:work?.sources[locale].data.title},previous:chapters[index-1]??null,next:chapters[index+1]??null};
}

export function documentChrome(html){
  const fragments={};
  walk(parse(html,{sourceCodeLocationInfo:true}),node=>{
    const classes=(attrs(node).class||'').split(/\s+/),inChrome=(node.parentNode&&attrs(node.parentNode).class||'').split(/\s+/).includes('site-chrome');
    let name;
    if(inChrome&&node.tagName==='a'&&classes.includes('skip-link'))name='skip';
    if(inChrome&&node.tagName==='header'&&classes.includes('site-header'))name='header';
    if(inChrome&&node.tagName==='footer'&&classes.includes('site-footer'))name='footer';
    if(node.tagName==='script'&&node.childNodes.some(child=>child.value?.includes('dataset.siteChromeBound')))name='menu';
    if(!name)return;
    if(fragments[name])throw Error('作品导航外壳重复: '+name);
    const {startOffset,endOffset}=node.sourceCodeLocation;
    fragments[name]=html.slice(startOffset,endOffset);
  });
  for(const name of ['skip','header','footer','menu'])if(!fragments[name])throw Error('作品导航外壳缺失: '+name);
  return fragments;
}

export function renderDocumentSlots(html,layout,source,slots,workCopy,chrome,{outline,bodyHasTitle}){
  const link=item=>`<a href="${escape(item.href)}"${item.current?' aria-current="page"':''}>${escape(item.title)}</a>`;
  const adjacent=(item,label,rel)=>item?`<a href="${escape(item.href)}" rel="${rel}"><span>${escape(label)}</span>${escape(item.title)}</a>`:'';
  const localize=fragment=>fragment.replace(/\{\{text:([^}]+)\}\}/g,(_,key)=>{
    if(!text(workCopy?.[key]))throw Error('作品导航外壳文案缺失: '+key);
    return escape(workCopy[key]);
  });
  const name=escape(layout.back.title??slots.works),label=escape(slots.documents??slots.toc),toc=escape(slots.toc);
  const values={...Object.fromEntries(Object.entries(chrome).map(([slot,fragment])=>[slot,localize(fragment)])),title:escape(source.title),description:escape(source.description??''),heading:bodyHasTitle?'':`<h1>${escape(source.title)}</h1>`,backHref:escape(layout.back.href),backLabel:escape(slots.backToWork??slots.works),workTitle:name,documents:label,tree:layout.groups.map(group=>`<li><span>${escape(group.title)}</span><ul>${group.chapters.map(chapter=>`<li>${link(chapter)}</li>`).join('')}</ul></li>`).join(''),adjacent:adjacent(layout.previous,slots.previous,'prev')+adjacent(layout.next,slots.next,'next'),outline:outline?`<aside class="article-sidebar work-doc-outline" data-work-doc-outline data-pagefind-ignore><details class="work-doc-outline-details" open><summary>${toc}</summary><nav class="article-outline" aria-label="${toc}"><ol class="outline-tree">${outline}</ol></nav></details></aside>`:''};
  return html.replace(/\{\{doc:(\w+)\}\}/g,(_,key)=>{if(!Object.hasOwn(values,key))throw Error('章节模板槽无效: '+key);return values[key];});
}

export function validateDocumentSourcePath(source,{work,groupOrder,docPage}){
  const root=/^网站\/001-作品\/\d{3}-[^/]+\/[^/]+\/README\.md$/;
  if(typeof work!=='string'||typeof source!=='string'||/[\\:\0]/.test(work+source)||!root.test(work)||[...work.split('/'),...source.split('/')].some(part=>part==='.'||part==='..')||!source.startsWith(work.slice(0,-'README.md'.length)+'文档/'))throw Error('章节来源不在所属作品目录');
  const [group,file,...extra]=source.slice(work.length-'README.md'.length+'文档/'.length).split('/');
  const groupMatch=/^(\d{3})-[^/]+$/.exec(group??''),fileMatch=/^(\d{3})-[^/]+\.md$/.exec(file??'');
  if(extra.length||!groupMatch||!fileMatch||Number(groupMatch[1])!==groupOrder||Number(fileMatch[1])!==docPage.order)throw Error('章节来源目录层级或编号不符');
  return group;
}

function anchorKey(value){
  if(!text(value)||/[\s#?\\\u007f-\u009f]/u.test(value)||['__proto__','prototype','constructor'].includes(value))return false;
  try{encodeURIComponent(value);return true;}catch{return false;}
}

export function resolveDocumentAlias(target,{entries,locale,route,pageIds,work}){
  if(!object(target)||!Object.keys(target).every(key=>['id','anchor'].includes(key))||typeof target.id!=='string')throw Error('旧章节链接目标配置无效');
  const entry=entries.find(item=>item.id===target.id&&(item.docPage||work&&item.type==='work'));
  if(!entry||entry.languageCodes&&!entry.languageCodes.includes(locale))throw Error('旧章节链接目标缺失: '+target.id);
  if(work&&(entry.docPage?.work??entry.slug)!==work)throw Error('旧章节链接目标不属于所属作品: '+target.id);
  if(target.anchor!==undefined&&(!anchorKey(target.anchor)||pageIds&&pageIds.get(entry.id+':'+locale)?.get(target.anchor)!==1))throw Error('旧章节锚点目标缺失或歧义: '+target.id);
  return {path:route(entry,locale),anchor:target.anchor??''};
}

export function projectDocumentAnchorAliases(entry,{entries,codes,pageIds,route}){
  const aliases=entry.anchorAliases;
  if(aliases===undefined)return undefined;
  if(!entry.docPage||!object(aliases))throw Error('正文锚点别名配置无效: '+entry.id);
  return Object.fromEntries(Object.entries(aliases).map(([locale,targets])=>{
    if(!codes.includes(locale)||!object(targets))throw Error('正文锚点别名语言或映射无效: '+entry.id);
    return [locale,Object.fromEntries(Object.entries(targets).map(([oldId,target])=>{
      if(!anchorKey(oldId)||!fields(target,['id','anchor'])||!anchorKey(target.anchor))throw Error('正文锚点别名配置无效: '+entry.id);
      if(pageIds?.get(entry.id+':'+locale)?.has(oldId))throw Error('正文锚点别名与真实 ID 冲突: '+entry.id+' #'+oldId);
      return [oldId,resolveDocumentAlias(target,{entries,locale,route,pageIds,work:entry.docPage.work})];
    }))];
  }));
}
