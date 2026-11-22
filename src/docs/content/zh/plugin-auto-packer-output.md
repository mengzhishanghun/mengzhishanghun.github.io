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
  group: packaging
  slug: output
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/output/
lang: zh
translationKey: doc:plugin-auto-packer:output
---

## 输出目录和错误日志

- 插件将被打包到 `PackagedPlugins/插件名/引擎名/` 中
- 如启用自动整理，插件中会包含清理后的文件与自动生成的配置
- 如果打包失败，会在对应目录生成 `Failed.log`

## 日志和引擎状态

每个引擎的状态图标会显示等待中、打包中、成功、失败或已取消。打包时可以实时查看日志，点击相应引擎可切换日志。
