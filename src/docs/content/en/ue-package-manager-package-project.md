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
sourceHash: 5ae9b3f05a84daac74ba3a22be8f9d0ae10cc99dd5e8810dce7c314899869c84
translationStatus: translated
generatedBodyHash: 4fc4faa3029f8a1b21a28292638a1e08888d01782182cfc6de844f23138e62d8
docPage:
  work: ue-package-manager
  group: features
  slug: package-project
  order: 1
---

## Package from the GUI

![](/media-occurrence/doc%3Aue-package-manager%3Apackage-project%3Amedia%3A1)

Check the project and UE directories shown at the top of the window. Then choose the Archive output directory and build configuration. The output directory cannot be the project root. Choose `DebugGame`, `Development`, `Test`, or `Shipping`. `Shipping` also enables compression. Click Start Packaging, then check the log at the bottom of the window for progress and the result.

## Command-line packaging and examples

Run `validate` to check the configuration, then use `package --dry-run` to preview the UAT command. When the command looks right, remove `--dry-run` to start packaging. You can omit `--project-root` when running from the project root. Commands return `0` on success or `2` for argument, configuration, or execution errors.

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
