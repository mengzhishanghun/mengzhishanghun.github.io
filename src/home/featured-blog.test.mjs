import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
import {attrs,walk} from '../build/extract-dom.mjs';

test('home keeps the two featured blog posts and matching carousel controls',()=>{
  const html=fs.readFileSync(new URL('./templates/page--home.html',import.meta.url),'utf8');
  let section;walk(parse(html),node=>{if(attrs(node)['aria-labelledby']==='featured-blog-title')section=node;});
  assert.ok(section);
  const panels=[],controls=[];walk(section,node=>{const a=attrs(node);if(a['data-feature-panel']!==undefined)panels.push(node);if(a['data-feature-select']!==undefined)controls.push(a);});
  assert.equal(panels.length,2);assert.equal(controls.length,2);
  const expected=['/blog/plugin-release-workflow/','/blog/ue-multiwindow-interface/'];
  const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url),'utf8'));
  for(const route of expected)assert.ok(manifest.entries.some(entry=>entry.type==='blog'&&entry.legacyRoutes.includes(route)),route);
  panels.forEach((panel,index)=>{
    const links=[];walk(panel,node=>{if(node.tagName==='a')links.push(attrs(node).href);});
    assert.ok(links.length>0);assert.ok(links.every(link=>link===expected[index]));
    assert.equal(controls[index]['data-feature-select'],String(index));
    assert.equal(controls[index]['aria-controls'],attrs(panel).id);
  });
});
