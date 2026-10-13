---
title: SimpleLauncher 使用指南
description: 通过预设管理外部程序的启动、停止、多实例和退出通知。
type: doc
slug: simple-launcher-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleLauncher
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
workIds:
  - simple-launcher
lang: zh
translationKey: doc:simple-launcher-guide:supplement:1
---

# SimpleLauncher 使用指南

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

### 1.2 进程生命周期管理

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

**自动清理：**

当 `bLaunchDetached = false`（默认）时，插件会在游戏退出时**自动终止**该进程。设置为 `true` 的分离进程则会在游戏退出后继续运行。

### 1.3 多实例支持

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

### 1.4 进程退出回调

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

## 调用示例

### 场景1：随游戏启动本地服务器

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

### 场景2：后台数据处理

```
1. 配置 Python 脚本预设
   CommandLine: "python D:/Scripts/data_processor.py --input data.json"
   bLaunchHidden: true

2. 需要时启动：
   FProcessId Id = StartProcess("DataProcessor")
   BindProcessExited(Id, OnDataProcessed)

3. 脚本完成后自动触发回调
```

### 场景3：多服务器集群测试

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

## 安装与使用

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：配置预设

路径：`Edit > Project Settings > Simple Launcher`

添加你需要的启动器配置。

### 步骤3：蓝图中使用

所有函数都在 `SimpleLauncher` 分类下，核心流程：

```
1. StartProcess("预设名") → 获得 ProcessId
2. IsProcessRunning(ProcessId) → 检查状态
3. BindProcessExited(ProcessId, Callback) → 监听退出
4. StopProcess(ProcessId) → 手动停止
```

## 生命周期注意事项

bLaunchDetached 为 false 时，游戏退出会清理由该配置启动的进程；为 true 时进程可继续运行。根据外部程序的用途选择设置，避免在停止测试时关闭仍需运行的程序。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770928)。
