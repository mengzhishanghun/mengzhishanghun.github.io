---
title: "Fab submission notes: review the package and instructions together"
description: A feature working in the development project does not prove that a delivery package can be installed and reproduced. These notes distill past Unreal p
type: blog
slug: ue-fab-submission-notes
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
translationKey: ue-fab-submission-notes
publishedAt: 2026-10-13
sourceHash: 33320438752751b62a2c0f918365608831f2e436e061dd64abeceedd2070951a
generatedBodyHash: e89ce754bfcc5a5d0404d71590bfa8bc35ce67ad930a8d327b126e3971a80aa0
translationStatus: translated
---

# Fab submission notes: review the package and instructions together

## Problem and scope
A feature working in the development project does not prove that a delivery package can be installed and reproduced. These notes distill past Unreal publishing experience without describing a particular plugin product or claiming to state current Fab review rules.

## Prepare a reproducible delivery
Keep a separate candidate-package directory instead of cleaning the development directory. Check descriptor version, module type, loading phase, content support and platforms against the actual delivery. Instructions should cover installation, supported engine versions, dependencies, the shortest usage path and known limits. Include licensing and third-party dependency information.

Install the candidate in a clean test project, follow the minimum tutorial and check the promised Editor and packaged targets separately. Source and precompiled deliveries need different files. Do not always delete `Binaries`, or assume `Installed: true` makes a source plugin compile in a Blueprint-only project. Check that `FilterPlugin.ini` matches the actual packaged files when additional files are needed.

## Listing and descriptor
Describe supported environments and user tasks, with demonstration images from the candidate version. A documentation URL should lead to accessible documentation rather than contain a sentence describing a file location. Character limits and `FabURL`/`MarketplaceURL` workarounds in the original notes were historical observations, not current requirements here. Use the platform form, official requirements and actual feedback on submission day.

## Example check and limits
Extract the candidate ZIP into a temporary project. Confirm that referenced tutorial files exist, dependencies are documented and versions agree, then record the engines and platforms actually tested. No new upload or current-rule verification was performed for this article; it cannot promise review approval.
