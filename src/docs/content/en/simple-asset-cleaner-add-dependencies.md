---
title: Add Untracked Dependencies
type: doc
slug: simple-asset-cleaner-add-dependencies
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/add-dependencies/
lang: en
translationKey: doc:simple-asset-cleaner:add-dependencies
sourceHash: 4f3c56bed38fe119112815d45e4fb322068dcb3761105b8150d928f32aa8cb94
translationStatus: translated
generatedBodyHash: c347b07538d5f2eb03eab8cf17e17557c8093825dc44e0df813d2943fb6f993f
docPage:
  work: simple-asset-cleaner
  group: workflows
  slug: add-dependencies
  order: 2
---

## Automatically Add Untracked Dependencies on Submission

When submitting a changelist, the plugin automatically checks dependencies of assets being submitted. If dependent files are not yet under version control, a dialog lists them. Select the dependencies to add using checkboxes; confirming automatically adds them to version control.

- **Trigger**: Automatically when submitting a changelist
- **Detection**: Files depended on by pending assets that are not yet under version control
- **Operation**: A dialog lists untracked dependencies; select and confirm to add them
- **Toggle**: Enable or disable this through “Enable Auto Add Dependencies” in settings

---

### Add Untracked Dependencies

Checks dependencies of selected assets, finds files outside version control, and lists them for user confirmation before adding them.

- Supports selecting one or multiple files or folders

> The context menu acts precisely on the selection, making it suitable for everyday cleanup and dependency checks on particular directories or assets.

---

#### Enable Auto Add Dependencies
- **Default**: Enabled
- **Function**: Automatically detect untracked dependency files during submission
- **Behavior**: A dialog lists untracked dependencies; selected files are added after confirmation
- **Recommendation**: Keep enabled to prevent missing dependencies from breaking other team members' builds

### Automatic Dependency Addition

| Dependency status | Action |
|---------|---------|
| Already under version control | No action required |
| Not under version control | Listed in a confirmation dialog for the user to select files to add |

---
