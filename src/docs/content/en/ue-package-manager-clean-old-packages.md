---
title: Clean Old Packages
type: doc
slug: ue-package-manager-clean-old-packages
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/clean-old-packages/
lang: en
translationKey: doc:ue-package-manager:clean-old-packages
sourceHash: 950c440fef81dab0b70836094c3a1ee6d55a5969a72fcac1132dbef22fba8293
translationStatus: translated
generatedBodyHash: ff94b9a9f221385b0ee082fc600a29b03f1518237519ae41d212f792fe58e6fd
docPage:
  work: ue-package-manager
  group: features
  slug: clean-old-packages
  order: 4
---

## Choose the cleanup scope

Check the current output path, then select Clean old package in the GUI. The tool remembers the selection but asks you to confirm before each cleanup. In the CLI, use `--clean-output` to request cleanup before the current build.

The tool cleans only recognized old packages in the current output path. It does not delete the entire output directory or clean the previous path when you change the output location.
