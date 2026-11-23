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
sourceHash: 7707e059e0bcd17178383d9c6399642d6d0d9efdbd92cfc474e978deac7601bd
translationStatus: translated
generatedBodyHash: 53269030bcca6a4c9d6ec4059c75322170c7531cdd5a6ea7c8e7172921fb116e
docPage:
  work: mcp-umg
  group: features
  slug: layout-inspection
  order: 3
---

## Diagnostic scope in Design and PIE modes

`dryRun` validates the tree and properties without running Slate layout. Design mode in `InspectWidgetLayout` provides metadata only. PIE mode adds direct Slate parent bounds, up to 64 clipping ancestors (at most 256 entries per page), and signs of vertical overflow, including automatically wrapped text. If you see `PossibleAncestorClipping` or `PossibleVerticalOverflow`, use the screenshot to locate the affected area. `Unverified*` means the tool could not determine the result.

Ancestor rectangles are screen-space axis-aligned bounding boxes, not the final paint clipping region. Rotation, OnDemand, ClipToBoundsWithoutIntersecting, custom painting and stale cached geometry can affect the findings. The tool does not create instances, force preview data or change runtime state for diagnostics. Let the real page finish its layout before inspecting the target instance.

## Interpret clipping and scaling

Find the clipped widget in the screenshot, then compare its actual bounds with its immediate parent and clipping ancestors. If a button label does not fit, for example, check how much width the button leaves for the text, then check whether an outer container also clips it.

Use PIE mode in InspectWidgetLayout to read actual dimensions, layout scale, parent bounds, clipping ancestors and signs of text overflow. Design mode cannot establish actual layout results. Unverified does not mean a check passed. Rotated bounding boxes, conditional clipping and stale caches still require screenshots for interpretation.

Button style NormalPadding adds to ButtonSlot Padding. A child widget cannot use the outer SizeBox dimensions directly as its available space; check the actual internal layout.

## Find why a button cannot be hit

`InspectWidgetHitTest` accepts BlueprintPath, WidgetName and optional InstanceIndex. It checks the target center by default. You can supply LocalX/LocalY together in the target's own local coordinates. It only queries the target window's cached hit-test grid, without moving the mouse, clicking or changing focus.

The result contains bTargetOnHitPath, target enabled/visibility state, keyboard focus and up to 64 Slate path nodes. TargetNotOnCachedHitPath can result from occlusion, disabled state, hit-test visibility or cache state; it does not identify a single specific fault. Other windows, mouse capture and actual event execution are outside this diagnostic's scope. The call fails explicitly when there is no runtime instance or valid geometry.

Recommended order: confirm the session, read the layout, inspect hit testing, adjust layout/properties, read back, test real interaction, then save the exact target.
