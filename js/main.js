const ContentArea = document.getElementById("ContentArea");
const HeroArea = document.getElementById("HeroArea");
const NavBar = document.getElementById("NavBar");
const NavItems = document.querySelectorAll("nav li");

// 加载页面内容
async function loadPage(page) {
  const res = await fetch(`sections/${page}.html`);
  const html = await res.text();
  ContentArea.innerHTML = html;

  NavItems.forEach(li => li.classList.remove("active"));
  const active = document.querySelector(`nav li[data-page="${page}"]`);
  if (active) active.classList.add("active");

  if (page === "about") calculateInfo();
  if (page === "projects") setupProjectFilter();
}

// 切换到内容区域
function switchToContent(page) {
  HeroArea.style.display = "none";
  ContentArea.style.display = "block";
  NavBar.style.display = "block";
  loadPage(page);
}

// 点击导航加载页面
NavItems.forEach(li => {
  li.addEventListener("click", () => switchToContent(li.dataset.page));
});

// 动态计算年龄和经验
function calculateInfo() {
  const birthYear = 1997;
  const workStartYear = 2018;
  const now = new Date();
  const age = now.getFullYear() - birthYear;
  const exp = now.getFullYear() - workStartYear;

  const ageEl = document.getElementById("Age");
  const expEl = document.getElementById("Experience");

  if (ageEl) ageEl.textContent = `${age} 岁`;
  if (expEl) expEl.textContent = `${exp} 年`;
}

// 设置作品分类过滤
function setupProjectFilter() {
  const tabs = document.querySelectorAll('.ProjectTabs .Tab');
  const cards = document.querySelectorAll('.ProjectCard');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      cards.forEach(card => {
        card.style.display = (card.dataset.cat === cat) ? 'block' : 'none';
      });
    });
  });
}
