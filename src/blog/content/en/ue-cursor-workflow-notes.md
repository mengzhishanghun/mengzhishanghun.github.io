---
title: "Cursor with Unreal 5.6 on Windows: establish the build first"
description: These notes describe Windows and UE 5.6. The original record did not preserve complete Cursor or extension versions, so it is not a compatibility prom
type: blog
slug: ue-cursor-workflow-notes
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: ue-cursor-workflow-notes
publishedAt: 2026-10-13
sourceHash: e46efaeef3cdfdad3f3e98a46e57224d7a11db87e56c6f5593fd38899c76b4da
generatedBodyHash: 52170ed031d610df3e7e6a6a7ee9cffc1a11a76dfcd5f550ef0b1e9d55ba8dfc
translationStatus: translated
---

Cursor + UE from Scratch: A Guide from Getting Started to Giving Up
===

This tutorial only covers installation on Windows. The test environment uses UE5.6.

# Environment Setup

If you already have a build environment installed and can run VS or Rider normally, you can skip this step.
## Download and Install the Compiler Toolset

[Microsoft Visual C++ (MSVC) Compiler Toolset](https://visualstudio.microsoft.com/downloads/).

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A1>)

## Configure VS

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A2>)

Select the three options shown in the image, then click Install.

# Configure Cursor

### Download and Install Cursor

[Cursor: The Best Way to Code with AI](https://cursor.com/cn)
## Open the Extensions View

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A3>)
## Install the Chinese Language Pack

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A4>)

Search for Chinese and install the first result. After installation, you will be prompted to restart. Click Restart.
## Install the C++ and C# Extensions

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A5>)

Search for C++ and install the C/C++ extension and the C# extension.

Your final set of extensions should look like this:

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A6>)

These are usually installed automatically after installing C/C++ and C#. If they are missing, try restarting or install them manually.

## Set VSCode as the Default Source Code Editor

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A7>)

## Regenerate the VSCode Workspace

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A8>)

## Set the Workspace to Open with Cursor

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A9>)

## Configure IntelliSense

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A10>)

## Debug and Run

Open the Debug panel.

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A11>)

Select Editor Development mode.
![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A12>)

Click the arrow on the left or press F5 to start compiling.

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A13>)

Wait for compilation to finish.

# Troubleshooting

## cppvsdbg Is Not Supported

![](</media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A14>)

# References

[Setting Up Visual Studio Code for Unreal Engine | Unreal Engine 5.6 Documentation | Epic Developer Community](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/setting-up-visual-studio-code-for-unreal-engine)

[Setting Up Visual Studio Development Environment for C++ Projects in Unreal Engine | Unreal Engine 5.6 Documentation | Epic Developer Community](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine)

[How to Setup Cursor IDE for Unreal Engine](https://www.youtube.com/watch?v=9Km1GyYCnh4)
