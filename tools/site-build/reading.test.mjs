import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {walk,attrs} from './extract-dom.mjs';
const require=createRequire(new URL('../content-import/package.json',import.meta.url));
const {parse}=require('parse5');
const page=parse(fs.readFileSync(new URL('../../zh/blog/cnblogs-19136316/index.html',import.meta.url),'utf8'));
let toolbarNode;
walk(page,node=>{if(node.tagName==='mobile-outline')toolbarNode=node;});
assert.ok(toolbarNode,'the generated article must supply its mobile outline element');
function matchesToolbar(selector) {
  if(selector.startsWith('.'))return (attrs(toolbarNode).class || '').split(/\s+/).includes(selector.slice(1));
  return selector===toolbarNode.tagName;
}

function reading(mobile=false,restored=false) {
  const queue=new Map();let next=0,Reading;
  class Element extends EventTarget { attrs={};style={setProperty(){}};isConnected=true;setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}focus(){this.focused=true;} }
  const frame=new Element();frame.scrollTop=restored?180:0;frame.clientHeight=800;frame.getBoundingClientRect=()=>({top:100,height:800});frame.scrollTo=({top})=>{frame.scrollTop=top;};
  const headings=[400,700].map((top,index)=>{const h=new Element();h.id=`h${index}`;h.getBoundingClientRect=()=>({top:100+top-frame.scrollTop});return h;});
  const links=headings.map(h=>{const a=new Element();a.hash=`#${h.id}`;return a;});
  const toolbar=new Element();toolbar.getBoundingClientRect=()=>({height:58});toolbar.getClientRects=()=>mobile?[{}]:[];
  const document={getElementById:id=>headings.find(h=>h.id===id),createElement:()=>new Element()};
  const window=new EventTarget();window.SiteCopy={};window.clearTimeout=clearTimeout;
  const context={HTMLElement:Element,document,window,AbortController,history:{state:restored?{mzshViewport:{key:'/zh/blog/one/#h0',top:180}}:null,replaceState(){}},location:{pathname:'/zh/blog/one/',search:'',hash:restored?'#h0':''},requestAnimationFrame:fn=>{queue.set(++next,fn);return next;},cancelAnimationFrame:id=>queue.delete(id),customElements:{get(){},define(_name,cls){Reading=cls;}},getComputedStyle:()=>({display:mobile?'block':'none',visibility:'visible',position:'sticky'})};
  vm.runInNewContext(fs.readFileSync(new URL('./scripts/_astro/ReadingEnhancements.astro_astro_type_script_index_0_lang.jfxlepAz.js',import.meta.url),'utf8'),context);
  const root=new Reading();root.closest=()=>frame;root.contains=h=>headings.includes(h);root.append=()=>{};root.querySelectorAll=s=>s==='.article-outline a'?links:[];root.querySelector=s=>matchesToolbar(s)?toolbar:s==='[data-copy-status]'?new Element():null;
  const flush=()=>{const batch=[...queue.values()];queue.clear();for(const fn of batch)fn();};root.connectedCallback();flush();
  const click=index=>{const e=new Event('click',{cancelable:true});Object.defineProperty(e,'button',{value:0});links[index].dispatchEvent(e);};
  return {root,frame,headings,links,queue,flush,click};
}

test('outline jump survives a scroll event queued before its frame',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('scroll'));x.flush();assert.equal(x.frame.scrollTop,376);assert.equal(x.headings[0].focused,true);});
test('mobile jump leaves the heading below the visible sticky toolbar',()=>{const x=reading(true);x.click(0);x.flush();assert.equal(x.frame.scrollTop,334);});
test('desktop jump keeps its compact gap and last rapid click wins',()=>{const x=reading();x.click(0);x.click(1);x.flush();assert.equal(x.frame.scrollTop,676);assert.equal(x.headings[0].focused,undefined);assert.equal(x.links[1].attrs['aria-current'],'location');});
for(const name of ['wheel','touchstart'])test(`${name} cancels a pending outline jump`,()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event(name));x.flush();assert.equal(x.frame.scrollTop,0);});
test('scrolling keyboard intent cancels a pending jump',()=>{const x=reading();x.click(0);const e=new Event('keydown');Object.defineProperty(e,'key',{value:'PageDown'});x.frame.dispatchEvent(e);x.flush();assert.equal(x.frame.scrollTop,0);});
test('disconnect cancels both pending jump and highlight work',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('scroll'));x.root.isConnected=false;x.root.disconnectedCallback();x.flush();assert.equal(x.frame.scrollTop,0);assert.equal(x.queue.size,0);});
test('pointer intent on the scroll frame cancels a pending jump',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('pointerdown'));x.flush();assert.equal(x.frame.scrollTop,0);});

test('restored viewport with an anchor is preserved rather than replaced by an outline jump',()=>{const x=reading(false,true);x.flush();assert.equal(x.frame.scrollTop,180);assert.equal(x.headings[0].focused,undefined);});
