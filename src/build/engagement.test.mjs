import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('permanent identity survives route change and refuses replacement or reuse',async()=>{
  const {validateArticleIdentities,shareRoute}=await import('../engagement/article-identities.mjs');
  const registry={version:1,articles:[{id:'doc:guide',translationKey:'guide-source',type:'doc'}]};
  const entries=[{id:'doc:guide',translationKey:'guide-source',type:'doc',slug:'renamed',legacyRoutes:['/docs/zh/tools/renamed/']}];
  assert.deepEqual(validateArticleIdentities(entries,registry),['doc:guide']);assert.equal(shareRoute(entries[0],'en'),'/docs/tools/renamed/');
  assert.throws(()=>validateArticleIdentities([{...entries[0],id:'doc:new'}],registry),/身份/);
  assert.throws(()=>validateArticleIdentities([{...entries[0],translationKey:'different-source'}],registry),/身份/);
  assert.deepEqual(validateArticleIdentities([],registry),[]);
  const shared={version:1,articles:[{id:'work:one',translationKey:'same'},{id:'doc:one',translationKey:'same'}]};
  assert.deepEqual(validateArticleIdentities([{id:'work:one',translationKey:'same',type:'work'},{id:'doc:one',translationKey:'same',type:'doc'}],shared),['work:one','doc:one']);
  assert.deepEqual(validateArticleIdentities([{...entries[0],type:'case'}],registry),['doc:guide']);
});
test('share copies the canonical link even when native sharing is available, with manual fallback',async()=>{
  const {share}=runtime();let nativeCalls=0,copied='',manual='';
  const url='https://mzsh.me/docs/tools/guide/';
  assert.equal(await share({url,title:'Guide',navigator:{share:async()=>{nativeCalls++;}},copy:async value=>{copied=value;},manual:()=>{throw Error('must not expose');}}),'copied');
  assert.equal(nativeCalls,0);assert.equal(copied,url);
  assert.equal(await share({url,navigator:{},copy:async()=>{throw Error('denied');},manual:value=>{manual=value;}}),'manual');assert.equal(manual,url);
});

test('backup host initiates zero API calls and repeated Astro initialization binds once',async()=>{
  const listeners=new Map(),root={isConnected:true,dataset:{},querySelector:selector=>parts[selector]};
  const button=()=>({hidden:true,disabled:false,addEventListener(name,fn){const key=this===parts['[data-engagement-share]']?'share':name;if(listeners.has(key))throw Error('duplicate binding');listeners.set(key,fn);}});
  const parts={'[data-engagement-config]':{textContent:JSON.stringify({id:'doc:guide',origin:'https://mzsh.me',url:'https://mzsh.me/docs/tools/guide/',title:'Guide',labels:{copied:'Copied'}})},'[data-engagement-like]':button(),'[data-engagement-count]':{},'[data-engagement-status]':{},'[data-engagement-share]':button(),'[data-engagement-manual]':{},'[data-engagement-url]':{}};
  let requests=0,copied='';const window={location:{origin:'https://mengzhishanghun.github.io'},fetch:async()=>{requests++;throw Error('must not fetch');},navigator:{clipboard:{writeText:async value=>{copied=value;}}}};
  const document={readyState:'complete',querySelectorAll:()=>[root],addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(new URL('../engagement/client/engagement.js',import.meta.url),'utf8'),{window,document,URL,AbortController,setTimeout,clearTimeout});window.SiteEngagement.init();
  await listeners.get('share')();assert.equal(requests,0);assert.equal(parts['[data-engagement-like]'].hidden,true);assert.equal(copied,'https://mzsh.me/docs/tools/guide/');assert.equal(parts['[data-engagement-status]'].textContent,'Copied');
});

