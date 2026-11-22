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
sourceHash: 746782761ada0cdd3329f828df68464d1ace6159223829587e7a5f85bde042f1
translationStatus: translated
generatedBodyHash: 191d251e96a926cc0e8c5e2308e87a89412e5018a7672a652f6469d6aeff831e
docPage:
  work: plugin-manager
  group: workflows
  slug: enable-disable
  order: 2
---

### Plugin Operations
- **Enable/disable** - Modify .uproject with confirmation for dependency chains
- **Restore defaults** - Remove .uproject overrides to restore the plugin's default state
- **Move plugins** - Move between project and Marketplace locations; engine plugins cannot be moved
- **Delete plugins** - Move to the recycle bin; engine plugins cannot be deleted
- **Directory correction** - Rename garbled folders to match the plugin name

## Notes

- **Before operations**: Close the UE editor before moving, deleting, or correcting plugin directories
- **Read-only files**: The tool automatically removes the read-only attribute for compatibility with version control systems such as Perforce
- **Conflicting plugins**: Delete one of the same-name plugins before enabling or moving the other
