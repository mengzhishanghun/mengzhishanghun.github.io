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

/* --- 通用轮播函数 -------------------------------------------- */
function SetupCarousel(buttonPrevId, buttonNextId, cardSelector) {
    const cards = document.querySelectorAll(cardSelector);
    let index = 0;
    const show = (i) => {
        cards.forEach((c, idx) => {
            c.classList.toggle("active", idx === i);
        });
    };
    show(index);

    document.getElementById(buttonPrevId).onclick = () => {
        index = (index - 1 + cards.length) % cards.length;
        show(index);
    };
    document.getElementById(buttonNextId).onclick = () => {
        index = (index + 1) % cards.length;
        show(index);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const BirthYear = 1997;
    const WorkStartYear = 2018;
    const CurrentYear = new Date().getFullYear();
    document.getElementById("Age").innerText = CurrentYear - BirthYear;
    document.getElementById("WorkYears").innerText = CurrentYear - WorkStartYear;

    // 初始化项目经历轮播
    SetupCarousel("ProjectPrev", "ProjectNext", "#ProjectSlides .ProjectCard");

    // Showcase 的标签与轮播逻辑
    const ShowcaseTabs = document.querySelectorAll(".ProjectTab");
    const ShowcaseCards = document.querySelectorAll("#ShowcaseSlides .ProjectCard");
    const ShowcasePrev = document.getElementById("ShowcasePrev");
    const ShowcaseNext = document.getElementById("ShowcaseNext");

    let ShowcaseCurrentType = "UEPlugins";
    let ShowcaseIndex = 0;

    function FilterShowcase(type) {
        const Visible = Array.from(ShowcaseCards).filter(c => c.dataset.type === type);
        ShowcaseCards.forEach(c => c.classList.remove("active"));
        if (Visible.length > 0) {
            Visible[0].classList.add("active");
            ShowcaseIndex = 0;
        }
    }

    ShowcaseTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            ShowcaseTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            ShowcaseCurrentType = tab.dataset.type;
            FilterShowcase(ShowcaseCurrentType);
        });
    });

    ShowcasePrev.onclick = () => {
        const Visible = Array.from(ShowcaseCards).filter(c => c.dataset.type === ShowcaseCurrentType);
        ShowcaseIndex = (ShowcaseIndex - 1 + Visible.length) % Visible.length;
        Visible.forEach((c, i) => c.classList.toggle("active", i === ShowcaseIndex));
    };

    ShowcaseNext.onclick = () => {
        const Visible = Array.from(ShowcaseCards).filter(c => c.dataset.type === ShowcaseCurrentType);
        ShowcaseIndex = (ShowcaseIndex + 1) % Visible.length;
        Visible.forEach((c, i) => c.classList.toggle("active", i === ShowcaseIndex));
    };

    // 默认显示第一个标签
    FilterShowcase(ShowcaseCurrentType);
});
