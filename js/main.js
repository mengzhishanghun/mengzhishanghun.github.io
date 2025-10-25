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
  const navControl = document.querySelector('.nav-control');

  // 第1页隐藏导航控制条
  if (index === 0) {
    if (navControl) {
      navControl.style.opacity = '0';
      navControl.style.pointerEvents = 'none';
    }
  } else {
    if (navControl) {
      navControl.style.opacity = '1';
      navControl.style.pointerEvents = 'auto';
    }
  }

  // 更新导航点状态（第2-4页对应索引1-3，显示为导航点0-2）
  dots.forEach((dot, i) => {
    // 第1页不显示任何激活点
    if (index === 0) {
      dot.classList.remove('active');
      return;
    }

    // 第2-4页（索引1-3）对应导航点0-2
    if (i === index - 1) {
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

// ========== 循环滚动（仅在第2-4页之间循环）==========
function scrollToSectionWithLoop(direction) {
  if (isScrolling) return;

  let nextIndex = currentSectionIndex;

  if (direction === 'next') {
    // 如果在第1页，跳到第2页
    if (currentSectionIndex === 0) {
      nextIndex = 1;
    }
    // 如果在第2-3页，正常前进
    else if (currentSectionIndex < sections.length - 1) {
      nextIndex = currentSectionIndex + 1;
    }
    // 如果在第4页（最后一页），循环回第2页
    else {
      nextIndex = 1;
    }
  } else if (direction === 'prev') {
    // 如果在第1页，不能后退
    if (currentSectionIndex === 0) {
      return;
    }
    // 如果在第2页，不能回到第1页（第2-4页循环），跳到第4页
    else if (currentSectionIndex === 1) {
      nextIndex = sections.length - 1;
    }
    // 如果在第3-4页，正常后退
    else {
      nextIndex = currentSectionIndex - 1;
    }
  }

  scrollToSection(nextIndex);
}

// ========== 监听导航点点击 ==========
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    // 导航点索引0-2对应第2-4页（section索引1-3）
    scrollToSection(index + 1);
  });
});

// ========== 监听导航箭头按钮点击 ==========
const prevBtn = document.querySelector('.nav-prev');
const nextBtn = document.querySelector('.nav-next');

// 更新箭头按钮状态
function updateNavButtons() {
  if (prevBtn) {
    // 只在第1页时禁用后退按钮
    prevBtn.disabled = currentSectionIndex === 0;
  }
  if (nextBtn) {
    // 永远不禁用前进按钮（第4页会循环回第2页）
    nextBtn.disabled = false;
  }
}

// 上一页
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    scrollToSectionWithLoop('prev');
  });
}

// 下一页
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    scrollToSectionWithLoop('next');
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
