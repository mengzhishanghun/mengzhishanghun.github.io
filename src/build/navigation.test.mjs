import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {attrs,walk} from './extract-dom.mjs';

const output=path.resolve(process.env.SITE_OUTPUT || 'dist/site');
function page(route){return parse(fs.readFileSync(path.join(output,route,'index.html'),'utf8'));}
function find(doc,predicate){const found=[];walk(doc,node=>{if(predicate(node))found.push(node)});return found;}
function text(node){return node.nodeName==='#text'?node.value:(node.childNodes || []).map(text).join('');}

test('stylesheet URLs bind the page to the published CSS bytes',()=>{
  const cssPath='/assets/site-ui/navigation.css';
  const version=createHash('sha256').update(fs.readFileSync(path.join(output,cssPath.slice(1)))).digest('hex').slice(0,12);
  for(const locale of ['zh','en'])for(const route of ['', 'works/', 'works/simple-byte-conversion/', 'works/simple-byte-conversion/docs/setup/']) {
    const links=find(page(locale+'/'+route),n=>n.tagName==='link'&&attrs(n).rel==='stylesheet');
    assert.ok(links.some(n=>attrs(n).href===cssPath+'?v='+version),locale+'/'+route);
    for(const link of links){
      const url=new URL(attrs(link).href,'https://mzsh.me');
      if(!url.searchParams.has('v'))continue;
      const bytes=fs.readFileSync(path.join(output,url.pathname.slice(1)));
      assert.equal(url.searchParams.get('v'),createHash('sha256').update(bytes).digest('hex').slice(0,12),url.pathname);
    }
  }
});

test('case hero actions include contact and support without cover notes',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
  for(const entry of manifest.entries.filter(entry=>entry.type==='case')) {
    const doc=parse(fs.readFileSync(new URL('../'+entry.template,import.meta.url),'utf8'));
    const hero=find(doc,n=>(attrs(n).class || '').split(/\s+/).includes('project-hero-copy'))[0];
    assert.ok(hero,entry.id);
    assert.deepEqual(find(hero,n=>n.tagName==='a' && (attrs(n).class || '').split(/\s+/).includes('a-button')).map(n=>attrs(n).href),['/contact/','/support/'],entry.id);
    assert.equal(find(hero,n=>(attrs(n).class || '').split(/\s+/).includes('project-media-note')).length,0,entry.id);
  }
});

test('shared navigation reaches distinct contact and support pages in both languages',()=>{
  for(const locale of ['zh','en']) {
    for(const route of ['', 'works/','cases/','blog/','contact/','support/']) {
      const doc=page(locale+'/'+route),nav=find(doc,n=>attrs(n).id==='main-navigation')[0];
      const links=find(nav,n=>n.tagName==='a');
      assert.deepEqual(links.map(n=>attrs(n).href),['','works/','cases/','blog/','contact/','support/'].map(p=>'/'+locale+'/'+p));
      assert.equal(links.filter(n=>attrs(n)['aria-current']==='page').length,1);
      assert.equal(attrs(links.find(n=>attrs(n)['aria-current']==='page')).href,'/'+locale+'/'+route);
      if(locale==='zh')assert.deepEqual(links.map(text),['首页','作品展示','项目案例','个人博客','联系合作','支持创作']);
      const actions=find(doc,n=>(attrs(n).class || '').split(/\s+/).includes('header-actions'))[0];
      assert.equal(find(actions,n=>n.tagName==='a').length,0);
      assert.equal(find(actions,n=>attrs(n)['data-site-language-select']!==undefined).length,1);
    }
    const contact=page(locale+'/contact/'),support=page(locale+'/support/');
    assert.equal(find(contact,n=>n.tagName==='img' && /^\/assets\/support\//.test(attrs(n).src)).length,0);
    assert.equal(find(contact,n=>n.tagName==='img' && attrs(n).src==='/assets/contact/wechat-personal-qr.webp').length,1);
    assert.equal(find(support,n=>n.tagName==='img' && /^\/assets\/support\//.test(attrs(n).src)).length,2);
    assert.equal(find(support,n=>n.tagName==='img' && /^\/assets\/contact\//.test(attrs(n).src)).length,0);
    const runtime=find(support,n=>attrs(n)['data-site-language']!==undefined)[0];
    assert.deepEqual(JSON.parse(text(runtime)).urls,{zh:'/zh/support/',en:'/en/support/'});
    const home=page(locale+'/');
    assert.equal(find(home,n=>n.tagName==='a' && attrs(n).href==='/'+locale+'/contact/#support-title').length,0);
    assert.ok(find(home,n=>n.tagName==='a' && attrs(n).href==='/'+locale+'/support/').length>=2);
  }
});
