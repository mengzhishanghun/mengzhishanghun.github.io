import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {generatedPage} from './interaction-fixtures.mjs';
const source=fs.readFileSync(new URL('../shared/i18n/scripts/_astro/ContentIndex.astro_astro_type_script_index_0_lang.fObaHoDK.js',import.meta.url),'utf8');
function runtime({query='',io=true,broken=false,locale='en',route='blog'}={}) {
  const fixture=generatedPage(`${locale}/${route}/index.html`),queue=new Map(),observers=[];let next=0,url=new URL(`https://mzsh.me/${locale}/${route}/`+query),focusedElement=null;
  class Element extends EventTarget {
    dataset={};style={};hidden=false;isConnected=true;children=[];attrs={};value='';
    setAttribute(k,v){this.attrs[k]=v;}focus(){if(focusedElement)focusedElement.focused=false;focusedElement=this;this.focused=true;}scrollIntoView(){this.scrolled=true;}
    replaceChildren(...children){for(const child of this.children){child.isConnected=false;if(focusedElement===child){child.focused=false;focusedElement=null;}}this.children=children;for(const child of children)child.isConnected=this.isConnected;}
    getBoundingClientRect(){return {top:1200,bottom:1244};}
    querySelector(s){return this.children.find(e=>s==='[data-tag-all]'?e.dataset.tagAll!==undefined:s===`[data-tag="${e.dataset.tag}"]`);}
  }
  const elements=new Map();for(const node of fixture.nodes){if(!node.tagName)continue;const el=new Element(),a=fixture.attrs(node);for(const [k,v]of Object.entries(a))if(k.startsWith('data-'))el.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;el.hidden=Object.hasOwn(a,'hidden');elements.set(node,el);}
  const root=elements.get(fixture.select('[data-content-index]'));
  const select=s=>elements.get(fixture.select(s));
  root.querySelector=select;root.querySelectorAll=s=>fixture.nodes.filter(n=>fixture.matches(n,s)).map(n=>elements.get(n));
  const frame=new Element();frame.scrollTop=640;frame.getBoundingClientRect=()=>({top:0,bottom:800});root.closest=s=>s==='.site-chrome-main'?frame:null;
  const records=Array.from({length:25},(_,i)=>({slug:'item-'+i,categoryId:'ue',categoryName:'UE',title:i===24?'needle':'Entry '+i,description:'',body:'',tags:[i%2?'odd':'even']}));records.push({slug:'other',categoryId:'cpp',categoryName:'C++',title:'Other',description:'',body:'',tags:['even']});
  const cards=records.map(r=>{const el=new Element();el.dataset.slug=r.slug;return el;});const baseAll=root.querySelectorAll;root.querySelectorAll=s=>s==='[data-content-card]'?cards:baseAll(s);
  select('[data-content-index-data]').textContent=broken?'{':JSON.stringify(records);
  const document=new EventTarget();document.documentElement={lang:'en'};document.createElement=()=>new Element();document.querySelectorAll=s=>s==='[data-content-index]'&&root.isConnected?[root]:[];
  Object.defineProperty(document,'activeElement',{get:()=>focusedElement});
  const window=new EventTarget();window.SiteCopy=fixture.copy;window.SiteLanguageCode='en';window.SitePrimaryCode='zh';
  const history={state:{index:7,keep:'yes'},replaceState(state,_title,href){this.state=state;if(href)url=new URL(href,url);}};
  const context={document,window,history,get location(){return url;},URLSearchParams,CSS:{escape:s=>s},AbortController,CustomEvent:class extends Event{constructor(name,{detail}={}){super(name);this.detail=detail;}},performance:{clearMarks(){},mark(){}},requestAnimationFrame:fn=>{queue.set(++next,fn);return next;},cancelAnimationFrame:id=>queue.delete(id)};
  if(io)context.IntersectionObserver=class{constructor(fn,options){this.fn=fn;this.options=options;observers.push(this);}observe(target){this.target=target;}disconnect(){this.disconnected=true;}};
  vm.runInNewContext(source,context);
  const flush=()=>{const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn());};
  const emit=(el,name)=>el.dispatchEvent(new Event(name,{cancelable:true}));
  return {root,frame,cards,select,document,observers,flush,emit,history,get url(){return url;},visible:()=>cards.filter(c=>!c.hidden).map(c=>c.dataset.slug)};
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
test('successful swap disconnects old observer; canceled preparation keeps it usable',()=>{const x=runtime(),o=x.observers[0];assert.ok(o);x.emit(x.document,'astro:before-preparation');o.fn([{target:o.target,isIntersecting:true}]);assert.equal(x.visible().length,20);x.root.isConnected=false;x.emit(x.document,'astro:after-swap');assert.equal(o.disconnected,true);o.fn([{target:o.target,isIntersecting:true}]);assert.equal(x.visible().length,20);});
for(const locale of ['zh','en'])for(const route of ['blog','works','cases'])test(`${locale}/${route} malformed data leaves all static cards visible and controls hidden`,()=>{const x=runtime({broken:true,locale,route});assert.equal(x.visible().length,26);assert.equal(x.root.dataset.ready,'failed');for(const selector of ['.content-category-nav','.content-filter','[data-content-pagination]'])assert.equal(x.select(selector).hidden,true);});
