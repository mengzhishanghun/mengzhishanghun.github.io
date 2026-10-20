import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import * as media from './media.mjs';
import {walk,attrs} from './extract-dom.mjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resourcePath} from './resources.mjs';

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
test('a card remains one sortable and hideable container with sibling image and title links',()=>{
  const x=project('<section class="content-browser"><div class="grid"><a class="content-card" data-content-card="true" data-slug="one" hidden style="order:4" href="/en/works/one/" aria-label="One"><div class="content-cover-link" aria-hidden="true"><div class="content-cover" aria-hidden="true"><img src="/assets/one.png" alt=""></div></div><div class="content-card-copy"><h2>One</h2></div></a></div></section>');
  const card=x.nodes.find(n=>attrs(n)['data-content-card']!==undefined);assert.equal(card.tagName,'div');assert.equal(attrs(card).style,'order:4');assert.ok(Object.hasOwn(attrs(card),'hidden'));assert.equal(card.parentNode.childNodes.filter(n=>n.tagName).length,1);
  const image=x.nodes.find(n=>attrs(n)['data-media-image']!==undefined),title=x.nodes.find(n=>n.tagName==='a'&&attrs(n).href==='/en/works/one/');assert.ok(image);assert.ok(title);assert.equal(attrs(image)['aria-hidden'],undefined);assert.equal(attrs(image)['aria-label'],'View image: One');assert.equal(title.parentNode.tagName,'h2');
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
test('all current homepage feature images and gallery cards gain separate image actions',()=>{
  for(const [file,count]of [['home/templates/page--home.html',7],['works/templates/page--works-index.html',23],['cases/templates/page--cases-index.html',10]]) {
    const x=project(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'));
    const images=x.nodes.filter(n=>attrs(n)['data-media-image']!==undefined);
    assert.equal(images.length,count,file);
    for(const image of images)assert.ok(attrs(image)['aria-label']);
    for(const image of images)for(let parent=image.parentNode;parent;parent=parent.parentNode)if(attrs(parent)['data-content-card']!==undefined)assert.equal(parent.tagName,'div');
  }
});
test('every approved public occurrence has lazy dimensions, including byte-verified restored blog images',async()=>{
  const frozen=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url);
  const source=fs.readFileSync(new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozen.href));
  const {default:dimensions}=await import('data:text/javascript,'+encodeURIComponent(source));
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url)));
  const urls=[...new Set(manifest.entries.flatMap(e=>e.mediaOccurrences||[]).filter(o=>o.state==='public').map(o=>o.websiteUrl))];
  assert.deepEqual(urls.filter(url=>!dimensions[url]),[],'public images must open before their natural dimensions load');
  for(const url of urls.filter(url=>url.startsWith('/media/restored-blog/')||url==='/media/imported/blog/746c135cbfc3463f7ebd.png')) {
    const bytes=fs.readFileSync(resourcePath(fileURLToPath(new URL('../../',import.meta.url)),url.slice(1)));
    assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));
    assert.deepEqual(dimensions[url],{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)},url);
  }
});
