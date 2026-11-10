---
title: Fixing Missing GI Across Multiple Views in UE 5.3
description: "Increase the maximum view count from two to three in a UE 5.3 source build to address missing Lumen GI in a three-screen scene. Screenshots mark seven source changes; the engine must be rebuilt."
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
sourceHash: "ffccc5248e47f32b12f605d40a5b481ed541b402d813fe98e17fedca6b88245f"
translationStatus: translated
generatedBodyHash: "4c74508b6d95981f84f123ce0954f14e13be03b00a94d6fd6386aa235411ca9b"
websiteCoverUrl: "/media/covers/blog/ue53-multiview-gi-20261101.webp"
coverAlt: "Fixing Missing GI Across Multiple Views in UE 5.3 cover"
---

How to Fix Missing GI in Multiple Views
===

You must modify the source code here because the value is hardcoded. Changes to a non-source build will have no effect.

Using UE5.3 as an example:

The following example changes the maximum number of views from 2 to 3. There are seven places to modify in total.
![](</media-occurrence/blog%3Aue53-multiview-gi%3Amedia%3A1>)
