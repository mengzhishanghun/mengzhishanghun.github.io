// ✅ 启用 GFM + 自动换行支持（marked 初始化）
marked.setOptions({
  gfm: true,
  breaks: true
});

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
  if (page === "projects") loadProjectList();
  if (page === "blog") loadBlogList();
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

// ========== 项目功能 ==========

async function loadProjectList() {
  const res = await fetch("https://raw.githubusercontent.com/mengzhishanghun/MyProjects/main/index.md");
  const text = await res.text();
  const lines = text.split("\n");

  const filterEl = document.getElementById("ProjectFilter");
  const gridEl = document.getElementById("ProjectGrid");
  filterEl.innerHTML = "";
  gridEl.innerHTML = "";

  let currentCat = "未分类";
  const cats = new Set();
  const items = [];

  const linkReg = /^\-\s+\[([^\]]+)\]\(([^)]+)\)/;

  for (let line of lines) {
    if (line.startsWith("## ")) {
      currentCat = line.replace("## ", "").trim();
      cats.add(currentCat);
      continue;
    }

    const match = line.match(linkReg);
    if (match) {
      items.push({
        name: match[1],
        url: match[2],
        cat: currentCat
      });
    }
  }

  // 分类按钮
  [...cats].forEach((cat, idx) => {
    const span = document.createElement("span");
    span.className = "Tab" + (idx === 0 ? " active" : "");
    span.dataset.cat = cat;
    span.textContent = cat;
    span.onclick = () => {
      document.querySelectorAll("#ProjectFilter .Tab").forEach(t => t.classList.remove("active"));
      span.classList.add("active");
      filterProjects(cat);
    };
    filterEl.appendChild(span);

    if (idx < cats.size - 1) {
      const sep = document.createElement("span");
      sep.textContent = " | ";
      filterEl.appendChild(sep);
    }
  });

  // 加载所有项目详情
  for (let item of items) {
    try {
      const res = await fetch(item.url);
      const md = await res.text();
      const lines = md.split("\n");

      let intro = "";
      let link = "";
      let features = [];
      let section = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("## ")) {
          section = line.replace("## ", "").trim();
          continue;
        }

        if (section === "简介" && intro === "" && line && !line.startsWith("#")) {
          intro = line;
        }

        if (section === "链接" && link === "" && line && !line.startsWith("#")) {
          const mdLinkMatch = line.match(/\[.*?\]\((.*?)\)/);
          link = mdLinkMatch ? mdLinkMatch[1] : line;
        }

        if (section === "特性" && line.startsWith("-")) {
          features.push(line.replace(/^-/, "").trim());
        }
      }

      // 构建卡片
      const card = document.createElement(link ? "a" : "div");
      card.className = "ProjectCard";
      card.dataset.cat = item.cat;
      if (link) {
        card.href = link;
        card.target = "_blank";
      }

      const html = `
        <div>
          <h3 class="ProjectTitle">${item.name}</h3>
          <p class="ProjectIntro">${intro}</p>
          <ul>${features.map(f => `<li>${f}</li>`).join("")}</ul>
        </div>
      `;

      card.innerHTML = html;
      gridEl.appendChild(card);

    } catch (err) {
      console.error(`❌ 无法加载项目：${item.name}`, err);
    }
  }

  // 默认只显示第一个分类
  filterProjects([...cats][0]);
}

function filterProjects(cat) {
  document.querySelectorAll('.ProjectCard').forEach(card => {
    card.style.display = (card.dataset.cat === cat) ? 'flex' : 'none';
  });
}

// ========== 博客功能 ==========

async function loadBlogList() {
  const res = await fetch("https://raw.githubusercontent.com/mengzhishanghun/MyBlog/main/index.md");
  const text = await res.text();
  const lines = text.split("\n");

  const filterEl = document.getElementById("BlogFilter");
  const listEl = document.getElementById("BlogList");
  filterEl.innerHTML = "";
  listEl.innerHTML = "";

  let currentCat = "未分类";
  const cats = new Set();
  const posts = [];

  const postReg = /^-\s+(\d{4}-\d{2}-\d{2})\s+–\s+\[([^\]]+)]\(([^)]+)\)/;

  for (let line of lines) {
    if (line.startsWith("## ")) {
      currentCat = line.replace("## ", "").trim();
      cats.add(currentCat);
      continue;
    }

    const match = line.match(postReg);
    if (match) {
      posts.push({
        date: match[1],
        title: match[2],
        url: match[3],
        cat: currentCat
      });
    }
  }

  [...cats].forEach((cat, idx) => {
    const span = document.createElement("span");
    span.className = "Tab" + (idx === 0 ? " active" : "");
    span.dataset.cat = cat;
    span.textContent = cat;
    span.onclick = () => {
      document.querySelectorAll("#BlogFilter .Tab").forEach(t => t.classList.remove("active"));
      span.classList.add("active");
      filterPosts(cat);
    };
    filterEl.appendChild(span);

    if (idx < cats.size - 1) {
      const sep = document.createElement("span");
      sep.textContent = " | ";
      filterEl.appendChild(sep);
    }
  });

  posts.forEach(post => {
    const li = document.createElement("li");
    li.dataset.cat = post.cat;
    li.innerHTML = `
      <a href="javascript:void(0)" onclick="loadBlogPost('${post.title}', '${post.url}')">${post.title}</a>
      <span class="PostDate">${post.date}</span>
    `;
    listEl.appendChild(li);
  });

  filterPosts([...cats][0]);
}

function filterPosts(cat) {
  document.querySelectorAll('#BlogList li').forEach(li => {
    li.style.display = (li.dataset.cat === cat) ? 'flex' : 'none';
  });
}

async function loadBlogPost(title, url) {
  const res = await fetch(url);
  let md = await res.text();

  md = md.replace(/^> /gm, '\n> ');

  const basePath = url.substring(0, url.lastIndexOf("/") + 1);
  md = md.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    const fullUrl = src.startsWith("http") ? src : basePath + src;
    return `![${alt}](${fullUrl})`;
  });

  const html = marked.parse(md);

  document.getElementById("BlogMainView").style.display = "none";
  document.getElementById("BlogDetailView").style.display = "block";
  document.getElementById("BlogContent").innerHTML = `<h2>${title}</h2>` + html;
}

function backToBlogList() {
  document.getElementById("BlogMainView").style.display = "block";
  document.getElementById("BlogDetailView").style.display = "none";
}

// 自动设置当前年份（用于 footer）
const YearEl = document.getElementById("Year");
if (YearEl) {
  YearEl.textContent = new Date().getFullYear();
}
