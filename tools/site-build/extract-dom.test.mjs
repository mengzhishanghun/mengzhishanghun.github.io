import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTemplate,extractScript } from './extract-dom.mjs';

test('shell extraction preserves nested DOM and leaves body to Markdown', () => {
  const result = extractTemplate('<html><head><title>首页</title></head><body><nav><a href="/">首<span>页</span></a></nav><article><div class="prose"><h2>正文</h2><p>文章内容</p></div></article><button aria-label="复制">复制</button></body></html>');
  assert.equal(Object.values(result.slots).includes('文章内容'), false);
  assert.equal(Object.values(result.slots).includes('首页'), true);
  assert.match(result.template, /<a href="\/">\{\{text:[^}]+\}\}<span>\{\{text:[^}]+\}\}<\/span><\/a>/);
  assert.match(result.template, /<div class="prose">\{\{body\}\}<\/div>/);
  assert.ok(Object.values(result.slots).includes('复制'));
});
test('runtime script strings become language lookups without changing expressions', () => {
  const result=extractScript('button.textContent="复制"; status.textContent=`找到 ${count} 篇笔记`;', 'ui.js');
  assert.ok(Object.values(result.slots).includes('复制'));
  assert.ok(Object.values(result.slots).includes('找到 '));
  assert.ok(Object.values(result.slots).includes(' 篇笔记'));
  assert.equal(result.script.includes('复制'),false);
  assert.ok(result.script.includes('${count}'));
});

test('slot identifiers stay stable when translation changes text length', () => {
  const a = extractTemplate('<html><body><p aria-label="说明">中文</p></body></html>');
  const b = extractTemplate('<html><body><p aria-label="Description">English text</p></body></html>');
  assert.deepEqual(Object.keys(a.slots), Object.keys(b.slots));
});
