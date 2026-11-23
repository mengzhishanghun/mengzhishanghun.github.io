import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
import {attrs,walk} from '../build/extract-dom.mjs';

test('featured labels follow the target content taxonomy in each language without topic tags',async()=>{
  const {renderFeaturedCategories}=await import('./featured.mjs');
  const entries=[
    {id:'work:tool',legacyRoutes:['/works/tool/'],projectedCategory:{zh:{name:'UE插件'},en:{name:'UE plugins'}},tags:['AI','MCP']},
    {id:'case:project',legacyRoutes:['/cases/project/'],projectedCategory:{zh:{name:'UE项目'},en:{name:'UE projects'}},tags:['仿真']},
    {id:'blog:note',legacyRoutes:['/blog/note/'],projectedCategory:{zh:{name:'UE开发'},en:{name:'UE development'}},tags:['运动解算','IK']}
  ];
  const html='<main>'+entries.map(entry=>`<article data-feature-panel><p class="feature-category">old label</p><h3><a href="${entry.legacyRoutes[0]}">Title</a></h3></article>`).join('')+'</main>';
  const labels=html=>{const result=[];walk(parse(html),node=>{if((attrs(node).class||'').split(/\s+/).includes('feature-category'))result.push(node.childNodes.map(node=>node.value||'').join(''));});return result;};
  assert.deepEqual(labels(renderFeaturedCategories(html,entries,'zh')),['UE插件','UE项目','UE开发']);
  assert.deepEqual(labels(renderFeaturedCategories(html,entries,'en')),['UE plugins','UE projects','UE development']);
  entries[2].projectedCategory.zh.name='引擎与渲染';
  assert.deepEqual(labels(renderFeaturedCategories(html,entries,'zh')),['UE插件','UE项目','引擎与渲染']);
});

test('featured taxonomy rejects an unknown target or missing localized category',async()=>{
  const {renderFeaturedCategories}=await import('./featured.mjs');
  const html='<article data-feature-panel><p class="feature-category"></p><h3><a href="/blog/note/">Title</a></h3></article>';
  assert.throws(()=>renderFeaturedCategories(html,[],'zh'),/精选内容未登记/);
  assert.throws(()=>renderFeaturedCategories(html,[{id:'blog:note',legacyRoutes:['/blog/note/'],projectedCategory:{zh:{name:'UE开发'}}}],'en'),/精选分类缺失/);
});

test('home features three technical blog posts with matching carousel controls',()=>{
  const html=fs.readFileSync(new URL('./templates/page--home.html',import.meta.url),'utf8');
  let section;walk(parse(html),node=>{if(attrs(node)['aria-labelledby']==='featured-blog-title')section=node;});
  assert.ok(section);
  const panels=[],controls=[];walk(section,node=>{const a=attrs(node);if(a['data-feature-panel']!==undefined)panels.push(node);if(a['data-feature-select']!==undefined)controls.push(a);});
  assert.equal(panels.length,3);assert.equal(controls.length,3);
  const expected=['/blog/motion-capture-robot-control/','/blog/six-dof-motion-platform/','/blog/cnblogs-19165561/'];
  const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url),'utf8'));
  for(const route of expected)assert.ok(manifest.entries.some(entry=>entry.type==='blog'&&entry.legacyRoutes.includes(route)),route);
  panels.forEach((panel,index)=>{
    const links=[];walk(panel,node=>{if(node.tagName==='a')links.push(attrs(node).href);});
    assert.ok(links.length>0);assert.ok(links.every(link=>link===expected[index]));
    assert.equal(controls[index]['data-feature-select'],String(index));
    assert.equal(controls[index]['aria-controls'],attrs(panel).id);
  });
});

test('home puts MCPBlueprint first, followed by AIDataAsset and UEQuickStart',()=>{
  const html=fs.readFileSync(new URL('./templates/page--home.html',import.meta.url),'utf8');
  let section;walk(parse(html),node=>{if(attrs(node)['aria-labelledby']==='featured-works-title')section=node;});
  assert.ok(section);
  const panels=[],controls=[];walk(section,node=>{const a=attrs(node);if(a['data-feature-panel']!==undefined)panels.push(node);if(a['data-feature-select']!==undefined)controls.push(a);});
  const expected=['mcp-blueprint','ai-data-asset','ue-quick-start'];
  const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url),'utf8'));
  assert.equal(panels.length,3);assert.equal(controls.length,3);
  panels.forEach((panel,index)=>{
    const links=[],images=[];walk(panel,node=>{if(node.tagName==='a')links.push(attrs(node).href);if(node.tagName==='img')images.push(attrs(node).src);});
    assert.ok(links.length>0);assert.ok(links.every(link=>link==='/works/'+expected[index]+'/'));
    assert.deepEqual(images,[manifest.entries.find(entry=>entry.id==='work:'+expected[index]).cover.websiteUrl]);
    assert.equal(controls[index]['data-feature-select'],String(index));
    assert.equal(controls[index]['aria-controls'],attrs(panel).id);
  });
});
