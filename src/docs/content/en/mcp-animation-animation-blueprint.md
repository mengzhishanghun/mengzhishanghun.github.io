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
sourceHash: 7fa42b3cb1c281b748b09f123c35599080113edc10cc329c47d372ef2a0b2bbb
translationStatus: translated
generatedBodyHash: 7386320e5bed2f56e7894b0d1b6c47dc1b0d806f3934b18ff930004625ab05b4
docPage:
  work: mcp-animation
  group: features
  slug: animation-blueprint
  order: 2
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

To replace the animation in an existing state, find the Animation Blueprint, identify the state machine in the overview, and locate the state in the machine details. Use `SetStateAnimation` only if one Sequence Player directly drives the state result. If the graph is ambiguous, edit it in Unreal Editor or simplify it to a single direct driver first. Run `CompileAnimBlueprint` after editing, address any graph diagnostics, and call `SaveAsset` to keep the change.

For paths, transactions, and saving, see how to [open and save animation assets](/en/works/mcp-animation/docs/find-assets/).
