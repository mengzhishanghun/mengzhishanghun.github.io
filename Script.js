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

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".ProjectCard");
    let current = 0;
    const showCard = (i) => {
        cards.forEach((c, idx) => {
            c.classList.toggle("active", idx === i);
        });
    };
    showCard(current);

    document.getElementById("ProjectPrev").onclick = () => {
        current = (current - 1 + cards.length) % cards.length;
        showCard(current);
    };

    document.getElementById("ProjectNext").onclick = () => {
        current = (current + 1) % cards.length;
        showCard(current);
    };

    const BirthYear = 1997;
    const WorkStartYear = 2018;
    const CurrentYear = new Date().getFullYear();
    document.getElementById("Age").innerText = CurrentYear - BirthYear;
    document.getElementById("WorkYears").innerText = CurrentYear - WorkStartYear;
});