function runtime(){const window={};const document={readyState:'loading',addEventListener(){}};vm.runInNewContext(fs.readFileSync(new URL('../engagement/client/engagement.js',import.meta.url),'utf8'),{window,document,URL,AbortController,setTimeout,clearTimeout});return window.SiteEngagement;}
function storage(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
test('pending survives unknown write and reload refuses resubmission; successful count marks liked',async()=>{
  const {createLikeAction}=runtime(),store=storage();let writes=0;
  let action=createLikeAction({id:'blog:one',storage:store,send:async()=>{writes++;throw new Error('offline');}});
  assert.equal((await action.like()).state,'pending');assert.equal(writes,1);
  action=createLikeAction({id:'blog:one',storage:store,send:async()=>{writes++;}});assert.equal((await action.like()).state,'pending');assert.equal(writes,1);
  const other=createLikeAction({id:'doc:two',storage:store,send:async()=>({ok:true,status:200,json:async()=>({count:3})})});assert.deepEqual(JSON.parse(JSON.stringify(await other.like())),{state:'liked',count:3});
});
test('storage failure sends nothing; only explicit prewrite rejection permits retry',async()=>{
  const {createLikeAction}=runtime();let writes=0;
  const blocked=createLikeAction({id:'x',storage:{getItem(){return null;},setItem(){throw Error('quota');}},send:async()=>{writes++;}});assert.equal((await blocked.like()).state,'storage');assert.equal(writes,0);
  const store=storage(),action=createLikeAction({id:'x',storage:store,send:async()=>{writes++;return {ok:false,status:429,json:async()=>({error:'rate_limit',write:'rejected'})};}});assert.equal((await action.like()).state,'ready');assert.equal(store.getItem('article-like:x'),null);
  const malformed=createLikeAction({id:'y',storage:store,send:async()=>({ok:true,status:200,json:async()=>({count:'1'})})});assert.equal((await malformed.like()).state,'pending');
});
test('two preopened languages reread shared persistent state before sending',async()=>{
  const {createLikeAction}=runtime(),store=storage();let writes=0;
  const send=async()=>{writes++;return {ok:true,status:200,json:async()=>({count:1})};};
  const zh=createLikeAction({id:'blog:shared',storage:store,send}),en=createLikeAction({id:'blog:shared',storage:store,send});
  await zh.like();assert.equal((await en.like()).state,'liked');assert.equal(writes,1);
});
test('late initial read never replaces a confirmed like count',async()=>{
  let finishRead;const read=new Promise(resolve=>{finishRead=resolve;});let click;
  const parts={'[data-engagement-config]':{textContent:JSON.stringify({id:'doc:guide',origin:'https://mzsh.me',url:'https://mzsh.me/docs/tools/guide/',title:'Guide',labels:{like:'Like',liked:'Liked'}})},'[data-engagement-like]':{hidden:true,attrs:{},setAttribute(name,value){this.attrs[name]=value;},addEventListener:(_,fn)=>{click=fn;}},'[data-engagement-like-label]':{},'[data-engagement-count]':{},'[data-engagement-status]':{},'[data-engagement-share]':{addEventListener(){}},'[data-engagement-manual]':{},'[data-engagement-url]':{}};
  const root={isConnected:true,dataset:{},querySelector:selector=>parts[selector]};
  const window={location:{origin:'https://mzsh.me'},localStorage:storage(),navigator:{},addEventListener(){},fetch:async(_url,options)=>options.method==='POST'?{ok:true,status:200,json:async()=>({count:1})}:read};
  const document={readyState:'complete',querySelectorAll:()=>[root],addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(new URL('../engagement/client/engagement.js',import.meta.url),'utf8'),{window,document,URL,AbortController,setTimeout,clearTimeout});
  await click();finishRead({ok:true,status:200,json:async()=>({count:0})});await new Promise(resolve=>setTimeout(resolve,0));assert.equal(parts['[data-engagement-count]'].textContent,'1');assert.equal(parts['[data-engagement-like]'].attrs['aria-pressed'],'true');assert.equal(parts['[data-engagement-like]'].attrs['aria-label'],'Liked');assert.equal(parts['[data-engagement-status]'].textContent,'');
});
