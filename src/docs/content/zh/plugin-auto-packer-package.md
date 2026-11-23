---
title: 配置并打包插件
type: doc
slug: plugin-auto-packer-package
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 打包
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: features
  slug: package
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/package/
lang: zh
translationKey: doc:plugin-auto-packer:package
---

## 支持的平台与插件要求

- 仅支持构建 Windows 平台插件（Win64）
- 暂不支持 Mac / Linux
- 插件目录需规范，必须包含 `.uplugin` 文件

## 配置引擎与整理选项

先在图形界面添加 Launcher 或源码版引擎的路径。工具会检测项目中的 `.uplugin`，再从检测结果中选择要打包的插件，勾选目标引擎。下面的整理选项可单独使用，也可组合使用；开启会修改插件描述或源文件的选项前，先核对本次要处理的文件。

| 功能项                      | 用途说明                                                               |
|-----------------------------|--------------------------------------------------------------------|
| 添加引擎路径               | 注册多个 UE 引擎用于打包                                                     |
| 插件选择                   | 自动检测项目中的 `.uplugin`                                                |
| 转换 MarketplaceURL        | 修改 `.uplugin` 字段为 `FabURL`                                         |
| 删除 Binaries / Intermediate | 清理冗余中间产物                                                           |
| 拷贝 README / Docs         | 将工程文档复制到插件目录                                                       |
| 自动生成 FilterPlugin.ini  | 自动扫描插件根目录下的文件/文件夹，生成用于发布的 `.ini` 过滤配置                              |
| 自动添加版权声明           | 插入版权声明（从 `.uplugin` 中读取作者），替换旧注释，覆盖所有 `.h/.cpp/.Build.cs` 文件，自动跳过 `ThredParty` 目录 |

生成版权声明或 ini 后，可在日志中查看相应内容。

## 命令行打包

将 `UEPluginPacker.exe` 放到项目根目录后，不加参数是 GUI，加参数进入 CLI：

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

退出码：`0` 全成功；`1` 部分失败；`2` 参数或配置错；`130` 用户 Ctrl+C。

> ⚠️ 引擎列表仍由 GUI 维护（首次在 GUI 添加后 CLI 就能读取），CLI 不负责增删引擎。
