---
title: Manage Project Packaging Settings
type: doc
slug: ue-package-manager-project-configuration
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/project-configuration/
lang: en
translationKey: doc:ue-package-manager:project-configuration
sourceHash: 24def0b8214473f91a7b72dca1d6877c39c44a1847cfaaa090fe86391eb1fe49
translationStatus: translated
generatedBodyHash: 0f30b916449eebf3e35ba8226672423c798c8f23db3f8a1420cef04536c1616a
docPage:
  work: ue-package-manager
  group: packaging
  slug: project-configuration
  order: 2
---

## Isolate settings by project

Each `.uproject` gets an independent project ID based on its normalized absolute path:

```text
%LOCALAPPDATA%/UEPackageManager/Projects/<ProjectID>/config.json
```

Project paths, engine directories, output directories, build configurations, and additional copy rules are not reused across projects. The GUI does not read a “recent project”; it binds only to the project associated with the current EXE or working directory. If the CLI cannot identify the project from the current directory, explicitly pass `--project-root`.

## Inspect and change settings

The project and UE directory are read-only in the GUI. The tool identifies them from the current project’s `.uproject` and its `EngineAssociation`. Set the output directory and build configuration in the GUI. In the CLI, use `config-show` to inspect settings and `configure` to change them. Use the CLI to configure a source-built engine.
