---
title: Windows 源码版 UE：让团队使用一致的引擎关联名称
description: Windows 下，同一份源码引擎可能在不同电脑上注册成不同标识，导致 `.uproject` 的 `EngineAssociation` 产生无意义变更。统一关联名称可以减少这类差异；它不决定 UnrealBuildTool 是否重新编译。
type: blog
slug: ue-source-engine-association
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: ue-source-engine-association
---

# Windows 源码版 UE：让团队使用一致的引擎关联名称

## 问题与环境
Windows 下，同一份源码引擎可能在不同电脑上注册成不同标识，导致 `.uproject` 的 `EngineAssociation` 产生无意义变更。统一关联名称可以减少这类差异；它不决定 UnrealBuildTool 是否重新编译。

## 操作
先确认引擎根目录包含 `Engine`，并备份目标注册表值及 `.uproject`。以下是示例命令，路径和名称必须改成自己的值；本文没有执行注册表写入。

```powershell
$key = 'HKCU:\SOFTWARE\Epic Games\Unreal Engine\Builds'
$name = 'TeamUE56'
$engineRoot = 'D:\Engines\TeamUE56'
Get-ItemProperty -Path $key -Name $name -ErrorAction SilentlyContinue
# 确认旧值后再执行：同名值会被覆盖。
if (-not (Test-Path -LiteralPath "$engineRoot\Engine")) { throw 'Invalid engine root' }
New-Item -Path $key -Force | Out-Null
New-ItemProperty -Path $key -Name $name -Value $engineRoot -PropertyType String -Force
```

然后将项目 JSON 中的 `EngineAssociation` 设置为 `TeamUE56`，其余字段保持原样。注册表记录的是每台机器自己的路径，项目共享的是名称。不要为了去重扫描并删除其他注册项。

## 检查与限制
重新读取该名称对应的值，打开项目确认实际使用的引擎。恢复时只恢复本次修改的值和项目字段。工具链、源码提交、构建配置、生成文件和缓存仍会影响编译；统一名称不能保证复用另一台机器的构建产物。
