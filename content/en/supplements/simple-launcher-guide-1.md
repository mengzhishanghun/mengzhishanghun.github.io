---
title: SimpleLauncher User Guide
description: Manage external program startup, stopping, multiple instances, and exit notifications through presets.
type: doc
slug: simple-launcher-guide
categoryId: ue-tools
categoryName: UE tools
categoryOrder: 0
order: 0
status: Official documentation
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleLauncher
  - UE tools
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: Original Cnblogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
workIds:
  - simple-launcher
lang: en
translationKey: doc:simple-launcher-guide:supplement:1
sourceHash: 473db8cca7eafe086c16f860361f452c303bfe7d2b953eecc2119f7cfa098a0d
translationStatus: translated
generatedBodyHash: 949d2d13e3a6db06dbb8708b08da35757c6eab9f19615981dd35625227b2cab3
---

# SimpleLauncher User Guide

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
### 1.2 Process Lifecycle Management

**Start a process:**

```cpp
// 通过预设名称启动
FProcessId Id = USimpleLauncherGameSubsystem::StartProcess("LocalServer");
```
**Stop processes:**

```cpp
// 停止单个进程
StopProcess(ProcessId);

// 停止某个预设的所有实例
StopProcesses("LocalServer");

// 停止所有进程
StopAllProcesses();
```
**Automatic cleanup:**

When `bLaunchDetached = false` (the default), the plugin **automatically terminates** the process when the game exits, managing process cleanup at shutdown. Detached processes with this value set to `true` continue running after the game exits.

### 1.3 Multiple Instances

The same preset can launch **multiple instances**, each with an independent `FProcessId`:

```cpp
USTRUCT(BlueprintType)
struct FProcessId
{
    FName Name;    // 预设名称
    int32 Index;   // 实例索引（自动递增）
};
```
```
// 启动3个本地服务器实例
FProcessId Server1 = StartProcess("LocalServer");  // Index = 0
FProcessId Server2 = StartProcess("LocalServer");  // Index = 1
FProcessId Server3 = StartProcess("LocalServer");  // Index = 2

// 独立管理每个实例
StopProcess(Server2);  // 只停止第二个
IsProcessRunning(Server1);  // 检查第一个是否在运行
GetProcessCount("LocalServer");  // 返回 2（还剩两个在运行）
```
### 1.4 Process Exit Callbacks

The plugin polls process status through `Tick` and supports exit notifications at two levels:

**Individual process callback:**

```cpp
// 监听特定进程的退出事件
BindProcessExited(ProcessId, OnExitDelegate);
// 回调参数：ProcessId, bNaturalExit（true=自然退出，false=被强制停止）
```
**Preset-level callback:**

```cpp
// 监听某个预设下所有实例的退出事件
BindProcessesExited("LocalServer", OnExitDelegate);
```
**Typical use: automatic restart:**

```
OnProcessExited(ProcessId, bNaturalExit):
  if bNaturalExit:
    // 进程意外退出，自动重启
    StartProcess(ProcessId.Name)
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

## Call Examples

### Scenario 1: Start a Local Server with the Game

```
1. Configure the "LocalServer" preset in Project Settings
   CommandLine: "D:/Server/dedicated_server.exe -port=7777"
   bLaunchHidden: true
   bLaunchDetached: false  // 游戏退出时自动关闭

2. When the game starts:
   StartProcess("LocalServer")

3. When the game exits:
   The plugin automatically terminates the server process
```

### Scenario 2: Background Data Processing

```
1. Configure a Python script preset
   CommandLine: "python D:/Scripts/data_processor.py --input data.json"
   bLaunchHidden: true

2. Start it when needed:
   FProcessId Id = StartProcess("DataProcessor")
   BindProcessExited(Id, OnDataProcessed)

3. The callback is triggered automatically when the script finishes
```

### Scenario 3: Multi-Server Cluster Testing

```
// 启动多个服务器实例
for i in 0..4:
    StartProcess("TestServer")

// 查询运行状态
GetProcessCount("TestServer")  // 5

// 测试完成后一键停止
StopProcesses("TestServer")
```
* * *

## Installation and Usage

### Step 1: Install the Plugin

Copy the plugin folder into the project's `Plugins` directory and restart the editor.

### Step 2: Configure Presets

Path: `Edit > Project Settings > Simple Launcher`

Add the launcher configurations you need.

### Step 3: Use in Blueprints

All functions are in the `SimpleLauncher` category. The core workflow is:

```
1. StartProcess("预设名") → Obtain ProcessId
2. IsProcessRunning(ProcessId) → Check status
3. BindProcessExited(ProcessId, Callback) → Listen for exit
4. StopProcess(ProcessId) → Stop manually
```

## Lifecycle Notes

When bLaunchDetached is false, game shutdown cleans up processes launched by that configuration. When true, the processes can continue running. Choose the setting according to the external program's purpose to avoid closing programs that still need to run when testing stops.

---

Originally published on 2026-03-25 on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19770928).
