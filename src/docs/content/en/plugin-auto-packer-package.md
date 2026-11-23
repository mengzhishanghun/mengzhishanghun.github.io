---
title: Configure and Package Plugins
type: doc
slug: plugin-auto-packer-package
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Packaging
workIds:
  - plugin-auto-packer
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/package/
lang: en
translationKey: doc:plugin-auto-packer:package
sourceHash: 42ccc547fc2dd29853703863c22ac3d51ea49c0d3fed229c494c4067ab383cf3
translationStatus: translated
generatedBodyHash: 7ef73856dfc038dfacb82b561959aa0e7af6a7bb24c8dae5601327860fa053cb
docPage:
  work: plugin-auto-packer
  group: features
  slug: package
  order: 1
---

## Supported Platform and Plugin Requirements

- Only Windows plugin builds (Win64) are supported
- Mac / Linux are currently unsupported
- The plugin directory must follow the expected structure and contain a `.uplugin` file

## Configure Engines and Post-processing

In the GUI, add the paths to your Launcher-installed or source-built engines. The tool scans the project for `.uplugin` files. Select a plugin from the results and choose the target engines. You can use the options below on their own or together. Check which files you intend to process before enabling options that change the plugin descriptor or source files.

| Feature | Purpose |
|-----------------------------|--------------------------------------------------------------------|
| Add engine path | Register multiple UE engines for packaging |
| Plugin selection | Automatically detect `.uplugin` files in the project |
| Convert MarketplaceURL | Change the `.uplugin` field to `FabURL` |
| Delete Binaries / Intermediate | Clean redundant intermediate artifacts |
| Copy README / Docs | Copy project documentation into the plugin directory |
| Generate FilterPlugin.ini | Scan files/folders in the plugin root and generate publication `.ini` filter configuration |
| Add copyright notices | Insert notices using the author from `.uplugin`, replace old comments, and cover all `.h/.cpp/.Build.cs` files; automatically skip the `ThredParty` folder |

If you generate copyright notices or an ini file, you can read the generated text in the log.

## Package from the Command Line

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
