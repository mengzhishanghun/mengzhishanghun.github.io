import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {generatedPage} from './interaction-fixtures.mjs';
function runtime(docs=false) {
  const fixture=generatedPage(docs?'zh/docs/tools/ue-quick-start/index.html':undefined);
  // The real generated DOM decides which of the production container selectors matches.
  assert.ok(fixture.select(docs?'.site-chrome-docs .main-frame':'.site-chrome-main'));
  const queue=new Map(),writes=[];let next=0;let location=new URL('https://mzsh.me/a/?keep=yes#start');
  class Target extends EventTarget { counts=new Map();addEventListener(name,fn,opts){super.addEventListener(name,fn,opts);this.counts.set(name,(this.counts.get(name)||0)+1);opts?.signal?.addEventListener('abort',()=>this.counts.set(name,this.counts.get(name)-1),{once:true});} }
  const makeFrame=()=>{const frame=new Target();frame.scrollTop=0;frame.isConnected=true;return frame;};let current=makeFrame();
  const document=new Target();document.querySelector=selector=>selector==='meta[name="astro-view-transitions-enabled"]'?{}:fixture.select(selector)?current:null;
  const window=new Target();const history={state:{index:0,keep:'preserved'},pushState(state,_title,url){if(this.failPush)throw Error('native push failure');this.state=state;if(url)location=new URL(url,location);},replaceState(state,_title,url){this.state=state;writes.push({url:location.pathname+location.search+location.hash,state:structuredClone(state)});if(url)location=new URL(url,location);}};
  const context={document,window,history,get location(){return location;},AbortController,requestAnimationFrame:fn=>{queue.set(++next,fn);return next;},cancelAnimationFrame:id=>queue.delete(id)};
  const script=new URL('../shared/i18n/scripts/viewport.js',import.meta.url);let source;
  if(fs.existsSync(script))source=fs.readFileSync(script,'utf8');else{const template=fs.readFileSync(new URL('./templates/blog--cnblogs-19136316.html',import.meta.url),'utf8');source=template.match(/<script type="module">([^<]*mzshViewport[^<]*)<\/script>/)[1];}
  vm.runInNewContext(source,context);
  const flush=()=>{const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn());};
  const emit=(target,name,props={})=>{const e=new Event(name);Object.assign(e,props);target.dispatchEvent(e);};
  const scroll=top=>{current.scrollTop=top;emit(current,'scroll');};
  const move=(url,index,state={})=>{location=new URL(url,location);history.state={index,keep:'preserved',...state};};
  const swap=(url,index,state={})=>{current.isConnected=false;current=makeFrame();move(url,index,state);emit(document,'astro:after-swap');emit(document,'astro:page-load');};
  const prepare=()=>{const controller=new AbortController();emit(document,'astro:before-preparation',{signal:controller.signal});return controller;};
  return {reinstall:()=>vm.runInNewContext('(()=>{'+source+'})();',context),history,writes,queue,flush,scroll,move,swap,prepare,emit,window,document,get frame(){return current;}};
}

