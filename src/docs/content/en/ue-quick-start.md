---
title: UEQuickStart User Guide
description: Complete product user guide for UEQuickStart
type: doc
slug: ue-quick-start
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Compilation
  - Launch tools
workIds:
  - ue-quick-start
documentKind: product-manual
websiteRoute: /docs/zh/tools/ue-quick-start/
lang: en
translationKey: ue-quick-start
sourceHash: f1aa1a372fefea4b3044399eea17d387b8ebd802f5a4ceccb986cd2e2773df87
translationStatus: translated
generatedBodyHash: a04485a4ffa14f5ce2df6ef2b3867c31d89583c0080489f18a2093a7957cadb6
---

# UEBuildToGO Tutorial

## Prerequisite

The project must have run successfully at least once on this machine, ensuring the build environment is configured.

## Quick Start

1. Place `UEBuildTool.exe` in the project root, alongside `.uproject`
2. Double-click to run it
3. Wait for compilation to finish; the project opens automatically

## Configuration

### Automatically Detected Values

| Item | Source |
|------|------|
| Project name | `.uproject` filename |
| Engine version | `EngineAssociation` in `.uproject` |
| Engine path | Windows registry / Epic Games Launcher configuration |

### Optional Configuration File

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

## Frequently Asked Questions

### Q: “No .uproject file found”

**Cause**: The tool is not in the UE project root.

**Solution**: Copy `UEBuildTool.exe` or `Main.py` + `Source/` to the directory containing `.uproject`.

---

### Q: “Cannot find the engine installation path”

**Cause**: The engine was not installed through Epic Games Launcher, or its registry information is missing.

**Solution**:
1. Confirm the engine was installed through Launcher
2. Try verifying the engine files in Launcher
3. Reinstall the engine

---

### Q: Compilation fails

**Solution**: Check the specific error messages in the log window and ask a programmer to help diagnose the issue.

---

### Q: Source line endings cause build failures during cross-platform collaboration (Mac/Linux)

**Cause**: Mac/Linux use LF (`\n`) or CR (`\r`) line endings, which MSVC on Windows may not process correctly.

**Solution**: Before building, the tool automatically scans source files and converts line endings to CRLF (`\r\n`). No manual action is required.

**Scan scope**:
- `Source/` and `ThirdParty/` directories
- All `Source/` and `ThirdParty/` directories found recursively under `Plugins/`

**Supported file types**: `.h`, `.c`, `.cpp`, `.cs`, `.inl`

---

### Q: Is UE4 supported?

**Yes**. The tool automatically detects the editor:
- UE5: `UnrealEditor.exe`
- UE4: `UE4Editor.exe`

---

### Q: Are source-built engines supported?

**Yes**. The tool automatically recognizes GUID-format engine versions in `.uproject` and retrieves the corresponding engine path from the registry.

---

### Q: Are macOS / Linux supported?

**Not yet**. Currently only Windows is supported; cross-platform functionality remains to be developed.
