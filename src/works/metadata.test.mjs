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