test('scroll immediately followed by preparation saves the old entry before its frame',()=>{const x=runtime();x.scroll(420);x.prepare();x.flush();assert.equal(x.history.state.mzshViewport?.top,420);assert.equal(x.history.state.keep,'preserved');});
test('scrolling while navigation waits is retained on return',()=>{const x=runtime(true);x.scroll(120);x.prepare();x.scroll(460);x.flush();x.swap('/b/',1);x.swap('/a/?keep=yes#start',0);assert.equal(x.frame.scrollTop,460);});
test('out-of-order aborted preparations and stale page-load cannot replace the latest container',()=>{const x=runtime();x.scroll(210);const first=x.prepare();const second=x.prepare();x.swap('/c/',2);x.scroll(630);first.abort();second.abort();x.emit(x.document,'astro:page-load');x.flush();assert.equal(x.history.state.mzshViewport?.key,'/c/');assert.equal(x.history.state.mzshViewport?.top,630);});
test('back and forward restore each entry and preserve query/hash keys',()=>{const x=runtime();x.scroll(410);x.prepare();x.swap('/b/?q=two#title',1);x.scroll(720);x.flush();x.swap('/a/?keep=yes#start',0);assert.equal(x.frame.scrollTop,410);x.swap('/b/?q=two#title',1);assert.equal(x.frame.scrollTop,720);assert.equal(x.history.state.mzshViewport?.key,'/b/?q=two#title');});
test('same-document popstate/hash traversal restores and continues saving scroll',()=>{const x=runtime();x.scroll(330);x.flush();x.move('/a/?keep=yes#other',1);x.emit(x.window,'popstate');x.emit(x.window,'hashchange');x.scroll(660);x.flush();assert.equal(x.history.state.mzshViewport?.key,'/a/?keep=yes#other');assert.equal(x.history.state.mzshViewport?.top,660);x.move('/a/?keep=yes#start',0);x.emit(x.window,'popstate');x.emit(x.window,'hashchange');assert.equal(x.frame.scrollTop,330);x.scroll(350);x.flush();assert.equal(x.history.state.mzshViewport?.top,350);});
test('same-index replaceState query/hash changes keep saving the actual URL',()=>{const x=runtime();x.scroll(250);x.flush();x.history.replaceState(x.history.state,'','/a/?filter=ue#chosen');x.scroll(580);x.flush();assert.equal(x.history.state.mzshViewport?.key,'/a/?filter=ue#chosen');assert.equal(x.history.state.mzshViewport?.top,580);});
test('detached old container frame cannot write to the target history entry',()=>{const x=runtime();x.scroll(370);const old=x.frame;x.swap('/b/',1);x.flush();assert.equal(x.history.state.mzshViewport,undefined);old.scrollTop=999;x.emit(old,'scroll');x.flush();assert.equal(x.history.state.mzshViewport,undefined);});
test('a history switch before the old queued frame cannot record old scroll in the new entry',()=>{const x=runtime();x.scroll(510);x.move('/b/',1);x.flush();assert.equal(x.history.state.mzshViewport,undefined);});
test('repeated module initialization and page-load bind listeners once',()=>{const x=runtime();x.reinstall();assert.equal(x.document.counts.get('astro:before-preparation'),1);x.emit(x.document,'astro:page-load');x.emit(x.document,'astro:page-load');assert.equal(x.frame.counts.get('scroll'),1);});

test('Astro same-document push without events continues recording and restores on back',()=>{const x=runtime();x.scroll(320);x.history.pushState({index:1,keep:'new-entry'},'', '/a/?keep=yes#other');x.scroll(640);x.flush();assert.equal(x.history.state.mzshViewport?.top,640);assert.equal(x.history.state.mzshViewport?.key,'/a/?keep=yes#other');assert.equal(x.history.state.keep,'new-entry');x.move('/a/?keep=yes#start',0);x.emit(x.window,'popstate');assert.equal(x.frame.scrollTop,320);});
test('new push after back replaces reused index snapshots instead of restoring the old branch',()=>{const x=runtime();x.scroll(200);x.flush();x.prepare();x.history.pushState({index:1},'', '/b/');x.swap('/b/',1);x.scroll(700);x.flush();x.swap('/a/?keep=yes#start',0);assert.equal(x.frame.scrollTop,200);x.prepare();x.history.pushState({index:1},'', '/b/');x.swap('/b/',1);assert.equal(x.frame.scrollTop,0);x.scroll(350);x.flush();assert.equal(x.history.state.mzshViewport?.top,350);});

test('a native push exception leaves pending save and listener binding untouched',()=>{const x=runtime();x.scroll(480);const pending=x.queue.size,writes=x.writes.length;x.history.failPush=true;assert.throws(()=>x.history.pushState({index:1},'', '/a/?keep=yes#other'),/native push failure/);assert.equal(x.queue.size,pending);assert.equal(x.writes.length,writes);assert.equal(x.frame.counts.get('scroll'),1);assert.equal(x.history.state.index,0);x.flush();assert.equal(x.history.state.mzshViewport?.top,480);});
