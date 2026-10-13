---
title: Fixing Missing GI Across Multiple Views in UE 5.3
description: A UE 5.3 source-build record of changing the maximum view count from 2 to 3 across seven locations, with a source screenshot and version limits.
type: blog
slug: ue53-multiview-gi
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags:
  - Lumen
  - Multiple views
  - UE 5.3
lang: en
translationKey: ue53-multiview-gi
sourceHash: 5ed4409541952b043a6e7c61a4488e414aababa0568e13a41dd047e14a90664a
translationStatus: translated
generatedBodyHash: 82803880bfb2fd1f917d898f14310d888586c7a75cce4890249d5837db2e6018
---

# Fixing Missing GI Across Multiple Views in UE 5.3

# Change Record

The engine source must be changed because the relevant values are fixed in the implementation. This change does not work with a non-source build. The original record uses UE 5.3 as its example.

The screenshot below records changing the maximum view count from 2 to 3 across seven related locations.

![](/media-occurrence/blog%3Aue53-multiview-gi%3Amedia%3A1)

The engine needs to be rebuilt after these changes. The screenshot records the modification locations rather than a complete patch. Check the corresponding implementation again when changing engine versions.

# Related Case

This addresses the Lumen GI issue in a three-screen display. [Read the case on resolving inconsistent three-screen display in a driving test simulator](https://mzsh.me/cases/driving-simulator-three-screen/). Exposure synchronization is a separate part of that case.
