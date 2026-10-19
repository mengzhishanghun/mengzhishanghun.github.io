import fs from 'node:fs';import assert from 'node:assert/strict';import test from 'node:test';import path from 'node:path';import {parse} from 'parse5';
import {attrs,walk} from '../build/extract-dom.mjs';import {parseSource} from '../import/import.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url),'utf8'));
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
test('all manifest work pages expose verified channels, title statuses and localized documentation routes',()=>{
 let pages=0;
 for(const entry of manifest.entries.filter(e=>e.type==='work'))for(const lang of ['zh','en']){
  const source=parseSource(fs.readFileSync(new URL(`./content/${lang}/${entry.slug}.md`,import.meta.url),'utf8')).data;
  const file=path.resolve(process.env.SITE_OUTPUT||'dist/site',lang,'works',entry.slug,'index.html'),doc=parse(fs.readFileSync(file,'utf8'));
  const badges=[],actions=[];let compatibility,titleLine;
  walk(doc,node=>{const classes=(attrs(node).class||'').split(/\s+/);if(classes.includes('work-status'))badges.push(text(node));if(classes.includes('work-action'))actions.push({href:attrs(node).href,text:text(node)});if(classes.includes('work-compatibility'))compatibility=node;if(classes.includes('work-title-line'))titleLine=node;});
  assert.ok(titleLine,file);assert.ok(compatibility,file);
  assert.equal(badges.length,source.workInfo.channels.filter(c=>c.kind!=='docs').length+(source.workInfo.stage?1:0),file);
  for(const channel of source.workInfo.channels){const label=lang==='zh'?{sale:'跳转到在售页面','open-source':'跳转到开源页面',docs:'查看具体文档'}[channel.kind]:{sale:'View sales page','open-source':'View open-source page',docs:'View documentation'}[channel.kind];
   const action=actions.find(a=>a.text===label);assert.ok(action,file+' '+label);
   assert.equal(action.href,channel.kind==='docs'?channel.href.replace('/docs/zh/','/'+lang+'/docs/'):channel.href,file);
   if(channel.kind==='docs')assert.ok(fs.existsSync(path.resolve(process.env.SITE_OUTPUT||'dist/site',action.href.slice(1),'index.html')),file+' documentation target');
  }
  for(const group of source.workInfo.compatibility)for(const value of [...group.platforms,...group.requirements])assert.ok(text(compatibility).includes(value),file+' '+value);
  if(['plugin-manager','ue-quick-start'].includes(entry.slug)){assert.equal(badges.length,0);assert.ok(actions.some(a=>a.href.startsWith('https://github.com/')));}
  pages++;
 }
 assert.equal(pages,manifest.entries.filter(e=>e.type==='work').length*2);
});

test('both work indexes show statuses on all manifest work cards without adding badges to other indexes',()=>{
 for(const lang of ['zh','en']){
  const root=path.resolve(process.env.SITE_OUTPUT||'dist/site',lang),doc=parse(fs.readFileSync(path.join(root,'works/index.html'),'utf8'));
  let count=0,stylesheet=false;
  walk(doc,card=>{
   const a=attrs(card);if(card.tagName==='link' && a.href==='/assets/site-ui/content-index.css')stylesheet=true;
   if(a['data-content-card']===undefined)return;
   const data=parseSource(fs.readFileSync(new URL('./content/'+lang+'/'+a['data-slug']+'.md',import.meta.url),'utf8')).data;
   const badges=[],tags=[];walk(card,node=>{const classes=(attrs(node).class||'').split(/\s+/);if(classes.includes('work-status')){assert.equal(attrs(node.parentNode).class,'work-card-title-line');badges.push(text(node));}if(classes.includes('content-card-tags'))tags.push(text(node));});
   const want=[...(data.workInfo.stage?[lang==='zh'?'开发中':'In development']:[]),...data.workInfo.channels.filter(c=>c.kind!=='docs').map(c=>lang==='zh'?{sale:'在售','open-source':'开源'}[c.kind]:{sale:'On sale','open-source':'Open source'}[c.kind])];
   assert.deepEqual(badges,want,a['data-slug']+' '+lang);assert.equal(tags.length,1);count++;
  });
  assert.equal(count,manifest.entries.filter(e=>e.type==='work').length);assert.equal(stylesheet,true);
  for(const relative of ['index.html','cases/index.html','blog/index.html']){
   const other=parse(fs.readFileSync(path.join(root,relative),'utf8')),badges=[];walk(other,node=>{if((attrs(node).class||'').split(/\s+/).includes('work-status'))badges.push(node);});assert.equal(badges.length,0,lang+'/'+relative);
  }
 }
});

test('ten developing works have bilingual support and no false product or documentation links',()=>{
 const works=manifest.entries.filter(e=>e.type==='work');assert.equal(works.length,34);
 const categories=works.map(e=>parseSource(fs.readFileSync(new URL('./content/zh/'+e.slug+'.md',import.meta.url),'utf8')).data.categoryId);assert.equal(categories.filter(c=>c==='ue-plugins').length,25);assert.equal(categories.filter(c=>c==='ai-tools').length,1);
 const topics=JSON.parse(fs.readFileSync(new URL('./topics.json',import.meta.url)));assert.equal(topics.articles['work:simple-file-updater'].topics.includes('simple-series'),false);assert.equal(topics.articles['work:shaniu'].topics.includes('ai-series'),false);
 for(const lang of ['zh','en']){
  let developing=0;
  for(const e of works){const data=parseSource(fs.readFileSync(new URL('./content/'+lang+'/'+e.slug+'.md',import.meta.url),'utf8')).data;if(data.workInfo.stage!=='developing')continue;developing++;
   assert.deepEqual(data.workInfo.channels,[]);assert.equal(data.workInfo.supportHref,'/contact/#support-title');
   const html=fs.readFileSync(path.resolve(process.env.SITE_OUTPUT||'dist/site',lang,'works',e.slug,'index.html'),'utf8'),doc=parse(html);let support=0,missing=0;
   walk(doc,n=>{const a=attrs(n);if(a.href==='/'+lang+'/contact/#support-title')support++;if((a.class||'').split(' ').includes('work-action-unavailable')){assert.equal(n.tagName,'span');assert.equal(a.href,undefined);assert.equal(a.tabindex,undefined);missing++;}});
   assert.equal(support,1,e.slug);assert.equal(missing,1,e.slug);assert.doesNotMatch(html,/github.com\/MZSH-UEPlugins|fab.com\/listings|work-status-open-source|work-status-sale/);
  }assert.equal(developing,10);
 }
});
