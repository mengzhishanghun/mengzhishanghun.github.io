(() => {
  const applyDark = () => {
    document.documentElement.dataset.theme = 'dark';
  };

  applyDark();
  document.addEventListener('astro:after-swap', applyDark);
  document.addEventListener('astro:page-load', applyDark);
})();
