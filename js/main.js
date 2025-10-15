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

// ========== 监听鼠标滚轮 ==========
let lastScrollTime = 0;
const scrollDelay = 1000; // 防抖延迟

function handleWheel(e) {
  const now = Date.now();
  if (now - lastScrollTime < scrollDelay) return;

  if (e.deltaY > 0) {
    // 向下滚动
    if (currentSectionIndex < sections.length - 1) {
      lastScrollTime = now;
      scrollToSection(currentSectionIndex + 1);
    }
  } else {
    // 向上滚动
    if (currentSectionIndex > 0) {
      lastScrollTime = now;
      scrollToSection(currentSectionIndex - 1);
    }
  }
}

// 使用被动监听器优化性能
document.addEventListener('wheel', handleWheel, { passive: true });

// ========== 监听触摸事件（移动端） ==========
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let isTouching = false;

document.addEventListener('touchstart', (e) => {
  // 检查是否在可滚动元素内
  const target = e.target;
  const scrollableContent = target.closest('.section-content.scrollable');

  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
  isTouching = true;

  // 如果不在可滚动元素内，阻止默认滚动
  if (!scrollableContent) {
    // 不阻止，让浏览器处理
  }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (!isTouching) return;

  const target = e.target;
  const scrollableContent = target.closest('.section-content.scrollable');

  // 如果在可滚动内容内，允许滚动
  if (scrollableContent) {
    return;
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!isTouching) return;

  touchEndY = e.changedTouches[0].clientY;
  const touchDuration = Date.now() - touchStartTime;
  isTouching = false;

  // 检查是否在可滚动元素内
  const target = e.target;
  const scrollableContent = target.closest('.section-content.scrollable');

  // 如果在可滚动元素内，不触发页面切换
  if (!scrollableContent) {
    handleSwipe(touchDuration);
  }
}, { passive: true });

function handleSwipe(duration) {
  const swipeDistance = touchStartY - touchEndY;
  const minSwipeDistance = 50;
  const maxSwipeDuration = 500; // 快速滑动的最大时长

  if (Math.abs(swipeDistance) < minSwipeDistance) return;

  // 快速滑动或长距离滑动都可以触发
  const isQuickSwipe = duration < maxSwipeDuration;
  const isLongSwipe = Math.abs(swipeDistance) > 100;

  if (!isQuickSwipe && !isLongSwipe) return;

  if (swipeDistance > 0) {
    // 向上滑动（下一页）
    if (currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1);
    }
  } else {
    // 向下滑动（上一页）
    if (currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1);
    }
  }
}

// ========== 监听键盘事件 ==========
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowDown':
    case 'PageDown':
    case ' ': // 空格键
      e.preventDefault();
      if (currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
      }
      break;
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      if (currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
      }
      break;
    case 'Home':
      e.preventDefault();
      scrollToSection(0);
      break;
    case 'End':
      e.preventDefault();
      scrollToSection(sections.length - 1);
      break;
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
  console.log('  - 鼠标滚轮切换页面');
  console.log('  - 触摸滑动切换页面（移动端）');
  console.log('  - 键盘方向键/PageUp/PageDown/Home/End');
  console.log('  - 侧边导航点点击');
  console.log('  - URL Hash导航（#about, #skills等）');
}
