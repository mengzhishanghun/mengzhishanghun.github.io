(() => {
  const applyDark = () => {
    document.documentElement.dataset.theme = 'dark';
    window.StarlightThemeProvider.updatePickers();
  };

  window.StarlightThemeProvider = {
    updatePickers() {
      document.querySelectorAll('starlight-theme-select').forEach((picker) => {
        const select = picker.querySelector('select');
        if (select) select.value = 'dark';
        const template = document.querySelector('#theme-icons');
        const icon = template?.content.querySelector('.dark');
        const current = picker.querySelector('svg.label-icon');
        if (icon && current) current.replaceChildren(...icon.cloneNode(true).childNodes);
      });
    },
  };

  applyDark();
  document.addEventListener('astro:after-swap', applyDark);
  document.addEventListener('astro:page-load', applyDark);
})();
