---
title: Create SSH Tunnels in C++
type: doc
slug: simple-ssh-tunnel-cpp-tunnels
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
documentKind: product-manual
websiteRoute: /en/works/simple-ssh-tunnel/docs/cpp-tunnels/
lang: en
translationKey: doc:simple-ssh-tunnel:cpp-tunnels
sourceHash: e667fccf56d22ec3fd07130e31f1eb7fcde54e551d63f055f10c1defc71e5dec
translationStatus: translated
generatedBodyHash: 726b98d819b9c9e5da183c7ed913372c5b7f44a4035c720098e9cb698a058c1e
docPage:
  work: simple-ssh-tunnel
  group: native
  slug: cpp-tunnels
  order: 1
---

## Choosing an approach

For a temporary development test, call the system SSH client if it is installed on the target machine. An SSH library gives the project control over connection state and errors, but target-platform dependencies, portability, and packaging still need attention.

## Call the system SSH client

You can start the SSH client installed on the operating system.

**Windows (OpenSSH client):**

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

This approach needs little code and no third-party library integration. The executable paths differ on Windows, Linux, and macOS. Packaging is difficult when you cannot control the user's environment.

The system-client example keeps a `Password` parameter but does not use it for authentication. It relies on keys or external interaction. The caller must retain the process handle: the local variable does not make that handle available to the separate close function. Executable paths, argument escaping, startup failures, termination timing, and error collection also need handling.

## Integrate libssh2 and OpenSSL

An SSH library lets the project manage SSH sessions, channels, state, and errors. libssh2 handles connections, password or key authentication, and port forwarding. OpenSSL provides encryption, decryption, and key exchange.

### Build the libraries, add dependencies, and open a session

1. Build libssh2 and OpenSSL for each target platform. The original setup calls for static libraries and lists these Windows library and runtime files:

```bash
# Windows平台需要编译出
libssh2.lib / libssh2.dll
libcrypto.lib / libcrypto.dll
libssl.lib / libssl.dll
```

2. Add the dependencies in `.Build.cs`:

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

3. Initialize libssh2, open a session, authenticate, create the forwarding channel, and release the resources:

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

libssh2 works with a socket; in UE, you can use `FSocket`. Port forwarding also needs a local listening socket to accept connections. Run the forwarding loop on a separate thread to avoid blocking the game thread, and handle errors and resource cleanup for every libssh2 operation.

### Listening, forwarding, and host identity checks

The libssh2 example shows initialization, handshake, authentication, channel creation, and cleanup. It does not include a complete local listener, bidirectional forwarding, return-value checks, or server host-key verification. Values such as `socket` and `username` come from the surrounding project. Before distributing a build, check the target platform's libraries, runtime dependencies, and licenses. The comparison describes differences in management capabilities; integrating a library does not automatically remove dependencies, provide platform support, or guarantee reliable distribution.

The original technical record says this approach was verified in an actual project's development/test environment. Production use still requires adjustments for its security requirements. That historical statement does not guarantee every deployment condition for the current plugin.
