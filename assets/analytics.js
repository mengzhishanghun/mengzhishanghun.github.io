(() => {
  if (window.location.hostname !== 'mzsh.me') return;
  if (window.__mzshAnalytics) return;
  window.__mzshAnalytics = true;

  const website = document.currentScript?.dataset.websiteId;
  if (!website) return;

  const maxPending = 32;
  const pending = [];
  let lastUrl = '';
  let ready = false;
  let failed = false;
  let sending = false;

  function cleanUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.href);
      return url.origin + url.pathname;
    } catch {
      return '';
    }
  }

  async function flush() {
    if (sending || !ready || failed) return;
    sending = true;
    try {
      while (pending.length) {
        if (typeof window.umami?.track !== 'function') throw new Error('Umami unavailable');
        await window.umami.track(pending.shift());
      }
    } catch {
      pending.length = 0;
      failed = true;
    } finally {
      sending = false;
    }
  }

  function recordPage() {
    if (failed) return;
    const url = cleanUrl(window.location.href);
    if (!url || url === lastUrl) return;
    const referrer = lastUrl || cleanUrl(document.referrer);
    lastUrl = url;
    if (pending.length === maxPending) pending.shift();
    pending.push({ website, url, title: document.title, referrer });
    void flush();
  }

  document.addEventListener('astro:page-load', recordPage);
  recordPage();
  if (window.umami?.track) {
    ready = true;
    void flush();
    return;
  }
  try {
    const trackerScript = document.createElement('script');
    trackerScript.src = 'https://stats.mzsh.me/script.js';
    trackerScript.dataset.websiteId = website;
    trackerScript.dataset.autoTrack = 'false';
    trackerScript.dataset.domains = 'mzsh.me';
    trackerScript.dataset.excludeSearch = 'true';
    trackerScript.dataset.excludeHash = 'true';
    trackerScript.addEventListener('load', () => {
      ready = true;
      void flush();
    }, { once: true });
    trackerScript.addEventListener('error', () => {
      failed = true;
      pending.length = 0;
    }, { once: true });
    document.head.appendChild(trackerScript);
  } catch {
    failed = true;
    pending.length = 0;
  }
})();
