---
title: 编译前修复源码换行符
type: doc
slug: ue-quick-start-normalize-line-endings
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 编译
  - 启动工具
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: build
  slug: normalize-line-endings
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/normalize-line-endings/
lang: zh
translationKey: doc:ue-quick-start:normalize-line-endings
---

## 转换时机、目录和文件类型

协作项目中的 LF (`\n`) 或 CR (`\r`) 换行符可能影响 Windows 上的 MSVC 编译。工具会在编译前扫描并修改匹配的源码文件，将换行符转为 CRLF (`\r\n`)，无需手动转换。

扫描以下位置：

- 项目中的 `Source/`、`ThirdParty/`。
- `Plugins/` 下递归找到的 `Source/`、`ThirdParty/`。

处理的文件类型为 `.h`、`.c`、`.cpp`、`.cs` 和 `.inl`。
