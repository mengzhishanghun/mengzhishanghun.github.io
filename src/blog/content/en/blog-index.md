---
title: Blog
type: page
slug: blog-index
draft: false
sitePublish: true
websiteRoute: /blog/
template: blog/index.html
lang: en
translationKey: blog-index
sourceHash: 4f9195bf0db48edfed2b216cf961cb3767ea7e34b4f17ed7771c699e4ee5cb63
translationStatus: translated
generatedBodyHash: b591da04053518e0aca985f6f84d68603e6a49a370d8d5e0de6570df113471a1
---

![](/media-occurrence/page%3Ablog-index%3Amedia%3A1)

# Blog

Technical thoughts, troubleshooting, and development records

UE 35 · C++ 2 · Python 4 · Perforce 7

Search this category

Default order

Tags

[## Source-built Unreal on Windows: a shared engine association

On Windows, copies of the same source-built engine can receive different registration identifiers. That creates unnecessary `EngineAssociation` change

](/blog/ue-source-engine-association/)[## Unreal Blueprint parameters: references and display names

A C++ reference parameter may appear as a different Blueprint pin direction than expected. Type, `const` and metadata all matter. These UE5 reflected

](/blog/ue-uparam-reference-metadata/)[## Cursor with Unreal 5.6 on Windows: establish the build first

These notes describe Windows and UE 5.6. The original record did not preserve complete Cursor or extension versions, so it is not a compatibility prom

](/blog/ue-cursor-workflow-notes/)[## Fab submission notes: review the package and instructions together

A feature working in the development project does not prove that a delivery package can be installed and reproduced. These notes distill past Unreal p

](/blog/ue-fab-submission-notes/)[## Unreal DataTable and JSON: validate before replacing

JSON files can become DataTable rows, but clearing the table before parsing can destroy old data on a later failure. This workflow targets a UE5 C++ e

](/blog/ue-datatable-json-import-export/)[## Saving Unreal editor assets: checkout, dirty state and results

An automation tool may change an asset without updating its file. Possible causes include a clean package, an incorrect target path or source-control

](/blog/ue-editor-asset-saving/)[## Breaking Level Instances in batches: bound the work and stop on failure

Breaking a Level Instance may expose nested instances. A loop that continues whenever it finds an instance can repeat forever when one cannot be broke

](/blog/ue-level-instance-break-safety/)[## Parsing game expressions: define the grammar before precedence

Game events may evaluate text such as `1 + 2 * 3`. Rejecting a few patterns with regex and deleting array tokens does not establish a complete grammar

](/blog/ue-expression-parser-basics/)[## Everyday C++ choices: containers, sorting and value categories

Choose containers and sorting by access patterns and ordering requirements rather than old compiler implementation details. This article uses C++17 se

](/blog/cpp-algorithms-containers-value-categories/)[## Updating Excel by column names in Python: tuple keys and separate output

A reference workbook supplies values to update a target using several matching columns. Joining keys with underscores makes `("A_B", "C")` collide wit

](/blog/python-excel-column-update/)[## Comparing directories in Python: start with a content-difference report

When only some files changed between two large directories, you need additions, modifications and removals. The original workflow also copied files an

](/blog/python-directory-diff-report/)[## Switching Perforce stream workspaces: preflight and failure boundaries

A button that changes Client Stream, syncs and cleans can place local changes under the wrong view. This article describes a generic Python protection

](/blog/python-perforce-stream-switch-safety/)[## Fixing Missing GI Across Multiple Views in UE 5.3

A UE 5.3 source-build record of changing the maximum view count from 2 to 3 across seven locations, with a source screenshot and version limits.

LumenMultiple viewsUE 5.3](/blog/ue53-multiview-gi/)[## How to Let AI Modify DataAsset Directly

Discusses format selection, property conversion, repeated triggers, and file writes in bidirectional DataAsset and JSON synchronization.

AI · DataAsset · JSON](/blog/cnblogs-20159718/)[## Component State Contamination and Repair in Blueprint Inheritance

Analyzes abnormal CreationMethod values in Actor Blueprint component templates and the inspection and repair workflow across inheritance chains, SCS, and ICH.

Blueprints · Inheritance chain](/blog/cnblogs-20030737/)[## How to Fix UMG Size Staying Unchanged When Rendering

When rendering UMG, you may encounter a frustrating situation: the rendered UMG size does not change with your chosen output resolution.

UMG · Rendering](/blog/cnblogs-19813721/)[## How to Create Rounded Rectangles with a Material

I no longer remember when I recorded this, but found it while organizing my notes. It creates a rounded rectangle through a material. The values were set for three screens because the intended use was a project with a combined three-screen display. Adjust them before using it elsewhere.

Materials](/blog/cnblogs-19379355/)[## How to See Exactly Which Files Were Packaged

This is an output after packaging, different from the usual packaged files. It lets you see all the included configuration files, assets, and plugins.

Packaging](/blog/cnblogs-19379306/)[## Material Basics: The If Node

This image came from a beginner in a group chat a couple of days ago, asking why the material is invisible when dissolve is 0.

Materials](/blog/cnblogs-19379337/)[## Changing the Cache Path

The simplest approach is to search for \Engine\Config\BaseEngine.ini using Everything.

Cache · Configuration management](/blog/cnblogs-19379365/)[## Loading Costs of StaticMeshActor and ISM/HISM

Discusses object organization and loading costs for individual StaticMeshActors and instanced meshes, along with property handling when merging manually.

StaticMesh · ISM · HISM · Performance optimization](/blog/cnblogs-19204715/)[## Keys to Runtime Animation Recording: Correctly Retrieving and Saving Bone Data

The two most critical issues when implementing runtime animation recording in UE 5.4 are:

Animation · Bones](/blog/cnblogs-19197541/)[## A Small Tip for Chinese and English Bilingual Settings

I've noticed many newcomers to UE lately, so I put together a few small tips to share.

Localization](/blog/cnblogs-19183986/)[## Quickly Creating a Map

This only covers quickly creating a usable standard map, not a World Partition map.

Levels](/blog/cnblogs-19184043/)[## What to Do When Only One Screen Displays after Going Fullscreen across Multiple Screens

This discusses a problem after starting a game with several screens combined into one display using NVIDIA Surround.

Multi-screen display](/blog/cnblogs-19174288/)[## How to Call a DLL

Here's my approach. I'm not sure whether it's correct, but it works, haha. I followed the official third-party library setup. I'll skip packaging the DLL and focus on what to do once you have the DLL and Lib. Using the TestThird plugin created from the official template as an example, place the dll and lib files in TestThird\Source\ThirdParty\TestTh…

DLL](/blog/cnblogs-19174295/)[## PixelStreaming

Enable the PixelStreaming plugin.

PixelStreaming](/blog/cnblogs-19165494/)[## A Complete Guide to UE Network Programming: UDP, TCP, and WebSocket Implementations

Explains UE network communication through UDP, TCP client, TCP server, and WebSocket examples, covering threads, reconnection, sessions, and serialization.

UDP · TCP · WebSocket](/blog/cnblogs-19165484/)[## How to Synchronize Exposure across Multiple Screens

Create a LocalPlayer and override the function.

Multi-screen display · Exposure](/blog/cnblogs-19165561/)[## How to Implement an SSH Tunnel in UE for Secure Access to Remote Services

Compares calling the system SSH client from UE with integrating libssh2, explaining port forwarding, thread handling, and resource release.

SSH](/blog/cnblogs-19165541/)[## How to Set Up a Listen Server

The simplest way to start a listen server is to create a desktop shortcut and change its target to UnrealEditor.exe MyProject.uproject ?listen -game.

Listen server](/blog/cnblogs-19165553/)[## Seamless Map Travel

Seamless map travel differs from traditional level streaming. Level streaming places sublevels inside a map and switches between them by loading and unloading those sublevels. Seamless map travel first moves to a simple map, loads the destination map in the background, and then moves to it after loading completes.

Levels · Seamless travel](/blog/cnblogs-19165504/)[## Custom Configuration with DeveloperSettings

Create a class derived from UDeveloperSettings. In its class attributes, Config=Game means configuration in Game.ini; adding DefaultConfig makes it DefaultGame.ini. The value after config= is the configuration file name, so this example uses DefaultVehicle.ini.

DeveloperSettings · Configuration management](/blog/cnblogs-19165500/)[## Fixing Missing Context in UObject Blueprints

Usually, when you create a Blueprint derived from UObject, you find that you cannot even retrieve PlayerController.

UObject · Blueprints](/blog/cnblogs-19165488/)[## Traversing All Actor Properties for Sequence Recording

This recursively sets the structs in the Actor that need recording to CPF_Interp. That property flag means the value can be recorded by LevelSequence. The function traverses all properties inside the structs and also sets them to CPF_Interp.

Actor · Sequence](/blog/cnblogs-19165520/)[## Fixing MetaHuman Head Clipping during Animation with One Click

I encountered this recently in a MetaHuman project: when different head and body animations play simultaneously, clipping appears around the neck. The same issue has not been observed in LevelSequence so far.

MetaHuman · Animation](/blog/cnblogs-19136316/)[## How to Create Dynamic Enums in UE

Explains UE enum reflection, configuration array binding, and subsystem initialization, recording the basic approach's data validation and reuse limitations.

Enums](/blog/cnblogs-19136345/)
