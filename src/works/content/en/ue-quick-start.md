---
title: UEQuickStart
description: Detect the project and engine, display build logs, and launch the project after a successful build.
type: work
slug: ue-quick-start
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 3
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - Compilation
  - Launch tools
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEQuickStart
lang: en
translationKey: ue-quick-start
sourceHash: e65ee6afd00c7d9c8aa3bc16349aea39fe05c8b72a0d452ebe9783d578d634eb
translationStatus: translated
generatedBodyHash: 0d6b3383579cea1079a7f484ac84d40e97397563c671a0b887d4144e9150fb82
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/tools/ue-quick-start/
  compatibility:
    - platforms:
        - UE project tool (operating system to be verified)
      requirements: []
---
## Overview

UEQuickStart provides a graphical build and launch entry point for existing Unreal Engine projects. It automatically detects the project and associated engine, displays live build logs, and permits project launch after compilation succeeds.

It targets members who need to update local projects but are unfamiliar with command-line builds.

## Background and goals

Artists, designers, and other members sometimes need local compilation after receiving new assets or code. Depending on programmers for each operation or waiting for prebuilt Binaries synchronization can constrain project verification.

The work brings project detection, build progress, and launch into one window so users can see whether the build succeeded and inspect logs when it fails.

## Core capabilities

### Project and engine detection

The tool detects the UE project and associated engine from the current environment, reducing manual selection errors. Results must still match the actual working directory. This capability targets existing projects and does not create them.

### Pre-build processing

Before compilation, the tool can normalize source line ending differences caused by cross-platform collaboration. This changes the relevant text files, but does not solve source errors or missing dependencies.

### Logs and launch

Live logs show build progress and failure details. After success, users can launch the project from the tool, connecting compilation to opening the project. Failed builds still require actual problems to be fixed from the logs and cannot be treated as runnable.

## Use cases

It suits project members with configured environments who need to compile locally and open the editor after asset or code updates. Teams can also use logs to report specific errors to build maintainers instead of only saying the project will not open.

## Scope and limitations

Only Windows is currently supported. The machine must already have a configured build environment and have successfully run the project before. The tool does not install UE, compilers, or dependencies, and does not guarantee new source will build. Diagnose and fix code, module, or environment errors using the logs.

For operation steps and parameter details, see the [user guide](/en/docs/tools/ue-quick-start/).
