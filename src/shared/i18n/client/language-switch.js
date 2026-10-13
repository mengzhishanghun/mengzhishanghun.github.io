/* 文案和同篇路由由 OB 构建产物注入；根入口与语言链接共用此运行时。 */
(function () {
  'use strict';
  if (window.SiteLanguage) {
    window.SiteLanguage.init();
    return;
  }

  const storageKey = 'site-language';

  function enabledLanguages(data, href = window.location.href) {
    if (!Array.isArray(data?.languages)) return [];
    const current = new URL(href);
    return data.languages.filter((language) => {
      if (!language || typeof language.code !== 'string' || !/^[a-z][a-z0-9-]*$/i.test(language.code)) return false;
      const route = data.urls?.[language.code];
      if (typeof route !== 'string') return false;
      try {
        const target = new URL(route, current);
        const root = '/' + language.code;
        return target.origin === current.origin && /^https?:$/.test(target.protocol)
          && (target.pathname === root || target.pathname.startsWith(root + '/'));
      } catch (_) { return false; }
    });
  }

  function preferredLocale(data) {
    const languages = enabledLanguages(data);
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (languages.some((language) => language.code === saved)) return saved;
    } catch (_) { /* 私密浏览或禁用存储仍可选语言。 */ }
    const preferred = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    const matched = languages.find((language) => Array.isArray(language.browserTags) && language.browserTags.some((value) => {
      if (typeof value !== 'string') return false;
      const tag = value.toLowerCase();
      return tag.endsWith('-*') ? preferred.startsWith(tag.slice(0, -1)) : preferred === tag;
    }));
    if (matched) return matched.code;
    return languages.some((language) => language.code === data?.fallback) ? data.fallback : null;
  }

  function currentLocale(pathname, data) {
    return enabledLanguages(data).find((language) => pathname === '/' + language.code || pathname.startsWith('/' + language.code + '/'))?.code || null;
  }

  function savePreference(locale, data) {
    if (!enabledLanguages(data).some((language) => language.code === locale)) return;
    try { window.localStorage.setItem(storageKey, locale); } catch (_) { /* 不阻止导航。 */ }
  }

  function targetUrl(data, locale, href) {
    if (!enabledLanguages(data, href).some((language) => language.code === locale)) return null;
    try {
      const current = new URL(href);
      const target = new URL(data.urls[locale], current);
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

  function updateNavigation(data) {
    const current = new URL(window.location.href);
    const languages = enabledLanguages(data);
    for (const link of document.querySelectorAll('.site-header .main-nav a, .site-header .header-actions a')) {
      if (link.dataset?.siteLocale) continue;
      const href = link.getAttribute?.('href');
      if (!href) continue;
      let target;
      try { target = new URL(href, current); } catch (_) { continue; }
      if (target.origin !== current.origin) continue;
      const home = target.pathname === '/' || languages.some((language) => {
        const root = '/' + language.code;
        return target.pathname === root || target.pathname === root + '/';
      });
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
    const explicit = currentLocale(window.location.pathname, data);
    const redirect = data.redirect || (data.root === true ? { pathname: '/', locale: null } : null);
    if (redirect && window.location.pathname === redirect.pathname) {
      const languages = enabledLanguages(data);
      const locale = explicit || (languages.some((language) => language.code === redirect.locale) ? redirect.locale : preferredLocale(data));
      const target = targetUrl(data, locale, window.location.href);
      if (target && new URL(target).pathname !== window.location.pathname) window.location.replace(target);
      return;
    }
    const languages = enabledLanguages(data);
    const locale = explicit || (languages.some((language) => language.code === data.locale) ? data.locale : null);
    for (const group of document.querySelectorAll('.site-header .site-language-switch')) {
      const select = group.querySelector('select[data-site-language-select]');
      if (!select) continue;
      if (typeof data.labels?.group === 'string') select.setAttribute('aria-label', data.labels.group);
      const options = languages.map((language) => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = language.label;
        option.dataset.siteLocale = language.code;
        option.dataset.url = targetUrl(data, language.code, window.location.href);
        option.setAttribute('lang', language.htmlLang || language.code);
        option.selected = language.code === locale;
        return option;
      });
      select.replaceChildren(...options);
      select.value = locale || '';
      select.dataset.current = locale || '';
      select.disabled = languages.length === 0;
    }
    updateNavigation(data);
  }

  window.SiteLanguage = { preferredLocale, currentLocale, savePreference, targetUrl, init };
  document.addEventListener('change', function (event) {
    const select = event.target.closest?.('.site-header .site-language-switch select[data-site-language-select]');
    if (!select) return;
    const data = pageData();
    const target = targetUrl(data, select.value, window.location.href);
    if (!target) return;
    savePreference(select.value, data);
    window.location.assign(target);
  });
  document.addEventListener('astro:after-swap', init);
  document.addEventListener('astro:page-load', init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
