---
title: UEPackageManager User Guide
description: Complete product user guide for UEPackageManager
type: doc
slug: ue-package-manager
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /docs/zh/tools/ue-package-manager/
lang: en
translationKey: ue-package-manager
sourceHash: f779f7b72c3e428c81888a9a147e57a858044b23461cdbfdef9cf0e9e1564139
translationStatus: translated
generatedBodyHash: 7975b31e771dd50c7c2b8bcbf7ecd81684af11df75185b10400a8e3b62d6ec01
---

# UEPackageManager

A general-purpose Unreal Engine project packaging tool. It provides GUI and command-line modes, invokes Unreal Automation Tool to perform Build, Cook, Stage, Pak, and Archive, and deploys specified files or folders into the package after packaging succeeds.

## Download and Run

Download `UEPackageManager.exe` from [Releases](https://github.com/MZSH-Tools/UEPackageManager/releases/latest).

- Double-click the EXE without arguments to hide the console and open the GUI.
- Run a subcommand in a terminal to retain the console and CLI output.
- Place the EXE in the project root containing `.uproject` and double-click it. The project and associated engine are detected automatically and cannot be selected or changed in the GUI.
- Launching from a terminal in the project root also detects them automatically. If the EXE is elsewhere, the GUI refuses to package and tells you the correct location.
- The current EXE does not have commercial code signing. Windows may show a SmartScreen prompt on first launch. Use the SHA-256 file included with the Release to check download integrity.

## Graphical Interface

![](/media-occurrence/doc%3Aue-package-manager%3Amedia%3A1)

| Feature | Purpose | Notes |
|---|---|---|
| Project | Automatically reads `.uproject` beside the EXE or in the current working directory | Read-only in the GUI to prevent switching to another project |
| UE directory | Automatically detected from `EngineAssociation` | Read-only in the GUI; source-built engines can be configured through the CLI |
| Output directory | Select the Archive output location | The project root cannot be used directly |
| Build configuration | `DebugGame`, `Development`, `Test`, or `Shipping` | Shipping additionally enables compression |
| Clean old package | Remove recognized old packages from the current output path before packaging | The checkbox is saved with the project configuration; each actual cleanup still requires confirmation |
| Additional files | Copy files or folders after success | Each rule can specify a destination subdirectory inside the package and recursive ignore patterns |

Additional copying runs only after UE packaging succeeds. Directory copying skips `.trash`, `.svn`, `.git`, `.codex`, `.agents`, `.vs`, `.idea`, `__pycache__`, and `.pyc`, and checks file integrity afterward. Each rule also supports semicolon-separated name patterns to recursively ignore files or folders at any level, with `*` and `?` wildcards, for example `README*.md; Cache`. The destination must be a relative directory inside the package root; absolute paths, drive letters, and `..` are prohibited. Recursive ignore entries accept name patterns only and cannot contain paths.

## Isolated Project Configuration

Each `.uproject` gets an independent project ID based on its normalized absolute path:

```text
%LOCALAPPDATA%/UEPackageManager/Projects/<ProjectID>/config.json
```

Project paths, engine directories, output directories, build configurations, and additional copy rules are not reused across projects. The GUI does not read a “recent project”; it binds only to the project associated with the current EXE or working directory. If the CLI cannot identify the project from the current directory, explicitly pass `--project-root`.

## CLI

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
When running in the project root, `--project-root` can be omitted. `--dry-run` prints the UAT command without starting packaging; `--no-copy` skips additional file deployment; `--clean-output` cleans only recognized old packages in the current output path before this packaging run. Changing the output path does not clean the previous location. Commands return `0` on success and `2` for argument, configuration, or execution errors.

## Running from Source

```bat
conda env create -f environment.yml
conda activate UEPackageManager
cd /d E:\Projects\MyGame
python E:\Tools\UEPackageManager\Main.py
python E:\Tools\UEPackageManager\Main.py validate --project-root E:\Projects\MyGame
```
On Windows, you can also double-click `Run.bat` to launch the GUI or use `CLI.bat` to run commands.

## Building a Single-File EXE

```bat
Build.bat
```
The build reads only `UEPackageManager.spec` and produces `dist/UEPackageManager.exe`. This EXE retains the CLI console and automatically hides it in GUI mode with no arguments.

## Current Scope

- Supports packaging Win64 projects on Windows.
- Supports `DebugGame`, `Development`, `Test`, and `Shipping`; full `Debug`, which usually requires a source-built engine, is not provided.
- Supports Epic Launcher engines and manually specified source-built engines.
- Does not package standalone plugins; use the corresponding plugin packaging tool for plugin releases.
- Does not automatically close Unreal Editor, delete projects or output directories, or perform Git, SVN, or Perforce operations.

## License

[MIT License](LICENSE)
