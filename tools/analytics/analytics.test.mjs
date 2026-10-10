import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { injectHtml, isPublicHtml, isPublicPath } from './inject.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, '../../assets/analytics.js');
const id = '123e4567-e89b-42d3-a456-426614174000';

function browser(url = 'https://mzsh.me/a/?q=1#top', options = {}) {
  const listeners = new Map();
  const scripts = [];
  const calls = [];
  const location = new URL(url);
  const document = {
    title: 'A', referrer: options.referrer ?? 'https://search.example/results?q=private',
    currentScript: { dataset: { websiteId: id } },
    querySelector() { return null; },
    head: { appendChild(script) { scripts.push(script); } },
    createElement(tag) {
      assert.equal(tag, 'script');
      const handlers = new Map();
      return {
        dataset: {},
        addEventListener(type, fn) { handlers.set(type, fn); },
        emit(type) { handlers.get(type)?.(); },
      };
    },
    addEventListener(type, fn) { listeners.set(type, fn); },
  };
  const window = { location, document, umami: options.umami, URL };
  vm.runInNewContext(fs.readFileSync(script, 'utf8'), { window, document, URL, Promise });
  return {
    calls, window, document, scripts,
    emit(type) { listeners.get(type)?.(); },
    load() { scripts[0]?.emit('load'); },
    fail() { scripts[0]?.emit('error'); },
    navigate(pathname, title, event = 'astro:page-load') {
      window.location = new URL(pathname, window.location);
      document.title = title;
      this.emit(event);
    },
    setTracker(track = value => { calls.push(value); }) { window.umami = { track }; },
  };
}

test('first load, soft navigation, back and refresh record explicit sanitized snapshots', async () => {
  const page = browser();
  page.setTracker(); page.load();
  page.navigate('/b/?x=2#hash', 'B');
  page.navigate('/a/', 'A again');
  await new Promise(setImmediate);
  assert.deepEqual(JSON.parse(JSON.stringify(page.calls)), [
    { website: id, url: 'https://mzsh.me/a/', title: 'A', referrer: 'https://search.example/results' },
    { website: id, url: 'https://mzsh.me/b/', title: 'B', referrer: 'https://mzsh.me/a/' },
    { website: id, url: 'https://mzsh.me/a/', title: 'A again', referrer: 'https://mzsh.me/b/' },
  ]);
  const refreshCalls = [];
  const refreshed = browser('https://mzsh.me/a/', { umami: { track: value => refreshCalls.push(value) } });
  refreshed.load(); await new Promise(setImmediate);
  assert.equal(refreshCalls.length, 1);
});

test('query/hash and duplicate initialization do not add pageviews', async () => {
  const page = browser(); page.setTracker(); page.load();
  page.navigate('/a/?q=2#next', 'A changed');
  vm.runInNewContext(fs.readFileSync(script, 'utf8'), { window: page.window, document: page.document, URL, Promise });
  page.emit('astro:page-load'); await new Promise(setImmediate);
  assert.equal(page.calls.length, 1);
});

test('local preview makes no tracking call', async () => {
  const page = browser('http://localhost:4321/a/'); page.setTracker(); page.load();
  page.navigate('/b/', 'B'); await new Promise(setImmediate);
  assert.equal(page.calls.length, 0);
  assert.equal(page.scripts.length, 0);
});

test('backup domain does not request the tracker', () => {
  const page = browser('https://mengzhishanghun.github.io/a/');
  assert.equal(page.scripts.length, 0);
});

test('official tracker loads once on production domain with manual pageview settings', () => {
  const page = browser();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://stats.mzsh.me/script.js');
  assert.equal(page.scripts[0].dataset.websiteId, id);
  assert.equal(page.scripts[0].dataset.autoTrack, 'false');
  assert.equal(page.scripts[0].dataset.domains, 'mzsh.me');
  assert.equal(page.scripts[0].dataset.excludeSearch, 'true');
  assert.equal(page.scripts[0].dataset.excludeHash, 'true');
  vm.runInNewContext(fs.readFileSync(script, 'utf8'), { window: page.window, document: page.document, URL, Promise });
  assert.equal(page.scripts.length, 1);
});

test('slow load keeps ordered snapshots of rapid navigation', async () => {
  const page = browser();
  page.navigate('/b/?secret=1', 'B'); page.navigate('/c/', 'C');
  page.setTracker(); page.load(); await new Promise(setImmediate);
  assert.deepEqual(page.calls.map(value => value.url), ['https://mzsh.me/a/', 'https://mzsh.me/b/', 'https://mzsh.me/c/']);
  assert.deepEqual(page.calls.map(value => value.title), ['A', 'B', 'C']);
});

test('failed load drops queue and never replays it', async () => {
  const page = browser(); page.navigate('/b/', 'B'); page.fail();
  page.setTracker(); page.load(); page.navigate('/c/', 'C');
  await new Promise(setImmediate);
  assert.equal(page.calls.length, 0);
});

test('rejected tracking clears pending events without interrupting navigation', async () => {
  const page = browser();
  page.navigate('/b/', 'B');
  page.setTracker(() => Promise.reject(new Error('offline')));
  page.load();
  await new Promise(setImmediate);
  page.navigate('/c/', 'C');
  page.setTracker();
  page.load();
  await new Promise(setImmediate);
  assert.equal(page.document.title, 'C');
  assert.equal(page.calls.length, 0);
});

test('temporary queue is bounded during delayed load', async () => {
  const page = browser();
  for (let i = 0; i < 40; i++) page.navigate(`/p${i}/`, `P${i}`);
  page.setTracker(); page.load(); await new Promise(setImmediate);
  assert.equal(page.calls.length, 32);
  assert.equal(page.calls[0].url, 'https://mzsh.me/p8/');
  assert.equal(page.calls.at(-1).url, 'https://mzsh.me/p39/');
});

test('injection selects public HTML and stays idempotent', () => {
  const html = '<html><head><title>A</title></head><body>A</body></html>';
  assert.equal(isPublicPath('index.html'), true);
  assert.equal(isPublicPath('assets/analytics.js'), true);
  assert.equal(isPublicPath('design-preview/index.html'), false);
  assert.equal(isPublicPath('design-preview/docs/index.html'), false);
  assert.equal(isPublicPath('tools/analytics/inject.mjs'), false);
  assert.equal(isPublicHtml('index.html', html), true);
  assert.equal(isPublicHtml('design-preview/index.html', html), false);
  assert.equal(isPublicHtml('design-preview/docs/index.html', html), false);
  assert.equal(isPublicHtml('zh/index.html', '<meta http-equiv="refresh" content="0;url=/">'), false);
  assert.equal(isPublicHtml('docs/404.html', html), false);
  const once = injectHtml(html, id);
  assert.equal(injectHtml(once, id), once);
  assert.match(once, /src="\/assets\/analytics.js"/);
  assert.match(once, new RegExp(`data-website-id="${id}"`));
  assert.doesNotMatch(once, /stats\.mzsh\.me/);
});
