import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import * as build from './build.mjs';
import * as documents from './work-documents.mjs';
import {attrs,walk} from './extract-dom.mjs';
import {parse,parseFragment} from 'parse5';
const {localeRoute,readSource}=build;
import {documentCatalog,documentLayout,resolveDocumentAlias,validateDocumentSourcePath} from './work-documents.mjs';

const chapter=(slug,group,order)=>({id:`doc:cleaner:${slug}`,translationKey:`doc:cleaner:${slug}`,slug:`cleaner-${slug}`,type:'doc',template:'docs/templates/document.html',legacyRoutes:[],docPage:{work:'cleaner',group,slug,order},sources:{zh:{data:{title:slug}},en:{data:{title:slug.toUpperCase()}}}});
const first=chapter('setup','start',1),last=chapter('cleanup','usage',1);
const work={id:'work:cleaner',type:'work',slug:'cleaner',legacyRoutes:['/works/cleaner/'],sources:{zh:{data:{title:'Cleaner'}},en:{data:{title:'Cleaner'}}}};
const index={id:'page:works-index',legacyRoutes:['/works/']};
const groups={cleaner:[{id:'usage',order:2,titles:{zh:'使用',en:'Usage'}},{id:'start',order:1,titles:{zh:'开始',en:'Start'}}]};
const entries=[work,index,last,first],codes=['zh','en'];

test('chapter routes only change language; sections and adjacent links follow metadata',()=>{
  const catalog=documentCatalog(entries,groups,codes);
  assert.equal(localeRoute(first,'zh'),'/zh/works/cleaner/docs/setup/');
  assert.equal(localeRoute(first,'en'),'/en/works/cleaner/docs/setup/');
  const visible=documentLayout(first,'en',entries,catalog,localeRoute);
  assert.deepEqual(visible.groups.map(g=>g.title),['Start','Usage']);
  assert.equal(visible.groups[0].chapters[0].current,true);
  assert.equal(visible.previous,null);
  assert.equal(visible.next.href,'/en/works/cleaner/docs/cleanup/');
  assert.equal(visible.back.href,'/en/works/cleaner/');
  assert.equal(documentLayout(first,'en',entries.filter(e=>e!==work),catalog,localeRoute).back.href,'/en/works/');
});

test('reject incomplete group translations, duplicate order, aliases, and mismatched source placement',()=>{
  assert.throws(()=>documentCatalog(entries,{cleaner:[{id:'start',order:1,titles:{zh:'开始'}}]},codes),/分组/);
  assert.throws(()=>documentCatalog([...entries,chapter('install','start',1)],groups,codes),/顺序/);
  assert.throws(()=>documentCatalog([work,{...first,legacyRoutes:['/docs/setup/']},last],groups,codes),/章节/);
  const layout={work:'网站/001-作品/001-工具/Cleaner/README.md',groupOrder:1,docPage:first.docPage};
  assert.equal(validateDocumentSourcePath('网站/001-作品/001-工具/Cleaner/文档/001-入门/001-安装.md',layout),'001-入门');
  for(const source of ['网站/001-作品/001-工具/Other/文档/001-入门/001-安装.md','网站/001-作品/001-工具/Cleaner/文档/001-入门/002-安装.md','网站/001-作品/001-工具/Cleaner/文档/001-入门/extra/001-安装.md'])assert.throws(()=>validateDocumentSourcePath(source,layout),/章节/);
});

test('split old links can target another page and require exactly one real anchor',()=>{
  const options={entries,locale:'en',route:localeRoute,pageIds:new Map([[last.id+':en',new Map([['run',1]])]])};
  assert.deepEqual(resolveDocumentAlias({id:last.id,anchor:'run'},options),{path:'/en/works/cleaner/docs/cleanup/',anchor:'run'});
  assert.throws(()=>resolveDocumentAlias({id:last.id,anchor:'missing'},options),/锚点/);
  assert.throws(()=>resolveDocumentAlias({id:'doc:other:bad'},options),/目标/);
});

