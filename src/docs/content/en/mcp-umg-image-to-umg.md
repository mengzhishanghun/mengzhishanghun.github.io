---
title: Build UMG from a Reference Image
type: doc
slug: mcp-umg-image-to-umg
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/image-to-umg/
lang: en
translationKey: doc:mcp-umg:image-to-umg
sourceHash: c02659fbad0d4332531a4d11e591d61e7800326d51c40af8c7b6f93addd7955c
translationStatus: translated
generatedBodyHash: 913a2c300c69690bb122a3b27194e5442d5317da07270c37cb0a03be4740ff45
docPage:
  work: mcp-umg
  group: features
  slug: image-to-umg
  order: 2
---

MCPUMG does not connect to image models or store model keys inside the plugin. The AI client interprets the reference image, checks its text, identifies reusable components and generates a structured specification. MCPUMG follows that specification to validate, build, measure, and save Unreal Engine assets. It does not interpret the reference image itself.

`ApplyWidgetTreePatch` supports complete-tree and incremental patches. To change only an existing widget’s properties or layout, use the dedicated property or layout tools.

## From specification to preview and save

Before you start, gather the reference image, the target Widget Blueprint path, and the image files you plan to import. If the target already has widgets, read its tree first and identify which widgets to keep and which to change. Use that distinction to choose between a complete tree specification and an incremental patch.

1. Call `GetUIDesignCapabilities` to read the current schema, limits, and supported Widget and style capabilities.
2. Have the AI generate a Widget specification with `schemaVersion=1`, stating the design dimensions, layout assumptions and asset sources.
3. Use `ImportUITexture` to import PNG/JPEG files. Overwriting existing assets is disabled by default.
4. Use `ApplyWidgetTreePatch` with `dryRun` to preview the complete tree or incremental operations.
5. The dry run returns simulated results. For the actual call, retain the pre-preview `expectedRevision` and `expectedFingerprint`, change `dryRun` to `false`, obtain the canonical `inputHash` again, and execute the same operations.
6. Apply structured Brush, text or Button state styles with `SetWidgetStyle`.
7. Read back the structure and properties with `ExportWidgetSpec` and `GetWidgetTree`.
8. Check screen-pixel bounds, clipping, text overflow and resource status with `InspectWidgetLayout`.
9. Capture the design or runtime view with `CaptureWidgetScreenshot` or `CaptureRuntimeWidgetScreenshot`.
10. Compare it with the reference using `CompareUIImages`, then have the AI generate the next patch from the differences.
11. After checking the result, call `SaveWidgetBlueprint` and `SaveUIAsset` separately to save the exact target packages.

## Check the running version and file locks

- At the start of each session, use `tools/list` from the running editor as the authority. Updated source or installation files do not mean an open editor has loaded the new DLL. If the tool count or capability descriptions differ, check the deployment directory and restart the target editor.
- An old `-game`, PIE or second editor process for the same project may still hold a `.uasset` file handle. If `SaveWidgetBlueprint` fails, inspect `LogSavePackage` and the system error code in the project log. Windows `Error 32` means a sharing violation. Close only a stale process whose command line explicitly identifies the same project, then retry the exact save.
- Do not bypass file locks with `Save All`, external file overwrites or repeated patches. If the patch succeeded but saving failed, memory may already contain the new version. Keep the current editor open, release the lock and call `SaveWidgetBlueprint` without repeating the write operation.
- `CaptureRuntimeWidgetScreenshot` requires the MCPUMG editor module to be loaded and the target Widget instance to exist. A process started only with `-game` may not load editor modules. For runtime measurement, use an editor PIE/Game session with the plugin loaded.

## Widget Spec v1

The top-level specification contains:

- `schemaVersion`: fixed at `1`.
- `BlueprintPath`: the single target Widget Blueprint.
- `expectedRevision`, `expectedFingerprint`: optimistic concurrency checks.
- `requestId`, `inputHash`: identifiers for idempotent calls.
- `dryRun`: preview or actual execution. Recalculate `inputHash` when this field changes.
- `operations`: `create`, `set`, `move`, `rename`, `remove`.

Stable names identify nodes, which contain `class`, `parent`, `order`, `properties` and `slot`. Before making changes, the plugin checks for a single root, cycles, container compatibility, names, properties, Slots, node count, depth and the cumulative text budget. Errors should return an exact JSON Pointer.

## Check the rendered layout

`dryRun` checks the tree and properties. To diagnose clipping or text overflow, let the page finish rendering and then [inspect its layout](/en/works/mcp-umg/docs/layout-inspection/). For corners, Brushes, or Button padding, see [Style Widgets](/en/works/mcp-umg/docs/widget-styles/).

## Scope of changes and saving

- `dryRun` does not modify a real Widget Blueprint, compile it or save it.
- One patch operates on one Widget Blueprint. Treat each changed package as a separate operation.
- The complete final tree is simulated before changes; a successful operation refreshes and compiles only once.
- Deleting or renaming also updates navigation bindings that can safely migrate within the same Widget tree. The operation is rejected if safety cannot be established for dependencies such as external Blueprint graphs, animations, events, variables or C++ `BindWidget`.
- Image files, decoded pixels, Widget count, hierarchy depth, request text and response bodies all have hard limits.
- Every save accepts exactly one target package and never runs Save All.
- A reference image cannot uniquely specify interactions, hidden content or responsive rules. The AI must record assumptions in the specification; the plugin does not infer business logic.
