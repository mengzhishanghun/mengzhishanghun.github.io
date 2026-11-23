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
sourceHash: db35446eb94039411a0317e891a8f628e0b3a5a560437cd36013c2679cca86f3
translationStatus: translated
generatedBodyHash: 3a97056e10203ebe19453f22ead996ab3be3a4ed467a34a157effda99672f828
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