test('retired manual resolves cross-page fragments in its explicit language, keeping queries',()=>{
  const pathname='/docs/en/guide/',navigations=[],data={languages:[{code:'zh'},{code:'en'}],urls:{zh:localeRoute(first,'zh'),en:localeRoute(first,'en')},anchors:{en:{old:{path:localeRoute(last,'en'),anchor:'run'},top:{path:localeRoute(last,'en'),anchor:''}}},redirect:{pathname,locale:'en'}};
  const window={location:{href:'https://example.com'+pathname+'?view=full#old',pathname,replace:url=>navigations.push(url)},localStorage:{getItem:()=>'zh'}};
  const document={readyState:'complete',querySelector:()=>({textContent:JSON.stringify(data)}),querySelectorAll:()=>[],addEventListener:()=>{}};
  vm.runInNewContext(fs.readFileSync(new URL('../shared/i18n/client/language-switch.js',import.meta.url),'utf8'),{window,document,navigator:{language:'zh'},URL});
  assert.deepEqual(navigations,['https://example.com/en/works/cleaner/docs/cleanup/?view=full#run']);
  assert.equal(window.SiteLanguage.targetUrl(data,'en',window.location.href.replace('#old','#top')),'https://example.com/en/works/cleaner/docs/cleanup/?view=full');
});


test('chapter Markdown renders native headings and anchors without legacy heading scaffolds',async()=>{
  const entry={...first,sources:{zh:{data:{title:'Guide'},body:'# Guide\n\n## First step\n\n### Details\n\n#### Deep link\n\n## First step\n'}}};
  const result=await build.renderBody(entry,'zh',{primary:'zh',copy:{zh:{codeLabels:{}}},entries});
  const expected=[[1,'guide'],[2,'first-step'],[3,'details'],[4,'deep-link'],[2,'first-step-1']];
  assert.deepEqual(result.headings.map(heading=>[heading.depth,heading.slug]),expected);
  const actual=[];
  walk(parseFragment(result.code),node=>{if(/^h[1-6]$/.test(node.tagName||''))actual.push([Number(node.tagName[1]),attrs(node).id]);});
  assert.deepEqual(actual,expected);
});

test('chapter outline shows only real H2 and H3 in order without changing the body anchor list',()=>{
  const headings=[{depth:1,slug:'title',text:'Title'},{depth:2,slug:'范围',text:'Scope & limits'},{depth:3,slug:'exceptions',text:'Exceptions'},{depth:4,slug:'deep-link',text:'Deep link'},{depth:2,slug:'use',text:'Use'}];
  const outline=build.outline(headings,[2,3]),links=[],nodes=[];
  walk(parseFragment(outline),node=>{if(node.tagName==='li')nodes.push(node);if(node.tagName==='a')links.push(attrs(node).href);});
  assert.deepEqual(links,['#%E8%8C%83%E5%9B%B4','#exceptions','#use']);
  assert.deepEqual(nodes.map(node=>attrs(node)['data-heading-depth']),['2','3','2']);
  assert.equal(nodes[1].parentNode.parentNode,nodes[0]);
  assert.equal(headings[3].slug,'deep-link');assert.equal(headings.length,5);
});

