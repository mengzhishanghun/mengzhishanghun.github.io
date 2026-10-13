---
title: UE 编辑器资产保存：签出、脏标记与保存结果
description: 自动化工具修改了资产，磁盘文件却未更新，常见原因包括包未标脏、目标路径错误或版本控制阻止写入。本文限于 UE5 编辑器资产保存；不把编辑器 API 当成游戏运行时的通用存档方案。
type: blog
slug: ue-editor-asset-saving
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
translationKey: ue-editor-asset-saving
---

# UE 编辑器资产保存：签出、脏标记与保存结果

## 问题与环境
自动化工具修改了资产，磁盘文件却未更新，常见原因包括包未标脏、目标路径错误或版本控制阻止写入。本文限于 UE5 编辑器资产保存；不把编辑器 API 当成游戏运行时的通用存档方案。

## 保存前先明确对象和权限
已有资产从对象取得真实包，不为一个不明路径随意 `CreatePackage`。新资产则应先创建正确包并把对象放进该包，再登记新资产；`AssetCreated` 不应该对每次已有资产保存重复调用。长包名 `/Game/Data/Example` 与文件系统路径不是同一个概念，转换时使用包路径工具。

使用 Source Control 的签出流程，确认锁和权限，签出失败就停止。把文件设为可写只改变本机属性，不会获得 Perforce 锁、创建 edit 记录或解决他人签出。不要为了让保存成功绕过它。

## 最小流程
```text
检查 Editor 环境、对象、包和目标路径
确认版本控制允许修改；已有受管文件完成签出
在修改前建立事务并调用 Modify
修改对象并将包标记为 dirty
调用当前引擎的编辑器保存接口或 UPackage::SavePackage
检查返回结果；失败保留错误和 dirty 状态
```

## 可验证例与限制
在临时工程副本修改一个已存在资产，保存后关闭并重开确认字段；让签出失败时应停止并保留原磁盘文件。新资产和已有资产分别检查，不能只测试无版本控制的可写目录。以上为操作设计，未在编辑器中运行；具体保存接口、返回类型与模块依赖按使用的 UE 版本核对。
