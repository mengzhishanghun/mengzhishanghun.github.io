import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {generatedPage} from './interaction-fixtures.mjs';

function viewer(relative) {
  const fixture=generatedPage(relative);
  const anchorNode=fixture.select('a[data-media-image]');assert.ok(anchorNode,'the generated article supplies a published image trigger');
  const frameNode=fixture.closest(anchorNode,'.site-chrome-main,.main-frame');
  assert.ok(frameNode,'the generated page supplies the viewer scroll container');
  const listeners={},windows={},opened=[],fallback=[];let finish,reject;
  const loading=new Promise((resolve,no)=>{finish=resolve;reject=no;});
  const frame={scrollTop:125},anchor={isConnected:true,href:new URL(fixture.attrs(anchorNode).href,'https://mzsh.me').href,dataset:{mediaSrc:fixture.attrs(anchorNode)['data-media-src'],mediaAlt:fixture.attrs(anchorNode)['data-media-alt']},hasAttribute:name=>Object.hasOwn(fixture.attrs(anchorNode),name),closest:s=>fixture.closest(anchorNode,s)===frameNode?frame:null,querySelector:()=>({naturalWidth:640,naturalHeight:480,alt:'Image'}),focus(){this.focused=true;}};
  class Viewer { constructor(options){this.options=options;opened.push(this);}on(_name,fn){this.finish=fn;}init(){this.active=true;}destroy(){this.active=false;this.finish();} }
  const document={createElement:()=>({relList:{supports:()=>true}}),addEventListener:(name,fn)=>listeners[name]=fn};
  const window={SiteCopy:fixture.copy,addEventListener:(name,fn)=>windows[name]=fn};
  let source=fs.readFileSync(new URL('./scripts/_astro/ImageViewer.astro_astro_type_script_index_0_lang.CcVinRbp.js',import.meta.url),'utf8');source=source.replaceAll('import.meta.resolve','false').replaceAll('import.meta.url','"https://mzsh.me/_astro/viewer.js"').replace(/l\(\);\s*$/,'l(testLoader);');
  vm.runInNewContext(source,{document,window,URL,location:{href:'https://mzsh.me/zh/blog/one/',assign:url=>fallback.push(url)},matchMedia:()=>({matches:false}),testLoader:()=>loading});
  const click=(target=anchor)=>listeners.click({target:{closest:s=>fixture.matches(anchorNode,s)?target:null},button:0,preventDefault(){}});
  return {anchor,frame,opened,fallback,click,navigate:()=>listeners['astro:before-preparation'](),hide:()=>windows.pagehide(),finish:()=>finish([{default:Viewer},{},{default:{}}]),reject:()=>reject(Error('load failed'))};
}

test('delayed viewer load after navigation cannot open or redirect',async()=>{const x=viewer();const pending=x.click();x.navigate();x.finish();await pending;assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);});
test('rapid image clicks open only the latest request and close restores article scroll',async()=>{const x=viewer();const one=x.click();const two=x.click();x.finish();await Promise.all([one,two]);assert.equal(x.opened.length,1);x.frame.scrollTop=400;x.opened[0].destroy();assert.equal(x.frame.scrollTop,125);assert.equal(x.anchor.focused,true);});
test('current load failure falls back to the image URL',async()=>{const x=viewer();const pending=x.click();x.reject();await pending;assert.deepEqual(x.fallback,[x.anchor.href]);});
test('pagehide destroys an active viewer without restoring stale page focus or scroll',async()=>{const x=viewer();const pending=x.click();x.finish();await pending;x.frame.scrollTop=500;x.hide();assert.equal(x.opened[0].active,false);assert.equal(x.frame.scrollTop,500);assert.equal(x.anchor.focused,undefined);});

test('scrolling during image dependency loading restores the latest position on close',async()=>{const x=viewer();const pending=x.click();x.frame.scrollTop=400;x.finish();await pending;x.frame.scrollTop=700;x.opened[0].destroy();assert.equal(x.frame.scrollTop,400);assert.equal(x.anchor.focused,true);});

test('English docs use the shared viewer copy slots',async()=>{const x=viewer('en/docs/guides/ue-tools/simple-tcp-client-guide/index.html');const pending=x.click();x.finish();await pending;assert.equal(x.opened[0].options.closeTitle,'Close image');assert.equal(x.opened[0].options.zoomTitle,'Zoom image');});
test('missing image dimensions fall back to the current image URL',async()=>{const x=viewer();x.anchor.querySelector=()=>({naturalWidth:0,naturalHeight:0,alt:'Image'});const pending=x.click();x.finish();await pending;assert.deepEqual(x.fallback,[x.anchor.href]);});
