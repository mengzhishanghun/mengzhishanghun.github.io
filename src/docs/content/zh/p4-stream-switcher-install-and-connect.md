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
  group: getting-started
  slug: install-and-connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/install-and-connect/
lang: zh
translationKey: doc:p4-stream-switcher:install-and-connect
---

## 安装依赖并登录

准备 Windows、带 Tkinter 的 Python 3.10 或更高版本、Perforce CLI 和 P4V。账户需要能访问目标流，并有创建和删除客户端的权限。启动前，在自己的 Perforce 环境中配置 P4PORT、P4USER，按平时的方式登录。

在 P4V 中确认至少有一个属于当前用户的流客户端，Host 为当前主机，且已关联 Stream。

从[公开源码仓库](https://github.com/MZSH-Tools/P4StreamSwitcher)取得文件后，在项目目录安装依赖并启动：

```powershell
python -m pip install p4python platformdirs
python Main.py
```

启动后，在状态区核对服务器和用户。如果连接失败或未找到流客户端，按下文排查。

## 连接与流客户端排查

- 连接失败：检查 P4PORT、P4USER、登录状态和服务器可达性。
- 未检测到流客户端：在 P4V 中确认客户端属于当前用户、Host 为当前主机并关联 Stream。

[第一次切换工作区](/zh/works/p4-stream-switcher/docs/normal-switch/)
