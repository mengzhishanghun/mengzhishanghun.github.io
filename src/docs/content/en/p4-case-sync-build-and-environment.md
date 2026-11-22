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
sourceHash: 8555607201f9c8fcb53ec34270ad98fa571deb6c3a7c07c1d7e2793d5d943b30
translationStatus: translated
generatedBodyHash: 2bd67e7ff3ebfaec6687be728f9aacad1072f1f4ecad9f8597844845aa7333ab
docPage:
  work: p4-case-sync
  group: distribution
  slug: build-and-environment
  order: 1
---

## Package with the spec File

This project uses dynamic path imports, so hidden imports must be specified through a **spec file**.

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

## Build Troubleshooting

- Color decision rules (final version):  
  1) After == Before → Gray  
  2) After != Before and After == Automatic value → Green  
  3) After != Automatic value → Red  
- Double-click the **entire row** to edit; colors refresh immediately afterward  
- Consistency check failure → Automatically try a two-step move (temporary name → target name), then check again
