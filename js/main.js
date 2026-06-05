// ==================== 工作经历详情数据 ====================
const details = {
    freelance: {
        title: '自由职业 / 独立开发者',
        meta: '2025.01 - 至今',
        projects: [
            { name: '飞行汽车模拟器', time: '2025',
              desc: '面向未来出行的飞行汽车仿真系统',
              tasks: ['飞行与地面行驶双模态切换控制','物理模型驱动的飞行姿态与动力学模拟','座舱交互与 HUD 仪表系统'] },
            { name: '动捕机器人控制系统', time: '2025',
              desc: '基于动作捕捉的机器人实时控制方案',
              tasks: ['动捕数据采集与实时解析','UE 端机器人骨骼映射与动作同步','控制指令下发与反馈回路'] },
            { name: '六自由度运动平台控制', time: '2025',
              desc: 'Stewart 平台与 UE 仿真联动',
              tasks: ['平台姿态数据实时通信','UE 场景运动数据驱动平台响应','多自由度联动校准与调试'] },
            { name: '虚拟接待系统', time: '2025',
              desc: 'AI 数字人虚拟前台接待方案',
              tasks: ['基于 MetaHuman 的数字人交互','语音识别与智能对话集成','访客引导与信息展示'] },
            { name: '无人机仿真系统', time: '2025',
              tasks: ['无人机飞行控制与航线规划模拟','多机协同编队仿真','实时遥测数据可视化'] },
            { name: 'Fab 商业插件（17 款）', time: '2025.01 - 至今',
              tasks: ['网络通信系列：TCP Client/Server、UDP、WebSocket、SSH Tunnel','资产管理系列：Asset Cleaner、Asset Namer、Static Mesh Merger','自动化工具：Auto Enum、Config Exclude、Input Simulator 等','建立完整的插件开发模板与文档体系'] },
            { name: 'UE 效率工具链', time: '2025 - 至今',
              tasks: ['UEPluginAutoPacker：插件自动打包发布','UEPluginManager：多插件版本管理','P4StreamSwitcher：Perforce Stream 快速切换'] }
        ]
    },
    nino: {
        title: '北京尼诺时空文化科技有限公司',
        meta: 'Unreal 开发工程师 · 2023.02 - 2025.01',
        projects: [
            { name: '驾考模拟器自主学习系统', time: '2023.02 - 2025.01',
              desc: '科目二三模拟考试教学系统',
              tasks: ['使用芬兰团队 XVP 车辆物理模型，模拟真实操作反馈','自研插件并接入 MassAI 和 MetaHuman，模拟真实路人环境','改写引擎源码解决三屏 Lumen GI 光反射失效、曝光不一致等问题','接入并改写 Common UI 模块，提升 UI 管理效率'] },
            { name: 'AI 数字人交互演示', time: '2023.03 - 2023.05',
              tasks: ['基于 MetaHuman 构建数字人演示系统','本地部署完整 AI 流程（语音识别 → Chat → TTS → 表情驱动）','结合 Kinect + ControlRig 实现人体姿态捕捉与眼动追踪'] },
            { name: '海洋船舶模拟系统', time: '2024.05 - 2024.08',
              tasks: ['二次开发海洋插件，支持根据风力动态调整海浪参数','开发虚拟拍摄系统：结合 HTC、3D 打印控制器实现海面摄像回放','通过 LiveLink 将实时拍摄画面推送至平板供导演监控'] }
        ]
    },
    hongyu: {
        title: '北京弘宇飞拓科技有限公司',
        meta: 'Unreal 开发工程师 · 2021.07 - 2023.01',
        projects: [
            { name: '沈阳航空601所 - 无人机航母演示', time: '2021.05 - 2021.08',
              tasks: ['使用 LevelSequence 录制无人机起降、补给、维修完整流程','制作高质量航母 VR 展示视频'] },
            { name: '北京航空301所 - 导弹演示系统', time: '2021.07 - 2021.08',
              tasks: ['构建交互式军事基地，展示导弹结构与发射流程','使用 Timeline + Niagara 模拟发射路径与爆炸效果'] },
            { name: '北京陆军航空兵学院 - VR 训练系统', time: '2021.09 - 2022.09',
              tasks: ['为教学课目编写训练逻辑，实现学员端与教员端联动控制','接入飞行模拟器数据，支持实时同步学员操作与心率监控'] },
            { name: '北京商飞 - 飞机模型演示系统', time: '2022.08 - 2023.01',
              tasks: ['使用 DataTable + InstancedStaticMesh 实现飞机自动生成','支持交互式参数修改与装备选择'] }
        ]
    },
    youmi: {
        title: '北京悠米互动娱乐科技有限公司',
        meta: 'Unreal 开发工程师 · 2018.08 - 2021.02',
        projects: [
            { name: '《救赎之地》大逃杀MOBA手游', time: '2018.08 - 2021.02',
              desc: '客户端使用 UE4，服务器使用自建 C++ 游戏服务器',
              tasks: ['英雄技能模块：技能释放、冷却、隐藏、锁定逻辑','战斗伤害系统：伤害计算、死亡判定、减伤增伤机制','掉落系统：场景内掉落与拾取逻辑','交互系统：场景物品交互，如开门、开关、激活器等','坐骑系统：坐骑控制与角色同步机制','跳伞系统：单人 / 组队跳伞 + 同步跟随逻辑'] }
        ]
    }
};

