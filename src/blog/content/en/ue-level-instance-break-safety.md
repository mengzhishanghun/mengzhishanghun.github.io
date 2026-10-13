---
title: "Breaking Level Instances in batches: bound the work and stop on failure"
description: Breaking a Level Instance may expose nested instances. A loop that continues whenever it finds an instance can repeat forever when one cannot be broke
type: blog
slug: ue-level-instance-break-safety
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
translationKey: ue-level-instance-break-safety
publishedAt: 2026-10-13
sourceHash: 87e7ef8e455cfa291d55e7f1bc3dbd52b366445cffb914825f2af804a6ac684d
generatedBodyHash: acf334e0e30cc065e63c64bd8fa55cf8eec83ab0e66d7af7c4086d6fe9963e58
translationStatus: translated
---

# Breaking Level Instances in batches: bound the work and stop on failure

## Problem and environment
Breaking a Level Instance may expose nested instances. A loop that continues whenever it finds an instance can repeat forever when one cannot be broken. This article describes a UE5 editor workflow, not a runtime operation.

## Start with a copy
Back up the map and test a copy. Identify the world, selected instances and allowed nesting depth rather than traversing every world by default. Confirm levels are loaded, editable and permitted by source control. Use the current Level Instance editor API and retain each operation's success or failure result.

```text
Set maximum passes and maximum object count
Take a snapshot of candidates within the intended scope each pass
No candidates: complete
Recheck validity and editability, then attempt each break
Any failure: record the object and reason, then exit
Collect candidates again and confirm actual state change
No progress: exit and report; limit reached: report incomplete
```

A snapshot Actor may become invalid after another instance is broken, so check it again before use. A function call alone does not prove progress. Candidate count need not decrease either, because nested instances may increase it; compare object identity and operation results. Transactions improve undo, while backups remain the recovery foundation.

## Try it and understand the limits
Use one ordinary and one nested instance to check scope and results, then test an uneditable object or a failed operation to confirm bounded exit and an incomplete result. Reaching a pass limit is not success. This is a safety workflow; `BreakLevelInstance` was not compiled or called. Check its signature and editor conditions against your engine version.
