---
title: 在蓝图中管理 SSH 隧道
type: doc
slug: simple-ssh-tunnel-manage-tunnels
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
docPage:
  work: simple-ssh-tunnel
  group: tunnels
  slug: manage-tunnels
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-ssh-tunnel/docs/manage-tunnels/
lang: zh
translationKey: doc:simple-ssh-tunnel:manage-tunnels
---

## 从配置到启停隧道

1. 在 **项目设置** 中配置 SSH 隧道。
2. 在蓝图中调用 **Create SSHTunnel** 创建隧道。
3. 使用 **Check SSHTunnel Is Running** 验证状态。
4. 如需关闭连接，调用 **Close SSHTunnel** 或 **Close All SSHTunnel**。

## 蓝图节点

配置 SSH 连接后，以下**四个蓝图函数**可用：

### 创建 SSH 隧道

```blueprint
Create SSHTunnel (Tunnel Name: String) → Return Value: Bool
```

使用指定名称创建新的 SSH 隧道。

### 检查 SSH 隧道状态

```blueprint
Check SSHTunnel Is Running (Tunnel Name: String) → Return Value: Bool
```

检查指定的 SSH 隧道是否正在运行。

### 关闭指定 SSH 隧道

```blueprint
Close SSHTunnel (Tunnel Name: String) → Return Value: Bool
```

关闭指定的 SSH 隧道。

### 关闭所有 SSH 隧道

```blueprint
Close All SSHTunnel () → Return Value: Bool
```

关闭所有活跃的 SSH 隧道。

## 退出时关闭隧道

默认子系统在引擎关闭时会关闭所有隧道。若配置了自定义 **Subsystem Class**，关闭行为取决于该子系统。
