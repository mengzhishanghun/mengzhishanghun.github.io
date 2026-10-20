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

Unreal源码版注册表修改
===

# bat指令
创建一个bat文件，输入以下指令
```
set str=%~dp0
set name=%~n0
REG ADD "HKCU\SOFTWARE\Epic Games\Unreal Engine\Builds" /v "%name%" /t REG_SZ  /f /d "%str:~0,-1%"
```
这个脚本会把当前路径下的虚幻源码添加到注册表，名字就是这个脚本的命名
这样做的好处是统一源码的.uproject文件版本号
![](/media-occurrence/blog%3Aue-source-engine-association%3Amedia%3A1)
这样做的好处是可以防止每台电脑源码引擎的注册表名字不同导致的.uproject不同，而重新编译

## bat指令更新
```bat
@echo off
setlocal

REM 设置当前批处理脚本的路径并去掉最后的反斜杠
set str=%~dp0
set str=%str:~0,-1%
set name=%~n0
set key=HKCU\SOFTWARE\Epic Games\Unreal Engine\Builds

REM 查找并删除所有数据值等于 %str% 的项
for /f "tokens=1" %%i in ('REG QUERY "%key%" /f "%str%"') do (
    echo %%i
    REG DELETE "%key%" /v "%%i" /f
)

REG ADD "%key%" /v "%name%" /t REG_SZ  /f /d "%str%"

endlocal
```
新增功能删除所有值等于当前文档的数据，不然会出现添加不上的问题