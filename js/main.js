// ========== 全局变量 ==========
const sections = document.querySelectorAll('.fullpage-section');
const dots = document.querySelectorAll('.nav-dots .dot');
const scrollHint = document.querySelector('.scroll-hint');
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
  const ageElements = document.querySelectorAll('#age, #age-info');
  const expElements = document.querySelectorAll('#experience, #exp-info');

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

// ========== 更新当前section激活状态 ==========
function updateActiveSection(index) {
  sections.forEach((section, i) => {
    if (i === index) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
}

// ========== 滚动到指定section ==========
function scrollToSection(index) {
  if (index < 0 || index >= sections.length || isScrolling) return;

  isScrolling = true;
  currentSectionIndex = index;

  sections[index].scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  updateNavDots(index);
  updateActiveSection(index);
  updateNavButtons();

  // 隐藏滚动提示
  if (index > 0 && scrollHint) {
    scrollHint.classList.add('hidden');
  }

  // 重置滚动状态
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
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

// ========== 使用Intersection Observer监听section可见性 ==========
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(sections).indexOf(entry.target);
      currentSectionIndex = index;
      updateNavDots(index);
      updateActiveSection(index);
      updateNavButtons();

      // 隐藏滚动提示
      if (index > 0 && scrollHint) {
        scrollHint.classList.add('hidden');
      } else if (index === 0 && scrollHint) {
        scrollHint.classList.remove('hidden');
      }
    }
  });
}, observerOptions);

// 观察所有section
sections.forEach(section => {
  sectionObserver.observe(section);
});

// ========== 数字动画效果 ==========
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// 当第一屏激活时，触发数字动画
const heroSection = document.querySelector('.section-hero');
let hasAnimated = false;

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasAnimated) {
      hasAnimated = true;

      const workStartYear = 2018;
      const now = new Date();
      const exp = now.getFullYear() - workStartYear;

      // 动画更新数字
      setTimeout(() => {
        const expEl = document.querySelector('#experience');
        if (expEl) animateNumber(expEl, exp, 1500);
      }, 1800); // 延迟到统计卡片出现后
    }
  });
}, { threshold: 0.5 });

if (heroSection) {
  heroObserver.observe(heroSection);
}

// ========== 页面加载完成后初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
  // 计算年龄和经验
  calculateInfo();

  // 更新年份
  updateYear();

  // 初始化第一屏为激活状态
  updateNavDots(0);
  updateActiveSection(0);

  // 确保滚动到顶部
  window.scrollTo(0, 0);

  // 添加加载完成类，触发动画
  document.body.classList.add('loaded');
});

// ========== 防止页面刷新后自动滚动 ==========
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// ========== 处理URL hash导航（可选） ==========
function handleHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  const sectionMap = {
    '#hero': 0,
    '#about': 1,
    '#skills': 2,
    '#experience': 3,
    '#experience-1': 3,
    '#experience-2': 4,
    '#experience-3': 5,
    '#products': 6,
    '#contact': 7
  };

  const targetIndex = sectionMap[hash];
  if (targetIndex !== undefined) {
    setTimeout(() => {
      scrollToSection(targetIndex);
    }, 100);
  }
}

// 监听hash变化
window.addEventListener('hashchange', handleHashNavigation);

// 页面加载时检查hash
window.addEventListener('load', () => {
  handleHashNavigation();
});

// ========== 移除了工作经历内部滚动逻辑（已拆分为独立页面）==========

// ========== 性能优化：节流函数 ==========
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// ========== 调试信息（开发时可用） ==========
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🎉 全屏简历已加载');
  console.log('📱 支持功能：');
  console.log('  - 底部导航箭头按钮翻页');
  console.log('  - 底部导航点点击跳转');
  console.log('  - 鼠标滚轮/触摸滑动仅用于页面内浏览');
  console.log('  - 键盘 Home/End 快速跳转');
  console.log('  - URL Hash导航（#about, #skills等）');
}
