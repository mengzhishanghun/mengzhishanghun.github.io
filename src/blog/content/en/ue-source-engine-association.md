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
sourceHash: 52257dff044acddfb079def5dfea6eb251ab75792c1c0b65fbce49bf26d792ef
generatedBodyHash: 9e04f8f9bed3eb95b27cda398acbd6a47773bcc933e79262b91a04dde1dd78ea
translationStatus: translated
---

# Source-built Unreal on Windows: a shared engine association

## Problem and environment
On Windows, copies of the same source-built engine can receive different registration identifiers. That creates unnecessary `EngineAssociation` changes in `.uproject` files. A shared name reduces those differences; it does not decide whether UnrealBuildTool rebuilds.

## Procedure
Confirm that the engine root contains `Engine`, then back up the selected registry value and `.uproject`. The command below is an example, not an executed registry change. Replace the name and path.

```powershell
$key = 'HKCU:\SOFTWARE\Epic Games\Unreal Engine\Builds'
$name = 'TeamUE56'
$engineRoot = 'D:\Engines\TeamUE56'
Get-ItemProperty -Path $key -Name $name -ErrorAction SilentlyContinue
# Review the previous value first: this overwrites the same name.
if (-not (Test-Path -LiteralPath "$engineRoot\Engine")) { throw 'Invalid engine root' }
New-Item -Path $key -Force | Out-Null
New-ItemProperty -Path $key -Name $name -Value $engineRoot -PropertyType String -Force
```

Set the project's JSON `EngineAssociation` to `TeamUE56`, preserving other fields. Each computer stores its local path in the registry; the project shares the name. Do not scan and delete unrelated registrations for deduplication.

## Checks and limits
Read the value back and open the project to confirm the selected engine. To undo the change, restore only that value and the project field. Toolchain, source revision, configuration, generated files and caches still affect compilation. A shared name does not guarantee reuse of another computer's binaries.
