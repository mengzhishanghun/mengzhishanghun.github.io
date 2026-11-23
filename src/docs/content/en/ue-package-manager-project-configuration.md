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
sourceHash: 31a3048d24961ccea841aa154d86b6b8be51f8365d22da213b05f15e0859caa5
translationStatus: translated
generatedBodyHash: cdac05fa937627be2dd4eb12b0dab6dd88ae7bdd18886da23c84de1d655c0164
docPage:
  work: ue-package-manager
  group: features
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

The project and UE directories are read-only in the GUI. The tool identifies them from the `.uproject` in the current directory and its `EngineAssociation`. Set the output directory and build configuration in the GUI. In the CLI, use `config-show` to view settings and `configure` to change them. Use the CLI to specify a source-built engine manually.
