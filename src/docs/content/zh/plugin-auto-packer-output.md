---
title: 整理打包产物
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
  group: workflows
  slug: output
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/output/
lang: zh
translationKey: doc:plugin-auto-packer:output
---

## 📤 打包输出说明

- 插件将被打包到 `PackagedPlugins/插件名/引擎名/` 中
- 如启用自动整理，插件中会包含清理后的文件与自动生成的配置
- 如果打包失败，会在对应目录生成 `Failed.log`

---

## ⚠️ 当前限制

- 仅支持构建 Windows 平台插件（Win64）
- 暂不支持 Mac / Linux
- 插件目录需规范，必须包含 `.uplugin` 文件

---

## 📄 许可证

本项目采用 [MIT License](<https://github.com/MZSH-Tools/UEPluginAutoPacker/blob/1a1e43b283fcb6deb561cba0636d1e28bc634f8a/LICENSE>) 协议开源，欢迎自由使用、修改和分发。

---

## 📬 联系方式

作者邮箱：**mengzhishanghun@outlook.com**  
如有定制功能或合作需求，欢迎联系！
