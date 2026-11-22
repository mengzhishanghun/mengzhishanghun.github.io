---
title: 配置并管理 SSH 隧道
type: doc
slug: simple-ssh-tunnel-connect
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
docPage:
  work: simple-ssh-tunnel
  group: setup
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-ssh-tunnel/docs/connect/
lang: zh
translationKey: doc:simple-ssh-tunnel:connect
---

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
