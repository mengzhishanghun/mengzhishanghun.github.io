---
title: Start, Inspect, and Stop Processes
type: doc
slug: simple-launcher-processes
draft: false
sitePublish: true
tags:
  - Process management
workIds:
  - simple-launcher
documentKind: product-manual
websiteRoute: /en/works/simple-launcher/docs/processes/
lang: en
translationKey: doc:simple-launcher:processes
sourceHash: b39deb881916e75ca8c88ae66ec5c436b05b313a43afdf202e1f0ca74b2fa042
translationStatus: translated
generatedBodyHash: 7e88556c061c4dd9135c3ef7abca3209331bc61330256610d795d9284ae7ddb1
docPage:
  work: simple-launcher
  group: workflows
  slug: processes
  order: 2
---

### Process Control

| Function | Description |
|----------|-------------|
| `StartProcess(Name)` | Start a process, returns ProcessId |
| `StopProcess(ProcessId)` | Stop a single process |
| `StopProcesses(Name)` | Stop all processes for a preset |
| `StopAllProcesses()` | Stop all processes |

You can call `StartProcess` multiple times on the same preset. Each call launches a new process and returns a different `ProcessId`:

```cpp
FProcessId Id1 = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
FProcessId Id2 = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
// Id1 和 Id2 是两个独立运行的进程
```

### Status Queries

| Function | Description |
|----------|-------------|
| `IsProcessRunning(ProcessId)` | Check if a specific process is still running |
| `HasRunningProcesses(Name)` | Check if a preset has any running processes |
| `GetProcessCount(Name)` | Get the number of running processes for a preset |
| `GetProcesses(Name)` | Get all running ProcessIds for a preset |

### Process Exit Callbacks

Get notified when a process exits and execute custom logic (e.g. restart, logging).

| Function | Description |
|----------|-------------|
| `BindProcessExited(ProcessId, Delegate)` | Listen for a specific process exit |
| `UnbindProcessExited(ProcessId, Delegate)` | Stop listening for a specific process |
| `BindProcessesExited(Name, Delegate)` | Listen for all process exits under a preset |
| `UnbindProcessesExited(Name, Delegate)` | Stop listening for a preset |

The callback receives two parameters:
- `ProcessId` — which process exited
- `bNaturalExit` — exit reason: `true` means the program terminated on its own, `false` means it was stopped by code

**When callbacks are triggered:**

| Scenario | Callback Triggered | bNaturalExit |
|----------|-------------------|--------------|
| Program finishes or crashes on its own | Yes | true |
| Stopped via StopProcess | Yes | false |
| Stopped via StopProcesses | Yes | false |
| Stopped via RemoveConfig | Yes | false |
| Auto-cleanup on game exit | No | - |

> Binding the same delegate multiple times is silently ignored — it won't trigger duplicate callbacks.
>
> Callbacks are not triggered during game exit to avoid accessing destroyed objects, which would cause crashes.

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
