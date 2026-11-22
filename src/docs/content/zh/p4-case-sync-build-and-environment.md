---
title: 打包工具并复用依赖环境
type: doc
slug: p4-case-sync-build-and-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-case-sync
docPage:
  work: p4-case-sync
  group: workflows
  slug: build-and-environment
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/p4-case-sync/docs/build-and-environment/
lang: zh
translationKey: doc:p4-case-sync:build-and-environment
---

## 📦 打包（生成单文件 EXE）

本项目使用动态路径导入，需要通过 **spec 文件**指定隐藏导入。

### 推荐方式（使用 spec 文件）

```bash
pyinstaller P4CaseSync.spec
```

生成的 exe 位于 `dist/P4文件名大小写同步工具.exe`

### spec 文件说明

`P4CaseSync.spec` 已配置：
- 单文件打包（`--onefile`）
- 无控制台窗口（`--noconsole`）
- 隐藏导入模块：`LoginUI`, `MainUI`, `Core`
- 输出文件名：`P4文件名大小写同步工具`

如需修改配置（如文件名、图标），编辑 `P4CaseSync.spec` 文件：
- 修改名称：找到 `name='P4文件名大小写同步工具'` 这行
- 添加图标：将 `icon=None` 改为 `icon='icon.ico'`
- 显示控制台：将 `console=False` 改为 `console=True`（用于调试）

### ⚠️ 注意事项

**不要将**命令行参数与 spec 文件混用：
```bash
# ❌ 错误示例
pyinstaller -F -w P4CaseSync.spec  # 会报错

# ✅ 正确用法
pyinstaller P4CaseSync.spec
```

### 为什么需要 spec 文件？

本项目使用 `InjectSysPath()` 动态添加模块路径，PyInstaller 无法自动识别 `Source/UI` 和 `Source/Logic` 下的模块。spec 文件通过 `hiddenimports` 参数显式声明这些模块，确保打包成功。

---

## 🧪 开发者提示
- 颜色规则判断（最终版）：  
  1) 更改后 == 更改前 → 灰  
  2) 更改后 != 更改前 且 更改后 == 自动值 → 绿  
  3) 更改后 != 自动值 → 红  
- 双击**整行**弹出编辑框；编辑后立即刷新颜色  
- 一致性校验失败 → 自动尝试双步移动（临时名 → 目标名）再校验

---

## 🧰 导出与还原环境

> “minicode 虚拟环境”一般指 **Miniconda**。下面分别给出 **Conda** 与 **pip/venv** 两套方案。

### 方案 A：Conda（Miniconda/Anaconda）

**导出（推荐从历史，避免把无关包写进去）：**
```bash
# 当前激活 p4casesync 环境
conda env export > environment.yml
```

**还原：**
```bash
conda env create -f environment.yml
conda activate p4casesync
```

### 方案 B：pip + venv

**导出：**
```bash
# 激活你的 venv 后
pip freeze > requirements.txt
```

**还原：**
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---
