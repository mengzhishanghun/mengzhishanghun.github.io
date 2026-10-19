import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {generatedPage} from './interaction-fixtures.mjs';
const contentSource=fs.readFileSync(new URL('../shared/i18n/scripts/_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js',import.meta.url),'utf8');
const helperSource=fs.readFileSync(new URL('../shared/i18n/scripts/return-state.js',import.meta.url),'utf8').replace(/^export /gm,'');
const source=helperSource+contentSource.replace(/^import[^;]+;\s*/,'');
function runtime({query='',io=true,broken=false,locale='en',route='blog',documents=null,savedState={},aliases=null,tagDisplay=null,returnOrder=null}={}) {
  const fixture=generatedPage(`${locale}/${route}/index.html`),queue=new Map(),observers=[];let next=0,url=new URL(`https://mzsh.me/${locale}/${route}/`+query),focusedElement=null;
  class Element extends EventTarget {
    dataset={};style={};hidden=false;isConnected=true;children=[];attrs={};value='';
    setAttribute(k,v){this.attrs[k]=v;}focus(){if(focusedElement)focusedElement.focused=false;focusedElement=this;this.focused=true;}scrollIntoView(){this.scrolled=true;}
    blur(){if(focusedElement===this){focusedElement=null;this.focused=false;}this.dispatchEvent(new Event('blur'));}
    after(element){this.sibling=element;}append(...children){this.children.push(...children);}
    replaceChildren(...children){for(const child of this.children){child.isConnected=false;if(focusedElement===child){child.focused=false;focusedElement=null;}}this.children=children;for(const child of children)child.isConnected=this.isConnected;}
    getBoundingClientRect(){return {top:1200,bottom:1244};}
    querySelector(s){return this.children.find(e=>s==='[data-tag-all]'?e.dataset.tagAll!==undefined:s===`[data-tag="${e.dataset.tag}"]`);}
    querySelectorAll(s){return s==='[data-tag]'?this.children.filter(e=>e.dataset.tag!==undefined):[];}
  }
  const elements=new Map();for(const node of fixture.nodes){if(!node.tagName)continue;const el=new Element(),a=fixture.attrs(node);for(const [k,v]of Object.entries(a))if(k.startsWith('data-'))el.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;el.hidden=Object.hasOwn(a,'hidden');elements.set(node,el);}
  const root=elements.get(fixture.select('[data-content-index]'));
  if(tagDisplay)root.dataset.contentTagsDisplay=tagDisplay;
  if(aliases)root.dataset.contentTopicAliases=JSON.stringify(aliases);
  const select=s=>elements.get(fixture.select(s));
  root.querySelector=select;root.querySelectorAll=s=>fixture.nodes.filter(n=>fixture.matches(n,s)).map(n=>elements.get(n));
  const frame=new Element();frame.scrollTop=640;frame.getBoundingClientRect=()=>({top:0,bottom:800});root.closest=s=>s==='.site-chrome-main'?frame:null;
  const records=documents || Array.from({length:25},(_,i)=>({slug:'item-'+i,categoryId:'ue',categoryName:'UE',title:i===24?'needle':'Entry '+i,description:'',body:'',tags:[i%2?'odd':'even']}));if(!documents)records.push({slug:'other',categoryId:'cpp',categoryName:'C++',title:'Other',description:'',body:'',tags:['even']});
  const cards=records.map(r=>{const el=new Element();el.dataset.slug=r.slug;if(r.legacyTags)el.dataset.contentLegacyTags=JSON.stringify(r.legacyTags);return el;});const baseAll=root.querySelectorAll;root.querySelectorAll=s=>s==='[data-content-card]'?cards:baseAll(s);
  select('[data-content-index-data]').textContent=broken?'{':JSON.stringify(records);
  frame.querySelector=selector=>selector==='[data-content-index]'?root:null;
  const document=new EventTarget();document.querySelector=selector=>selector==='.site-chrome-main'?frame:selector==='meta[name="astro-view-transitions-enabled"]'?{}:null;document.documentElement={lang:locale};document.createElement=()=>new Element();document.querySelectorAll=s=>s==='[data-content-index]'&&root.isConnected?[root]:[];
  Object.defineProperty(document,'activeElement',{get:()=>focusedElement});
  const storage=new Map();
  const window=new EventTarget();window.sessionStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};window.SiteCopy=fixture.copy;window.SiteLanguageCode='en';window.SitePrimaryCode='zh';
  const history={state:{index:7,keep:'yes',...savedState},writes:0,replaceState(state,_title,href){this.writes++;this.state=state;if(href)url=new URL(href,url);}};
  const context={document,window,history,get location(){return url;},queueMicrotask:fn=>fn(),URL,URLSearchParams,CSS:{escape:s=>s},AbortController,CustomEvent:class extends Event{constructor(name,{detail}={}){super(name);this.detail=detail;}},performance:{clearMarks(){},mark(){}},requestAnimationFrame:fn=>{queue.set(++next,fn);return next;},cancelAnimationFrame:id=>queue.delete(id)};
  if(io)context.IntersectionObserver=class{constructor(fn,options){this.fn=fn;this.options=options;observers.push(this);}observe(target){this.target=target;}disconnect(){this.disconnected=true;}};
  const readyStates=[];document.addEventListener('mzsh:content-index-ready',()=>readyStates.push({expanded:select('[data-content-tags]').sibling?.attrs['aria-expanded'],visibleTags:select('[data-content-tags]').children.filter(t=>t.dataset.tag&&!t.hidden).length}));
  if(returnOrder){
    vm.runInNewContext('(()=>{'+helperSource+';rememberSessionPage();prepareSessionReturn(location.pathname);})();',context);
    history.state={index:57,keep:'new entry',mzshNavigation:{id:'target',url:url.pathname+url.search+url.hash,parent:null}};frame.scrollTop=0;
  }
  const viewport=fs.readFileSync(new URL('../shared/i18n/scripts/viewport.js',import.meta.url),'utf8').replace(/^import[^;]+;\s*/,'');
  const loadViewport=()=>vm.runInNewContext('(()=>{'+helperSource+viewport+'})();',context);
  if(returnOrder==='viewport-first')loadViewport();
  vm.runInNewContext(source,context);
  if(returnOrder==='list-first')loadViewport();
  const flush=()=>{const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn());};
  const emit=(el,name)=>el.dispatchEvent(new Event(name,{cancelable:true}));
  return {root,frame,cards,select,document,observers,queue,flush,emit,history,readyStates,toggle:()=>select('[data-content-tags]').sibling,get url(){return url;},visible:()=>cards.filter(c=>!c.hidden).map(c=>c.dataset.slug)};
}
for(const locale of ['zh','en'])for(const route of ['blog','works','cases'])test(`${locale}/${route} exposes every static card and hides JS controls`,()=>{
  const f=generatedPage(`${locale}/${route}/index.html`),cards=f.nodes.filter(n=>f.attrs(n)['data-content-card']!==undefined);
  assert.ok(cards.length);assert.equal(cards.filter(n=>Object.hasOwn(f.attrs(n),'hidden')).length,0);
  for(const selector of ['.content-category-nav','.content-filter','[data-content-pagination]'])assert.ok(Object.hasOwn(f.attrs(f.select(selector)),'hidden'));
});
test('load more keeps earlier cards, scroll, focus and unrelated history state',()=>{const x=runtime({io:false});assert.equal(x.visible().length,10);x.emit(x.select('[data-content-next]'),'click');assert.equal(x.visible().length,20);assert.equal(x.visible()[0],'item-0');assert.equal(x.frame.scrollTop,640);assert.equal(x.select('.content-index-main').focused,undefined);assert.equal(x.url.search,'?page=2');assert.equal(x.history.state.keep,'yes');});
test('page links expand all prior batches and invalid pages normalize',()=>{assert.equal(runtime({query:'?page=2',io:false}).visible().length,20);assert.equal(runtime({query:'?page=99',io:false}).visible().length,25);for(const query of ['?page=-1','?page=oops','?page=0']){const x=runtime({query,io:false});assert.equal(x.visible().length,10);assert.equal(x.url.search,'');}});
test('search and category changes reset expanded batches and keep matching results',()=>{const x=runtime({query:'?page=2',io:false});x.select('[data-content-query]').value='needle';x.emit(x.select('[data-content-query]'),'input');assert.deepEqual(x.visible(),['item-24']);x.select('[data-content-query]').value='';x.emit(x.select('[data-content-query]'),'input');assert.equal(x.visible().length,10);x.emit(x.select('[data-category="cpp"]'),'click');assert.deepEqual(x.visible(),['other']);});
test('tag changes reset batches and keyboard button activation can load remaining matches',()=>{const x=runtime({query:'?page=2',io:false});const tag=x.select('[data-content-tags]').children.find(t=>t.dataset.tag==='even');x.emit(tag,'click');assert.equal(x.visible().length,10);assert.equal(x.url.search,'?tag=even');x.emit(x.select('[data-content-next]'),'click');assert.equal(x.visible().length,13);assert.equal(x.select('[data-content-next]').hidden,true);});
test('observer uses the actual scroll frame and fills a still-visible sentinel',()=>{const x=runtime();assert.equal(x.observers[0]?.options.root,x.frame);const o=x.observers[0];o.target.getBoundingClientRect=()=>({top:700,bottom:744});o.fn([{target:o.target,isIntersecting:true}]);x.flush();x.flush();assert.equal(x.visible().length,25);assert.equal(x.frame.scrollTop,640);});
test('automatic append preserves the connected focused tag node while filter changes rebuild tags',()=>{const x=runtime(),tags=x.select('[data-content-tags]'),tag=tags.children.find(t=>t.dataset.tag==='even');tag.focus();const o=x.observers[0];o.fn([{target:o.target,isIntersecting:true}]);assert.equal(x.visible().length,20);assert.equal(tag.isConnected,true);assert.equal(x.document.activeElement,tag);assert.ok(tags.children.includes(tag));x.select('[data-content-query]').value='needle';x.emit(x.select('[data-content-query]'),'input');assert.equal(tag.isConnected,false);assert.deepEqual(x.visible(),['item-24']);});
for(const mode of ['manual','observer'])test(`${mode} final batch retains focused completion until blur and ignores repeated activation`,()=>{
  const x=runtime({query:'?page=2',io:mode==='observer'}),button=x.select('[data-content-next]'),pagination=x.select('[data-content-pagination]');button.focus();
  const append=()=>mode==='manual'?x.emit(button,'click'):x.observers[0].fn([{target:button,isIntersecting:true}]);append();
  assert.equal(x.visible().length,25);assert.equal(x.document.activeElement,button);assert.equal(button.hidden,false);assert.equal(button.disabled,false);assert.equal(button.attrs['aria-disabled'],'true');assert.equal(pagination.hidden,false);assert.equal(button.textContent,'All items shown');assert.equal(x.frame.scrollTop,640);
  const writes=x.history.writes;append();x.emit(button,'click');x.flush();x.flush();append();x.flush();assert.equal(x.history.writes,writes);assert.equal(x.queue.size,0);assert.equal(x.url.search,'?page=3');
  const query=x.select('[data-content-query]');query.value='needle';x.emit(query,'input');assert.equal(x.visible().length,1);assert.equal(pagination.hidden,false);assert.equal(button.hidden,false);assert.equal(x.document.activeElement,button);
  button.blur();assert.equal(button.hidden,true);assert.equal(pagination.hidden,true);
  query.focus();query.value='';x.emit(query,'input');assert.equal(x.visible().length,10);assert.equal(button.hidden,false);assert.equal(button.disabled,false);assert.equal(button.attrs['aria-disabled'],'false');assert.equal(button.textContent,'Load more');assert.equal(x.document.activeElement,query);
});
test('unfocused final batch hides the exhausted button without changing other focus or scroll',()=>{const x=runtime({query:'?page=2'}),query=x.select('[data-content-query]'),button=x.select('[data-content-next]');query.focus();x.observers[0].fn([{target:button,isIntersecting:true}]);assert.equal(x.visible().length,25);assert.equal(button.hidden,true);assert.equal(x.document.activeElement,query);assert.equal(x.frame.scrollTop,640);});
test('successful swap disconnects old observer; canceled preparation keeps it usable',()=>{const x=runtime(),o=x.observers[0];assert.ok(o);x.emit(x.document,'astro:before-preparation');o.fn([{target:o.target,isIntersecting:true}]);assert.equal(x.visible().length,20);x.root.isConnected=false;x.emit(x.document,'astro:after-swap');assert.equal(o.disconnected,true);o.fn([{target:o.target,isIntersecting:true}]);assert.equal(x.visible().length,20);});
for(const locale of ['zh','en'])for(const route of ['blog','works','cases'])test(`${locale}/${route} malformed data leaves all static cards visible and controls hidden`,()=>{const x=runtime({broken:true,locale,route});assert.equal(x.visible().length,26);assert.equal(x.root.dataset.ready,'failed');for(const selector of ['.content-category-nav','.content-filter','[data-content-pagination]'])assert.equal(x.select(selector).hidden,true);});

