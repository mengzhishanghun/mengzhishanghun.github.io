---
title: 2026-09-15
type: doc
slug: ue-package-manager-updates-2026-09-15
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - ue-package-manager
docPage:
  work: ue-package-manager
  group: changelog
  slug: updates-2026-09-15
  order: 79739085
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/updates-2026-09-15/
lang: en
translationKey: doc:ue-package-manager:updates-2026-09-15
sourceHash: 00983144aba7b33279ac91be328785c95291e429c326695b4f190b4f89e9913e
translationStatus: translated
generatedBodyHash: ab2267da68bfde74a0a15b4f3a993175f0bb726c331409b472416ffe16a51909
---

## v2.0.0

**Breaking change:** The GUI removes the project and engine pickers. Both paths are read-only, and the GUI no longer loads recent projects. Keep the EXE in the project root or launch it from the project root.

- The tool finds the project using the sole `.uproject` in the EXE directory or the current working directory. The GUI disables packaging if the tool cannot find a project.
- The tool first uses `EngineAssociation` in the `.uproject` to find the engine. If that fails, it uses the source engine path saved for this project through the CLI.
- The CLI still accepts `--project-root` and `--engine-root`.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v2.0.0).

## v1.2.0

The GUI adds an option to clean old packages before packaging. Before each cleanup, the GUI shows what it will clean and asks for confirmation. The CLI flag `--clean-output` applies to the current run only and is never saved as a project default.

Cleanup checks the output path selected when packaging starts and removes only old packages it can identify by the project’s entry EXE. Changing the output path leaves the previous one untouched. If no old package is recognized, packaging proceeds without deleting anything. The tool refuses to clean the project root, a drive root, any parent of the project root, or directories outside the current output path.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.2.0).

## v1.1.1

The Stop button now uses a Windows Job Object to terminate the entire UAT process tree. This keeps UAT child processes from holding the output pipe open after you click Stop.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.1.1).

## v1.1.0

Packaging now supports `DebugGame`, `Development`, `Test`, and `Shipping`. Only `Shipping` enables compression. Full `Debug`, which usually requires a source engine, is unavailable. Use `DebugGame` for standard project code debugging. The extra-file controls and packaging buttons now share one row.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.1.0).

## v1.0.1

Fixed the console window that stayed open after double-clicking to launch the GUI. The GUI now hides the shared console. The console and its output remain visible when you run the CLI.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.0.1).

## v1.0.0

The single `UEPackageManager.exe` supports Windows x64. Double-click to open the GUI or pass arguments to use the CLI. It packages Win64 projects in `Development` and `Shipping` configurations.

- The tool finds the Launcher engine via `EngineAssociation` in the `.uproject`, or you can select a source engine manually. Each `.uproject` has its own project path, engine, output directory, packaging configuration, and copy rules.
- After Unreal Engine finishes packaging successfully, the tool can copy selected files or folders into specified subdirectories in the package and check that the copies are complete. Destinations must stay within the package root. The tool excludes version control, IDE cache, `.trash`, and Python cache directories. It skips extra copies if packaging fails.
- This release performs no Git, SVN, or Perforce operations. It does not close Unreal Editor automatically or delete the project or output directory.

The EXE has no commercial code signature. Use the included SHA-256 file to verify the download.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.0.0).