test('chapter chrome reuses the existing works header, menu, skip and footer',()=>{
  const root=new URL('../',import.meta.url),template=fs.readFileSync(new URL('works/templates/page--works-index.html',root),'utf8'),files=documents.documentChrome(template);
  for(const locale of codes){
    const copy=readSource(fileURLToPath(root),`shared/i18n/${locale}/000-texts.md`,'copy').data;
    const chapterTemplate=fs.readFileSync(new URL('docs/templates/document.html',root),'utf8');
    const slots={toc:'Contents',previous:'Previous',next:'Next',works:'Works',documents:'Documentation',backToWork:'Back'};
    const layout=documentLayout(first,locale,entries,documentCatalog(entries,groups,codes),localeRoute);
    const rendered=documents.renderDocumentSlots(chapterTemplate,layout,first.sources[locale].data,slots,copy.shellSlots['page:works-index'],files,{outline:'<li id="outline-sample">Sample</li>',bodyHasTitle:false});
    const tags={};walk(parse(rendered),node=>{const a=attrs(node);if(node.tagName==='header'&&a.class==='site-header')tags.header=node;if(node.tagName==='footer'&&a.class==='site-footer')tags.footer=node;if(a['data-menu-toggle']!==undefined)tags.menu=node;if(node.tagName==='main')tags.main=node;if(a.id==='outline-sample')tags.outline=node;if(a.rel==='next')tags.next=node;});
    assert.doesNotMatch(rendered,/\{\{doc:/);assert.ok(tags.header&&tags.footer&&tags.menu&&tags.outline&&tags.next);
    assert.equal(attrs(tags.header)['data-astro-transition-persist'],'site-header');
    assert.equal(attrs(tags.main).class,'site-chrome-main');assert.equal(tags.footer.parentNode,tags.header.parentNode);
    assert.match(rendered,/>Back<\/a>/);assert.match(rendered,/Documentation/);assert.doesNotMatch(rendered,/rel="prev"/);
    const nodes=[];walk(parse(rendered),node=>nodes.push(node));
    const hasClass=(node,name)=>(attrs(node).class||'').split(/\s+/).includes(name);
    const sidebar=nodes.find(node=>hasClass(node,'work-doc-sidebar'));
    const content=nodes.find(node=>hasClass(node,'work-doc-content'));
    const sidebarNodes=[];walk(sidebar,node=>sidebarNodes.push(node));
    assert.ok(!sidebarNodes.some(node=>node.tagName==='details'||node.tagName==='summary'),'chapter navigation must always be expanded');
    const interaction=nodes.find(node=>attrs(node)['data-work-doc-engagement']!==undefined);
    assert.equal(interaction.parentNode,content,'interaction toolbar belongs to the article, not the chapter sidebar');
  }
});


test('chapter reading follows the site scroll frame and selects the final heading at the bottom',()=>{
  const events=new Map(),windowEvents=new Map(),state={scrollTop:0,outerScrolls:0};
  const frame={clientHeight:300,scrollHeight:680,get scrollTop(){return state.scrollTop;},getBoundingClientRect:()=>({top:72}),addEventListener:(name,fn)=>events.set(name,fn)};
  const sidebar={clientHeight:60,scrollHeight:150,scrollTop:0,style:{setProperty(){}},getBoundingClientRect:()=>({top:100,bottom:160,height:60})};
  const links=[0,48,108].map((top,i)=>({hash:'#h'+i,getAttribute(name){return this[name];},setAttribute(name,value){this[name]=value;},removeAttribute(name){delete this[name];},addEventListener(){},getBoundingClientRect(){return {top:100+top-sidebar.scrollTop,bottom:124+top-sidebar.scrollTop};}}));
  const headings=[100,310,560].map(top=>({getBoundingClientRect:()=>({top:72+top-state.scrollTop})}));
  let Reading,sequence=0;const queue=new Map();const window={addEventListener:(name,fn)=>windowEvents.set(name,fn)};
  const document={getElementById:id=>headings[Number(id.slice(1))]};
  const source=new URL('../shared/i18n/scripts/_astro/ReadingEnhancements.astro_astro_type_script_index_0_lang.jfxlepAz.js',import.meta.url);
  vm.runInNewContext(fs.readFileSync(source,'utf8'),{window,document,location:{hash:''},history:{state:null},HTMLElement:class{},AbortController,customElements:{get:()=>undefined,define:(_,ctor)=>Reading=ctor},requestAnimationFrame:fn=>(queue.set(++sequence,fn),sequence),cancelAnimationFrame:id=>queue.delete(id)});
  function flush(){for(const [id,fn]of [...queue]){queue.delete(id);fn();}}
  const reading=new Reading();
  reading.closest=()=>frame;reading.querySelectorAll=selector=>selector==='.article-outline a'?links:[];
  reading.querySelector=selector=>selector==='.article-sidebar'||selector==='[data-work-doc-outline]'?sidebar:selector==='[data-copy-status]'?{}:null;
  reading.connectedCallback();flush();
  assert.equal(links[0]['aria-current'],'location');assert.equal(windowEvents.has('scroll'),false);
  state.scrollTop=240;events.get('scroll')();flush();assert.equal(links[1]['aria-current'],'location');assert.equal(links[0]['aria-current'],undefined);
  state.scrollTop=380;events.get('scroll')();flush();assert.equal(links[2]['aria-current'],'location');assert.equal(links[1]['aria-current'],undefined);
  assert.ok(sidebar.scrollTop>0);assert.equal(state.scrollTop,380);
});