const topicDocuments=()=>Array.from({length:12},(_,i)=>({slug:'topic-'+i,categoryId:'ue',categoryName:'UE',title:'Topic '+i,description:'',body:'',tags:['theme-'+String(i).padStart(2,'0')],legacyTags:[i<2?'Old exact':'Other'],searchTags:['search-only']}));
test('all topic tags stay visible without a toggle through filtering and return',()=>{
  for(const locale of ['zh','en']){
    const x=runtime({locale,tagDisplay:'all',documents:topicDocuments(),query:'?page=2',io:false,savedState:{mzshContentTags:{key:`/${locale}/blog/`,category:'ue',expanded:false}}}),tags=x.select('[data-content-tags]');
    assert.equal(x.toggle(),undefined);assert.equal(tags.children.filter(t=>t.dataset.tag&&!t.hidden).length,12);assert.equal(x.visible().length,12);
    const tag=tags.children.find(t=>t.dataset.tag==='theme-11');x.emit(tag,'click');assert.deepEqual(x.visible(),['topic-11']);assert.equal(tags.children.filter(t=>t.dataset.tag&&!t.hidden).length,12);
    x.emit(tags.children.find(t=>t.dataset.tag==='theme-11'),'click');assert.equal(x.document.activeElement,tags.children.find(t=>t.dataset.tag==='theme-11'));assert.equal(x.frame.scrollTop,640);
    x.select('[data-content-query]').value='nothing-found';x.emit(x.select('[data-content-query]'),'input');assert.deepEqual(x.visible(),[]);assert.equal(tags.children.filter(t=>t.dataset.tag&&!t.hidden).length,12);assert.equal(x.toggle(),undefined);
  }
});
test('collapsed tags expose eight plus selected legacy terms; unknown terms yield zero results',()=>{const x=runtime({tagDisplay:'fold',documents:topicDocuments(),query:'?tag=theme-11',io:false}),tags=x.select('[data-content-tags]');assert.equal(tags.children.filter(t=>t.dataset.tag&&!t.hidden).length,9);assert.equal(tags.children.find(t=>t.dataset.tag==='theme-11').hidden,false);assert.deepEqual(x.visible(),['topic-11']);const unknown=runtime({documents:topicDocuments(),query:'?tag=unknown',io:false});assert.deepEqual(unknown.visible(),[]);assert.equal(unknown.select('[data-content-tags]').children.find(t=>t.dataset.tag==='unknown')?.attrs['aria-pressed'],'true');unknown.emit(unknown.select('[data-content-tags]').children.find(t=>t.dataset.tag==='unknown'),'click');assert.equal(unknown.visible().length,10);});
test('legacy memberships retain precise AND semantics and never use broad search tags',()=>{const x=runtime({documents:topicDocuments(),query:'?tag=Old+exact',io:false});assert.deepEqual(x.visible(),['topic-0','topic-1']);const and=runtime({documents:topicDocuments(),query:'?tag=Old+exact&tag=theme-01',io:false});assert.deepEqual(and.visible(),['topic-1']);assert.deepEqual(runtime({documents:topicDocuments(),query:'?tag=search-only',io:false}).visible(),[]);});
test('stable expand control preserves batches, focus and history; category changes collapse',()=>{const x=runtime({tagDisplay:'fold',documents:topicDocuments(),query:'?page=2',io:false}),toggle=x.toggle();assert.ok(toggle);toggle.focus();x.emit(toggle,'click');assert.equal(x.toggle(),toggle);assert.equal(toggle.attrs['aria-expanded'],'true');assert.equal(x.visible().length,12);assert.equal(x.url.search,'?page=2');assert.equal(x.frame.scrollTop,640);assert.equal(x.document.activeElement,toggle);assert.equal(x.history.state.keep,'yes');assert.equal(x.history.state.mzshContentTags.expanded,true);x.select('[data-content-query]').value='Topic';x.emit(x.select('[data-content-query]'),'input');assert.equal(toggle.attrs['aria-expanded'],'true');x.emit(x.select('[data-category="cpp"]'),'click');assert.equal(toggle.attrs['aria-expanded'],'false');});
test('return restores expanded tags before ready, while deselected rare tags move focus to toggle',()=>{const x=runtime({tagDisplay:'fold',documents:topicDocuments(),io:false,savedState:{mzshContentTags:{key:'/en/blog/',category:'ue',expanded:true},mzshViewport:{key:'/en/blog/',top:640}}});assert.equal(x.toggle()?.attrs['aria-expanded'],'true');assert.deepEqual(x.readyStates,[{expanded:'true',visibleTags:12}]);assert.equal(x.history.state.mzshViewport.top,640);const y=runtime({tagDisplay:'fold',documents:topicDocuments(),query:'?tag=theme-11',io:false}),tag=y.select('[data-content-tags]').children.find(t=>t.dataset.tag==='theme-11');tag.focus();y.emit(tag,'click');assert.equal(y.select('[data-content-tags]').children.find(t=>t.dataset.tag==='theme-11').hidden,true);assert.equal(y.document.activeElement,y.toggle());});
test('every published legacy blog tag preserves its original per-category article membership',()=>{
  const topics=JSON.parse(fs.readFileSync(new URL('../blog/topics.json',import.meta.url)));let comparisons=0;
  for(const locale of ['zh','en']){
    const fixture=generatedPage(`${locale}/blog/index.html`),node=fixture.select('[data-content-index-data]'),records=JSON.parse(node.childNodes.map(n=>n.value||'').join('')).map(record=>({...record,legacyTags:topics.articles['blog:'+record.slug].legacyTags[locale]}));
    for(const category of new Set(records.map(r=>r.categoryId)))for(const tag of new Set(records.filter(r=>r.categoryId===category).flatMap(r=>r.legacyTags))){
      const expected=records.filter(r=>r.categoryId===category&&r.legacyTags.includes(tag)).map(r=>r.slug).sort(),params=new URLSearchParams({category,tag,page:'99'}),x=runtime({locale,documents:records,query:'?'+params,io:false});assert.deepEqual(x.visible().sort(),expected,`${locale}/${category}/${tag}`);comparisons++;
    }
  }
  assert.ok(comparisons>100);
});
test('all twelve topics survive bilingual query carryover with exact membership and legacy AND',()=>{
  const data=JSON.parse(fs.readFileSync(new URL('../blog/topics.json',import.meta.url)));
  const fixtures=Object.fromEntries(['zh','en'].map(locale=>{const f=generatedPage(`${locale}/blog/index.html`),node=f.select('[data-content-index-data]');return [locale,{f,records:JSON.parse(node.childNodes.map(n=>n.value||'').join('')).map(r=>({...r,legacyTags:data.articles['blog:'+r.slug].legacyTags[locale]}))}];}));
  const labels=Object.fromEntries(['zh','en'].map(locale=>[locale,Object.fromEntries(data.topics.map(id=>[id,fixtures[locale].f.copy['blog-topic:'+id]]))]));
  for(const from of ['zh','en']){const to=from==='zh'?'en':'zh',target=fixtures[to],aliases=Object.fromEntries(data.topics.flatMap(id=>['zh','en'].map(locale=>[labels[locale][id],labels[to][id]])));
    for(const id of data.topics){const expected=target.records.filter(r=>data.articles['blog:'+r.slug].topics.includes(id)).map(r=>r.slug).sort(),actual=[];
      for(const category of new Set(target.records.map(r=>r.categoryId))){const params=new URLSearchParams({category,tag:labels[from][id],page:'99'}),x=runtime({locale:to,documents:target.records,aliases,query:'?'+params,io:false});actual.push(...x.visible());assert.equal(x.select('[data-content-tags]').children.find(t=>t.dataset.tag===labels[to][id])?.attrs['aria-pressed'],'true');assert.ok(x.url.search.includes(encodeURIComponent(labels[to][id]).replaceAll('%20','+')));}
      assert.deepEqual(actual.sort(),expected,from+'->'+to+'/'+id);
    }
    const record=target.records.find(r=>r.legacyTags.length),id=data.articles['blog:'+record.slug].topics[0],old=record.legacyTags[0],params=new URLSearchParams({category:record.categoryId,page:'99'});params.append('tag',labels[from][id]);params.append('tag',old);const x=runtime({locale:to,documents:target.records,aliases,query:'?'+params,io:false});assert.deepEqual(x.visible().sort(),target.records.filter(r=>r.categoryId===record.categoryId&&r.tags.includes(labels[to][id])&&r.legacyTags.includes(old)).map(r=>r.slug).sort());const button=x.select('[data-content-tags]').children.find(t=>t.dataset.tag===old);x.emit(button,'click');assert.equal(new URLSearchParams(x.url.search).getAll('tag').includes(old),false);
  }
  assert.deepEqual(runtime({documents:topicDocuments(),aliases:{known:'theme-01'},query:'?tag=constructor',io:false}).visible(),[]);
});
for(const [route,type,prefix]of [['works','work','work-topic'],['cases','case','case-topic']])test(`${route} preserves all legacy memberships, bilingual themes, precise AND and visible focused tags`,()=>{
  const mapping=JSON.parse(fs.readFileSync(new URL(`../${route}/topics.json`,import.meta.url))),fixtures=Object.fromEntries(['zh','en'].map(locale=>{const f=generatedPage(`${locale}/${route}/index.html`),node=f.select('[data-content-index-data]'),records=JSON.parse(node.childNodes.map(n=>n.value||'').join('')).map(r=>({...r,legacyTags:mapping.articles[type+':'+r.slug].legacyTags[locale]}));return [locale,{f,records}];}));
  for(const locale of ['zh','en']){const {f,records}=fixtures[locale],other=locale==='zh'?'en':'zh',categories=[...new Set(records.map(r=>r.categoryId))],aliases=JSON.parse(f.attrs(f.select('[data-content-index]'))['data-content-topic-aliases']);assert.equal(new Set(records.flatMap(r=>r.tags)).size,mapping.topics.length);
    for(const category of categories){const categoryRecords=records.filter(r=>r.categoryId===category),params=new URLSearchParams({category,page:'99'}),x=runtime({route,locale,documents:records,query:'?'+params,io:false});assert.equal(x.toggle(),undefined);assert.equal(x.select('[data-content-tags]').children.filter(t=>t.dataset.tag&&!t.hidden).length,new Set(categoryRecords.flatMap(r=>r.tags)).size);
      for(const tag of new Set(categoryRecords.flatMap(r=>r.legacyTags))){params.set('tag',tag);const filtered=runtime({route,locale,documents:records,query:'?'+params,io:false});assert.deepEqual(filtered.visible().sort(),categoryRecords.filter(r=>r.legacyTags.includes(tag)).map(r=>r.slug).sort(),`${locale}/${category}/${tag}`);}
      params.set('tag','unknown-old-tag');assert.deepEqual(runtime({route,locale,documents:records,query:'?'+params,io:false}).visible(),[]);
    }
    for(const topic of mapping.topics){const actual=[];for(const category of categories){const params=new URLSearchParams({category,page:'99',tag:fixtures[other].f.copy[prefix+':'+topic]}),x=runtime({route,locale,documents:records,query:'?'+params,io:false});actual.push(...x.visible());assert.equal(x.select('[data-content-tags]').children.find(t=>t.dataset.tag===f.copy[prefix+':'+topic])?.attrs['aria-pressed'],'true');}assert.deepEqual(actual.sort(),records.filter(r=>mapping.articles[type+':'+r.slug].topics.includes(topic)).map(r=>r.slug).sort());}
    const record=records.find(r=>r.legacyTags.length),topic=mapping.articles[type+':'+record.slug].topics[0],params=new URLSearchParams({category:record.categoryId,page:'99'});params.append('tag',fixtures[other].f.copy[prefix+':'+topic]);params.append('tag',record.legacyTags[0]);const x=runtime({route,locale,documents:records,query:'?'+params,io:false});assert.deepEqual(x.visible().sort(),records.filter(r=>r.categoryId===record.categoryId&&r.tags.includes(f.copy[prefix+':'+topic])&&r.legacyTags.includes(record.legacyTags[0])).map(r=>r.slug).sort());
    const button=x.select('[data-content-tags]').children.find(t=>t.dataset.tag===record.legacyTags[0]);button.focus();x.emit(button,'click');assert.equal(x.toggle(),undefined);assert.equal(new URLSearchParams(x.url.search).getAll('tag').includes(record.legacyTags[0]),false);assert.equal(x.frame.scrollTop,640);
  }
});

