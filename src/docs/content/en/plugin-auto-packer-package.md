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
sourceHash: 95bd20f710ecb9e01896559721df8f5cdcef2862c7700c34d7872d9d5e9db32b
translationStatus: translated
generatedBodyHash: 58843f7d411d3dc513789024671c9a51510b7d643120f38e15e499b9c59bd2ee
docPage:
  work: plugin-auto-packer
  group: packaging
  slug: package
  order: 1
---

## Supported Platform and Plugin Requirements

- Only Windows plugin builds (Win64) are supported
- Mac / Linux are currently unsupported
- The plugin directory must follow the expected structure and contain a `.uplugin` file

## Configure Engines and Post-processing

In the GUI, add engine paths from the Epic Games Launcher or a source build. Choose the plugin and target engines, then select any post-processing options you need.

| Feature | Purpose |
|-----------------------------|--------------------------------------------------------------------|
| Add engine path | Register multiple UE engines for packaging |
| Plugin selection | Automatically detect `.uplugin` files in the project |
| Convert MarketplaceURL | Change the `.uplugin` field to `FabURL` |
| Delete Binaries / Intermediate | Clean redundant intermediate artifacts |
| Copy README / Docs | Copy project documentation into the plugin directory |
| Generate FilterPlugin.ini | Scan files/folders in the plugin root and generate publication `.ini` filter configuration |
| Add copyright notices | Insert notices using the author from `.uplugin`, replace old comments, and cover all `.h/.cpp/.Build.cs` files; automatically skip the `ThredParty` folder |

Each operation can be selected separately or combined. The log includes the generated copyright text and ini contents.

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
