---
title: Configure Process Presets
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
sourceHash: 4ea263def75a46f931f4e825bcb2f5ddda900557ce9425bed0ac925dca873a82
translationStatus: translated
generatedBodyHash: 6594a21addf1e35379ba06f4e5c91a090da8385e08f86b3b338432f48edf8750
docPage:
  work: simple-launcher
  group: features
  slug: presets
  order: 1
---

## Set Preset Fields

Decide which program to launch, where it should resolve relative paths, and whether it should stay running after the game exits. Check the saved preset name: the launch call uses that name to find it.

Open **Project Settings → Plugins → Simple Launcher** and add a preset under Launchers. For example, set `Key` to `MyServer` and `CommandLine` to `notepad.exe` or `python script.py`.

In C++, a preset uses `FLauncherConfig`:

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
For example, save three named presets in Project Settings:

```
Launchers:
  "LocalServer"  → "D:/Server/server.exe --port 7777"
  "LogCollector" → "python D:/Tools/log_collector.py"
  "AIService"    → "D:/AI/inference.exe --model gpt"
```

### Key (Preset Name)

Use the same preset name in settings and API calls.

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

The plugin automatically handles quoted paths and argument splitting:

```cpp
// 支持带空格的路径
"C:/Program Files/MyApp/app.exe" --port 8080

// 也支持不带引号的简单路径
D:/Tools/server.exe --config default
```

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

![SimpleLauncher process presets](/media-occurrence/doc%3Asimple-launcher%3Apresets%3Amedia%3A1)

Each preset has its own command line, hidden launch option, detached launch option, and working directory. Test and Notepad are separate presets in this example.

## Manage Presets at Runtime

All APIs are static functions on `USimpleLauncherGameSubsystem`, callable from both Blueprint and C++.

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

This example queries, updates, and removes presets:

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

## Scope of Runtime Configuration

- `UpdateConfig` only updates configuration data and does not affect already running processes. The new configuration takes effect on the next `StartProcess` call.
- `RemoveConfig` stops all processes for the preset before removing it. However, bound callbacks are not cleared — they remain active if you recreate a preset with the same name.
