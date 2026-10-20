---
title: "Source-built Unreal on Windows: a shared engine association"
description: On Windows, copies of the same source-built engine can receive different registration identifiers. That creates unnecessary `EngineAssociation` change
type: blog
slug: ue-source-engine-association
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: ue-source-engine-association
publishedAt: 2026-10-13
sourceHash: 1d5e447e56fb52aa4b94f906f8a25be56a10af549ea9e746450768c924d65574
generatedBodyHash: 95837c4a7b5df66d3871b5caab176e02666e0f6c1f808674fe06c34a021ecfa1
translationStatus: translated
---

Modifying Registry Entries for a Source-Built Unreal Engine
===

# BAT Commands
Create a BAT file and enter the following commands
```
set str=%~dp0
set name=%~n0
REG ADD "HKCU\SOFTWARE\Epic Games\Unreal Engine\Builds" /v "%name%" /t REG_SZ  /f /d "%str:~0,-1%"
```
This script adds the Unreal Engine source in the current path to the registry, using the script's filename as the name
The benefit is a consistent version identifier in the source engine's .uproject files
![](</media-occurrence/blog%3Aue-source-engine-association%3Amedia%3A1>)
This prevents different registry names for the source engine on each computer from causing differences in the .uproject file and triggering recompilation

## Updated BAT Commands
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
Added functionality to delete all entries whose values equal the current document; otherwise, adding the entry may fail
