import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mapMedia,mediaDimensions} from './media.mjs';
import {hash,localeRoute,preflight} from './build.mjs';
import {projectPublication} from './publication.mjs';
import {generatedPage} from './interaction-fixtures.mjs';

test('optional dimensions keep unsupported approved media valid and exclude withheld media',()=>{
  const png=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);png.write('IHDR',12);png.writeUInt32BE(640,16);png.writeUInt32BE(480,20);
  const entries=[{mediaOccurrences:[{state:'public',websiteUrl:'/assets/one.png'},{state:'public',websiteUrl:'/assets/vector.svg'},{state:'public',websiteUrl:'/assets/legacy.gif'},{state:'withheld',websiteUrl:'/assets/hidden.png'}]}];
  const resources=new Map([['assets/one.png',png],['assets/vector.svg',Buffer.from('<svg/>')],['assets/legacy.gif',Buffer.from('GIF89a')],['assets/hidden.png',png]]);
  assert.deepEqual([...mediaDimensions(entries,resources)],[['/assets/one.png',{kind:'image',width:640,height:480}]]);
});
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
test('published content renders every approved media occurrence in order with named image links in each language',t=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
  const site=fileURLToPath(new URL('../../',import.meta.url)),validated=preflight({manifest,site});
  const {entries}=projectPublication({...validated,site,redirects:manifest.redirects});
  const targets=entries.filter(e=>e.type!=='page'&&e.mediaOccurrences?.length);
  assert.ok(targets.length>0,'the integration fixture must contain media');
  let pairs=0;
  for(const entry of targets)for(const {code:locale} of validated.config.languages){
    const route=localeRoute(entry,locale),f=generatedPage(route.slice(1)+'index.html');
    const scope=n=>f.closest(n,'.prose, .sl-markdown-content');
    const publicMedia=entry.mediaOccurrences.filter(o=>o.state==='public');
    const withheld=entry.mediaOccurrences.filter(o=>o.state==='withheld');
    const triggers=f.nodes.filter(n=>n.tagName==='a'&&f.attrs(n)['data-media-image']!==undefined&&scope(n));
    assert.equal(triggers.length,publicMedia.length,entry.id+'/'+locale+' public images');
    assert.equal(f.nodes.filter(n=>f.matches(n,'.media-withheld')&&scope(n)).length,withheld.length,entry.id+'/'+locale+' withheld placeholders');
    for(const [index,occurrence]of publicMedia.entries()){
      const trigger=triggers[index],label=occurrence.id+'/'+locale;
      assert.equal(f.attrs(trigger).href,occurrence.websiteUrl,label+' link');
      assert.equal(f.attrs(trigger)['data-media-src'],occurrence.websiteUrl,label+' viewer source');
      const image=trigger.childNodes.find(n=>n.tagName==='img');
      assert.ok(image,label+' image');
      assert.equal(f.attrs(image).src,occurrence.websiteUrl,label+' image source');
      assert.ok(f.attrs(trigger)['aria-label']?.trim(),label+' accessible name');
      assert.ok(f.attrs(trigger)['data-media-alt']?.trim(),label+' viewer description');
      if(f.attrs(image).alt?.trim())assert.equal(f.attrs(trigger)['data-media-alt'],f.attrs(image).alt,label+' description');
      pairs++;
    }
  }
  t.diagnostic(`${targets.length} content entries, ${pairs} localized media occurrences`);
});
