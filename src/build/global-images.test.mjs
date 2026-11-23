import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import * as media from './media.mjs';
import {walk,attrs} from './extract-dom.mjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resourcePath} from './resources.mjs';
import {generatedPage} from './interaction-fixtures.mjs';
import {localeRoute,preflight} from './build.mjs';
import {projectPublication} from './publication.mjs';
import {mediaInfo} from '../import/project-media.mjs';

function project(body,locale='en') {
  assert.equal(typeof media.projectImageViewers,'function','content images need a final HTML projection');
  const html=media.projectImageViewers('<html><body><main>'+body+'</main></body></html>',locale);
  const nodes=[];walk(parse(html),n=>nodes.push(n));return {html,nodes};
}
test('bare content images gain named image links while semantic decoration stays untouched',()=>{
  const x=project('<article><h2>Diagram</h2><div class="feature-art"><img src="/assets/diagram.webp" alt="" width="800" height="600"></div><div class="prose"><img src="/media/body.png" alt="Step"></div></article><div class="hero-backdrop"><img src="/assets/hero.webp"></div><a class="police-record"><img src="/assets/beian.png"></a>');
  const links=x.nodes.filter(n=>attrs(n)['data-media-image']!==undefined);
  assert.equal(links.length,2);assert.equal(attrs(links[0]).class,'feature-art');assert.equal(attrs(links[0])['aria-label'],'View image: Diagram');assert.equal(attrs(links[1]).href,'/media/body.png');
  assert.equal(media.projectImageViewers(x.html,'en'),x.html,'projection is idempotent');
});

test('existing image links use the translated image description and byte-derived dimensions',()=>{
  const html=media.projectImageViewers('<article><a data-media-image data-media-alt="旧说明" aria-label="旧说明" href="/media/new.png"><img src="/media/new.png" alt="New screenshot"></a></article>','en',new Map([['/media/new.png',{width:1120,height:720}]]));
  const nodes=[];walk(parse(html),n=>nodes.push(n));const link=nodes.find(n=>n.tagName==='a');
  assert.equal(attrs(link)['data-media-alt'],'New screenshot');
  assert.equal(attrs(link)['aria-label'],'View image: New screenshot');
  assert.equal(attrs(link)['data-media-width'],'1120');
  assert.equal(attrs(link)['data-media-height'],'720');
  assert.equal(media.projectImageViewers(html,'en',new Map([['/media/new.png',{width:1120,height:720}]])),html);
});

