---
title: Build a Standalone EXE
type: doc
slug: p4-case-sync-build-and-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/build-and-environment/
lang: en
translationKey: doc:p4-case-sync:build-and-environment
sourceHash: 148a81ecea4e46c66409c32fdf4e3b3eb4d1010253c0325ebad6dbf98f096fba
translationStatus: translated
generatedBodyHash: c41fe6dc1314c4383101c3897fd9cf4e26fbc1b9afb5f6f61bd9a78e7823cce8
docPage:
  work: p4-case-sync
  group: features
  slug: build-and-environment
  order: 2
---

## Package with the spec File

Run this command from the project directory that contains `P4CaseSync.spec`. The project imports modules dynamically, so the build needs the hidden imports declared in the spec file.

```bash
pyinstaller P4CaseSync.spec
```

The generated executable is at `dist/P4文件名大小写同步工具.exe`

## What the spec File Does

`P4CaseSync.spec` is configured for:
- Single-file packaging (`--onefile`)
- No console window (`--noconsole`)
- Hidden imports: `LoginUI`, `MainUI`, `Core`
- Output filename: `P4文件名大小写同步工具`

To change settings such as filename or icon, edit `P4CaseSync.spec`:
- Rename: Find the line `name='P4文件名大小写同步工具'`
- Add an icon: Change `icon=None` to `icon='icon.ico'`
- Show the console: Change `console=False` to `console=True` for debugging

The project uses `InjectSysPath()` to add module paths dynamically. PyInstaller cannot automatically identify modules under `Source/UI` and `Source/Logic`. The spec file explicitly declares these modules through `hiddenimports` to ensure packaging succeeds.

## Packaging Options and Notes

**Do not mix** command-line packaging options with a spec file:
```bash
# ❌ 错误示例
pyinstaller -F -w P4CaseSync.spec  # 会报错

# ✅ 正确用法
pyinstaller P4CaseSync.spec
```
