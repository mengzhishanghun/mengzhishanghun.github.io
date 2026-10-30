---
title: SimpleSSHTunnel 使用文档
description: SimpleSSHTunnel 的完整中文产品使用文档
type: doc
slug: simple-ssh-tunnel-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-ssh-tunnel-guide/
lang: zh
translationKey: simple-ssh-tunnel-guide
---

# SimpleSSHTunnel 用户指南

## SSH 隧道与远程服务

UE 应用有时需要访问远程数据库、API 或内网服务，直接把服务暴露到公网会增加风险。SSH 隧道用 SSH 通道把本地端口的连接转发到远程服务，供项目在本机访问；是否安全仍取决于服务器身份核验、认证、监听范围和凭据管理，不能只因使用 SSH 就保证安全。

SimpleSSHTunnel 已把连接管理封装为下面的项目设置与蓝图接口。若需要理解底层集成或自定义行为，可以继续阅读 C++ 实现方式；这些原生示例并非使用插件必须编写的代码。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 1. 配置 SSH 连接

使用 SimpleSSHTunnel 插件前，在 **项目设置 → Engine → Simple SSH Tunnel** 中配置 SSH 连接。

### 1.1 访问 SSH 设置

1. 在 Unreal Engine 编辑器中打开 **项目设置**。
2. 在左侧面板导航至 **Engine → Simple SSH Tunnel**。
3. 配置以下参数：

   - **Local Address**
   - **Local Port**
   - **Remote Server Address**
   - **Remote Port**
   - **SSH Server Address**
   - **SSH Port**（默认：22）
   - **SSH Username**
   - **SSH Password**

可选：**Subsystem Class** 允许你覆盖默认行为。

所有设置保存在 `DefaultSimpleSSHTunnel.ini` 中，引擎启动时自动应用。

---

## 2. 蓝图 API

配置 SSH 连接后，以下**四个蓝图函数**可用：

### 2.1 创建 SSH 隧道

```blueprint
Create SSHTunnel (Tunnel Name: String) → Return Value: Bool
```

使用指定名称创建新的 SSH 隧道。

### 2.2 检查 SSH 隧道状态

```blueprint
Check SSHTunnel Is Running (Tunnel Name: String) → Return Value: Bool
```

检查指定的 SSH 隧道是否正在运行。

### 2.3 关闭指定 SSH 隧道

```blueprint
Close SSHTunnel (Tunnel Name: String) → Return Value: Bool
```

关闭指定的 SSH 隧道。

### 2.4 关闭所有 SSH 隧道

```blueprint
Close All SSHTunnel () → Return Value: Bool
```

关闭所有活跃的 SSH 隧道。

📌 **注意**：
- 默认子系统在引擎关闭时自动关闭所有隧道。
- 可指定自定义 **Subsystem Class** 来调整行为。

---

## 3. 示例工作流

1. 在 **项目设置** 中配置 SSH 隧道。
2. 在蓝图中调用 **Create SSHTunnel** 创建隧道。
3. 使用 **Check SSHTunnel Is Running** 验证状态。
4. 如需关闭连接，调用 **Close SSHTunnel** 或 **Close All SSHTunnel**。

---

## 4. 补充说明

- 完全用 C++ 实现，完整蓝图集成。
- 引擎关闭时自动清理 SSH 隧道（除非自定义）。

---

## C++ 中建立 SSH 隧道的两种方式

### 调用系统SSH客户端

最简单的方式是调用系统自带的SSH客户端：

**Windows (使用OpenSSH客户端):**

```cpp
#include "GenericPlatform/GenericPlatformProcess.h"

void CreateSSHTunnelByCommand(
    const FString& SSHHost,
    int32 SSHPort,
    const FString& Username,
    const FString& Password,
    int32 LocalPort,
    const FString& RemoteHost,
    int32 RemotePort)
{
    // 构建SSH命令
    // ssh -L LocalPort:RemoteHost:RemotePort Username@SSHHost -p SSHPort
    FString Command = FString::Printf(TEXT("ssh -L %d:%s:%d %s@%s -p %d -N"),
        LocalPort, *RemoteHost, RemotePort,
        *Username, *SSHHost, SSHPort);

    // 使用UE的进程管理启动SSH
    FProcHandle ProcHandle = FPlatformProcess::CreateProc(
        TEXT("C:/Windows/System32/OpenSSH/ssh.exe"),
        *Command,
        true,   // bLaunchDetached
        false,  // bLaunchHidden
        false,  // bLaunchReallyHidden
        nullptr,
        0,
        nullptr,
        nullptr
    );

    // 保存进程句柄用于后续关闭
    if (ProcHandle.IsValid())
    {
        UE_LOG(LogTemp, Log, TEXT("SSH隧道已启动"));
    }
}

// 关闭SSH隧道
void CloseSSHTunnel(FProcHandle& ProcHandle)
{
    if (ProcHandle.IsValid())
    {
        FPlatformProcess::TerminateProc(ProcHandle);
        FPlatformProcess::CloseProc(ProcHandle);
    }
}
```

**这种方式的优缺点:**

✅ **优点:**

-   实现简单,几行代码就能完成
-   无需集成第三方库
-   利用系统自带SSH客户端

❌ **缺点:**

-   依赖系统环境(需要预装SSH客户端)
-   无法在代码中输入密码(需要配置密钥或手动输入)
-   进程管理复杂,难以获取连接状态
-   跨平台兼容性差(Windows/Linux/Mac路径不同)
-   无法获取详细的错误信息
-   不适合打包发布(用户环境不可控)

* * *

### 集成SSH库

