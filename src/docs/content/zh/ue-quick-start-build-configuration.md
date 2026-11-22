---
title: 自定义编译和启动行为
type: doc
slug: ue-quick-start-build-configuration
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
  slug: build-configuration
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/build-configuration/
lang: zh
translationKey: doc:ue-quick-start:build-configuration
---

## 编写 UEBuildConfig.json

在项目根目录创建 `UEBuildConfig.json` 可自定义编译行为：

```json
{
  "Build": {
    "Platform": "Win64",
    "Configuration": "Development",
    "AdditionalArgs": []
  },
  "AutoOpenProject": true,
  "AutoCloseOnSuccess": true,
  "CloseDelayMs": 1500
}
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| Build.Platform | Win64 | 目标平台 |
| Build.Configuration | Development | 编译配置（Development/Shipping 等） |
| Build.AdditionalArgs | [] | 额外编译参数 |
| AutoOpenProject | true | 编译成功后自动打开项目 |
| AutoCloseOnSuccess | true | 打开项目后自动关闭工具 |
| CloseDelayMs | 1500 | 关闭延迟（毫秒） |
