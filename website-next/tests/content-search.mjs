import assert from 'node:assert/strict';
import { rankSearchDocument, splitSearchTerms } from '../shared/content-search.ts';

const document = {
  title: 'UE：如何让 AI 修改 DataAsset',
  description: '通过自动化工具修改 Unreal Engine 数据资产。',
  categoryName: 'Unreal 工具',
  tags: ['Unreal Engine', 'AI', '自动化'],
  body: '文章正文包含 UMG 和编辑器工具。',
};

assert.deepEqual(splitSearchTerms('  UE   AI  UE '), ['ue', 'ai']);
assert.equal(rankSearchDocument(document, splitSearchTerms('UE AI DataAset')).matchedTerms, 3);
assert.equal(rankSearchDocument(document, splitSearchTerms('Godot AI')).matchedTerms, 1);
assert.ok(rankSearchDocument(document, ['dataasset']).score > rankSearchDocument(document, ['umg']).score);
console.log('content-search tests passed');

