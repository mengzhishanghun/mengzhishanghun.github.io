---
title: Install and Set Up Source Control
type: doc
slug: simple-asset-cleaner-setup
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/setup/
lang: en
translationKey: doc:simple-asset-cleaner:setup
sourceHash: 4f534305e469b5be819fb7ef7a63356b67ca9100ed6bd6c9b16b420f2f8bf954
translationStatus: translated
generatedBodyHash: b73e624fed668d639abffd19045ab7689b2e4abcf97e51c0b110e5823bccf442
docPage:
  work: simple-asset-cleaner
  group: setup
  slug: setup
  order: 1
---

## Install and Enable the Plugin

1.  Copy the plugin folder into your project's `Plugins` directory
    
    ```
    YourProject/
    └── Plugins/
        └── SimpleAssetCleaner/
    ```
    
2.  Open the project and search for `SimpleAssetCleaner` under `Edit > Plugins`
    
3.  Enable it and restart the editor

## Choose a Source Control Provider

In `Editor > Preferences > Source Control`, select the provider your project uses. The plugin integrates through the UE API with providers such as Perforce, Git, Subversion, and Plastic SCM. It wraps the provider automatically to check assets on submission. Do not select `Perforce_Proxy`, `Git_Proxy`, or another provider ending in `_Proxy`.

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A1)

## Open Project Settings

Open **Editor > Project Settings > General > Simple Asset Cleaner**. `Language` defaults to English. Switching to Chinese updates the UI and logs immediately, without a restart.

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A2)

## Checks Before Your First Submission

Review the root assets and directories to keep. Maps are roots by default, and plugin and engine assets outside the project are excluded. Review the settings before using `Enable Auto Clean`; on first use, open the submission window on a test branch and review the candidates. `Clean All Source Control Assets` scans the whole project and can delete files locally and from source control.

## Verbose Logging

`Enable Verbose Logging` is off by default. Turn it on in Project Settings during your first trial or when troubleshooting. It lists scanned files, unreferenced candidates, cleanup actions, and reference traces. Turn it off when you no longer need the detail.
