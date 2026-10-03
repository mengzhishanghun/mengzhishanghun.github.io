import assert from 'node:assert/strict';
import { paginateContent, paginationNumbers } from '../shared/content-pagination.ts';

const items = Array.from({ length: 23 }, (_, index) => ({ slug: `work-${index}`, tag: index % 2 ? '插件' : '自动化' }));
const pages = [1, 2, 3].map(page => paginateContent(items, page));
assert.deepEqual(pages.map(page => page.items.length), [9, 9, 5]);
assert.deepEqual(pages.flatMap(page => page.items), items);
assert.equal(pages[1].items[0].slug, 'work-9');
assert.equal(paginateContent(items, 99).page, 3);
assert.equal(paginateContent(items, -1).page, 1);
assert.equal(paginateContent(items, NaN).page, 1);
assert.equal(paginateContent(items.filter(item => item.tag === '插件'), 3).page, 2);
assert.equal(paginateContent(items.slice(0, 3), 2).page, 1);
assert.deepEqual(paginateContent([]), { items: [], page: 1, pageCount: 0, total: 0 });
assert.deepEqual(paginationNumbers(1, 1), [1]);
assert.deepEqual(paginationNumbers(1, 12), [1, 2, 3, 4, 'ellipsis', 12]);
assert.deepEqual(paginationNumbers(6, 12), [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]);
assert.deepEqual(paginationNumbers(12, 12), [1, 'ellipsis', 9, 10, 11, 12]);
console.log('content-pagination tests passed');
