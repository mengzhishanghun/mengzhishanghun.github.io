---
title: Inspect Layout, Clipping, and Hit Testing
type: doc
slug: mcp-umg-layout-inspection
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/layout-inspection/
lang: en
translationKey: doc:mcp-umg:layout-inspection
sourceHash: 4bfdac62b9ce9e316f71d08eb63357aec938c2a548689b0e5d9acfad513339b5
translationStatus: translated
generatedBodyHash: c5ad5c13b9c5d2e8662179bf7bda732ad34b00f64f1994d2a62a4446b129215d
docPage:
  work: mcp-umg
  group: widgets-layout
  slug: layout-inspection
  order: 3
---

## Diagnostic scope in Design and PIE modes

`dryRun` validates the tree and properties without running Slate layout. Design mode in `InspectWidgetLayout` provides metadata only. PIE mode adds direct Slate parent bounds, up to 64 clipping ancestors (at most 256 entries per page), and signs of vertical overflow, including automatically wrapped text. Locate `PossibleAncestorClipping` and `PossibleVerticalOverflow` issues using the actual screenshot. `Unverified*` means the tool did not have enough evidence to determine a result.

Ancestor rectangles are screen-space axis-aligned bounding boxes, not the final paint clipping region. Rotation, OnDemand, ClipToBoundsWithoutIntersecting, custom painting and stale cached geometry can affect the findings. The tool does not create instances, force preview data or change runtime state for diagnostics. Let the real page finish its layout before inspecting the target instance.

## Interpret clipping and scaling

Use PIE mode in InspectWidgetLayout to read actual dimensions, layout scale, parent bounds, clipping ancestors and signs of text overflow. Design mode cannot establish actual layout results. Unverified does not mean a check passed. Rotated bounding boxes, conditional clipping and stale caches still require screenshots for interpretation.

Button style NormalPadding adds to ButtonSlot Padding. A child widget cannot use the outer SizeBox dimensions directly as its available space; check the actual internal layout.

## Find why a button cannot be hit

`InspectWidgetHitTest` accepts BlueprintPath, WidgetName and optional InstanceIndex. It checks the target center by default. You can supply LocalX/LocalY together in the target's own local coordinates. It only queries the target window's cached hit-test grid, without moving the mouse, clicking or changing focus.

The result contains bTargetOnHitPath, target enabled/visibility state, keyboard focus and up to 64 Slate path nodes. TargetNotOnCachedHitPath can result from occlusion, disabled state, hit-test visibility or cache state; it does not identify a single specific fault. Other windows, mouse capture and actual event execution are outside this diagnostic's scope. The call fails explicitly when there is no runtime instance or valid geometry.

Recommended order: confirm the session, read the layout, inspect hit testing, adjust layout/properties, read back, test real interaction, then save the exact target.
