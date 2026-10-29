import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {generatedPage} from './interaction-fixtures.mjs';
import {projectImageViewers} from './media.mjs';

function viewer(relative,mediaURL) {
  const fixture=generatedPage(relative,html=>projectImageViewers(html,relative?.startsWith('en/')?'en':'zh'));
  const anchorNode=mediaURL?fixture.nodes.find(node=>node.tagName==='a'&&fixture.attrs(node)['data-media-image']!==undefined&&fixture.attrs(node).href===mediaURL):fixture.select('a[data-media-image]');assert.ok(anchorNode,'the generated article supplies a published image trigger');
  const frameNode=fixture.closest(anchorNode,'.site-chrome-main,.main-frame');
  assert.ok(frameNode,'the generated page supplies the viewer scroll container');
  const listeners={},windows={},opened=[],fallback=[];let finish,reject;
  const loading=new Promise((resolve,no)=>{finish=resolve;reject=no;});
  const frame={scrollTop:125},anchor={isConnected:true,href:new URL(fixture.attrs(anchorNode).href,'https://mzsh.me').href,dataset:{mediaSrc:fixture.attrs(anchorNode)['data-media-src'],mediaAlt:fixture.attrs(anchorNode)['data-media-alt']},hasAttribute:name=>Object.hasOwn(fixture.attrs(anchorNode),name),closest:s=>fixture.closest(anchorNode,s)===frameNode?frame:null,querySelector:()=>({naturalWidth:640,naturalHeight:480,alt:'Image'}),focus(){this.focused=true;}};
  class Viewer { constructor(options){this.options=options;opened.push(this);}on(_name,fn){this.finish=fn;}init(){this.active=true;}destroy(){this.active=false;this.finish();} }
  const document={createElement:()=>({relList:{supports:()=>true}}),addEventListener:(name,fn)=>listeners[name]=fn};
  const window={SiteCopy:fixture.copy,addEventListener:(name,fn)=>windows[name]=fn};
  let source=fs.readFileSync(new URL('../shared/i18n/scripts/_astro/ImageViewer.astro_astro_type_script_index_0_lang.CcVinRbp.js',import.meta.url),'utf8');source=source.replaceAll('import.meta.resolve','false').replaceAll('import.meta.url','"https://mzsh.me/_astro/viewer.js"').replace(/l\(\);\s*$/,'l(testLoader);');
  vm.runInNewContext(source,{document,window,URL,location:{href:'https://mzsh.me/zh/blog/one/',assign:url=>fallback.push(url)},matchMedia:()=>({matches:false}),testLoader:()=>loading});
  const click=(target=anchor,options={})=>listeners.click({target:{closest:s=>fixture.matches(anchorNode,s)?target:null},button:0,preventDefault(){},...options});
  return {anchor,frame,opened,fallback,click,navigate:()=>listeners['astro:before-preparation'](),hide:()=>windows.pagehide(),finish:(dimensions={})=>finish([{default:Viewer},{},{default:dimensions}]),reject:()=>reject(Error('load failed'))};
}

test('delayed viewer load after navigation cannot open or redirect',async()=>{const x=viewer();const pending=x.click();x.navigate();x.finish();await pending;assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);});
test('rapid image clicks open only the latest request and close restores article scroll',async()=>{const x=viewer();const one=x.click();const two=x.click();x.finish();await Promise.all([one,two]);assert.equal(x.opened.length,1);x.frame.scrollTop=400;x.opened[0].destroy();assert.equal(x.frame.scrollTop,125);assert.equal(x.anchor.focused,true);});
test('current load failure falls back to the image URL',async()=>{const x=viewer();const pending=x.click();x.reject();await pending;assert.deepEqual(x.fallback,[x.anchor.href]);});
test('pagehide destroys an active viewer without restoring stale page focus or scroll',async()=>{const x=viewer();const pending=x.click();x.finish();await pending;x.frame.scrollTop=500;x.hide();assert.equal(x.opened[0].active,false);assert.equal(x.frame.scrollTop,500);assert.equal(x.anchor.focused,undefined);});

test('scrolling during image dependency loading restores the latest position on close',async()=>{const x=viewer();const pending=x.click();x.frame.scrollTop=400;x.finish();await pending;x.frame.scrollTop=700;x.opened[0].destroy();assert.equal(x.frame.scrollTop,400);assert.equal(x.anchor.focused,true);});

