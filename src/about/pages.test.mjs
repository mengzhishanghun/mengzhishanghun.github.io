import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {walk,attrs} from '../build/extract-dom.mjs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{parse}=require('parse5');
const output=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..',process.env.SITE_OUTPUT||'dist/site');
const load=relative=>parse(fs.readFileSync(path.join(output,relative),'utf8'));
const all=(tree,predicate)=>{const nodes=[];walk(tree,n=>{if(predicate(n))nodes.push(n);});return nodes;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const hasClass=(node,name)=>(attrs(node).class||'').split(/\s+/).includes(name);
test('about aliases lead to the homepage introduction without publishing a separate profile',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url)));assert.ok(!manifest.entries.some(e=>e.id==='page:about'));assert.ok(!manifest.entries.some(e=>e.id==='page:support'));
  for(const code of ['zh','en']){const tree=load(code+'/index.html'),intro=all(tree,n=>attrs(n).id==='about');assert.equal(intro.length,1);assert.match(text(intro[0]),/UE/);assert.match(text(intro[0]),/VR/);assert.equal(all(tree,n=>attrs(n)['data-current-age']!==undefined).length,0);}
  for(const route of ['about/index.html','zh/about/index.html','en/about/index.html']){const runtime=JSON.parse(text(all(load(route),n=>attrs(n)['data-site-language']!==undefined)[0]));assert.equal(runtime.urls.zh,'/zh/');assert.equal(runtime.urls.en,'/en/');assert.equal(runtime.anchors.zh['about-experience-title'],'about');assert.equal(runtime.redirect.locale,route.startsWith('zh/')?'zh':route.startsWith('en/')?'en':null);}
});
test('home CTA links the cooperation invitation to contact and headers keep only contact',()=>{
  for(const code of ['zh','en']){
    const tree=load(code+'/index.html'),hero=all(tree,n=>hasClass(n,'a-hero'))[0];
    assert.equal(all(hero,n=>n.tagName==='a'&&hasClass(n,'a-button')).length,0);
    assert.equal(all(hero,n=>hasClass(n,'hero-actions')).length,0);
    assert.equal(all(hero,n=>hasClass(n,'hero-role')).length,0);
    const greeting=text(all(hero,n=>hasClass(n,'hero-greeting'))[0]);
    if(code==='zh')assert.equal(greeting,'你好，我是小毛，一名自由职业开发者。');
    else assert.match(greeting,/a freelance developer\.$/);
    const introduction=all(hero,n=>attrs(n).id==='about')[0];
    const lines=introduction.childNodes.filter(n=>n.tagName==='p');
    assert.equal(lines.length,4);
    for(const line of lines)assert.ok(text(line).trim().endsWith(code==='zh'?'。':'.'));
    const experience=all(lines[0],n=>attrs(n)['data-year-difference']!==undefined);
    assert.equal(experience.length,1);
    assert.equal(attrs(experience[0])['data-base-year'],'2018');
    assert.match(attrs(experience[0])['data-year-format'],/\{years\}/);
    assert.match(text(experience[0]),/2018/);
    if(code==='zh')assert.equal(text(lines[2]),'承接工具、插件、自动化流程及游戏开发，欢迎联系我聊聊。');
    else assert.equal(text(lines[2]),'For tool, plugin, workflow automation, or game development projects, get in touch.');
    const links=all(hero,n=>n.tagName==='a');
    assert.equal(links.length,2);
    assert.equal(attrs(links[0]).href,'/'+code+'/contact/');
    assert.equal(text(links[0]),code==='zh'?'欢迎联系我聊聊':'get in touch');
    assert.equal(attrs(links[1]).href,'/'+code+'/contact/#support-title');
    assert.equal(text(links[1]),code==='zh'?'支持我继续创作':'support my work');
    if(code==='zh')assert.equal(text(lines[3]),'如果我的文章或工具对你有帮助，也欢迎支持我继续创作。');
    else assert.equal(text(lines[3]),'If my articles or tools help you, you can also support my work.');
    const actions=all(tree,n=>hasClass(n,'header-actions'))[0];
    assert.deepEqual(all(actions,n=>n.tagName==='a').map(n=>attrs(n).href),['/'+code+'/contact/']);
    assert.ok(all(tree,n=>n.tagName==='a'&&attrs(n).href==='/'+code+'/works/').length>=2);
  }
});
test('merged contact retains copy/QR/Sponsors and exact support aliases and anchors',()=>{
  const ids=['support-title','purpose-title','methods-title','wechat-title','alipay-title','github-support-title'];
  for(const code of ['zh','en']){const tree=load(code+'/contact/index.html'),nodes=all(tree,()=>true),channel=nodes.findIndex(n=>attrs(n).id==='channels-title'),support=nodes.findIndex(n=>attrs(n).id==='support-title');assert.ok(channel>=0&&support>channel);const content=nodes.find(n=>hasClass(n,'contact-content')),panels=content.childNodes.filter(n=>n.tagName);assert.equal(panels.length,4);assert.deepEqual(panels.map(n=>attrs(n)['aria-labelledby']),['channels-title','capabilities-title','support-title','purpose-title']);const headings=code==='zh'?['打赏支持','微信','支持用途']:['Donations & support','WeChat','What your support helps with'];for(const [i,id] of ['support-title','wechat-title','purpose-title'].entries())assert.equal(text(nodes.find(n=>attrs(n).id===id)),headings[i]);for(const qr of nodes.filter(n=>n.tagName==='a'&&attrs(n)['data-media-qr']!==undefined)){for(let parent=qr.parentNode;parent;parent=parent.parentNode)assert.notEqual(parent.tagName,'details','QR images must be visible without expansion');}assert.equal(all(panels[3],n=>n.tagName==='li').length,4);assert.equal(nodes.filter(n=>attrs(n).id==='copy-email').length,1);assert.equal(nodes.filter(n=>n.tagName==='a'&&attrs(n)['data-media-qr']!==undefined).length,3);assert.equal(nodes.filter(n=>n.tagName==='a'&&attrs(n).href==='https://github.com/sponsors/mengzhishanghun').length,1);for(const id of ids)assert.equal(nodes.filter(n=>attrs(n).id===id).length,1);const actions=nodes.find(n=>hasClass(n,'header-actions'));assert.deepEqual(all(actions,n=>attrs(n)['aria-current']==='page').map(n=>attrs(n).href),['/'+code+'/contact/']);}
  for(const route of ['support/index.html','zh/support/index.html','en/support/index.html']){const tree=load(route),runtime=JSON.parse(text(all(tree,n=>attrs(n)['data-site-language']!==undefined)[0]));assert.equal(runtime.urls.zh,'/zh/contact/');assert.equal(runtime.urls.en,'/en/contact/');assert.equal(runtime.anchors.zh['page-title'],'support-title');assert.equal(runtime.anchors.zh['purpose-title'],'purpose-title');assert.equal(runtime.redirect.locale,route.startsWith('zh/')?'zh':route.startsWith('en/')?'en':null);assert.ok(all(tree,n=>n.tagName==='a'&&attrs(n).href===runtime.urls[runtime.redirect.locale||runtime.primary]).length);}
});
test('merged contact runs its existing email-copy success and failure feedback',async()=>{
  for(const code of ['zh','en']){const tree=load(code+'/contact/index.html'),scripts=all(tree,n=>n.tagName==='script').map(text),copy=JSON.parse(scripts.find(s=>s.startsWith('window.SiteCopy=')).match(/^window\.SiteCopy=([\s\S]*?);window\.SiteLanguageCode=/)[1]),script=scripts.find(s=>s.includes("document.querySelector('#copy-email').addEventListener"));assert.ok(script);
    for(const failure of [false,true]){let click,copied;const status={textContent:''},document={querySelector:selector=>selector==='#copy-email'?{addEventListener:(_,fn)=>{click=fn;}}:status};vm.runInNewContext(script,{document,window:{SiteCopy:copy},navigator:{clipboard:{writeText:async value=>{copied=value;if(failure)throw Error('denied');}}}});await click();assert.equal(copied,'mzsh.me@icloud.com');assert.ok(status.textContent.length>0);}
  }
});
test('retired about pages are absent from actual Pagefind fragments',()=>{for(const code of ['zh','en']){const root=path.join(output,code,'blog-search');const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);const fragments=files(root).filter(p=>p.endsWith('.pf_fragment')).map(p=>JSON.parse(gunzipSync(fs.readFileSync(p)).toString().slice('pagefind_dcd'.length)));assert.ok(!fragments.some(f=>f.url==='/'+code+'/about/'),'retired profile must not appear in the published search index');}});
