---
title: Configure Launch Presets
type: doc
slug: simple-launcher-presets
draft: false
sitePublish: true
tags:
  - Process management
workIds:
  - simple-launcher
documentKind: product-manual
websiteRoute: /en/works/simple-launcher/docs/presets/
lang: en
translationKey: doc:simple-launcher:presets
sourceHash: 5ba7785e22bc365f5ea5ffc8ad64fe83f6887be4f40145dadfaeaf6c9f67b172
translationStatus: translated
generatedBodyHash: 18528243757d3d9e6c096c09a826f18cc11fcad2e1eef502be882d4fcd1fde43
docPage:
  work: simple-launcher
  group: workflows
  slug: presets
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Quick Start

Launch an external program from your game in just two steps:

**Step 1: Configure a Preset**

Open **Project Settings → Plugins → Simple Launcher**, and add a preset in Launchers:
- Set Key to a preset name, e.g. `MyServer`
- Set CommandLine to the command to execute, e.g. `notepad.exe` or `python script.py`

**Step 2: Call the API to Launch**

Call from Blueprint or C++:
```cpp
FProcessId Id = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
```
The program will start. When the game exits, the plugin will automatically shut it down.

## Configuration

Each preset contains the following settings:

### Key (Preset Name)

A name for this preset. All APIs reference presets by this name.

- Use any name you like, e.g. `MyServer`, `Logger`, `DataSync`
- Names must be unique across all presets

### CommandLine

The full command to execute, including the program path and arguments.

```
notepad.exe file.txt
"C:\Program Files\app.exe" -port 8080
'/usr/bin/app' -arg
```
> If the path contains spaces, you must wrap the program path in quotes, otherwise parsing will fail.

### bLaunchHidden

Whether to hide the program window. Defaults to `false` (window visible).

- Set to `true`: the program runs in the background with no visible window
- Ideal for background services or tools that don't need user interaction

### bLaunchDetached

Controls whether the program is shut down when the game exits. Defaults to `false` (shut down with game).

- `false` (default): the program is automatically closed when the game exits — ideal for game servers, temporary tools
- `true`: the program continues running after the game exits — ideal for log collectors or other persistent services

### WorkingDirectory

The working directory for the program. Defaults to empty (uses the game's working directory).

- Use an absolute path, e.g. `C:\MyApp` or `/home/user/app`
- Relative paths used by the program will resolve based on this directory

## API Reference

All APIs are static functions on `USimpleLauncherGameSubsystem`, callable from both Blueprint and C++.

### Config Management

| Function | Description |
|----------|-------------|
| `UpdateConfig(Name, Config, bOverrideIfExists, bCreateIfNotExists)` | Create or update a preset |
| `GetConfig(Name, OutConfig)` | Get preset configuration |
| `GetAllConfig()` | Get all presets |
| `RemoveConfig(Name)` | Remove a preset (also stops all its processes) |

`UpdateConfig` has two optional parameters for precise control:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `bOverrideIfExists` | `true` | Whether to overwrite if the preset already exists. Set to `false` to prevent accidental overwrites |
| `bCreateIfNotExists` | `true` | Whether to create if the preset doesn't exist. Set to `false` to only update existing presets |

In addition to configuring presets in Project Settings, you can create them dynamically at runtime:

```cpp
FLauncherConfig Config;
Config.CommandLine = TEXT("python script.py");
Config.bLaunchHidden = true;
USimpleLauncherGameSubsystem::UpdateConfig(FName("TempTask"), Config);
```
> Presets created at runtime are lost when the game restarts. For persistent presets, configure them in Project Settings.

## Notes

- `UpdateConfig` only updates configuration data and does not affect already running processes. The new configuration takes effect on the next `StartProcess` call.
- `RemoveConfig` stops all processes for the preset before removing it. However, bound callbacks are not cleared — they remain active if you recreate a preset with the same name.

### Platform Support

The plugin supports Windows, Linux, and macOS. It uses UE's `FPlatformProcess::CreateProc` under the hood, so any program the OS can execute can be launched — there are no file type restrictions.

## Version History


Open **Edit → Project Settings**, select the SimpleLauncher settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Contact

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)

## SimpleLauncher User Guide

Launch and manage external programs through named presets. The same preset can run multiple instances.

## Configuration and Process Interfaces

### 1.1 Preset Configuration System

The plugin uses **presets** to manage process configuration:

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
You can configure multiple launchers in Project Settings, each with an independent name:

Path: `Edit > Project Settings > Simple Launcher`

```
Launchers:
  "LocalServer"  → "D:/Server/server.exe --port 7777"
  "LogCollector" → "python D:/Tools/log_collector.py"
  "AIService"    → "D:/AI/inference.exe --model gpt"
```

### 1.5 Runtime Configuration Management

In addition to static editor configuration, the plugin supports **dynamic management at runtime**:

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

### 1.6 Smart Command-Line Parsing

The plugin automatically handles quoted paths and argument splitting:

```cpp
// 支持带空格的路径
"C:/Program Files/MyApp/app.exe" --port 8080

// 也支持不带引号的简单路径
D:/Tools/server.exe --config default
```
* * *

## Installation and Usage

### Step 1: Install the Plugin

Copy the plugin folder into the project's `Plugins` directory and restart the editor.

### Step 2: Configure Presets

Path: `Edit > Project Settings > Simple Launcher`

Add the launcher configurations you need.
