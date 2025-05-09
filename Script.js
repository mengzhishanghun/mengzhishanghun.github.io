/* --- 高亮同步：滚动到哪个块，高亮对应按钮 ------------------- */
const buttons = document.querySelectorAll('.NavButton');
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = '#' + e.target.id;
                buttons.forEach(b => b.classList.toggle('NavActive', b.getAttribute('href') === id));
            }
        });
    },
    { root: document.querySelector('.ContentArea'), threshold: 0.55 }
);

document.querySelectorAll('.SnapSection').forEach(sec => observer.observe(sec));

/* --- 平滑滚动（阻止 <a> 默认跳转） --------------------------- */
buttons.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(btn.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
