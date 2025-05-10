const ContentArea = document.getElementById("ContentArea");
const HeroArea = document.getElementById("HeroArea");
const NavBar = document.getElementById("NavBar");
const NavItems = document.querySelectorAll("nav li");

async function loadPage(page) {
  const res = await fetch(`sections/${page}.html`);
  const html = await res.text();
  ContentArea.innerHTML = html;
  NavItems.forEach(li => li.classList.remove("active"));
  const active = document.querySelector(`nav li[data-page="${page}"]`);
  if (active) active.classList.add("active");

  if (page === "about") calculateInfo();
}

function switchToContent(page) {
  HeroArea.style.display = "none";
  ContentArea.style.display = "block";
  NavBar.style.display = "block";
  loadPage(page);
}

NavItems.forEach(li => {
  li.addEventListener("click", () => switchToContent(li.dataset.page));
});

// 动态计算年龄和工作经验
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
