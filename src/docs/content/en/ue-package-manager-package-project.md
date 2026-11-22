---
title: Package a Project from the GUI or CLI
type: doc
slug: ue-package-manager-package-project
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/package-project/
lang: en
translationKey: doc:ue-package-manager:package-project
sourceHash: e9a7e87081d5577664e18a7240ea7d9329364f5f60aae60aa5f2cd9edde893df
translationStatus: translated
generatedBodyHash: 428887068b7d6534761619ac792d40f7775d6e01319fd41adf0a3bb578bdb7bc
docPage:
  work: ue-package-manager
  group: packaging
  slug: package-project
  order: 1
---

## Package from the GUI

![](/media-occurrence/doc%3Aue-package-manager%3Apackage-project%3Amedia%3A1)

Confirm the project and engine shown in the GUI, choose the Archive output directory and build configuration, then start packaging. The project root cannot be used as the output directory. Choose `DebugGame`, `Development`, `Test`, or `Shipping`. `Shipping` also enables compression. Check the log for progress and the result.

## Command-line packaging and examples

Run `validate` to check the configuration, then run `package --dry-run` to see the UAT command. Remove `--dry-run` to start packaging. When running from the project root, you can omit `--project-root`. Commands return `0` on success and `2` for argument, configuration, or execution errors.

```bat
UEPackageManager.exe --version
UEPackageManager.exe config-show --project-root E:\Projects\MyGame
UEPackageManager.exe configure --project-root E:\Projects\MyGame --configuration Shipping --output E:\Builds\MyGame
UEPackageManager.exe copy-list --project-root E:\Projects\MyGame
UEPackageManager.exe copy-add --project-root E:\Projects\MyGame --source E:\Assets\Data --target-directory . --ignore README*.md --ignore Cache
UEPackageManager.exe copy-remove --project-root E:\Projects\MyGame --index 0
UEPackageManager.exe validate --project-root E:\Projects\MyGame
UEPackageManager.exe package --project-root E:\Projects\MyGame --dry-run
UEPackageManager.exe package --project-root E:\Projects\MyGame
```

## Supported builds and scope

- Package Win64 projects on Windows using an Epic Launcher engine or a manually specified source-built engine.
- Full `Debug` builds (which usually require a source-built engine) are unavailable. Use a separate tool to package a standalone plugin.
- The tool does not automatically close Unreal Editor, delete projects or output directories, or perform Git, SVN, or Perforce operations.
