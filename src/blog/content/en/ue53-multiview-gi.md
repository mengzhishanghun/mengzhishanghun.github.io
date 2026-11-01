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
sourceHash: "733f881a1ac880ca9fea55bbcdc6996c7da191bd196b9a111e5f6bb8fb428e1a"
translationStatus: translated
generatedBodyHash: 4c74508b6d95981f84f123ce0954f14e13be03b00a94d6fd6386aa235411ca9b
websiteCoverUrl: "/media/covers/blog/ue53-multiview-gi-20261101.webp"
coverAlt: "Fixing Missing GI Across Multiple Views in UE 5.3 cover"
---

How to Fix Missing GI in Multiple Views
===

You must modify the source code here because the value is hardcoded. Changes to a non-source build will have no effect.

Using UE5.3 as an example:

The following example changes the maximum number of views from 2 to 3. There are seven places to modify in total.
![](</media-occurrence/blog%3Aue53-multiview-gi%3Amedia%3A1>)
