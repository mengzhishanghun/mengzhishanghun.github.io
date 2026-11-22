---
title: Detect, Build, and Open a UE Project
type: doc
slug: ue-quick-start-open-project
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Compilation
  - Launch tools
workIds:
  - ue-quick-start
documentKind: product-manual
websiteRoute: /en/works/ue-quick-start/docs/open-project/
lang: en
translationKey: doc:ue-quick-start:open-project
sourceHash: 800282d6c2ecb64ae4a68508cd4c6133b4dff58805153e560bb4babb51ffe4e1
translationStatus: translated
generatedBodyHash: eb595a2b880e1073c5e8c6743a9131090fd1aac039354468535d4969f6682f62
docPage:
  work: ue-quick-start
  group: setup
  slug: open-project
  order: 1
---

## Requirements

Run the tool on Windows. Set up the build environment and run the project successfully on this machine at least once before using the tool.

## Build and open the project

1. Place `UEBuildTool.exe` in the project root, alongside `.uproject`.
2. Double-click the executable and watch the build progress in the log window.
3. After a successful build, the tool opens the project by default.

## How the tool detects projects and engines

| Item | Source |
|------|------|
| Project name | `.uproject` filename |
| Engine version | `EngineAssociation` in `.uproject` |
| Engine path | Windows registry / Epic Games Launcher configuration |

### UE4 and UE5 editors

The tool detects the editor for the engine version:
- UE5: `UnrealEditor.exe`
- UE4: `UE4Editor.exe`

### Source-built engine detection

The tool automatically recognizes GUID-format engine versions in `.uproject` and retrieves the corresponding engine path from the registry.

## Startup and build troubleshooting

### No .uproject file found

Make sure the tool is in the UE project root. Copy `UEBuildTool.exe` or `Main.py` + `Source/` to the directory containing `.uproject`.

### Engine installation path not found

Check whether the engine registration is missing. For a Launcher engine, confirm it was installed through Epic Games Launcher, verify the engine files there, and reinstall if needed. For a source-built engine, check that the GUID in `.uproject` matches its registry entry.

### Build fails

Read the specific error in the log window. If you need help, share the error with the teammate responsible for the build.
