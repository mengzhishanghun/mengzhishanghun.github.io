/* 文案和同篇路由由 OB 构建产物注入；根入口与语言链接共用此运行时。 */
(function () {
  'use strict';
  if (window.SiteLanguage) {
    window.SiteLanguage.init();
    return;
  }

  const storageKey = 'site-language';
  const isLocale = (locale) => locale === 'zh' || locale === 'en';

  function preferredLocale() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isLocale(saved)) return saved;
    } catch (_) { /* 私密浏览或禁用存储仍可选语言。 */ }
    const language = navigator.languages?.[0] || navigator.language || '';
    return /^zh(?:-|$)/i.test(language) ? 'zh' : 'en';
  }

  function currentLocale(pathname) {
    return /^\/(zh|en)(?:\/|$)/.exec(pathname)?.[1] || null;
  }

  function savePreference(locale) {
    if (!isLocale(locale)) return;
    try { window.localStorage.setItem(storageKey, locale); } catch (_) { /* 不阻止导航。 */ }
  }

  function targetUrl(data, locale, href) {
    if (!isLocale(locale) || !data?.urls?.[locale]) return null;
    try {
      const current = new URL(href);
      const target = new URL(data.urls[locale], current);
      if (target.origin !== current.origin || !/^https?:$/.test(target.protocol)) return null;
      target.search = current.search;
      target.hash = current.hash;
      if (current.hash) {
        let anchor;
        try { anchor = decodeURIComponent(current.hash.slice(1)); } catch (_) { anchor = current.hash.slice(1); }
        const mapped = data.anchors?.[locale]?.[anchor];
        if (typeof mapped === 'string') target.hash = mapped;
      }
      return target.href;
    } catch (_) { return null; }
  }

  function pageData() {
    const script = document.querySelector('script[data-site-language]');
    if (!script) return null;
    try { return JSON.parse(script.textContent); } catch (_) { return null; }
  }

  function updateNavigation() {
    const current = new URL(window.location.href);
    for (const link of document.querySelectorAll('.site-header .main-nav a, .site-header .header-actions a')) {
      if (link.dataset?.siteLocale) continue;
      const href = link.getAttribute?.('href');
      if (!href) continue;
      let target;
      try { target = new URL(href, current); } catch (_) { continue; }
      if (target.origin !== current.origin) continue;
      const home = target.pathname === '/' || /^\/(zh|en)\/?$/.test(target.pathname);
      const active = home
        ? current.pathname.replace(/\/$/, '') === target.pathname.replace(/\/$/, '')
        : current.pathname.startsWith(target.pathname);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }

  function init() {
    const data = pageData();
    if (!data) return;
    const explicit = currentLocale(window.location.pathname);
    if (data.root === true && window.location.pathname === '/' && !explicit) {
      const target = targetUrl(data, preferredLocale(), window.location.href);
      if (target) window.location.replace(target);
      return;
    }
    const locale = explicit || (isLocale(data.locale) ? data.locale : null);
    for (const group of document.querySelectorAll('.site-header .site-language-switch')) {
      if (typeof data.labels?.group === 'string') group.setAttribute('aria-label', data.labels.group);
      for (const link of group.querySelectorAll('a[data-site-locale]')) {
        const language = link.dataset.siteLocale;
        if (!isLocale(language)) continue;
        const target = targetUrl(data, language, window.location.href);
        if (target) link.href = target;
        link.dataset.active = String(language === locale);
        // 原站脚本会重写 header-actions a 的 aria-current，状态由 data-active 表示。
        const label = data.labels?.[language];
        const aria = data.labels?.[language + 'Aria'];
        if (typeof label === 'string') link.textContent = label;
        if (typeof aria === 'string') link.setAttribute('aria-label', aria);
      }
    }
    updateNavigation();
  }

  window.SiteLanguage = { preferredLocale, currentLocale, savePreference, targetUrl, init };
  document.addEventListener('click', function (event) {
    const link = event.target.closest?.('.site-header .site-language-switch a[data-site-locale]');
    if (!link || !isLocale(link.dataset.siteLocale)) return;
    const target = targetUrl(pageData(), link.dataset.siteLocale, window.location.href);
    if (!target) return;
    savePreference(link.dataset.siteLocale);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    event.preventDefault();
    window.location.assign(target);
  });
  document.addEventListener('astro:after-swap', init);
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
