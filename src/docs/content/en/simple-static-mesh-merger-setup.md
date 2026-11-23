---
title: Open the Tool and Find Its Controls
type: doc
slug: simple-static-mesh-merger-setup
draft: false
sitePublish: true
tags:
  - StaticMesh
  - Instancing
workIds:
  - simple-static-mesh-merger
documentKind: product-manual
websiteRoute: /en/works/simple-static-mesh-merger/docs/setup/
lang: en
translationKey: doc:simple-static-mesh-merger:setup
sourceHash: 94c2264eb01f04f7969679fe121396f402c19205ae5c1ec14aa8e5896c6ce535
translationStatus: translated
generatedBodyHash: c60c3200666b8da2898f3be21bd43e33c68070559f8ce8b95b80993937034c10
docPage:
  work: simple-static-mesh-merger
  group: getting-started
  slug: setup
  order: 1
---

## Open Static Mesh Merger

1. Open Unreal Engine Editor
2. Click top menu `Window > Static Mesh Merger`
3. The editor opens a dockable tool panel.

## Find the Toolbar Controls

If you only need to merge actors in the persistent level, click **Refresh** to see the groups. To include actors in nested levels, review the scope before clicking **Break Level Instances**. Skip that step if the LevelInstances should stay intact.

Use **Break Level Instances** to break apart LevelInstances, **Refresh** to update the preview, and **Merge Selected** to merge the selected groups. The type dropdown offers HISM and ISM, with HISM selected by default.

![SimpleStaticMeshMerger group preview and instance list](/media-occurrence/doc%3Asimple-static-mesh-merger%3Asetup%3Amedia%3A1)

Candidate groups appear on the left, with the selected group's actors on the right. Check the filters, instance counts, and selection before running Merge Selected.
