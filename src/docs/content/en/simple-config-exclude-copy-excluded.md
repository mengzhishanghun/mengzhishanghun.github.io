---
title: Copy Excluded Config Files
type: doc
slug: simple-config-exclude-copy-excluded
draft: false
sitePublish: true
tags:
  - Packaging
  - Configuration Management
workIds:
  - simple-config-exclude
documentKind: product-manual
websiteRoute: /en/works/simple-config-exclude/docs/copy-excluded/
lang: en
translationKey: doc:simple-config-exclude:copy-excluded
sourceHash: 04ce617227930543313cd6cc416e18f1a6e6d8f8e170e5cf7388ef1531ee9bd2
translationStatus: translated
generatedBodyHash: e86900d3f753fc0a546d61b6ede7d50b7075f981e7c3507a2b32e87400d8f956
docPage:
  work: simple-config-exclude
  group: workflows
  slug: copy-excluded
  order: 2
---

### Copy

#### Copy Target Directory
- **Default**: /Windows
- **Function**: Target directory for copying excluded configuration files
- **Path format**: Relative to the project directory, such as `/Windows` or `/Build/Output`
- **Cross-platform**: Supports Windows, Mac, and Linux
- **Directory structure**: Preserves the original structure (`TargetDir/ProjectName/Config/xxx.ini`)
- **Copy button**: Copies all Disallowed configuration files to the target directory

### Example 3: Copy Excluded Files into the Packaged Output

After packaging, you may want to add excluded configuration manually:

1. Set “Copy Target Directory” to the packaging output path, such as `/Windows`
2. Set the configuration to exclude to “Disallowed”
3. Package the project
4. Click “Copy”
5. Files are copied to `Windows/YourProject/Config/xxx.ini`

---

### Cleanup Before Copying

When “Clean Config Before Copy” is enabled:
- Delete `TargetDir/ProjectName/Config/` before copying
- Copy only currently Disallowed files
- Ensure the target directory reflects the current state

---

### Extra Files in the Target Directory after Copying

Enable “Clean Config Before Copy” to clean the target Config folder before copying

---

### 1.3 Copy Excluded Files

Excluded configuration files do not appear in the packaged directory. Some scenarios require adding files manually after packaging, such as deployment to different environments.

The plugin provides **one-click copying**:

-   Configure the target directory (default: `/Windows`)
-   Click `Copy`
-   All configuration files marked `Disallowed` are copied to the target directory
-   Optionally clean the target Config folder before copying

Copying can supplement deployment with configuration files for different environments.
