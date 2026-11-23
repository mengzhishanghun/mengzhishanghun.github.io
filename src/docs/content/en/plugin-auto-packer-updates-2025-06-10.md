---
title: 2025-06-10
type: doc
slug: plugin-auto-packer-updates-2025-06-10
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-10
  order: 79749390
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2025-06-10/
lang: en
translationKey: doc:plugin-auto-packer:updates-2025-06-10
sourceHash: aa229739e32515679b95aa3ac703633203b2b0c300ec28a9ef0cc85f97347214
translationStatus: translated
generatedBodyHash: 7d9268af0b717e7fcdffeb623f286c7c76ed46ef44a1916c64cc5701409f2816
---

## v1.1.0

The packer now generates `FilterPlugin.ini` from the plugin directory and removes the manual editor from the GUI. This version excludes the `.uplugin` file and the `Binaries`, `Intermediate`, `Resources`, and `Source` directories.

The packer reads the author from `CreatedBy` in the `.uplugin` file and replaces existing copyright blocks in `.h`, `.cpp`, and `.Build.cs` files. The packaging log shows the generated filter, copyright text, and relative paths of the files it updates.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.0).