for(const returnOrder of ['viewport-first','list-first'])test('cross-document fallback restores cumulative URL, expansion and scroll with '+returnOrder,()=>{
 const x=runtime({query:'?page=2',documents:topicDocuments(),tagDisplay:'fold',io:false,returnOrder,savedState:{mzshContentTags:{key:'/en/blog/',category:'ue',expanded:true},mzshViewport:{key:'/en/blog/?page=2',top:1530}}});
 assert.equal(x.visible().length,12);assert.equal(x.url.search,'?page=2');assert.equal(x.toggle().attrs['aria-expanded'],'true');assert.equal(x.frame.scrollTop,1530);assert.equal(x.history.state.index,57);assert.equal(x.history.state.keep,'new entry');assert.equal(x.history.state.mzshNavigation.id,'target');assert.equal(x.history.state.mzshNavigation.parent,null);
});

for(const returnOrder of ['viewport-first','list-first'])test('failed list keeps its static fallback and restores scroll with '+returnOrder,()=>{
 const x=runtime({query:'?page=2',broken:true,io:false,returnOrder,savedState:{mzshViewport:{key:'/en/blog/?page=2',top:900}}});assert.equal(x.root.dataset.ready,'failed');assert.equal(x.visible().length,26);assert.equal(x.frame.scrollTop,900);assert.equal(x.history.state.keep,'new entry');
});
