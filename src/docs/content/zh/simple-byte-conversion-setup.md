---
title: 安装插件并查找节点
type: doc
slug: simple-byte-conversion-setup
draft: false
sitePublish: true
tags:
  - 蓝图
  - 序列化
workIds:
  - simple-byte-conversion
docPage:
  work: simple-byte-conversion
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-byte-conversion/docs/setup/
lang: zh
translationKey: doc:simple-byte-conversion:setup
---

## 安装与启用

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

启用插件后即可使用蓝图节点，无需手动管理子系统或插件的生命周期。

## 蓝图节点分类

图中按输入和输出列出了成对的转换节点。选好数据类型后，先将 `Bytes` 输出接到同一类型的还原节点，检查还原值，再接入通信或存储。

所有节点都在 `SimpleByteConversion` 分类下：

-   **基础类型**：搜索 `IntToBytes`、`FloatToBytes` 等
-   **结构体**：搜索 `StructToBytes`、`StructToJsonString` 等

- 所有节点均为 `BlueprintPure`——无需执行引脚
- 可组合用于网络、文件存取或自定义协议

![](/media-occurrence/doc%3Asimple-byte-conversion%3Asetup%3Amedia%3A1)
