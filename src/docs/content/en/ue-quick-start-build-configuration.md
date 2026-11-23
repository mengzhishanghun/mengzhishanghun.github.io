---
title: Customize Build and Launch Behavior
type: doc
slug: ue-quick-start-build-configuration
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Compilation
  - Launch tools
workIds:
  - ue-quick-start
documentKind: product-manual
websiteRoute: /en/works/ue-quick-start/docs/build-configuration/
lang: en
translationKey: doc:ue-quick-start:build-configuration
sourceHash: 164b5535423ce12bdbbd5a583dbbbd5c28ab3caddf94e5afb6025ba97dbee9e3
translationStatus: translated
generatedBodyHash: d16c8a04c47409fb8f87fe19f8bda8425e65b9afb73376a35cbed991f3be3ff6
docPage:
  work: ue-quick-start
  group: features
  slug: build-configuration
  order: 1
---

## Create UEBuildConfig.json

Create `UEBuildConfig.json` in the project root, next to `.uproject`. This example shows the default settings:

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
| Setting | Default | Description |
|--------|--------|------|
| Build.Platform | Win64 | Target platform |
| Build.Configuration | Development | Build configuration (Development/Shipping, etc.) |
| Build.AdditionalArgs | [] | Additional build arguments |
| AutoOpenProject | true | Open the project automatically after a successful build |
| AutoCloseOnSuccess | true | Close the tool automatically after opening the project |
| CloseDelayMs | 1500 | Time the tool waits before closing automatically, in milliseconds |
