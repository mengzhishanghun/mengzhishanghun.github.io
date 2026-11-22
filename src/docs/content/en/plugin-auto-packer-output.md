---
title: Organize Package Output
type: doc
slug: plugin-auto-packer-output
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Packaging
workIds:
  - plugin-auto-packer
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/output/
lang: en
translationKey: doc:plugin-auto-packer:output
sourceHash: 16a256f80e52b101854c280a064cfe5677d2fe941b3bfd43e29fc89d68677f1b
translationStatus: translated
generatedBodyHash: 81265af59d9ed658ddc487238e1556726e2762a81dc0bf16802f70898fa61ee6
docPage:
  work: plugin-auto-packer
  group: workflows
  slug: output
  order: 2
---

## 📤 Packaging Output

- Plugins are packaged under `PackagedPlugins/插件名/引擎名/`
- With automatic organization enabled, the plugin includes cleaned files and generated configuration
- Packaging failures produce `Failed.log` in the corresponding directory

---

## ⚠️ Current Limitations

- Only Windows plugin builds (Win64) are supported
- Mac / Linux are currently unsupported
- The plugin directory must follow the expected structure and contain a `.uplugin` file

---

## 📄 License

This project is open source under the [MIT License](./LICENSE). You are welcome to use, modify, and distribute it.

---

## 📬 Contact

Author email: **mengzhishanghun@outlook.com**  
Contact me for custom functionality or collaboration!
