---
title: 配置启动预设
type: doc
slug: simple-launcher-presets
draft: false
sitePublish: true
tags:
  - 进程管理
workIds:
  - simple-launcher
docPage:
  work: simple-launcher
  group: workflows
  slug: presets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-launcher/docs/presets/
lang: zh
translationKey: doc:simple-launcher:presets
---

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 快速开始

只需两步从游戏中启动外部程序：

**步骤 1：配置预设**

打开 **项目设置 → Plugins → Simple Launcher**，在 Launchers 中添加预设：
- 设置 Key 为预设名称，如 `MyServer`
- 设置 CommandLine 为要执行的命令，如 `notepad.exe` 或 `python script.py`

**步骤 2：调用 API 启动**

从蓝图或 C++ 调用：
```cpp
FProcessId Id = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
```

程序将启动。当游戏退出时，插件会自动关闭它。

## 配置

每个预设包含以下设置：

### Key（预设名称）

此预设的名称。所有 API 通过此名称引用预设。

- 使用任意名称，如 `MyServer`、`Logger`、`DataSync`
- 名称在所有预设中必须唯一

### CommandLine

要执行的完整命令，包括程序路径和参数。

```
notepad.exe file.txt
"C:\Program Files\app.exe" -port 8080
'/usr/bin/app' -arg
```

> 如果路径包含空格，必须用引号包裹程序路径，否则解析会失败。

### bLaunchHidden

是否隐藏程序窗口。默认为 `false`（窗口可见）。

- 设为 `true`：程序在后台运行，无可见窗口
- 适用于不需要用户交互的后台服务或工具

### bLaunchDetached

控制游戏退出时是否关闭程序。默认为 `false`（随游戏关闭）。

- `false`（默认）：游戏退出时自动关闭程序——适用于游戏服务器、临时工具
- `true`：游戏退出后程序继续运行——适用于日志收集器或其他持久服务

### WorkingDirectory

程序的工作目录。默认为空（使用游戏的工作目录）。

- 使用绝对路径，如 `C:\MyApp` 或 `/home/user/app`
- 程序使用的相对路径将基于此目录解析

## API 参考

所有 API 都是 `USimpleLauncherGameSubsystem` 上的静态函数，可从蓝图和 C++ 调用。

### 配置管理

| 函数 | 说明 |
|------|------|
| `UpdateConfig(Name, Config, bOverrideIfExists, bCreateIfNotExists)` | 创建或更新预设 |
| `GetConfig(Name, OutConfig)` | 获取预设配置 |
| `GetAllConfig()` | 获取所有预设 |
| `RemoveConfig(Name)` | 移除预设（同时停止其所有进程） |

`UpdateConfig` 有两个可选参数用于精确控制：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `bOverrideIfExists` | `true` | 预设已存在时是否覆盖。设为 `false` 防止意外覆盖 |
| `bCreateIfNotExists` | `true` | 预设不存在时是否创建。设为 `false` 仅更新现有预设 |

除了在项目设置中配置预设，也可以在运行时动态创建：

```cpp
FLauncherConfig Config;
Config.CommandLine = TEXT("python script.py");
Config.bLaunchHidden = true;
USimpleLauncherGameSubsystem::UpdateConfig(FName("TempTask"), Config);
```

> 运行时创建的预设在游戏重启后丢失。持久预设请在项目设置中配置。

## 注意事项

- `UpdateConfig` 仅更新配置数据，不影响已运行的进程。新配置在下次 `StartProcess` 调用时生效。
- `RemoveConfig` 在移除前会停止预设的所有进程。但绑定的回调不会被清除——如果重新创建同名预设，它们仍然有效。

### 平台支持

插件支持 Windows、Linux 和 macOS。底层使用 UE 的 `FPlatformProcess::CreateProc`，因此操作系统能执行的任何程序都可以启动——没有文件类型限制。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleLauncher 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 联系

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleLauncher 使用指南

通过命名预设启动和管理外部程序；同一预设可以运行多个实例。

## 配置与进程接口

### 1.1 预设配置系统

插件通过**预设（Preset）** 管理进程配置：

```cpp
USTRUCT(BlueprintType)
struct FLauncherConfig
{
    // 完整命令行（可执行文件路径 + 参数）
    FString CommandLine;

    // 隐藏进程窗口
    bool bLaunchHidden = false;

    // 分离运行（true=游戏退出后进程继续运行）
    bool bLaunchDetached = false;

    // 工作目录
    FString WorkingDirectory;
};
```

可以在项目设置中预先配置多个启动器，每个都有独立的名称：

路径：`Edit > Project Settings > Simple Launcher`

```
Launchers:
  "LocalServer"  → "D:/Server/server.exe --port 7777"
  "LogCollector" → "python D:/Tools/log_collector.py"
  "AIService"    → "D:/AI/inference.exe --model gpt"
```

### 1.5 运行时配置管理

除了编辑器中的静态配置，插件还支持**运行时动态管理**：

```cpp
// 运行时更新配置
UpdateConfig("DynamicServer", NewConfig, true, true);

// 查询配置
GetConfig("LocalServer", OutConfig);

// 获取所有配置
GetAllConfig();

// 删除配置（同时停止该预设的所有进程）
RemoveConfig("OldServer");
```

### 1.6 智能命令行解析

插件自动处理带引号的路径和参数分割：

```cpp
// 支持带空格的路径
"C:/Program Files/MyApp/app.exe" --port 8080

// 也支持不带引号的简单路径
D:/Tools/server.exe --config default
```

* * *

## 安装与使用

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：配置预设

路径：`Edit > Project Settings > Simple Launcher`

添加你需要的启动器配置。
