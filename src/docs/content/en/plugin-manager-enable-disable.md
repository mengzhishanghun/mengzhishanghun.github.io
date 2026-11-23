---
title: Enable and Disable Plugins
type: doc
slug: plugin-manager-enable-disable
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Dependency Analysis
workIds:
  - plugin-manager
documentKind: product-manual
websiteRoute: /en/works/plugin-manager/docs/enable-disable/
lang: en
translationKey: doc:plugin-manager:enable-disable
sourceHash: 859b25caf7b08177a688fff1e31709fa490dc7b792f5decf73e1c9f139daa5d0
translationStatus: translated
generatedBodyHash: d44b64133fbc697908379af0cc652a581702d51cee6d46f7b819511911322bf4
docPage:
  work: plugin-manager
  group: features
  slug: enable-disable
  order: 2
---

## Change the Enabled State

Select a plugin in the list, then use the buttons on the right to enable it, disable it, or restore its defaults. Enabling or disabling records your choice in `.uproject`. If the tool prompts you about dependency changes, review the affected plugins before confirming. Restoring defaults removes the plugin’s explicit setting from `.uproject` so its default state applies.

## Resolve Same-Name Conflicts

If two plugins in the project have the same name, check where each one comes from. Remove one before enabling the other.
