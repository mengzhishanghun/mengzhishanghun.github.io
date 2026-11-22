---
title: 打包独立 EXE
type: doc
slug: p4-case-sync-build-and-environment
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-case-sync
docPage:
  work: p4-case-sync
  group: distribution
  slug: build-and-environment
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-case-sync/docs/build-and-environment/
lang: zh
translationKey: doc:p4-case-sync:build-and-environment
---

## 用 spec 文件打包

本项目使用动态路径导入，需要通过 **spec 文件**指定隐藏导入。

```bash
pyinstaller P4CaseSync.spec
```

生成的 exe 位于 `dist/P4文件名大小写同步工具.exe`

## spec 文件作用

`P4CaseSync.spec` 已配置：
- 单文件打包（`--onefile`）
- 无控制台窗口（`--noconsole`）
- 隐藏导入模块：`LoginUI`, `MainUI`, `Core`
- 输出文件名：`P4文件名大小写同步工具`

如需修改配置（如文件名、图标），编辑 `P4CaseSync.spec` 文件：
- 修改名称：找到 `name='P4文件名大小写同步工具'` 这行
- 添加图标：将 `icon=None` 改为 `icon='icon.ico'`
- 显示控制台：将 `console=False` 改为 `console=True`（用于调试）

本项目使用 `InjectSysPath()` 动态添加模块路径，PyInstaller 无法自动识别 `Source/UI` 和 `Source/Logic` 下的模块。spec 文件通过 `hiddenimports` 参数显式声明这些模块，确保打包成功。

## 打包参数与注意事项

**不要将**命令行参数与 spec 文件混用：
```bash
# ❌ 错误示例
pyinstaller -F -w P4CaseSync.spec  # 会报错

# ✅ 正确用法
pyinstaller P4CaseSync.spec
```

## 构建排查

- 颜色规则判断（最终版）：  
  1) 更改后 == 更改前 → 灰  
  2) 更改后 != 更改前 且 更改后 == 自动值 → 绿  
  3) 更改后 != 自动值 → 红  
- 双击**整行**弹出编辑框；编辑后立即刷新颜色  
- 一致性校验失败 → 自动尝试双步移动（临时名 → 目标名）再校验
