---
title: 启动和管理进程
type: doc
slug: simple-launcher-processes
draft: false
sitePublish: true
tags:
  - 进程管理
workIds:
  - simple-launcher
docPage:
  work: simple-launcher
  group: process-control
  slug: processes
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-launcher/docs/processes/
lang: zh
translationKey: doc:simple-launcher:processes
---

## 从蓝图或 C++ 启动

配置好预设后，从蓝图或 C++ 调用：
```cpp
FProcessId Id = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
```

此例使用未分离的预设，游戏退出时会关闭进程。

所有函数都在 `SimpleLauncher` 分类下，核心流程：

```
1. StartProcess("预设名") → 获得 ProcessId
2. IsProcessRunning(ProcessId) → 检查状态
3. BindProcessExited(ProcessId, Callback) → 监听退出
4. StopProcess(ProcessId) → 手动停止
```

## 启动与停止

| 函数 | 说明 |
|------|------|
| `StartProcess(Name)` | 启动进程，返回 ProcessId |
| `StopProcess(ProcessId)` | 停止单个进程 |
| `StopProcesses(Name)` | 停止预设的所有进程 |
| `StopAllProcesses()` | 停止所有进程 |

可以对同一预设多次调用 `StartProcess`。每次调用启动新进程并返回不同的 `ProcessId`：

```cpp
FProcessId Id1 = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
FProcessId Id2 = USimpleLauncherGameSubsystem::StartProcess(FName("MyServer"));
// Id1 和 Id2 是两个独立运行的进程
```

**启动进程：**

```cpp
// 通过预设名称启动
FProcessId Id = USimpleLauncherGameSubsystem::StartProcess("LocalServer");
```

**停止进程：**

```cpp
// 停止单个进程
StopProcess(ProcessId);

// 停止某个预设的所有实例
StopProcesses("LocalServer");

// 停止所有进程
StopAllProcesses();
```

## 查询进程状态

| 函数 | 说明 |
|------|------|
| `IsProcessRunning(ProcessId)` | 检查特定进程是否仍在运行 |
| `HasRunningProcesses(Name)` | 检查预设是否有运行中的进程 |
| `GetProcessCount(Name)` | 获取预设的运行进程数 |
| `GetProcesses(Name)` | 获取预设所有运行中的 ProcessId |

## 同一预设启动多个实例

同一个预设可以启动**多个实例**，每个实例都有独立的 `FProcessId`：

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

## 进程退出回调

进程退出时获得通知并执行自定义逻辑（如重启、日志记录）。

| 函数 | 说明 |
|------|------|
| `BindProcessExited(ProcessId, Delegate)` | 监听特定进程退出 |
| `UnbindProcessExited(ProcessId, Delegate)` | 停止监听特定进程 |
| `BindProcessesExited(Name, Delegate)` | 监听预设下所有进程退出 |
| `UnbindProcessesExited(Name, Delegate)` | 停止监听预设 |

回调接收两个参数：
- `ProcessId` — 哪个进程退出了
- `bNaturalExit` — 退出原因：`true` 表示程序自行终止，`false` 表示被代码停止

**回调触发时机：**

| 场景 | 触发回调 | bNaturalExit |
|------|---------|--------------|
| 程序自行完成或崩溃 | 是 | true |
| 通过 StopProcess 停止 | 是 | false |
| 通过 StopProcesses 停止 | 是 | false |
| 通过 RemoveConfig 停止 | 是 | false |
| 游戏退出时自动清理 | 否 | - |

> 多次绑定相同委托会被静默忽略——不会触发重复回调。
>
> 游戏退出时不触发回调，以避免访问已销毁的对象导致崩溃。

插件通过 `Tick` 轮询检测进程状态，支持两种粒度的退出通知：

**单个进程回调：**

```cpp
// 监听特定进程的退出事件
BindProcessExited(ProcessId, OnExitDelegate);
// 回调参数：ProcessId, bNaturalExit（true=自然退出，false=被强制停止）
```

**预设级回调：**

```cpp
// 监听某个预设下所有实例的退出事件
BindProcessesExited("LocalServer", OnExitDelegate);
```

**典型用法——自动重启：**

```
OnProcessExited(ProcessId, bNaturalExit):
  if bNaturalExit:
    // 进程意外退出，自动重启
    StartProcess(ProcessId.Name)
```

## 游戏退出后的进程

`bLaunchDetached` 为 `false` 时，游戏退出会清理由该配置启动的进程；为 `true` 时进程可继续运行。根据外部程序的用途选择设置，避免在停止测试时关闭仍需运行的程序。

## 随游戏启动本地服务器

```
1. 项目设置中配置预设 "LocalServer"
   CommandLine: "D:/Server/dedicated_server.exe -port=7777"
   bLaunchHidden: true
   bLaunchDetached: false  // 游戏退出时自动关闭

2. 游戏启动时：
   StartProcess("LocalServer")

3. 游戏退出时：
   插件自动终止服务器进程
```

## 后台数据处理

```
1. 配置 Python 脚本预设
   CommandLine: "python D:/Scripts/data_processor.py --input data.json"
   bLaunchHidden: true

2. 需要时启动：
   FProcessId Id = StartProcess("DataProcessor")
   BindProcessExited(Id, OnDataProcessed)

3. 脚本完成后自动触发回调
```

## 测试多服务器集群

```
// 启动多个服务器实例
for i in 0..4:
    StartProcess("TestServer")

// 查询运行状态
GetProcessCount("TestServer")  // 5

// 测试完成后一键停止
StopProcesses("TestServer")
```
