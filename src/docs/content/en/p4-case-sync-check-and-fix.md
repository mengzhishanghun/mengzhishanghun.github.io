---
title: Check and Fix Filename Case
type: doc
slug: p4-case-sync-check-and-fix
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/check-and-fix/
lang: en
translationKey: doc:p4-case-sync:check-and-fix
sourceHash: 6c0cc89f1d0ca1087c4eeb70e9c4d2ed597cee2614e0f9a00899b5085848a1b0
translationStatus: translated
generatedBodyHash: b1f21bee36e0a3c7bf5f78fe03480c0268c2cb9d1b49a6f1feb99c0302a16ef4
docPage:
  work: p4-case-sync
  group: workflows
  slug: check-and-fix
  order: 1
---

**P4CaseSync** is a small tool that synchronizes and corrects **path and filename capitalization before Perforce submission**.  
On Windows, P4 often weakens case distinctions, causing uploaded directories and files to become lowercase. This tool corrects the file paths listed by `p4 opened` using **actual capitalization on the local disk**, allows manual adjustments, and applies changes as `p4 move` operations in one click.

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

## 📄 License
MIT License

---

## 🙌 Acknowledgments
Thanks to all developers using and providing feedback on **P4CaseSync**. Open an Issue for problems or contribute improvements through a PR.
