---
title: P4CaseSync User Manual
description: Complete English product manual for P4CaseSync
type: doc
slug: p4-case-sync
categoryId: open-source-tools
categoryName: Open Source Tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /docs/zh/tools/p4-case-sync/
lang: en
translationKey: p4-case-sync
sourceHash: d6d0056d5edfa9eafadc6cecd92b1345a02a27e7c68f6d0f49568b4b79eb711c
translationStatus: translated
generatedBodyHash: d3695cfa5030e2364218ebb4108b628f90adb868defe289b382a7677c642a6f4
---

# P4CaseSync

**P4CaseSync** is a small tool that synchronizes and corrects **path and filename capitalization before Perforce submission**.  
On Windows, P4 often weakens case distinctions, causing uploaded directories and files to become lowercase. This tool corrects files in `p4 opened` using **actual capitalization on the local disk**, allows manual adjustments, and applies changes as `p4 move` operations in one click.

## ✨ Features
- Scans opened files in a Changelist (or default)
- Uses `p4 where` mapping and reads **actual local capitalization**, correcting each level of the entire path
- Color-coded list for easy identification  
  - **Gray**: Before and after are identical; no change needed  
  - **Green**: Matches the automatically corrected value  
  - **Red**: Manually edited by the user and differs from the automatic value  
- Double-click the **entire row** to open a centered edit dialog
- Performs a **consistency check** after applying changes; if inconsistent, automatically tries a two-step move fallback, and reports failure if inconsistency remains
- Shows only `edit / add / move/add`, automatically hiding deletion actions

## 🖼 Interface Tips
- The top shows a **color legend** and an “Only show files needing changes” toggle  
- Rows show “Before / After”; double-click a row to edit “After”

## 🔧 Requirements
- Windows (recommended)  
- Python 3.8+  
- Installed **Perforce CLI** `p4`, available from the command line  
- Tkinter (included with Python)  
- PyInstaller (optional for development/packaging)

---

## 🚀 Quick Start

### 1) Clone and Enter the Directory
```bash
git clone https://github.com/<your-org-or-user>/P4CaseSync.git
cd P4CaseSync
```

### 2) Install Dependencies (Choose One)

#### A. Miniconda / Anaconda (Recommended)
```bash
# 新建环境（示例用 python 3.11）
conda create -n p4casesync python=3.11 -y
conda activate p4casesync

# 安装打包所需（运行本工具本身无需第三方包；打包需要 PyInstaller）
pip install -r requirements.txt
# 如果你没有 requirements.txt，可先： pip install pyinstaller
```

#### B. Built-In venv + pip
```bash
# Windows PowerShell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> Note: Running the project requires only the standard library and `p4`; `requirements.txt` generally needs only `pyinstaller` for packaging.  
> If the file is missing, create one containing only:  
> ```
> pyinstaller>=6
> ```

### 3) Run
```bash
# 在激活环境下
python Main.py
```

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

## 🧭 Usage Steps
1. Open the tool and select the **Changelist** to process (default: `default`).  
2. The tool lists files automatically:  
   - **Gray**: Before and after match; skipped  
   - **Green**: Automatically corrected to actual local capitalization  
   - **Red**: Manually edited and differs from the automatic value  
3. To adjust a path, double-click its row and edit the “After” path in the dialog.  
4. Click **Apply Changes**: the tool runs `p4 move` sequentially and checks consistency, using the two-step move fallback if necessary.  
5. Submit normally in P4V or from the command line.

---

## ❓ Frequently Asked Questions (FAQ)

**Q1: Why do large gray bars or ghosting appear?**  
A: This has been fixed. Refreshing the list destroys all child widgets, including separators, to prevent remnants.

**Q2: Why is “X” sometimes shown instead of “✔”?**  
A: This depends on the system theme. Windows `vista/xpnative` themes are preferred. Custom icons are another option if needed.

**Q3: What if the local path does not exist?**  
A: The tool corrects capitalization through the deepest accessible parent directory where possible. Unresolvable portions remain unchanged and can be edited manually.

**Q4: What if submission includes deletion actions?**  
A: Deletion actions (`delete/move/delete`) are **filtered** by default; only `edit/add/move/add` are shown.

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

## 📄 License
MIT License

---

## 🙌 Acknowledgments
Thanks to all developers using and providing feedback on **P4CaseSync**. Open an Issue for problems or contribute improvements through a PR.
