---
title: "Saving Unreal editor assets: checkout, dirty state and results"
description: "An automation tool may change an asset without updating its file. Possible causes include a clean package, an incorrect target path or source-control "
type: blog
slug: ue-editor-asset-saving
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
translationKey: ue-editor-asset-saving
publishedAt: 2026-10-13
sourceHash: 9eb208bf814dcc2db70be9a3893ef7b03891c6a157039e74a582fca0d12eab3f
generatedBodyHash: 2ed83a96c971e1342c220982ec92f5b47b548535ea6a67e0ba1a25e5df349cd1
translationStatus: translated
---

# Saving Unreal editor assets: checkout, dirty state and results

## Problem and environment
An automation tool may change an asset without updating its file. Possible causes include a clean package, an incorrect target path or source-control restrictions. This article concerns UE5 editor asset saving, not a general game-runtime save system.

## Establish the object and permission first
For an existing asset, obtain its actual package rather than calling `CreatePackage` for an uncertain path. For a new asset, create the correct package, place the object in it and register it as a new asset. Do not call `AssetCreated` on every save of an existing asset. A long package name such as `/Game/Data/Example` is not a filesystem path; use package-path utilities to convert it.

Use the Source Control checkout workflow and check locks and permissions. Stop if checkout fails. Making a file locally writable does not acquire a Perforce lock, open it for edit or resolve another user's checkout. Do not bypass the workflow to make a save succeed.

## Minimum workflow
```text
Check Editor context, object, package and destination
Confirm source control permits editing; check out existing managed files
Create a transaction and call Modify before mutation
Modify the object and mark its package dirty
Use the current editor save API or UPackage::SavePackage
Inspect the result; preserve the error and dirty state on failure
```

## Try it and understand the limits
Modify an existing asset in a temporary project copy, save, close and reopen it to inspect the field. A failed checkout should stop the operation and preserve the disk file. Test new and existing assets separately rather than testing only writable folders without source control. This workflow has not been run in the editor; verify API signatures, result types and module dependencies for the UE version used.
