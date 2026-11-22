---
title: Open SSH Tunnels from C++
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
sourceHash: 932e7682e3379d0b07e950db4d5bc30653311e253f5fb641c00a94b559d28df0
translationStatus: translated
generatedBodyHash: 7f39c8d86dfab451cb4992e6ec5e45ff9b05551db6edd1024a245ec4e93dcee1
docPage:
  work: simple-ssh-tunnel
  group: workflows
  slug: cpp-tunnels
  order: 1
---

## Two ways to create an SSH tunnel in C++

### Call the system SSH client

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

This approach takes little code, uses the system SSH client, and does not require integrating a third-party library. It also has several limitations:

- The target machine needs an SSH client installed.
- This example cannot supply a password from code; use keys or interactive input.
- Process management and connection status tracking require extra work.
- Executable paths differ on Windows, Linux, and macOS.
- The example does not collect detailed errors.
- Packaging is difficult when the user's environment is outside your control.

### Integrate an SSH library

An SSH library lets the project manage sessions, channels, connection state, and errors directly.

This example uses libssh2 with OpenSSL:

- **libssh2** implements SSH connections, password/key authentication, and port forwarding. Source: [https://github.com/libssh2/libssh2](https://github.com/libssh2/libssh2). License: BSD 3-Clause.
- **OpenSSL** provides cryptographic algorithms, key exchange, and data encryption/decryption. Source: [https://github.com/openssl/openssl](https://github.com/openssl/openssl). License: Apache 2.0.

### Use the two libraries

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

### Compare the two approaches

| Feature | System SSH client | Integrated SSH library |
| --- | --- | --- |
| Implementation effort | Low | Higher |
| Environment dependencies | Requires a system SSH client | No separate SSH client; library dependencies remain |
| Password authentication | Interactive input in this example | Available through the library |
| Status monitoring | Requires process integration | Session and channel state are accessible |
| Error handling | Not collected by this example | Detailed library errors are accessible |
| Cross-platform use | Executable paths differ | Shared interface; platform builds still required |
| Packaging | Depends on the user's environment | Dependencies can be packaged with the product |
| Typical use | Development and temporary tests | Product integration |

Calling the system client is a quick option for temporary testing. A product needs a maintainable connection and distribution strategy. This example integrates an SSH library, though that is not the only option for every product.

### Process and connection resources in the examples

The system-client example keeps a `Password` parameter but does not use it for authentication. It relies on keys or external interaction. The caller must retain the process handle: the local variable does not make that handle available to the separate close function. Executable paths, argument escaping, startup failures, termination timing, and error collection also need handling.

The libssh2 example shows initialization, handshake, authentication, channel creation, and cleanup. It does not include a complete local listener, bidirectional forwarding, return-value checks, or server host-key verification. Values such as `socket` and `username` come from the surrounding project. Before distributing a build, check the target platform's libraries, runtime dependencies, and licenses. The comparison describes differences in management capabilities; integrating a library does not automatically remove dependencies, provide platform support, or guarantee reliable distribution.

The original technical record says this approach was verified in an actual project's development/test environment. Production use still requires adjustments for its security requirements. That historical statement does not guarantee every deployment condition for the current plugin.