// ==================== 页面切换 ====================
const pageHero = document.getElementById('pageHero');
const pageContent = document.getElementById('pageContent');
const backBtn = document.getElementById('backBtn');
let onContent = false, switching = false;

function goContent() {
    if (switching || onContent) return;
    switching = true; onContent = true;
    pageHero.classList.add('exit');
    pageContent.classList.add('active');
    backBtn.classList.add('visible');
    setTimeout(() => switching = false, 700);
}

function goHero() {
    if (switching || !onContent) return;
    switching = true; onContent = false;
    pageHero.classList.remove('exit');
    pageContent.classList.remove('active');
    backBtn.classList.remove('visible');
    setTimeout(() => switching = false, 700);
}

// Hero 页面滚轮 / 触摸进入正文
let touchStartY = 0;
pageHero.addEventListener('wheel', e => { if (e.deltaY > 30) goContent(); }, { passive: true });
pageHero.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
pageHero.addEventListener('touchend', e => { if (touchStartY - e.changedTouches[0].clientY > 50) goContent(); }, { passive: true });

// 正文顶部下拉回首页
const layoutBox = document.getElementById('layoutBox');
let cTouchY = 0;
layoutBox.addEventListener('touchstart', e => { cTouchY = e.touches[0].clientY; }, { passive: true });
layoutBox.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - cTouchY > 80 && layoutBox.scrollTop <= 0) goHero();
}, { passive: true });

// ==================== 详情页 ====================
const overlay = document.getElementById('detailOverlay');
const panel = document.getElementById('detailPanel');

function openDetail(key) {
    const d = details[key];
    if (!d) return;
    let html = `<div class="detail-back" onclick="closeDetail()">← 返回</div>`;
    html += `<div class="detail-title">${d.title}</div>`;
    html += `<div class="detail-meta">${d.meta}</div>`;
    d.projects.forEach(p => {
        html += `<div class="project"><h5>${p.name}</h5>`;
        html += `<div class="project-time">${p.time}</div>`;
        if (p.desc) html += `<div class="project-desc">${p.desc}</div>`;
        if (p.tasks) {
            html += '<ul>';
            p.tasks.forEach(t => html += `<li>${t}</li>`);
            html += '</ul>';
        }
        html += '</div>';
    });
    panel.innerHTML = html;
    panel.scrollTop = 0;
    overlay.classList.add('open');
}

function closeDetail(e) {
    if (e && e.target !== overlay && !e.target.classList.contains('detail-back')) return;
    overlay.classList.remove('open');
}

// ==================== 繁星星空 ====================
const sc = document.getElementById('stars-canvas');
const sctx = sc.getContext('2d');
const mc = document.getElementById('meteor-canvas');
const mctx = mc.getContext('2d');

function resize() {
    sc.width = mc.width = innerWidth;
    sc.height = mc.height = innerHeight;
}
resize();
addEventListener('resize', resize);

const stars = [], shooting = [];
for (let i = 0; i < 250; i++) {
    const r = Math.random();
    stars.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        s: Math.random() * 1.8,
        bo: Math.random() * .7 + .2,
        ts: Math.random() * .02 + .005,
        tp: Math.random() * Math.PI * 2,
        c: r < .7 ? [255,255,255] : r < .8 ? [200,220,255] : r < .9 ? [255,240,200] : [0,188,212]
    });
}

