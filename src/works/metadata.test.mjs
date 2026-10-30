import assert from 'node:assert/strict';
import test from 'node:test';
import {assertPublicFields} from '../build/source-schema.mjs';
import {projectSource} from '../import/import.mjs';
const info={channels:[{kind:'sale',href:'https://example.com/store'},{kind:'open-source',href:'https://github.com/example/tool'},{kind:'docs',href:'/docs/zh/tool/'}],compatibility:[{platforms:['Windows'],requirements:['UE 5.2–5.8']},{platforms:['macOS'],requirements:['UE 5.4']}]};
test('nested metadata rejects unknown fields, invalid shape and unsafe URL',()=>{
 for(const workInfo of [{...info,privatePath:'secret'},{...info,channels:[{kind:'sale',href:'javascript:alert(1)'}]},{...info,channels:[{kind:'docs',href:'//evil.test'}]},{...info,channels:[{kind:'sale',href:'https://example.com',secret:true}]},{...info,compatibility:[{platforms:'Windows',requirements:[]}]},{...info,compatibility:[{platforms:['Windows'],requirements:[],secret:true}]}])assert.throws(()=>assertPublicFields({workInfo}),/workInfo/);
 assert.doesNotThrow(()=>assertPublicFields({workInfo:info}));
});
test('projection preserves valid public metadata and refuses nested private fields',async()=>{
 const record={id:'work:test',kind:'work',lang:'zh',images:[]};
 assert.deepEqual((await projectSource({data:{workInfo:info},body:'Body\n'},record)).data.workInfo,info);
 await assert.rejects(()=>projectSource({data:{workInfo:{...info,secret:'private'}},body:'Body\n'},record),/workInfo/);
});
test('metadata renderer supports sale, source, both, grouped compatibility and legacy fallback',async()=>{
 const {renderWorkMetadata}=await import('./metadata.mjs');
 const labels={sale:'在售', 'open-source':'开源',saleAction:'跳转到在售页面',sourceAction:'跳转到开源页面',docsAction:'查看具体文档',platforms:'适用平台',requirements:'环境要求',pending:'待核实'};
 const html='<div class="project-title-group"><h1>Test</h1><p>English</p></div><nav class="work-actions"><a href="/docs/zh/tool/">Old docs</a></nav>';
 assert.equal(renderWorkMetadata(html,{},labels),html);
 for(const kinds of [['sale'],['open-source'],['sale','open-source']]){
  const result=renderWorkMetadata(html,{workInfo:{...info,channels:info.channels.filter(x=>kinds.includes(x.kind)||x.kind==='docs')}},labels);
  assert.equal((result.match(/class="work-status /g)||[]).length,kinds.length);
  const groups=[...result.matchAll(/<div class="work-compatibility-group">([\s\S]*?)<\/div>/g)].map(match=>match[1]);
  assert.equal(groups.length,2);assert.match(groups[0],/Windows/);assert.match(groups[0],/UE 5.2–5.8/);assert.doesNotMatch(groups[0],/macOS/);assert.match(groups[1],/macOS/);assert.match(groups[1],/UE 5.4/);
  assert.match(result,/查看具体文档/);assert.match(result,/Windows/);assert.match(result,/macOS/);assert.match(result,/UE 5.4/);
  for(const kind of kinds)assert.match(result,new RegExp(kind==='sale'?'跳转到在售页面':'跳转到开源页面'));
 }
});

test('work cards show only verified sale and source badges beside their titles',async()=>{
 const {renderWorkCardStatuses}=await import('./metadata.mjs');
 const {parseFragment}=await import('parse5');const {walk,attrs}=await import('../build/extract-dom.mjs');
 const labels={sale:'在售','open-source':'开源'},html='<a class="content-card" data-content-card data-slug="example"><div class="project-title-group"><h2>Example</h2><p>Secondary</p></div><div class="content-card-tags"><span>Tag</span></div></a>';
 for(const [kinds,want]of [[['sale'],['在售']],[['open-source'],['开源']],[['sale','open-source'],['在售','开源']],[['docs'],[]],[[],[]]]){
  const data={workInfo:{...info,channels:info.channels.filter(c=>kinds.includes(c.kind))}},entries=[{type:'work',slug:'example',sources:{zh:{data}}}];
  const result=renderWorkCardStatuses(html,entries,'zh',labels),doc=parseFragment(result),badges=[];
  walk(doc,n=>{if((attrs(n).class||'').split(' ').includes('work-status')){assert.equal(attrs(n.parentNode).class,'work-card-title-line');assert.ok(n.parentNode.childNodes.some(child=>child.tagName==='h2'));badges.push(n.childNodes[0].value);}});
  assert.deepEqual(badges,want);assert.match(result,/<div class="content-card-tags"><span>Tag<\/span><\/div>/);
 }
 assert.equal(renderWorkCardStatuses(html,[{type:'case',slug:'example',sources:{zh:{data:{workInfo:info}}}}],'zh',labels),html);
 assert.equal(renderWorkCardStatuses(html,[{type:'work',slug:'example',sources:{zh:{data:{}}}}],'zh',labels),html);
});

test('developing works retain lifecycle, safe support and noninteractive missing documentation',async()=>{
 const {renderWorkMetadata,renderWorkBadges}=await import('./metadata.mjs');
 const workInfo={stage:'developing',supportHref:'/contact/#support-title',channels:[],compatibility:[]};
 assert.doesNotThrow(()=>assertPublicFields({workInfo}));
 for(const supportHref of ['javascript:alert(1)','//evil.test','/../secret','https://user:password@example.com'])assert.throws(()=>assertPublicFields({workInfo:{...workInfo,supportHref}}),/workInfo/);
 assert.throws(()=>assertPublicFields({workInfo:{...workInfo,stage:'released'}}),/workInfo/);
 const labels={developing:'开发中',supportAction:'去支持',noDocs:'暂无相关文档',pending:'待核实',platforms:'适用平台',requirements:'环境要求'};
 const result=renderWorkMetadata('<div class="project-title-group"><h1>Example</h1></div><nav class="work-actions"></nav>',{workInfo},labels);
 assert.match(renderWorkBadges({workInfo},labels),/开发中/);
 assert.match(result,/<a class="work-action work-action-primary" href="\/contact\/#support-title">去支持<\/a>/);
 assert.match(result,/<button type="button" class="work-action work-action-unavailable" disabled>暂无相关文档<\/button>/);
 assert.doesNotMatch(result,/href="[^"]*docs|work-status-open-source|work-status-sale/);
});

test('missing documentation renders a disabled button regardless of development stage',async()=>{
 const {renderWorkMetadata}=await import('./metadata.mjs');
 const {parseFragment}=await import('parse5');const {walk,attrs}=await import('../build/extract-dom.mjs');
 const labels={noDocs:'暂无相关文档',pending:'待核实',platforms:'适用平台',requirements:'环境要求'};
 const html='<div class="project-title-group"><h1>Example</h1></div><nav class="work-actions"></nav>';
 for(const stage of [undefined,'developing']){
  const result=renderWorkMetadata(html,{workInfo:{...(stage?{stage}:{}),channels:[],compatibility:[]}},labels),buttons=[];
  walk(parseFragment(result),node=>{if((attrs(node).class||'').split(' ').includes('work-action-unavailable'))buttons.push(node);});
  assert.equal(buttons.length,1);assert.equal(buttons[0].tagName,'button');
  assert.equal(attrs(buttons[0]).type,'button');assert.ok(Object.hasOwn(attrs(buttons[0]),'disabled'));
  assert.equal(attrs(buttons[0]).href,undefined);
 }
});
