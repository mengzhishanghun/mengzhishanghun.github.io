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
sourceHash: 843bcef181fadbd7f7e890969cd1cfb089224d81ed526f7be794d4528e81a842
translationStatus: translated
generatedBodyHash: 1bad82615d692bbabff20f390063d23198b43099e33effe2d0a1f76769e3dd8f
docPage:
  work: plugin-manager
  group: plugins
  slug: enable-disable
  order: 2
---

## Change the Enabled State

Use the buttons on the right to enable, disable, or restore defaults for the selected plugin. Enabling or disabling writes to `.uproject`; the tool asks for confirmation when the dependency chain is affected. Restore Defaults removes the plugin’s override from `.uproject`.

## Resolve Same-Name Conflicts

If two plugins have the same name, remove one before enabling the other.
