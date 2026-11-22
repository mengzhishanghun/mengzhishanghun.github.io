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
sourceHash: 8f1e49e92f518f68cbf3fcce1cdc836d3f567c754907ef886d8c05bba18e4816
translationStatus: translated
generatedBodyHash: 8b070db07c167a8a324a26c758e822fedf463ad9bc1cd1c7876bf7d7b9ad569c
docPage:
  work: ue-quick-start
  group: build
  slug: build-configuration
  order: 1
---

## Create UEBuildConfig.json

Create `UEBuildConfig.json` in the project root to customize build behavior:

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
| CloseDelayMs | 1500 | Close delay in milliseconds |
