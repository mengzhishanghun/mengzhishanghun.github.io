---
title: Build the Tool and Reuse Its Environment
type: doc
slug: p4-case-sync-build-and-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/build-and-environment/
lang: en
translationKey: doc:p4-case-sync:build-and-environment
sourceHash: baea533173c0bfb2f3b73f70ad2d5fbd5940997f6b65000ca826baf59a4cc6f9
translationStatus: translated
generatedBodyHash: 7753189517663453a4627a4ea682d0eb34a30d952e56c0540e943debddfbd205
docPage:
  work: p4-case-sync
  group: workflows
  slug: build-and-environment
  order: 2
---

## 📦 Packaging (Single-File EXE)

This project uses dynamic path imports, so hidden imports must be specified through a **spec file**.

### Recommended Method (Spec File)

```bash
pyinstaller P4CaseSync.spec
```

The generated executable is at `dist/P4文件名大小写同步工具.exe`

### Spec File Details

`P4CaseSync.spec` is configured for:
- Single-file packaging (`--onefile`)
- No console window (`--noconsole`)
- Hidden imports: `LoginUI`, `MainUI`, `Core`
- Output filename: `P4文件名大小写同步工具`

To change settings such as filename or icon, edit `P4CaseSync.spec`:
- Rename: Find the line `name='P4文件名大小写同步工具'`
- Add an icon: Change `icon=None` to `icon='icon.ico'`
- Show the console: Change `console=False` to `console=True` for debugging

### ⚠️ Notes

**Do not mix** command-line packaging options with a spec file:
```bash
# ❌ 错误示例
pyinstaller -F -w P4CaseSync.spec  # 会报错

# ✅ 正确用法
pyinstaller P4CaseSync.spec
```

### Why Is a Spec File Required?

The project uses `InjectSysPath()` to add module paths dynamically. PyInstaller cannot automatically identify modules under `Source/UI` and `Source/Logic`. The spec file explicitly declares these modules through `hiddenimports` to ensure packaging succeeds.

---

## 🧪 Developer Tips
- Color decision rules (final version):  
  1) After == Before → Gray  
  2) After != Before and After == Automatic value → Green  
  3) After != Automatic value → Red  
- Double-click the **entire row** to edit; colors refresh immediately afterward  
- Consistency check failure → Automatically try a two-step move (temporary name → target name), then check again

---

## 🧰 Exporting and Restoring Environments

> “Minicode virtual environment” usually refers to **Miniconda**. Both **Conda** and **pip/venv** approaches are provided below.

### Option A: Conda (Miniconda/Anaconda)

**Export (prefer history to avoid unrelated packages):**
```bash
# 当前激活 p4casesync 环境
conda env export > environment.yml
```

**Restore:**
```bash
conda env create -f environment.yml
conda activate p4casesync
```

### Option B: pip + venv

**Export:**
```bash
# 激活你的 venv 后
pip freeze > requirements.txt
```

**Restore:**
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
