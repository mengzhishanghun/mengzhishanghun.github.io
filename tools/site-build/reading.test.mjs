import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {generatedPage,toolbarGeometry} from './interaction-fixtures.mjs';
function reading(mobile=false,restored=false,{height=800,docs=false}={}) {
  const fixture=generatedPage(docs?'zh/docs/tools/ue-quick-start/index.html':undefined);
  const actualToolbar=fixture.select('mobile-outline');
  const readerNode=fixture.select('mzsh-reading');
  const actualFrame=fixture.closest(readerNode,'.main-frame, .site-chrome-main');
  assert.ok(actualFrame);assert.ok(fixture.select('.article-outline a'));
  assert.ok(actualToolbar);
  const toolbarHeight=toolbarGeometry(docs);
  const queue=new Map();let next=0,Reading;
  class Element extends EventTarget { attrs={};style={setProperty(){}};isConnected=true;setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}focus(){this.focused=true;} }
  const frame=new Element();frame.scrollTop=restored?180:0;frame.clientHeight=height;frame.getBoundingClientRect=()=>({top:100,height});frame.scrollTo=({top})=>{frame.scrollTop=top;};
  const headings=[400,700].map((top,index)=>{const h=new Element();h.id=`h${index}`;h.getBoundingClientRect=()=>({top:100+top-frame.scrollTop});return h;});
  const links=headings.map(h=>{const a=new Element();a.hash=`#${h.id}`;return a;});
  const toolbar=new Element();toolbar.getBoundingClientRect=()=>({height:toolbarHeight});toolbar.getClientRects=()=>mobile?[{}]:[];
  const document={getElementById:id=>headings.find(h=>h.id===id),createElement:()=>new Element()};
  const window=new EventTarget();window.SiteCopy={};window.clearTimeout=clearTimeout;
  const context={HTMLElement:Element,document,window,AbortController,history:{state:restored?{mzshViewport:{key:'/zh/blog/one/#h0',top:180}}:null,replaceState(){}},location:{pathname:'/zh/blog/one/',search:'',hash:restored?'#h0':''},requestAnimationFrame:fn=>{queue.set(++next,fn);return next;},cancelAnimationFrame:id=>queue.delete(id),customElements:{get(){},define(_name,cls){Reading=cls;}},getComputedStyle:()=>({display:mobile?'block':'none',visibility:'visible',position:'sticky'})};
  vm.runInNewContext(fs.readFileSync(new URL('./scripts/_astro/ReadingEnhancements.astro_astro_type_script_index_0_lang.jfxlepAz.js',import.meta.url),'utf8'),context);
  const root=new Reading();root.closest=s=>fixture.closest(readerNode,s)===actualFrame?frame:null;root.contains=h=>headings.includes(h);root.append=()=>{};root.querySelectorAll=s=>s==='.article-outline a'&&fixture.select(s)?links:[];root.querySelector=s=>fixture.select(s)===actualToolbar?toolbar:s==='[data-copy-status]'?new Element():null;
  const flush=()=>{const batch=[...queue.values()];queue.clear();for(const fn of batch)fn();};root.connectedCallback();flush();
  const click=index=>{const e=new Event('click',{cancelable:true});Object.defineProperty(e,'button',{value:0});links[index].dispatchEvent(e);};
  return {root,frame,headings,links,queue,flush,click,context,window};
}

test('outline jump survives a scroll event queued before its frame',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('scroll'));x.flush();assert.equal(x.frame.scrollTop,376);assert.equal(x.headings[0].focused,true);});
test('mobile jump leaves the heading below the visible sticky toolbar',()=>{const x=reading(true);x.click(0);x.flush();assert.equal(x.frame.scrollTop,334);});
test('desktop jump keeps its compact gap and last rapid click wins',()=>{const x=reading();x.click(0);x.click(1);x.flush();assert.equal(x.frame.scrollTop,676);assert.equal(x.headings[0].focused,undefined);assert.equal(x.links[1].attrs['aria-current'],'location');});
for(const name of ['wheel','touchstart'])test(`${name} cancels a pending outline jump`,()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event(name));x.flush();assert.equal(x.frame.scrollTop,0);});
test('scrolling keyboard intent cancels a pending jump',()=>{const x=reading();x.click(0);const e=new Event('keydown');Object.defineProperty(e,'key',{value:'PageDown'});x.frame.dispatchEvent(e);x.flush();assert.equal(x.frame.scrollTop,0);});
test('disconnect cancels both pending jump and highlight work',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('scroll'));x.root.isConnected=false;x.root.disconnectedCallback();x.flush();assert.equal(x.frame.scrollTop,0);assert.equal(x.queue.size,0);});
test('pointer intent on the scroll frame cancels a pending jump',()=>{const x=reading();x.click(0);x.frame.dispatchEvent(new Event('pointerdown'));x.flush();assert.equal(x.frame.scrollTop,0);});

test('restored viewport with an anchor is preserved rather than replaced by an outline jump',()=>{const x=reading(false,true);x.flush();assert.equal(x.frame.scrollTop,180);assert.equal(x.headings[0].focused,undefined);});

test('hash traversal preserves the matching restored viewport instead of jumping to its heading',()=>{const x=reading();x.frame.scrollTop=180;x.context.location.hash='#h0';x.context.history.state={mzshViewport:{key:'/zh/blog/one/#h0',top:180}};x.window.dispatchEvent(new Event('hashchange'));x.flush();assert.equal(x.frame.scrollTop,180);assert.equal(x.headings[0].focused,undefined);});

for(const [name,options,mobile,want] of [
  ['phone with visible toolbar',{height:800},true,334],
  ['half-height docs with visible toolbar',{height:400,docs:true},true,334],
  ['tall docs with hidden toolbar',{height:1200,docs:true},false,376]
])test(name+' positions the heading using generated toolbar geometry',()=>{const x=reading(mobile,false,options);x.click(0);x.flush();assert.equal(x.frame.scrollTop,want);});
