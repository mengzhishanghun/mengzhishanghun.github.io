---
title: Edit Animation Blueprints and State Machines
type: doc
slug: mcp-animation-animation-blueprint
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/animation-blueprint/
lang: en
translationKey: doc:mcp-animation:animation-blueprint
sourceHash: 74cda1cdb4fdba391085470f2ffb64882a56138fe930582f9ec7473e9e966b74
translationStatus: translated
generatedBodyHash: 416ed38f3a917b82a707b09aa2bc1084031ca3a0ad39f034ba8b9971fa8bac6e
docPage:
  work: mcp-animation
  group: editing
  slug: animation-blueprint
  order: 1
---

## Find and inspect state machines

| Tool | Purpose |
|---|---|
| `ListAnimBlueprints` | List Animation Blueprints with stable pagination. |
| `GetAnimBPOverview` | Read Animation Blueprint, AnimGraph, and state machine summaries. |
| `GetStateMachineDetail` | Read bounded state, transition, and conduit summaries. |

## Edit and compile animation blueprints

| Tool | Purpose |
|---|---|
| `CreateAnimBlueprint` | Create an Animation Blueprint for a Skeleton. |
| `AddState` / `RemoveState` | Add or remove a state. |
| `SetStateAnimation` | Set an animation only when a unique Sequence Player directly driving the state result can be confirmed. |
| `AddTransition` | Create a transition between two states. |
| `SetTransitionRule` | Set a supported transition rule. |
| `CompileAnimBlueprint` | Compile and return diagnostics from AnimGraphs, state graphs, and transition graphs. |

Complex or ambiguous state result graphs are not modified by guesswork. Simplify them to one direct driver or edit them manually in Unreal Editor.

For paths, transactions, and saving, see how to [open and save animation assets](/en/works/mcp-animation/docs/find-assets/).
