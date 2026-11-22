---
title: Rename Assets Automatically or in Batches
type: doc
slug: simple-asset-namer-rename-assets
draft: false
sitePublish: true
tags:
  - Asset Management
  - Naming Conventions
workIds:
  - simple-asset-namer
documentKind: product-manual
websiteRoute: /en/works/simple-asset-namer/docs/rename-assets/
lang: en
translationKey: doc:simple-asset-namer:rename-assets
sourceHash: 26cd148be109cad6d0daffe74da584e7061547519238b218e85c7d8ce0e714ef
translationStatus: translated
generatedBodyHash: 0e5bb9d6ea659a75bcb634a46043d4b608bf6a0dd19a52d112a26cc5e6b56a37
docPage:
  work: simple-asset-namer
  group: workflows
  slug: rename-assets
  order: 2
---

## 2. Usage

### 2.1 Automatic Renaming

| Option | Trigger |
|------|---------|
| Auto Rename on Create | Automatically rename assets on creation or import |
| Auto Rename on Rename | Correct names automatically after manual renaming |

**Example**: Create Blueprint `MyCharacter` → automatically renamed to `BP_MyCharacter`

### 2.2 Batch Renaming through the Context Menu

All context-menu entries are grouped under the **Simple Asset Namer** submenu.

**Asset context menu**
1. Select one or more assets
2. Right-click → **Simple Asset Namer** → **Auto Rename**

**Folder context menu**
1. Right-click a folder
2. **Simple Asset Namer** → **Auto Rename All Assets**

### 2.3 Smart Processing Strategy

Folder batch renaming uses three progressive stages:

| Stage | Condition | Processing |
|------|------|---------|
| Fast batch | Total >= 100 | Process in 10 batches |
| Retry failures | Any batch failed | Combine failed batches and retry once |
| Individual processing | Failures remain | Process individually with detailed errors |

When the total is < 100, assets are processed individually from the start.

### 2.4 Results Dialog

After completion, a results window appears with three tabs:
- **Success**: Assets successfully renamed
- **Errors**: Failed assets and reasons
- **Skipped**: Skipped assets and reasons

**Common errors**:
| Error message | Description |
|---------|------|
| Source control not connected | Version control is disconnected |
| Checked out by another user | File checked out by another user |
| File is read-only | File is read-only |
| Target file already exists | Destination file already exists |
| Asset has unsaved changes | Asset contains unsaved changes |

---

## 3. Frequently Asked Questions

**Q: Will renaming break asset references?**

No. The official UE API automatically handles references and creates redirectors.

**Q: Can it be undone?**

Yes, Ctrl+Z undo is supported.

**Q: Why were some assets not renamed?**

1. The name already follows the standard
2. No naming rule is configured for that asset type
3. Filter rules exclude the path
4. The file is read-only and cannot be checked out

**Q: How do I add a custom rule?**

Settings → Asset Type Naming Rules → Click + to add a rule.

**Q: What if batch renaming reports many unknown errors?**

Fix redirectors first: Content Browser → right-click folder → Fix Up Redirectors in Folder, then run renaming again.

---

## Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

### Step 3: Start Using It

-   **Automatic mode**: Work normally; assets are named automatically on creation/import
-   **Batch mode**: Select a folder and use batch renaming

## Automatic Processing Toggles

- bAutoRenameOnCreate: Apply naming rules when assets are created or imported.
- bAutoRenameOnRename: Recheck naming rules after manual renaming.

## Viewing Results

Batch renaming displays a detailed results dialog containing:

-   Success counts and details (old name → new name)
-   Skip counts and reasons, such as already standard, no matching rule, or existing target
-   Error counts and specific information

## Batch Operations

Select the target folder and use the batch-renaming entry point. Check included or excluded paths first, then review success, skip, and error details. Retain a recoverable version before batch operations and check asset references after renaming.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770922).
