import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
function session(options={}){
 const storage=options.storage||new Map();let url=new URL(options.url||'https://mzsh.me/zh/blog/?category=ue&q=shader&tag=render&page=3#cards'),now=10000000;
 const state={index:7,keep:'yes',mzshNavigation:{id:'current',parent:null},mzshViewport:{key:url.pathname+url.search+url.hash,top:1530},mzshContentTags:{key:url.pathname,category:'ue',expanded:true}};
 const window={get sessionStorage(){if(options.disabled)throw Error('disabled');return {getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};}};
 const history={state,replaceState(next,_title,href){this.state=next;if(href)url=new URL(href,url);}};
 const context={window,history,get location(){return url;},URL,Date:class extends Date{static now(){return now;}}};
 const source=fs.readFileSync(new URL('../shared/i18n/scripts/return-state.js',import.meta.url),'utf8').replace(/^export /gm,'');vm.runInNewContext(source+';globalThis.api={rememberSessionPage,prepareSessionReturn,applySessionReturn,clearSessionReturn};',context);
 return {api:context.api,storage,history,move(value){url=new URL(value,url);history.state={index:20,keep:'target',mzshNavigation:{id:'target',parent:null}};},age(ms){now+=ms;},get url(){return url;}};
}
test('fallback session state restores exact URL and only necessary fields without replacing navigation identity',()=>{
 const x=session();x.api.rememberSessionPage();x.move('/zh/docs/guide/');const prepared=x.api.prepareSessionReturn('/zh/blog/');assert.equal(prepared.url,'/zh/blog/?category=ue&q=shader&tag=render&page=3#cards');x.move(prepared.url);assert.equal(x.api.applySessionReturn(),true);assert.equal(x.history.state.index,20);assert.equal(x.history.state.keep,'target');assert.equal(x.history.state.mzshNavigation.id,'target');assert.equal(x.history.state.mzshNavigation.parent,null);assert.equal(x.history.state.mzshViewport.top,1530);assert.equal(x.history.state.mzshContentTags.expanded,true);assert.equal(x.api.applySessionReturn(),false);
});
test('ordinary navigation, explicit targets and other languages never consume cached pages',()=>{
 const x=session();x.api.rememberSessionPage();x.move('/zh/blog/');assert.equal(x.api.applySessionReturn(),false);x.move('/en/docs/guide/');assert.equal(x.api.prepareSessionReturn('/en/blog/').url,'/en/blog/');assert.equal(x.api.prepareSessionReturn('/zh/blog/').url,'/zh/blog/');x.move('/zh/docs/guide/');for(const href of ['/zh/blog/?q=explicit','/zh/blog/#heading']){assert.equal(x.api.prepareSessionReturn(href).url,href);assert.equal(x.api.applySessionReturn(),false);}
});
test('blocked storage, malformed records, expiry and canceled or mismatched intents degrade safely',()=>{
 const disabled=session({disabled:true});assert.doesNotThrow(()=>disabled.api.rememberSessionPage());assert.equal(disabled.api.prepareSessionReturn('/zh/blog/').url,'/zh/blog/');assert.equal(disabled.api.applySessionReturn(),false);
 const x=session();x.api.rememberSessionPage();x.move('/zh/docs/guide/');let p=x.api.prepareSessionReturn('/zh/blog/');x.api.clearSessionReturn(p.intent);x.move(p.url);assert.equal(x.api.applySessionReturn(),false);
 x.move('/zh/docs/guide/');p=x.api.prepareSessionReturn('/zh/blog/');x.move('/zh/works/');assert.equal(x.api.applySessionReturn(),false);x.move(p.url);assert.equal(x.api.applySessionReturn(),false);
 x.move('/zh/docs/guide/');p=x.api.prepareSessionReturn('/zh/blog/');x.age(60001);x.move(p.url);assert.equal(x.api.applySessionReturn(),false);x.age(24*60*60*1000);assert.equal(x.api.prepareSessionReturn('/zh/blog/').url,'/zh/blog/');
 for(const [k]of x.storage)x.storage.set(k,'{broken');assert.doesNotThrow(()=>x.api.rememberSessionPage());assert.equal(x.api.applySessionReturn(),false);
});
test('cached state excludes arbitrary history fields and rejects invalid scroll or tag values',()=>{
 const x=session();x.history.state.privateField='secret';x.history.state.mzshViewport.top=-1;x.history.state.mzshContentTags.expanded='yes';x.api.rememberSessionPage();assert.doesNotMatch([...x.storage.values()].join(''),/secret|mzshNavigation|privateField/);x.move('/zh/docs/guide/');const p=x.api.prepareSessionReturn('/zh/blog/');x.move(p.url);x.api.applySessionReturn();assert.equal(x.history.state.mzshViewport,undefined);assert.equal(x.history.state.mzshContentTags,undefined);
});

test('generated viewport and content index import the same reachable fingerprinted session helper',()=>{
 const root=new URL('../../'+(process.env.SITE_OUTPUT||'dist/site')+'/',import.meta.url),directory=new URL('assets/site-ui/i18n/',root),files=fs.readdirSync(directory),helper=files.find(file=>/^return-state\.[a-f0-9]{12}\.js$/.test(file));assert.ok(helper);
 const page=fs.readFileSync(new URL('zh/blog/index.html',root),'utf8');
 for(const name of ['viewport','ContentIndex']){const href=[...page.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match=>match[1]).find(href=>href.startsWith('/assets/site-ui/i18n/'+name+'.'));assert.ok(href);const source=fs.readFileSync(new URL(href.slice(1),root),'utf8'),imports=[...source.matchAll(/from\s+["']([^"']+)["']/g)].map(match=>match[1]);assert.ok(imports.includes('/assets/site-ui/i18n/'+helper));for(const href of imports)assert.ok(fs.existsSync(new URL(href.slice(1),root)));}
});

test('session page cache is bounded and expires rather than growing across paths',()=>{
 const x=session();for(let i=0;i<50;i++){x.move('/zh/blog/item-'+i+'/');x.api.rememberSessionPage({top:100+i});}const stored=[...x.storage.values()].map(raw=>JSON.parse(raw)).find(Array.isArray);assert.ok(stored.length<=32);x.move('/zh/docs/guide/');assert.equal(x.api.prepareSessionReturn('/zh/blog/item-0/').url,'/zh/blog/item-0/');assert.ok(x.api.prepareSessionReturn('/zh/blog/item-49/').intent);x.api.clearSessionReturn();x.age(24*60*60*1000);assert.equal(x.api.prepareSessionReturn('/zh/blog/item-49/').intent,null);
});
