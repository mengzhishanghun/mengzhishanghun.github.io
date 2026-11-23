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
sourceHash: 0a58977fb5fa172656485ac7e4c558972e3b1e4de742d30276194ce3de807569
translationStatus: translated
generatedBodyHash: 3697d40f05d590b3430cb0aa3fd40c6f28870842896ac80b16cc134e529302b2
docPage:
  work: ue-quick-start
  group: getting-started
  slug: open-project
  order: 1
---

## Requirements

Run the tool on Windows. Set up the build environment and run the project successfully on this machine at least once before using the tool.

## Build and open the project

1. Place `UEQuickStart.exe` in the project root, alongside `.uproject`.
2. Double-click the executable. The log window shows build progress and errors.
3. The tool opens the project by default after a successful build. If the build fails, use the troubleshooting steps below to find the error.

![UEQuickStart build window after detecting a project](/media-occurrence/doc%3Aue-quick-start%3Aopen-project%3Amedia%3A1)

The top of the window shows the project name, engine version, and current status. Build logs appear below. This screenshot uses Unreal Engine 5.7 and shows `编译中...` (building); no build result is shown yet.

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

Make sure the tool is in the UE project root. Copy `UEQuickStart.exe` or `Main.py` + `Source/` to the directory containing `.uproject`.

### Engine installation path not found

Check whether the engine registration is missing. For a Launcher engine, confirm it was installed through Epic Games Launcher, verify the engine files there, and reinstall if needed. For a source-built engine, check that the GUID in `.uproject` matches its registry entry.

### Build fails

Read the specific error in the log window. If you need help, share the error with the teammate responsible for the build.
