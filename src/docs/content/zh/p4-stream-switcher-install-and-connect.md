---
title: 安装并连接 Perforce
type: doc
slug: p4-stream-switcher-install-and-connect
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: setup
  slug: install-and-connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/install-and-connect/
lang: zh
translationKey: doc:p4-stream-switcher:install-and-connect
---

## 安装依赖并登录

准备 Windows、带 Tkinter 的 Python 3.10 或更高版本、Perforce CLI 和 P4V。服务器账户需有访问目标流、创建和删除客户端所需的权限，并完成登录。当前主机至少应有一个属于当前用户的流客户端，Host 为当前主机，且关联 Stream。

从[公开源码仓库](https://github.com/MZSH-Tools/P4StreamSwitcher)取得文件后，在项目目录安装依赖并启动：

```powershell
python -m pip install p4python platformdirs
python Main.py
```

启动前，在自己的 Perforce 环境中配置 P4PORT、P4USER，并用正常登录流程建立有效会话。

## 连接与流客户端排查

- 连接失败：检查 P4PORT、P4USER、登录状态和服务器可达性。
- 未检测到流客户端：在 P4V 中确认客户端属于当前用户、Host 为当前主机并关联 Stream。

[第一次切换工作区](/zh/works/p4-stream-switcher/docs/normal-switch/)