test('English docs use the shared viewer copy slots',async()=>{const x=viewer('en/docs/guides/ue-tools/simple-tcp-client-guide/index.html');const pending=x.click();x.finish();await pending;assert.equal(x.opened[0].options.closeTitle,'Close image');assert.equal(x.opened[0].options.zoomTitle,'Zoom image');});
test('missing image dimensions fall back to the current image URL',async()=>{const x=viewer();x.anchor.querySelector=()=>({naturalWidth:0,naturalHeight:0,alt:'Image'});const pending=x.click();x.finish();await pending;assert.deepEqual(x.fallback,[x.anchor.href]);});
test('keyboard activation opens image anchors and modified clicks retain native link behavior',async()=>{
  for(const options of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){const x=viewer();await x.click(x.anchor,options);assert.equal(x.opened.length,0);assert.equal(x.fallback.length,0);}
  const x=viewer();const pending=x.click(x.anchor,{detail:0});x.finish();await pending;assert.equal(x.opened.length,1);assert.equal(x.opened[0].options.escKey,true);assert.equal(x.opened[0].options.doubleTapAction,'zoom');
});
test('published homepage and list cards retain detail navigation without image-viewer interception',()=>{
  for(const locale of ['zh','en'])for(const page of ['index.html','works/index.html','cases/index.html','blog/index.html']){
    const f=generatedPage(locale+'/'+page);
    assert.equal(f.nodes.filter(n=>Object.hasOwn(f.attrs(n),'data-media-image')).length,0,locale+'/'+page);
    for(const card of f.nodes.filter(n=>Object.hasOwn(f.attrs(n),'data-content-card'))){
      assert.equal(card.tagName,'a');assert.ok(f.attrs(card).href.startsWith('/'+locale+'/'));
      assert.equal(card.childNodes.some(n=>n.tagName==='a'),false);
    }
    if(page==='index.html'){
      assert.ok(f.nodes.some(n=>n.tagName==='link'&&f.attrs(n).href==='/assets/site-ui/content-index.css'));
      for(const panel of f.nodes.filter(n=>Object.hasOwn(f.attrs(n),'data-feature-panel'))){
        const links=f.nodes.filter(n=>n.tagName==='a'&&f.closest(n,'[data-feature-panel]')===panel);
        assert.ok(links.length>0);assert.ok(links.every(n=>f.attrs(n).href===f.attrs(links[0]).href));
      }
    }
  }
});
test('all three contact/support QR triggers still open the existing shared viewer',async()=>{for(const locale of ['zh','en'])for(const url of ['/assets/contact/wechat-personal-qr.webp','/assets/support/wechat-pay-qr.webp','/assets/support/alipay-qr.webp']){const x=viewer(locale+'/contact/index.html',url);const pending=x.click();x.finish();await pending;assert.equal(x.opened.length,1);assert.equal(x.fallback.length,0);assert.ok(x.opened[0].options.closeTitle);}});
test('all newly approved images open before natural dimensions load and preserve zoom and close restoration',async()=>{
  const frozenURL=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url),code=fs.readFileSync(new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozenURL.href)),dimensions=await import('data:text/javascript,'+encodeURIComponent(code)),manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));assert.equal(Object.keys(dimensions.additionalDimensions).length,45);
  for(const [url,size]of Object.entries(dimensions.additionalDimensions)){const entry=manifest.entries.find(e=>e.mediaOccurrences?.some(o=>o.websiteUrl===url)),route=entry.legacyRoutes[0].replace(/^\/docs\/(?:zh|en)\//,'/docs/');for(const locale of ['zh','en']){const x=viewer(locale+route+'index.html',url);x.anchor.querySelector=()=>({naturalWidth:0,naturalHeight:0,alt:x.anchor.dataset.mediaAlt});const pending=x.click();x.finish(dimensions.default);await pending;assert.equal(x.opened.length,1);assert.equal(x.fallback.length,0);const options=x.opened[0].options;assert.equal(options.dataSource[0].width,size.width);assert.equal(options.dataSource[0].height,size.height);assert.equal(options.initialZoomLevel,'fit');assert.equal(options.maxZoomLevel,2);assert.equal(options.wheelToZoom,true);assert.equal(options.trapFocus,true);x.frame.scrollTop=700;x.opened[0].destroy();assert.equal(x.frame.scrollTop,125);assert.equal(x.anchor.focused,true);}}
});
test('restored published blog images open from the dimension registry before lazy loading',async()=>{
  const frozenURL=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url);
  const code=fs.readFileSync(new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozenURL.href));
  const {default:dimensions}=await import('data:text/javascript,'+encodeURIComponent(code));
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
  for(const entry of manifest.entries)for(const occurrence of entry.mediaOccurrences||[]) {
    const url=occurrence.websiteUrl;
    if(occurrence.state!=='public'||!url.startsWith('/media/restored-blog/')&&url!=='/media/imported/blog/746c135cbfc3463f7ebd.png')continue;
    for(const locale of ['zh','en']) {
      const route=entry.legacyRoutes[0].replace(/^\/docs\/(?:zh|en)\//,'/docs/'),x=viewer(locale+route+'index.html',url);
      x.anchor.querySelector=()=>({naturalWidth:0,naturalHeight:0,alt:'Image'});
      const pending=x.click();x.finish(dimensions);await pending;
      assert.equal(x.opened.length,1,url);assert.equal(x.fallback.length,0,url);
      assert.equal(x.opened[0].options.dataSource[0].width,dimensions[url].width);
      assert.equal(x.opened[0].options.dataSource[0].height,dimensions[url].height);
    }
  }
});
test('Fab project screenshots open in the existing viewer before their natural dimensions load',async()=>{
  const frozenURL=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url),code=fs.readFileSync(new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozenURL.href)),dimensions=await import('data:text/javascript,'+encodeURIComponent(code));
  assert.deepEqual(dimensions.default['/media/works/fab/simple-bp-inherit-fix-01.jpg'],{width:1920,height:1202});
  const config=JSON.parse(fs.readFileSync(new URL('./project-galleries.json',import.meta.url),'utf8')),manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
  for(const gallery of config.galleries)for(const item of gallery.items.filter(item=>item.kind==='image'&&item.sourcePage)){
    const entry=manifest.entries.find(entry=>entry.id===gallery.entryId);
    for(const locale of ['zh','en']){const x=viewer(locale+entry.legacyRoutes[0]+'index.html',item.websiteUrl);x.anchor.querySelector=()=>({naturalWidth:0,naturalHeight:0,alt:x.anchor.dataset.mediaAlt});const pending=x.click();x.finish(dimensions.default);await pending;assert.equal(x.opened.length,1,item.websiteUrl);assert.equal(x.fallback.length,0);assert.equal(x.opened[0].options.dataSource[0].width,item.width);assert.equal(x.opened[0].options.dataSource[0].height,item.height);assert.equal(x.opened[0].options.wheelToZoom,true);assert.equal(x.opened[0].options.trapFocus,true);}
  }
});
