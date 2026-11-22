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
sourceHash: b4dd9475f2ec0387293be93c3a9402c79c3cbd8c077ac7bbb0aea00993d61cbb
translationStatus: translated
generatedBodyHash: 1c1a5b4ca06cfc93c536ee0972d37d524674e2e014a66b10e9c37a64f7a4bd48
docPage:
  work: ue-package-manager
  group: output
  slug: clean-old-packages
  order: 2
---

## Choose the cleanup scope

Select Clean old package in the GUI. The tool saves the checkbox state with the project configuration and asks for confirmation each time it performs cleanup. Use `--clean-output` to request cleanup before the current CLI packaging run.

The tool cleans only recognized old packages in the current output path. It does not delete the entire output directory or clean the previous path when you change the output location.
