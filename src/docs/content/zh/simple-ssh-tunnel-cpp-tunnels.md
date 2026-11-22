---
title: 从 C++ 建立 SSH 隧道
type: doc
slug: simple-ssh-tunnel-cpp-tunnels
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
docPage:
  work: simple-ssh-tunnel
  group: native
  slug: cpp-tunnels
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-ssh-tunnel/docs/cpp-tunnels/
lang: zh
translationKey: doc:simple-ssh-tunnel:cpp-tunnels
---

## 选择集成方式

临时开发测试可调用系统 SSH 客户端，前提是目标机器已安装客户端。产品集成可使用 SSH 库直接管理连接状态和错误，但仍需处理目标平台依赖、跨平台适配和发布条件。

## 调用系统 SSH 客户端

可启动操作系统上已安装的 SSH 客户端。

**Windows（OpenSSH 客户端）**

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

这种方式实现简单，无需在项目中集成第三方库。

Windows、Linux 和 macOS 的客户端路径不同。若无法控制用户环境，这种方式不适合作为打包发布的依赖。

系统客户端示例保留了 `Password` 参数，但没有把它用于认证；它依赖密钥或外部交互。创建的进程句柄仍需由调用方保存，局部变量本身不能让后续关闭函数取到句柄。路径、引用转义、启动失败、结束时机和错误收集也需要补齐。

## 集成 libssh2 和 OpenSSL

SSH 库允许项目直接管理 SSH 会话、通道、状态和错误。libssh2 负责连接、密码或密钥认证和端口转发；OpenSSL 提供加密、解密和密钥交换。

### 编译库、添加依赖并建立会话

**编译库文件**

为目标平台编译 libssh2 和 OpenSSL 的静态库。以下是 Windows 示例涉及的库文件和运行时文件：

```bash
# Windows平台需要编译出
libssh2.lib / libssh2.dll
libcrypto.lib / libcrypto.dll
libssl.lib / libssl.dll
```

**在 `.Build.cs` 中添加依赖**

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

**初始化、认证并打开转发通道**

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

libssh2 需要与 Socket 配合使用，在 UE 中可用 `FSocket`。通过本地监听 Socket 接受连接，并在独立线程循环转发数据，避免阻塞游戏主线程。每个 libssh2 操作都需要处理错误并释放资源。

### 监听、转发和主机身份核验

libssh2 示例说明初始化、握手、认证、开通道和释放的顺序，没有包含完整的本地监听、双向转发、返回值检查或服务器主机密钥核验。`socket`、`username` 等来自项目上下文；发布时还应核对目标平台的库文件、运行时依赖和许可证。

当时的技术记录称该方案已在实际项目的开发/测试环境中验证；生产环境仍需按安全需求调整，不能把这条历史记录当成当前插件所有部署条件的保证。
