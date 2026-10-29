import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function gallery(){
  const listeners={},windows={};let exits=0;
  const video={paused:false,pause(){this.paused=true;}};
  const panels=[{dataset:{galleryPanel:'0'},hidden:false},{dataset:{galleryPanel:'1'},hidden:true}];
  const buttons=[0,1].map(index=>({dataset:{gallerySelect:String(index)},setAttribute(name,value){this[name]=value;}}));
  const root={isConnected:true,querySelectorAll(selector){return selector==='video'?[video]:selector==='[data-gallery-panel]'?panels:buttons;},contains(node){return node===video;}};
  buttons.forEach(button=>button.closest=selector=>selector==='[data-project-gallery]'?root:selector==='[data-gallery-select]'?button:null);
  const document={createElement:()=>({relList:{supports:()=>true}}),fullscreenElement:video,exitFullscreen(){exits++;this.fullscreenElement=null;return Promise.resolve();},querySelectorAll:()=>[root],addEventListener(name,fn){(listeners[name]??=[]).push(fn);}};
  const window={addEventListener(name,fn){(windows[name]??=[]).push(fn);}};
  const context=vm.createContext({document,window});const source=fs.existsSync(new URL('../shared/project-gallery/client.js',import.meta.url))?fs.readFileSync(new URL('../shared/project-gallery/client.js',import.meta.url),'utf8'):'';
  const init=()=>vm.runInContext(source,context);init();
  const fire=(name,event={})=>(listeners[name]||windows[name]||[]).map(fn=>fn(event));
  return {init,listeners,video,panels,buttons,root,context,window,exits:()=>exits,fire,click(index){fire('click',{target:buttons[index],button:0});}};
}
test('switching gallery selection pauses video, leaves fullscreen and updates the visible panel',()=>{const x=gallery();x.click(1);assert.equal(x.video.paused,true);assert.equal(x.exits(),1);assert.equal(x.panels[0].hidden,true);assert.equal(x.panels[1].hidden,false);assert.equal(x.buttons[1]['aria-pressed'],'true');});
test('navigation and pagehide stop current media; repeated initialization adds no handlers',()=>{for(const event of ['astro:before-preparation','pagehide']){const x=gallery();x.init();x.init();x.fire(event);assert.equal(x.video.paused,true);assert.equal(x.exits(),1);assert.equal(x.listeners.click.length,1);}});
test('detached gallery cannot be changed by a stale click',()=>{const x=gallery();x.root.isConnected=false;x.click(1);assert.equal(x.panels[1].hidden,true);assert.equal(x.video.paused,false);});
function coldViewer(){
  const x=gallery(),opened=[],fallback=[];let finish,reject;
  const loading=new Promise((resolve,no)=>{finish=resolve;reject=no;});
  const frame={scrollTop:125};
  const anchors=x.panels.map((panel,index)=>{
    const anchor={isConnected:true,href:'https://mzsh.me/media/image-'+index+'.png',dataset:{mediaSrc:'/media/image-'+index+'.png',mediaAlt:'Image '+index},hasAttribute:()=>false,querySelector:()=>({naturalWidth:640,naturalHeight:480,alt:'Image'}),focus(){this.focused=true;}};
    anchor.closest=selector=>selector==='a[data-media-image]'?anchor:selector==='.site-chrome-main,.main-frame'?frame:selector==='[data-gallery-panel][hidden]'&&panel.hidden?panel:null;return anchor;
  });
  class Viewer{constructor(options){this.options=options;opened.push(this);}on(_name,callback){this.finish=callback;}init(){this.active=true;}destroy(){this.active=false;this.finish();}}
  x.window.SiteCopy={};Object.assign(x.context,{URL,location:{href:'https://mzsh.me/en/works/example/',assign:url=>fallback.push(url)},matchMedia:()=>({matches:false}),testLoader:()=>loading});
  let source=fs.readFileSync(new URL('../shared/i18n/scripts/_astro/ImageViewer.astro_astro_type_script_index_0_lang.CcVinRbp.js',import.meta.url),'utf8');source=source.replaceAll('import.meta.resolve','false').replaceAll('import.meta.url','"https://mzsh.me/_astro/viewer.js"').replace(/l\(\);\s*$/,'l(testLoader);');vm.runInContext(source,x.context);
  return {...x,opened,fallback,anchors,frame,open:index=>Promise.all(x.fire('click',{target:anchors[index],button:0,preventDefault(){}})),finish:()=>finish([{default:Viewer},{},{default:{}}]),reject:()=>reject(Error('dependency failed'))};
}
test('real gallery switching cancels a hidden image while the real viewer dependency is loading',async()=>{const x=coldViewer(),pending=x.open(0);x.click(1);assert.equal(x.panels[0].hidden,true);assert.equal(x.panels[1].hidden,false);x.finish();await pending;assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);const current=x.open(1);await current;assert.equal(x.opened.length,1);x.frame.scrollTop=500;x.opened[0].destroy();assert.equal(x.anchors[1].focused,true);assert.equal(x.frame.scrollTop,125);});
test('real gallery switching prevents a failed cold viewer load from navigating to the hidden image',async()=>{const x=coldViewer(),pending=x.open(0);x.click(1);x.reject();await pending;assert.equal(x.panels[0].hidden,true);assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);});
