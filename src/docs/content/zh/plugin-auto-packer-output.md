---
title: 检查打包产物
type: doc
slug: plugin-auto-packer-output
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 打包
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: features
  slug: output
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/output/
lang: zh
translationKey: doc:plugin-auto-packer:output
---

## 输出目录和错误日志

- 按插件名和引擎名在 `PackagedPlugins/插件名/引擎名/` 中找对应的包。
- 启用自动整理后，检查包内的文件和生成的配置是否符合本次发布要求。
- 某个引擎版本打包失败时，打开其输出目录中的 `Failed.log` 查看报错。

## 日志和引擎状态

每个引擎的状态图标会显示等待中、打包中、成功、失败或已取消。打包时可以实时查看日志，点击相应引擎可切换日志。
