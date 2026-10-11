---
title: UEPluginAutoPacker User Manual
description: Complete English product manual for UEPluginAutoPacker
type: doc
slug: plugin-auto-packer
categoryId: open-source-tools
categoryName: Open Source Tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Packaging
workIds:
  - plugin-auto-packer
documentKind: product-manual
websiteRoute: /docs/zh/tools/plugin-auto-packer/
lang: en
translationKey: plugin-auto-packer
sourceHash: c1e486ef6a34a3432251405376d1389a9af4f1176e52654e1bc7a532f389c405
translationStatus: translated
generatedBodyHash: ea756910f69288e6ae7e96fb89991428d2c1eb81c57533c9f4b70ef78db88867
---

# 🎮 UE Multi-Version Plugin Packer

A graphical tool for **packaging plugins for multiple Unreal Engine versions in one click**, helping plugin developers quickly build installation packages for multiple engine versions.
It supports packaging log viewing, Fab organization, and automated file filtering to improve packaging efficiency and consistency.

---

## 🚀 Highlights

- Add multiple Unreal Engine installation paths, including Launcher and source builds
- Status icons for each engine: waiting, packaging, ✅ success, ❌ failure, ➖ canceled
- Simple graphical interface with live logs; click to switch between engine logs
- Optional Fab plugin organization: clean intermediate files, copy documentation, generate FilterPlugin.ini, and more
- Reads author information from `.uplugin` and automatically adds copyright notices to each source file

---

## ⚙️ How to Use

### ✅ Method 1: `.exe` (Recommended)
1. Download `UEPluginPacker.exe` from the Releases page
2. Place it in your Unreal project root, containing the `.uproject` file
3. Double-click to run; no command-line or environment configuration is required

### 🧑‍💻 Method 2: Run from Source
1. Clone this repository
2. Install Python 3.8+ (Miniconda recommended)
3. Install dependencies and run:

```bash
conda env create -f environment.yml
conda activate UEPluginAutoPacker
pip install -r requirements.txt
python Main.py
```

### ⌨️ Method 3: Command Line (CLI)

Place `UEPluginPacker.exe` in the project root. Running without arguments opens the GUI; arguments activate CLI mode:

```bat
:: 列出已在 GUI 中配置的引擎
UEPluginPacker.exe engines

:: 列出项目下的插件
UEPluginPacker.exe plugins

:: 对勾选的引擎打包（等同于 GUI 点击“打包”）
UEPluginPacker.exe build MyPlugin

:: 只打指定引擎
UEPluginPacker.exe build MyPlugin --engines 5.2,5.5,5.7

:: 打所有已配置的引擎
UEPluginPacker.exe build MyPlugin --all

:: 只看是否能编译，跳过 Fab 后处理
UEPluginPacker.exe build MyPlugin --all --no-post

:: 自定义输出目录
UEPluginPacker.exe build MyPlugin --engines 5.5 --output D:\temp\out
```

Exit codes: `0` all successful; `1` partial failure; `2` invalid arguments or configuration; `130` user Ctrl+C.

> ⚠️ The engine list is still maintained through the GUI. After adding engines there once, CLI can read the list; CLI does not add or remove engines.

---

## 💡 What Each Feature Does

| Feature | Purpose |
|-----------------------------|--------------------------------------------------------------------|
| Add engine path | Register multiple UE engines for packaging |
| Plugin selection | Automatically detect `.uplugin` files in the project |
| Convert MarketplaceURL | Change the `.uplugin` field to `FabURL` |
| Delete Binaries / Intermediate | Clean redundant intermediate artifacts |
| Copy README / Docs | Copy project documentation into the plugin directory |
| Generate FilterPlugin.ini | Scan files/folders in the plugin root and generate publication `.ini` filter configuration |
| Add copyright notices | Insert notices using the author from `.uplugin`, replace old comments, and cover all `.h/.cpp/.Build.cs` files; automatically skip the ThredParty folder |
|

Each operation can be selected separately or combined. Logs show detailed results, including generated copyright text and ini contents.

---

## 📤 Packaging Output

- Plugins are packaged under `PackagedPlugins/插件名/引擎名/`
- With automatic organization enabled, the plugin includes cleaned files and generated configuration
- Packaging failures produce `Failed.log` in the corresponding directory

---

## ⚠️ Current Limitations

- Only Windows plugin builds (Win64) are supported
- Mac / Linux are currently unsupported
- The plugin directory must follow the expected structure and contain a `.uplugin` file

---

## 📄 License

This project is open source under the [MIT License](./LICENSE). You are welcome to use, modify, and distribute it.

---

## 📬 Contact

Author email: **mengzhishanghun@outlook.com**  
Contact me for custom functionality or collaboration!
