---
title: 配置进程预设
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
  group: features
  slug: presets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-launcher/docs/presets/
lang: zh
translationKey: doc:simple-launcher:presets
---

## 设置预设字段

先确定预设要启动哪个程序、程序从哪个目录读取相对路径，以及游戏退出后进程是否仍需运行。填写后核对预设名，启动接口按这个名字查找。

打开 **项目设置 → Plugins → Simple Launcher**，在 Launchers 中添加预设。例如，将 `Key` 设为 `MyServer`，把 `CommandLine` 设为 `notepad.exe` 或 `python script.py`。

预设在 C++ 中对应 `FLauncherConfig`：

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

例如，在项目设置里保存三个不同名称的预设：

```
Launchers:
  "LocalServer"  → "D:/Server/server.exe --port 7777"
  "LogCollector" → "python D:/Tools/log_collector.py"
  "AIService"    → "D:/AI/inference.exe --model gpt"
```

### Key（预设名称）

在设置和 API 调用中，用同一个名称指向该预设。

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

插件自动处理带引号的路径和参数分割：

```cpp
// 支持带空格的路径
"C:/Program Files/MyApp/app.exe" --port 8080

// 也支持不带引号的简单路径
D:/Tools/server.exe --config default
```

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

![SimpleLauncher 多个进程预设](/media-occurrence/doc%3Asimple-launcher%3Apresets%3Amedia%3A1)

每个预设分别填写命令行、是否隐藏启动、是否分离运行和工作目录。图中的 Test 与 Notepad 是不同的预设。

## 运行时管理预设

所有 API 都是 `USimpleLauncherGameSubsystem` 上的静态函数，可从蓝图和 C++ 调用。

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

以下示例演示查询、更新和删除预设：

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

## 运行时配置的作用范围

- `UpdateConfig` 仅更新配置数据，不影响已运行的进程。新配置在下次 `StartProcess` 调用时生效。
- `RemoveConfig` 在移除前会停止预设的所有进程。但绑定的回调不会被清除——如果重新创建同名预设，它们仍然有效。