test('existing full-size targets survive thumbnails and multiple images in one trigger',()=>{
  const source='<article><a data-media-image href="/media/full.png" data-media-src="/media/full.png"><img src="/media/thumb.png" alt="Detail"><img src="/media/thumb2.png" alt="Second"></a></article>';
  const html=media.projectImageViewers(source,'en'),nodes=[];walk(parse(html),n=>nodes.push(n));
  const links=nodes.filter(n=>n.tagName==='a');assert.equal(links.length,1);assert.equal(attrs(links[0]).href,'/media/full.png');assert.equal(attrs(links[0])['data-media-src'],'/media/full.png');
  assert.equal(media.projectImageViewers(html,'en'),html);
});
test('the whole card stays a detail link, including its cover and blank space',()=>{
  const x=project('<section class="content-browser"><div class="grid"><a class="content-card" data-content-card="true" data-slug="one" hidden style="order:4" href="/en/works/one/" aria-label="One"><div class="content-cover-link" aria-hidden="true"><div class="content-cover" aria-hidden="true"><img src="/assets/one.png" alt=""></div></div><div class="content-card-copy"><h2>One</h2></div></a></div></section>');
  const card=x.nodes.find(n=>attrs(n)['data-content-card']!==undefined);assert.equal(card.tagName,'a');assert.equal(attrs(card).href,'/en/works/one/');assert.equal(attrs(card).style,'order:4');assert.ok(Object.hasOwn(attrs(card),'hidden'));assert.equal(card.parentNode.childNodes.filter(n=>n.tagName).length,1);
  assert.equal(x.nodes.filter(n=>Object.hasOwn(attrs(n),'data-media-image')).length,0);
  assert.equal(x.nodes.filter(n=>n.tagName==='a').length,1);
  assert.equal(media.projectImageViewers(x.html,'en'),x.html);
  for(const link of x.nodes.filter(n=>n.tagName==='a'))for(let p=link.parentNode;p;p=p.parentNode)assert.notEqual(p.tagName,'a');
});
test('functional image links keep their destination and gain a separate enlargement action',()=>{
  const x=project('<a href="https://example.com/download" download><img src="/assets/download.png" alt="Download"></a>','zh');
  const links=x.nodes.filter(n=>n.tagName==='a');assert.equal(attrs(links[0]).href,'https://example.com/download');assert.ok(Object.hasOwn(attrs(links[0]),'download'));assert.equal(attrs(links[1]).href,'/assets/download.png');assert.equal(attrs(links[1])['aria-label'],'放大查看图片：Download');assert.equal(links[0].parentNode,links[1].parentNode);
});
test('case covers have byte-verified dimensions available before lazy images load',async()=>{
  const frozen=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url);
  const source=fs.readFileSync(new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozen.href));
  const {default:dimensions}=await import('data:text/javascript,'+encodeURIComponent(source));
  for(const url of ['/assets/cases/blueprint-inheritance-repair.png','/assets/cases/data-asset-json-sync.png','/assets/cases/metahuman-animation-clipping.png']) {
    const bytes=fs.readFileSync(resourcePath(fileURLToPath(new URL('../../',import.meta.url)),url.slice(1)));
    assert.deepEqual(dimensions[url],{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)});
  }
});
test('homepage and gallery covers navigate to detail pages instead of opening the viewer',()=>{
  for(const file of ['home/templates/page--home.html','works/templates/page--works-index.html','cases/templates/page--cases-index.html']) {
    const x=project(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'));
    const images=x.nodes.filter(n=>attrs(n)['data-media-image']!==undefined);
    assert.equal(images.length,0,file);
    const covers=x.nodes.filter(n=>n.tagName==='img'&&!x.nodes.some(p=>(attrs(p).class||'').includes('hero-backdrop')&&p.childNodes?.includes(n)));
    assert.ok(covers.length>0,file);
    for(const card of x.nodes.filter(n=>Object.hasOwn(attrs(n),'data-content-card'))){assert.equal(card.tagName,'a');assert.ok(attrs(card).href,file+' card destination');}
    for(const panel of x.nodes.filter(n=>Object.hasOwn(attrs(n),'data-feature-panel'))){
      const title=panel.childNodes.find(n=>(attrs(n).class||'').split(/\s+/).includes('feature-copy'));
      assert.ok(title,file+' feature retains its native detail link');
    }
  }
});
test('published raster content images expose byte-verified dimensions before lazy loading',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
  const site=fileURLToPath(new URL('../../',import.meta.url)),validated=preflight({manifest,site});
  const {entries}=projectPublication({...validated,site,redirects:manifest.redirects});
  for(const entry of entries.filter(e=>e.type!=='page'&&e.mediaOccurrences?.some(o=>o.state==='public')))for(const {code:locale}of validated.config.languages){
    const page=generatedPage(localeRoute(entry,locale).slice(1)+'index.html');
    for(const occurrence of entry.mediaOccurrences.filter(o=>o.state==='public')){
      const link=page.nodes.find(n=>n.tagName==='a'&&attrs(n)['data-media-image']!==undefined&&attrs(n).href===occurrence.websiteUrl&&page.closest(n,'.prose, .sl-markdown-content'));
      assert.ok(link,occurrence.id+'/'+locale);
      const bytes=fs.readFileSync(resourcePath(site,occurrence.websiteUrl.slice(1))),extension=occurrence.websiteUrl.slice(occurrence.websiteUrl.lastIndexOf('.'));
      let expected;try{expected=mediaInfo(bytes,bytes[0]===255&&bytes[1]===216?'.jpg':extension);}catch{continue;}
      if(expected.kind!=='image')continue;
      assert.deepEqual({width:Number(attrs(link)['data-media-width']),height:Number(attrs(link)['data-media-height'])},{width:expected.width,height:expected.height},occurrence.id+'/'+locale);
    }
  }
});
