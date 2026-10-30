---
title: SimpleSSHTunnel User Guide
description: Complete product user guide for SimpleSSHTunnel
type: doc
slug: simple-ssh-tunnel-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-ssh-tunnel-guide/
lang: en
translationKey: simple-ssh-tunnel-guide
sourceHash: 9d8c5b2120e121ea3649773129572e346da8a8cd0bef1a0de0eefe7a667836a5
translationStatus: translated
generatedBodyHash: 81cdc19064c06e831ef19457b17f11103aab0419225990cff4146f3411a4ed39
---

# SimpleSSHTunnel User Guide

## SSH tunnels and remote services

A UE application may need access to a remote database, API, or private network service. Exposing that service directly to the internet adds risk. An SSH tunnel forwards connections from a local port to the remote service through SSH, so the project can access it locally. Security still depends on server identity verification, authentication, listening addresses, and credential management.

SimpleSSHTunnel provides the project settings and Blueprint interfaces below to manage these connections. The C++ examples explain lower-level integration and customization; you do not need to write them to use the plugin.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## 1. Configure SSH Connection

To use the SimpleSSHTunnel plugin, configure the SSH connection in **Project Settings → Engine → Simple SSH Tunnel**.

### 1.1 Access SSH Settings

1. Open **Project Settings** in Unreal Engine editor.
2. Navigate to **Engine → Simple SSH Tunnel** in the left panel.
3. Configure the following parameters:

   - **Local Address**
   - **Local Port**
   - **Remote Server Address**
   - **Remote Port**
   - **SSH Server Address**
   - **SSH Port** (default: 22)
   - **SSH Username**
   - **SSH Password**

Optional: **Subsystem Class** allows you to override the default behavior.

All settings are saved in `DefaultSimpleSSHTunnel.ini` and automatically applied at engine startup.

---

## 2. Blueprint API

After configuring the SSH connection, the following **four Blueprint functions** are available:

### 2.1 Create SSH Tunnel

```blueprint
Create SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Creates a new SSH tunnel with the specified name.

### 2.2 Check SSH Tunnel Status

```blueprint
Check SSHTunnel Is Running (Tunnel Name: String) → Return Value: Bool
```
Checks if the specified SSH tunnel is running.

### 2.3 Close Specific SSH Tunnel

```blueprint
Close SSHTunnel (Tunnel Name: String) → Return Value: Bool
```
Closes the specified SSH tunnel.

### 2.4 Close All SSH Tunnels

```blueprint
Close All SSHTunnel () → Return Value: Bool
```
Closes all active SSH tunnels.

📌 **Note**:
- The default subsystem automatically shuts down all tunnels when the engine closes.
- You may define custom behavior by specifying a custom **Subsystem Class**.

---

## 3. Example Workflow

1. Configure the SSH tunnel in **Project Settings**.
2. In Blueprint, call **Create SSHTunnel** to create a tunnel.
3. Use **Check SSHTunnel Is Running** to verify its status.
4. Call **Close SSHTunnel** or **Close All SSHTunnel** to shut down connections if needed.

---

## 4. Additional Notes

- Fully implemented in C++ with full Blueprint integration.
- Automatically cleans up SSH tunnels when the engine shuts down (unless customized).

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

## Acknowledgments and open-source libraries

This approach uses the following open-source projects:

- **libssh2** is an SSH2 client library for SSH connections, authentication, and port forwarding. Project: [https://github.com/libssh2/libssh2](https://github.com/libssh2/libssh2). License: BSD 3-Clause License. Thanks to the libssh2 team for its SSH implementation.
- **OpenSSL** provides SSL/TLS protocols and cryptographic algorithms. Project: [https://github.com/openssl/openssl](https://github.com/openssl/openssl). License: Apache 2.0 License. Thanks to the OpenSSL project for its work on network security.

Follow the licenses and acknowledge the sources when using these libraries.

The original technical record was published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165541) on 2025-10-25.

## Version History


Open **Edit → Project Settings**, select the SimpleSSHTunnel settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
