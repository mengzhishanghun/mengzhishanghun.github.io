import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {mapMedia} from './media.mjs';
import {hash} from './build.mjs';
import {generatedPage} from './interaction-fixtures.mjs';
test('same image source stays withheld or public according to occurrence, with byte proof',async t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'site-media-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const vault=path.join(root,'vault'),site=path.join(root,'site');fs.mkdirSync(vault);fs.mkdirSync(site);
  fs.mkdirSync(path.join(site,'assets'));fs.writeFileSync(path.join(site,'assets/public.png'),'same bytes');
  const entry={id:'blog:example',mediaOccurrences:[{id:'blog:example:media:1',ordinal:1,state:'withheld'},{id:'blog:example:media:2',ordinal:2,state:'public',websiteUrl:'/assets/public.png',publicSha256:hash('same bytes')}]};
  const records=mapMedia(entry,{site});
  assert.deepEqual(records.map(x=>x.state),['withheld','public']);
  assert.equal(records[0].websiteUrl,undefined);
  assert.equal(records[1].websiteUrl,'/assets/public.png');
  assert.equal(records[0].publicSha256,undefined);
  assert.throws(()=>mapMedia({...entry,mediaOccurrences:[{...records[0],publicSha256:records[1].publicSha256},records[1]]},{site}),/隐藏媒体权限/);
  fs.writeFileSync(path.join(site,'assets/public.png'),'drift');
  assert.throws(()=>mapMedia(entry,{site}),/公开媒体hash漂移/);
});
test('all approved site occurrences render public images in both languages without withheld placeholders',async()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.entries.flatMap(e=>e.mediaOccurrences||[]).filter(o=>o.state==='withheld').length,0);
  const moduleFile=new URL('../shared/i18n/client/media-dimensions.js',import.meta.url),frozenURL=new URL('../shared/compat/_astro/media-dimensions.BM-KTszl.js',import.meta.url),code=fs.readFileSync(moduleFile,'utf8').replace("from '/_astro/media-dimensions.BM-KTszl.js'",'from '+JSON.stringify(frozenURL.href)),dimensions=await import('data:text/javascript,'+encodeURIComponent(code)),urls=new Set(Object.keys(dimensions.additionalDimensions));assert.equal(urls.size,45);
  const targetIds=['blog:cnblogs-19143267','blog:cnblogs-19143251','blog:cnblogs-19143255','blog:cnblogs-19143256','blog:cnblogs-19143260','blog:cnblogs-19379365','blog:cnblogs-19174288','blog:cnblogs-19174295','blog:cnblogs-19165494','blog:cnblogs-19165500','work:ue-package-manager','doc:ai-data-asset-guide','doc:ue-package-manager'];
  let pairs=0;for(const entry of manifest.entries.filter(e=>targetIds.includes(e.id)))for(const locale of ['zh','en']){const route=entry.legacyRoutes[0].replace(/^\/docs\/(?:zh|en)\//,'/docs/'),f=generatedPage(locale+route+'index.html');assert.equal(f.nodes.filter(n=>f.matches(n,'.media-withheld')).length,0);const triggers=f.nodes.filter(n=>n.tagName==='a'&&f.attrs(n)['data-media-image']!==undefined&&f.closest(n,'.prose, .sl-markdown-content'));for(const occurrence of entry.mediaOccurrences||[])if(urls.has(occurrence.websiteUrl)){const trigger=triggers[occurrence.ordinal-1];assert.ok(trigger,occurrence.id+'/'+locale);assert.equal(f.attrs(trigger).href,occurrence.websiteUrl);const image=trigger.childNodes.find(n=>n.tagName==='img');assert.equal(f.attrs(image).src,occurrence.websiteUrl);assert.ok(f.attrs(image).alt);assert.equal(f.attrs(trigger)['data-media-alt'],f.attrs(image).alt);pairs++;}}assert.equal(pairs,94);
});
