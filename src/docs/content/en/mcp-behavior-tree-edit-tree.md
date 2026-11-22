---
title: Edit Behavior Trees and Set Blackboard Keys
type: doc
slug: mcp-behavior-tree-edit-tree
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
documentKind: product-manual
websiteRoute: /en/works/mcp-behavior-tree/docs/edit-tree/
lang: en
translationKey: doc:mcp-behavior-tree:edit-tree
sourceHash: a8fc6010d40d3213e3d41bde76ed10ad3877f3bddd75694b96cef58233615e4d
translationStatus: translated
generatedBodyHash: e7abb156ca0469545f71d22c60d1b63802e0940e33c1bbfda4573ea027973b9d
docPage:
  work: mcp-behavior-tree
  group: workflows
  slug: edit-tree
  order: 2
---

## Blackboard key rules

Supported key types are `Bool`, `Int`, `Float`, `Vector`, `Rotator`, `Name`, `String`, `Object`, `Class`, and `Enum`.

- `Object` and `Class` keys may specify `BaseClass`.
- `Enum` keys require `Enum`; `BaseClass` and `Enum` are rejected for unrelated key types.
- `KeyName` cannot be empty or `None`.
- A key selector is checked with Unreal's native filter semantics, including Object/Class base-class restrictions and Enum identity. A same-named key of the wrong type is invalid.
- `RemoveBlackboardKey` scans project Behavior Trees and refuses unresolved references or scan failures unless `bForce=true` explicitly accepts the risk.

## Editing behavior

Editing tools use Unreal transactions and mark affected packages dirty. Node properties use Unreal import-text strings; for example, booleans use `true`/`false`, enums use their names, and vectors use `(X=0.0,Y=0.0,Z=0.0)`. Property maps accept string values only, and a failed import leaves the property's previous value unchanged. Blackboard selector properties take a Blackboard key name and are validated against the selector's native type filters.

`SimpleParallel` has `Default` and `Background` output pins. Use `ParentOutputPin="Background"` when adding or moving the background subtree. Run validation before saving; validation reports structural errors, missing classes, invalid key bindings, invalid decorator abort modes, and unconnected nodes.
