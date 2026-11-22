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
sourceHash: f80078e47fe96205b730f811ff620901fba38b9c06f8d16410c2667e55d112bf
translationStatus: translated
generatedBodyHash: 4f58466bf249727e600abeeae46bcc42d4c5820d9941fa85d5b7e2515daf6e9e
docPage:
  work: mcp-animation
  group: workflows
  slug: animation-blueprint
  order: 2
---

### Animation Blueprint and state machine editing

| Tool | Purpose |
|---|---|
| `CreateAnimBlueprint` | Create an Animation Blueprint for a Skeleton. |
| `AddState` / `RemoveState` | Add or remove a state. |
| `SetStateAnimation` | Set an animation only when a unique Sequence Player directly driving the state result can be confirmed. |
| `AddTransition` | Create a transition between two states. |
| `SetTransitionRule` | Set a supported transition rule. |
| `CompileAnimBlueprint` | Compile and return diagnostics from AnimGraphs, state graphs, and transition graphs. |
