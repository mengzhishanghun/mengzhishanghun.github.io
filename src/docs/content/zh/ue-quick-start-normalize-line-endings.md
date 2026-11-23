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
  group: features
  slug: normalize-line-endings
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/normalize-line-endings/
lang: zh
translationKey: doc:ue-quick-start:normalize-line-endings
---

## 转换时机、目录和文件类型

在多人协作的项目里，LF (`\n`) 或 CR (`\r`) 换行符可能影响 Windows 上的 MSVC 编译。运行编译时，工具会先扫描下列目录，把匹配文件的换行符直接改为 CRLF (`\r\n`)。

扫描以下位置：

- 项目中的 `Source/`、`ThirdParty/`。
- `Plugins/` 下递归找到的 `Source/`、`ThirdParty/`。

处理的文件类型为 `.h`、`.c`、`.cpp`、`.cs` 和 `.inl`。