let t = 0, nextS = 80;
function drawStars() {
    sctx.clearRect(0, 0, sc.width, sc.height);
    t++;
    // 绘制星星
    stars.forEach(s => {
        const o = Math.max(.05, Math.min(1, s.bo + Math.sin(t * s.ts + s.tp) * .3));
        const [r, g, b] = s.c;
        if (s.s > 1.2) {
            sctx.beginPath(); sctx.arc(s.x, s.y, s.s * 3, 0, Math.PI * 2);
            sctx.fillStyle = `rgba(${r},${g},${b},${o * .08})`; sctx.fill();
        }
        sctx.beginPath(); sctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        sctx.fillStyle = `rgba(${r},${g},${b},${o})`; sctx.fill();
    });
    // 随机流星
    nextS--;
    if (nextS <= 0) {
        const a = Math.PI / 4 + (Math.random() - .5) * .3;
        shooting.push({ x: Math.random() * sc.width, y: Math.random() * sc.height * .4,
            len: Math.random() * 100 + 50, spd: Math.random() * 7 + 4,
            a, life: 1, dec: Math.random() * .015 + .008 });
        nextS = Math.random() * 200 + 80;
    }
    for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += Math.cos(s.a) * s.spd;
        s.y += Math.sin(s.a) * s.spd;
        s.life -= s.dec;
        if (s.life > 0) {
            const tx = s.x - Math.cos(s.a) * s.len;
            const ty = s.y - Math.sin(s.a) * s.len;
            const g = sctx.createLinearGradient(s.x, s.y, tx, ty);
            g.addColorStop(0, `rgba(255,255,255,${s.life})`);
            g.addColorStop(.3, `rgba(0,188,212,${s.life * .6})`);
            g.addColorStop(1, 'rgba(0,188,212,0)');
            sctx.beginPath(); sctx.moveTo(s.x, s.y); sctx.lineTo(tx, ty);
            sctx.strokeStyle = g; sctx.lineWidth = 1.5; sctx.stroke();
            sctx.beginPath(); sctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
            sctx.fillStyle = `rgba(255,255,255,${s.life})`; sctx.fill();
        } else {
            shooting.splice(i, 1);
        }
    }
    requestAnimationFrame(drawStars);
}
drawStars();

// ==================== 鼠标流星拖尾 ====================
let mouse = { x: -1e3, y: -1e3 };
const trail = [];

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > 35) trail.shift();
});

function drawMeteor() {
    mctx.clearRect(0, 0, mc.width, mc.height);
    if (trail.length > 1) {
        trail.forEach(p => p.life -= .025);
        while (trail.length && trail[0].life <= 0) trail.shift();
        // 拖尾线条
        for (let i = 1; i < trail.length; i++) {
            const p = trail[i - 1], q = trail[i], pr = i / trail.length;
            mctx.beginPath(); mctx.moveTo(p.x, p.y); mctx.lineTo(q.x, q.y);
            mctx.strokeStyle = `rgba(0,188,212,${pr * q.life * .8})`;
            mctx.lineWidth = pr * 3; mctx.lineCap = 'round'; mctx.stroke();
        }
        // 发光粒子
        trail.forEach((p, i) => {
            const pr = i / trail.length;
            if (Math.random() > .4) {
                mctx.beginPath();
                mctx.arc(p.x + (Math.random() - .5) * 8, p.y + (Math.random() - .5) * 8,
                    Math.random() * 1.5 * pr, 0, Math.PI * 2);
                mctx.fillStyle = `rgba(255,255,255,${p.life * pr * .6})`; mctx.fill();
            }
        });
    }
    // 鼠标头部光点
    if (mouse.x > 0) {
        const g = mctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 25);
        g.addColorStop(0, 'rgba(0,188,212,0.12)'); g.addColorStop(1, 'rgba(0,188,212,0)');
        mctx.beginPath(); mctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2);
        mctx.fillStyle = g; mctx.fill();
        mctx.beginPath(); mctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        mctx.fillStyle = 'rgba(255,255,255,0.85)'; mctx.fill();
    }
    requestAnimationFrame(drawMeteor);
}
drawMeteor();

// ==================== 打字机效果 ====================
const motto = '所有复杂，皆可封装；所有重复，皆可自动化';
const mottoEl = document.getElementById('mottoText');
let ci = 0;

function type() {
    if (ci < motto.length) {
        mottoEl.textContent += motto[ci++];
        setTimeout(type, 80 + Math.random() * 40);
    } else {
        setTimeout(() => document.getElementById('heroTitle').classList.add('show'), 300);
        setTimeout(() => document.getElementById('heroSub1').classList.add('show'), 700);
        setTimeout(() => document.getElementById('heroSub2').classList.add('show'), 1100);
        setTimeout(() => document.getElementById('heroTags').classList.add('show'), 1600);
        setTimeout(() => document.getElementById('enterBtn').classList.add('show'), 2200);
    }
}
setTimeout(type, 500);

// ==================== 动态数据 ====================
const y = new Date().getFullYear();
document.getElementById('age-info').textContent = y - 1997;
document.getElementById('exp-years').textContent = y - 2018;
document.getElementById('exp-years2').textContent = y - 2018;

// ==================== 滚动渐入 ====================
const obs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
}, { threshold: .1, root: layoutBox });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// ==================== 触摸设备兼容 ====================
if ('ontouchstart' in window) document.body.style.cursor = 'auto';
