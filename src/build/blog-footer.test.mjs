import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generatedPage} from './interaction-fixtures.mjs';
import {preflight,renderBody} from './build.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
const donation='/Donate/WeChat.jpg';
for(const locale of ['zh','en'])test(`${locale} legacy blog articles omit the imported promotion footer and separator`,()=>{
  const entries=manifest.entries.filter(entry=>entry.type==='blog'&&fs.readFileSync(new URL(`../blog/content/${locale}/${entry.slug}.md`,import.meta.url),'utf8').includes(donation));
  assert.equal(entries.length,27);
  for(const entry of entries){
    const page=generatedPage(`${locale}/blog/${entry.slug}/index.html`),body=page.select('article .prose');
    assert.ok(body,entry.id);
    const descendants=page.nodes.filter(node=>page.closest(node,'.prose')===body);
    assert.equal(descendants.some(node=>page.attrs(node).href?.includes(donation)),false,entry.id+' must omit the old donation link');
    assert.notEqual(body.childNodes.filter(node=>node.tagName).at(-1)?.tagName,'hr',entry.id+' must omit the footer separator');
  }
});

test('blog footer cleanup preserves body quotations, code samples, and reprint sources',async()=>{
  const site=fileURLToPath(new URL('../../',import.meta.url)),validated=preflight({site,manifest});
  const entry=validated.entries.find(entry=>entry.id==='blog:cnblogs-19184043'),source=entry.sources.zh;
  const processor={...validated,primary:validated.config.primary};
  const divider=source.body.lastIndexOf('\n***\n'),footer=source.body.slice(divider);
  for(const body of [source.body+'\n\nFurther article content.\n',source.body.slice(0,divider)+'\n\n~~~text\n'+footer+'~~~\n']){
    const rendered=await renderBody({...entry,sources:{...entry.sources,zh:{...source,body}}},'zh',processor,site);
    assert.ok(rendered.code.includes(donation),'a body quotation or code sample must retain the donation reference');
  }
  const original=validated.reprints[0],reprintSource=original.sources.zh;
  const rendered=await renderBody({...original,sources:{zh:{...reprintSource,body:reprintSource.body+footer}}},'zh',processor,site);
  assert.ok(rendered.code.includes(donation),'borrowed source content must remain intact');
});
