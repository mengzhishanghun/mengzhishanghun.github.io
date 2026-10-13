import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function viewer() {
  const listeners={},windows={},opened=[],fallback=[];let finish,reject;
  const loading=new Promise((resolve,no)=>{finish=resolve;reject=no;});
  const frame={scrollTop:125},anchor={isConnected:true,href:'https://mzsh.me/assets/one.png',dataset:{},hasAttribute:()=>false,closest:s=>s.includes('main-frame')?frame:null,querySelector:()=>({naturalWidth:640,naturalHeight:480,alt:'Image'}),focus(){this.focused=true;}};
  class Viewer { constructor(options){this.options=options;opened.push(this);}on(_name,fn){this.finish=fn;}init(){this.active=true;}destroy(){this.active=false;this.finish();} }
  const document={createElement:()=>({relList:{supports:()=>true}}),addEventListener:(name,fn)=>listeners[name]=fn};
  const window={SiteCopy:{},addEventListener:(name,fn)=>windows[name]=fn};
  let source=fs.readFileSync(new URL('./scripts/_astro/ImageViewer.astro_astro_type_script_index_0_lang.CcVinRbp.js',import.meta.url),'utf8');source=source.replaceAll('import.meta.resolve','false').replaceAll('import.meta.url','"https://mzsh.me/_astro/viewer.js"').replace(/l\(\);\s*$/,'l(testLoader);');
  vm.runInNewContext(source,{document,window,URL,location:{href:'https://mzsh.me/zh/blog/one/',assign:url=>fallback.push(url)},matchMedia:()=>({matches:false}),testLoader:()=>loading});
  const click=(target=anchor)=>listeners.click({target:{closest:()=>target},button:0,preventDefault(){}});
  return {anchor,frame,opened,fallback,click,navigate:()=>listeners['astro:before-preparation'](),hide:()=>windows.pagehide(),finish:()=>finish([{default:Viewer},{},{default:{}}]),reject:()=>reject(Error('load failed'))};
}

test('delayed viewer load after navigation cannot open or redirect',async()=>{const x=viewer();const pending=x.click();x.navigate();x.finish();await pending;assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);});
test('rapid image clicks open only the latest request and close restores article scroll',async()=>{const x=viewer();const one=x.click();const two=x.click();x.finish();await Promise.all([one,two]);assert.equal(x.opened.length,1);x.frame.scrollTop=400;x.opened[0].destroy();assert.equal(x.frame.scrollTop,125);assert.equal(x.anchor.focused,true);});
test('current load failure falls back to the image URL',async()=>{const x=viewer();const pending=x.click();x.reject();await pending;assert.deepEqual(x.fallback,[x.anchor.href]);});
test('pagehide destroys an active viewer without restoring stale page focus or scroll',async()=>{const x=viewer();const pending=x.click();x.finish();await pending;x.frame.scrollTop=500;x.hide();assert.equal(x.opened[0].active,false);assert.equal(x.frame.scrollTop,500);assert.equal(x.anchor.focused,undefined);});