集成 SSH 库可以由项目直接管理会话、通道、状态与错误。

这里选用开源的libssh2+OpenSSL的组合，需要两个关键库:

**libssh2** — SSH协议实现

-   负责SSH连接建立
-   用户认证(密码/密钥)
-   端口转发功能
-   🔗 开源地址: [https://github.com/libssh2/libssh2](https://github.com/libssh2/libssh2)
-   📄 许可证: BSD 3-Clause

**OpenSSL** — 加密支持

-   提供底层加密算法
-   密钥交换
-   数据加密/解密
-   🔗 开源地址: [https://github.com/openssl/openssl](https://github.com/openssl/openssl)
-   📄 许可证: Apache 2.0

### 如何使用这两个库

集成libssh2到UE项目的基本步骤：

**1\. 编译库文件**

首先需要为目标平台编译libssh2和OpenSSL的静态库：

```bash
# Windows平台需要编译出
libssh2.lib / libssh2.dll
libcrypto.lib / libcrypto.dll
libssl.lib / libssl.dll
```

**2\. 在.Build.cs中添加依赖**

```csharp
// 添加头文件路径
PublicIncludePaths.Add(Path.Combine(ThirdPartyPath, "libssh2", "include"));
PublicIncludePaths.Add(Path.Combine(ThirdPartyPath, "openssl", "include"));

// 链接静态库
PublicAdditionalLibraries.Add(Path.Combine(ThirdPartyPath, "libssh2", "lib", "libssh2.lib"));
PublicAdditionalLibraries.Add(Path.Combine(ThirdPartyPath, "openssl", "lib", "libcrypto.lib"));
PublicAdditionalLibraries.Add(Path.Combine(ThirdPartyPath, "openssl", "lib", "libssl.lib"));

// 运行时需要的DLL
RuntimeDependencies.Add("$(BinaryOutputDir)/libssh2.dll", Path.Combine(ThirdPartyPath, "libssh2", "bin", "libssh2.dll"));
```

**3\. 基本的libssh2使用流程**

```cpp
#include "libssh2.h"

// 初始化libssh2
libssh2_init(0);

// 创建会话
LIBSSH2_SESSION* session = libssh2_session_init();

// 连接到SSH服务器（基于已有的Socket）
libssh2_session_handshake(session, socket);

// 用户认证
libssh2_userauth_password(session, username, password);

// 创建端口转发通道
LIBSSH2_CHANNEL* channel = libssh2_channel_direct_tcpip(
    session,
    remote_host,  // 远程目标地址
    remote_port   // 远程目标端口
);

// 后续进行数据转发...

// 清理资源
libssh2_channel_free(channel);
libssh2_session_disconnect(session, "Normal Shutdown");
libssh2_session_free(session);
libssh2_exit();
```

**关键点：**

-   libssh2需要配合Socket使用，UE中可以用`FSocket`
-   端口转发需要在本地开启监听Socket接受连接
-   数据转发需要在独立线程中循环处理，避免阻塞主线程
-   所有libssh2操作都需要正确的错误处理和资源释放

### 两种方式对比

| 特性 | 调用系统SSH | 集成SSH库 |
| --- | --- | --- |
| **实现难度** | 简单 | 复杂 |
| **环境依赖** | 需要系统SSH客户端 | 无依赖 |
| **密码认证** | 不支持(需手动输入) | 完全支持 |
| **状态监控** | 困难 | 完整支持 |
| **错误处理** | 无法获取详情 | 详细错误信息 |
| **跨平台** | 路径不一致 | 统一接口 |
| **打包发布** | 不可靠 | 可靠 |
| **适用场景** | 开发测试 | 生产环境 |

**结论:**

-   如果只是临时测试,调用系统SSH是最快的方式
-   产品集成需要选择可维护的连接与发布方案；集成 SSH 库是这里采用的方式，但不是所有产品的唯一选择。

* * *

### 示例中的进程与连接资源

系统客户端示例保留了 `Password` 参数，但没有把它用于认证；它依赖密钥或外部交互。创建的进程句柄仍需由调用方保存，局部变量本身不能让后续关闭函数取到句柄。路径、引用转义、启动失败、结束时机和错误收集也需要补齐。

libssh2 示例说明初始化、握手、认证、开通道和释放的顺序，没有包含完整的本地监听、双向转发、返回值检查或服务器主机密钥核验。`socket`、`username` 等来自项目上下文；发布时还应核对目标平台的库文件、运行时依赖和许可证。上面的对比表表达管理能力上的差异，不意味着集成库后自动没有依赖、自动具备跨平台支持或保证发布可靠。

当时的技术记录称该方案已在实际项目的开发/测试环境中验证；生产环境仍需按安全需求调整，不能把这条历史记录当成当前插件所有部署条件的保证。

## 致谢与开源库

本技术方案基于以下开源项目：

**libssh2** — 成熟的SSH2协议客户端库

-   📦 项目地址: [https://github.com/libssh2/libssh2](https://github.com/libssh2/libssh2)
-   📄 许可证: BSD 3-Clause License
-   💡 功能: SSH连接、用户认证、端口转发
-   🙏 感谢libssh2团队提供的SSH实现

**OpenSSL** — 行业标准的加密库

-   📦 项目地址: [https://github.com/openssl/openssl](https://github.com/openssl/openssl)
-   📄 许可证: Apache 2.0 License
-   💡 功能: SSL/TLS协议、加密算法
-   🙏 感谢OpenSSL项目为网络安全做出的贡献

使用这些库时，请遵守相应的开源协议，并在项目中注明来源。

原技术记录于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165541)。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleSSHTunnel 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
