import fs from 'node:fs';import assert from 'node:assert/strict';import test from 'node:test';import path from 'node:path';import {parse} from 'parse5';
import {attrs,walk} from '../build/extract-dom.mjs';import {parseSource} from '../import/import.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url),'utf8'));
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
test('all 48 work pages expose verified channels, title statuses and localized documentation routes',()=>{
 let pages=0;
 for(const entry of manifest.entries.filter(e=>e.type==='work'))for(const lang of ['zh','en']){
  const source=parseSource(fs.readFileSync(new URL(`./content/${lang}/${entry.slug}.md`,import.meta.url),'utf8')).data;
  const file=path.resolve(process.env.SITE_OUTPUT||'dist/site',lang,'works',entry.slug,'index.html'),doc=parse(fs.readFileSync(file,'utf8'));
  const badges=[],actions=[];let compatibility,titleLine;
  walk(doc,node=>{const classes=(attrs(node).class||'').split(/\s+/);if(classes.includes('work-status'))badges.push(text(node));if(classes.includes('work-action'))actions.push({href:attrs(node).href,text:text(node)});if(classes.includes('work-compatibility'))compatibility=node;if(classes.includes('work-title-line'))titleLine=node;});
  assert.ok(titleLine,file);assert.ok(compatibility,file);
  assert.equal(badges.length,source.workInfo.channels.filter(c=>c.kind!=='docs').length,file);
  for(const channel of source.workInfo.channels){const label=lang==='zh'?{sale:'跳转到在售页面','open-source':'跳转到开源页面',docs:'查看具体文档'}[channel.kind]:{sale:'View sales page','open-source':'View open-source page',docs:'View documentation'}[channel.kind];
   const action=actions.find(a=>a.text===label);assert.ok(action,file+' '+label);
   assert.equal(action.href,channel.kind==='docs'?channel.href.replace('/docs/zh/','/'+lang+'/docs/'):channel.href,file);
   if(channel.kind==='docs')assert.ok(fs.existsSync(path.resolve(process.env.SITE_OUTPUT||'dist/site',action.href.slice(1),'index.html')),file+' documentation target');
  }
  for(const group of source.workInfo.compatibility)for(const value of [...group.platforms,...group.requirements])assert.ok(text(compatibility).includes(value),file+' '+value);
  if(['plugin-manager','ue-quick-start'].includes(entry.slug)){assert.equal(badges.length,0);assert.ok(actions.some(a=>a.href.startsWith('https://github.com/')));}
  pages++;
 }
 assert.equal(pages,48);
});
