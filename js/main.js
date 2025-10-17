// ========== 全局变量 ==========
const sections = document.querySelectorAll('.fullpage-section');
const dots = document.querySelectorAll('.nav-dots .dot');
let currentSectionIndex = 0;
let isScrolling = false;

// ========== 计算年龄和工作经验 ==========
function calculateInfo() {
  const birthYear = 1997;
  const workStartYear = 2018;
  const now = new Date();
  const age = now.getFullYear() - birthYear;
  const exp = now.getFullYear() - workStartYear;

  // 更新所有年龄和经验显示
  const ageElements = document.querySelectorAll('#age-info');
  const expElements = document.querySelectorAll('#exp-years');

  ageElements.forEach(el => {
    if (el) el.textContent = age;
  });

  expElements.forEach(el => {
    if (el) el.textContent = exp;
  });
}

// ========== 更新页脚年份 ==========
function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ========== 更新导航点状态 ==========
function updateNavDots(index) {
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ========== 更新当前section激活状态（左右切换效果）==========
function updateActiveSection(index) {
  sections.forEach((section, i) => {
    section.classList.remove('active', 'prev');

    if (i === index) {
      section.classList.add('active');
    } else if (i < index) {
      section.classList.add('prev');
    }
    // i > index 的保持默认状态（在右侧）
  });
}

// ========== 滚动到指定section（使用CSS transform实现左右切换）==========
function scrollToSection(index) {
  if (index < 0 || index >= sections.length || isScrolling) return;

  isScrolling = true;
  currentSectionIndex = index;

  updateNavDots(index);
  updateActiveSection(index);
  updateNavButtons();

  // 重置滚动状态（等待动画完成）
  setTimeout(() => {
    isScrolling = false;
  }, 600); // 与CSS transition时间一致
}

// ========== 监听导航点点击 ==========
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    scrollToSection(index);
  });
});

// ========== 监听导航箭头按钮点击 ==========
const prevBtn = document.querySelector('.nav-prev');
const nextBtn = document.querySelector('.nav-next');

// 更新箭头按钮状态
function updateNavButtons() {
  if (prevBtn) {
    prevBtn.disabled = currentSectionIndex === 0;
  }
  if (nextBtn) {
    nextBtn.disabled = currentSectionIndex === sections.length - 1;
  }
}

// 上一页
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1);
    }
  });
}

// 下一页
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1);
    }
  });
}

// 初始化按钮状态
updateNavButtons();

// ========== 鼠标滚轮只用于页面内滚动，不再翻页 ==========
// 移除了滚轮翻页逻辑，滚轮现在只用于浏览页面内容

// ========== 移除触摸滑动翻页逻辑 ==========
// 触摸滑动现在只用于页面内滚动，不再翻页

// ========== 监听键盘事件（保留上下箭头用于页面内滚动）==========
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Home':
      e.preventDefault();
      scrollToSection(0);
      break;
    case 'End':
      e.preventDefault();
      scrollToSection(sections.length - 1);
      break;
    // 移除了上下左右箭头翻页，保留用于页面内滚动
  }
});

// ========== 页面加载完成后初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
  // 计算年龄和经验
  calculateInfo();

  // 更新年份
  updateYear();

  // 初始化第一屏为激活状态
  updateNavDots(0);
  updateActiveSection(0);
  updateNavButtons();

});

// ========== 防止页面刷新后自动滚动 ==========
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ========== 调试信息（开发时可用） ==========
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🎉 全屏简历已加载');
  console.log('📱 支持功能：');
  console.log('  - 底部导航箭头按钮翻页');
  console.log('  - 底部导航点点击跳转');
  console.log('  - 鼠标滚轮/触摸滑动仅用于页面内浏览');
  console.log('  - 键盘 Home/End 快速跳转');
}
