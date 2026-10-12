(function () {
  'use strict';
  if (window.SiteEngagement) { window.SiteEngagement.init(); return; }
  const refreshers = new WeakMap();
  function createLikeAction({ id, storage, send, locks }) {
    const key = 'article-like:' + id;
    let state, inFlight = false;
    const sync = () => {
      if (inFlight) return state;
      try { const saved = storage.getItem(key); state = saved === 'liked' ? 'liked' : saved ? 'pending' : 'ready'; }
      catch { state = 'storage'; }
      return state;
    };
    sync();
    const submit = async () => {
      sync();
      if (state !== 'ready') return { state };
      try { storage.setItem(key, 'pending'); if (storage.getItem(key) !== 'pending') throw Error('storage'); }
      catch { state = 'storage'; return { state }; }
      state = 'pending';
      try {
        const response = await send();
        const data = await response.json();
        if (response.ok && Number.isSafeInteger(data.count) && data.count >= 1) {
          try { storage.setItem(key, 'liked'); } catch { /* Persistent pending still prevents a replay. */ }
          state = 'liked'; return { state, count: data.count };
        }
        if ([400,403,404,405,413,415,429].includes(response.status) && data.write === 'rejected') {
          try { storage.removeItem(key); if (storage.getItem(key) !== null) throw Error('storage'); state = 'ready'; }
          catch { state = 'pending'; }
          return { state, rejected: true };
        }
      } catch { /* The write may have committed; never replay it. */ }
      return { state };
    };
    return {
      get state() { return inFlight && state === 'ready' ? 'pending' : state; },
      sync,
      async like() {
        if (inFlight) return { state: 'pending' };
        // Reload inside the optional cross-tab lock, before creating a new pending write.
        sync();
        if (state !== 'ready') return { state };
        inFlight = true;
        try {
          const run = async () => { inFlight = false; sync(); inFlight = true; return submit(); };
          return locks?.request ? await locks.request(key, run) : await run();
        } catch { return { state: 'pending' }; }
        finally { inFlight = false; }
      }
    };
  }
  async function timedFetch(url, options) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 10000);
    try { const response = await window.fetch(url, { ...options, signal: controller.signal, credentials: 'omit', cache: 'no-store' }); const data = await response.json(); return { ok: response.ok, status: response.status, json: async () => data }; }
    finally { clearTimeout(timer); }
  }
  async function share({ url, title, navigator, copy, manual }) {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }); return 'shared'; }
      catch (error) { if (error.name === 'AbortError') return 'cancelled'; }
    }
    try { await copy(url); return 'copied'; }
    catch { manual(url); return 'manual'; }
  }
  function init() {
    for (const root of document.querySelectorAll('[data-article-engagement]')) {
      if (root.dataset.engagementReady) continue;
      root.dataset.engagementReady = 'true';
      const data = JSON.parse(root.querySelector('[data-engagement-config]').textContent);
      const like = root.querySelector('[data-engagement-like]'), count = root.querySelector('[data-engagement-count]'), status = root.querySelector('[data-engagement-status]');
      const endpoint = '/api/engagement/articles/' + encodeURIComponent(data.id);
      const main = window.location.origin === data.origin;
      if (main) {
        like.hidden = false;
        let storage; try { storage = window.localStorage; } catch { storage = { getItem() { throw Error('storage'); } }; }
        let countRevision = 0;
        const action = createLikeAction({ id: data.id, storage, locks: window.navigator.locks, send: () => timedFetch(endpoint + '/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }) });
        const update = (result = { state: action.state }) => {
          like.disabled = result.state !== 'ready';
          root.querySelector('[data-engagement-like-label]').textContent = result.state === 'liked' ? data.labels.liked : data.labels.like;
          if (result.count !== undefined) { countRevision++; count.textContent = String(result.count); }
          status.textContent = result.rejected && result.state === 'ready' ? data.labels.rejected : data.labels[result.state] || '';
        };
        update();
        refreshers.set(root, () => { action.sync(); update(); });
        timedFetch(endpoint, {}).then(r => { if (!r.ok) throw Error('read'); return r.json(); }).then(value => {
          if (!Number.isSafeInteger(value.count) || value.count < 0) throw Error('count'); if (countRevision === 0) count.textContent = String(value.count);
        }).catch(() => { if (countRevision === 0) count.textContent = '—'; });
        like.addEventListener('click', async () => {
          action.sync();
          if (action.state !== 'ready') { update(); return; }
          like.disabled = true;
          const pending = action.like(); await pending.then(update);
        });
      }
      const shareButton = root.querySelector('[data-engagement-share]'), manual = root.querySelector('[data-engagement-manual]'), link = root.querySelector('[data-engagement-url]');
      shareButton.addEventListener('click', async () => {
        if (shareButton.disabled) return;
        shareButton.disabled = true;
        try {
          const result = await share({ url: data.url, title: data.title, navigator: window.navigator,
            copy: value => window.navigator.clipboard.writeText(value),
            manual: value => { manual.hidden = false; link.value = value; link.focus(); link.select(); } });
          if (result !== 'cancelled') status.textContent = data.labels[result];
        } finally { shareButton.disabled = false; }
      });
    }
  }
  window.SiteEngagement = { init, createLikeAction, share };
  window.addEventListener?.('storage', event => {
    if (event.key !== null && !event.key?.startsWith('article-like:')) return;
    for (const root of document.querySelectorAll('[data-article-engagement]')) refreshers.get(root)?.();
  });
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
}());
