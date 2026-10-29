(() => {
  if (window.projectGalleryReady) return;
  window.projectGalleryReady = true;
  const stop = root => {
    root.querySelectorAll('video').forEach(video => video.pause());
    if (document.fullscreenElement && root.contains(document.fullscreenElement)) {
      try { document.exitFullscreen()?.catch(() => {}); } catch {}
    }
  };
  const leave = () => document.querySelectorAll('[data-project-gallery]').forEach(stop);
  document.addEventListener('astro:before-preparation', leave);
  window.addEventListener('pagehide', leave);
  document.addEventListener('click', event => {
    const button = event.target?.closest('[data-gallery-select]');
    const root = button?.closest('[data-project-gallery]');
    if (!root?.isConnected || event.button !== 0) return;
    const selected = button.dataset.gallerySelect;
    if (!Array.from(root.querySelectorAll('[data-gallery-panel]')).some(panel => panel.dataset.galleryPanel === selected)) return;
    stop(root);
    root.querySelectorAll('[data-gallery-panel]').forEach(panel => { panel.hidden = panel.dataset.galleryPanel !== selected; });
    root.querySelectorAll('[data-gallery-select]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
})();
