---
title: Copy Excluded Configuration Files
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
sourceHash: d1af4ed85f9ed50fd241f8a9dff0a9adc22b8cbdc1d3ae19aa6ebab43d79bc2c
translationStatus: translated
generatedBodyHash: 81e5b87ff83c9de5ae93a28e62bf802cd4d2e3a9fadb4c949ab75408a1890e8e
docPage:
  work: simple-config-exclude
  group: packaging
  slug: copy-excluded
  order: 2
---

## Set the Destination and Copy

- **Default**: /Windows
- **Function**: Target directory for copying excluded configuration files
- **Path format**: Relative to the project directory, such as `/Windows` or `/Build/Output`
- **Cross-platform**: Supports Windows, Mac, and Linux
- **Directory structure**: Preserves the original structure (`TargetDir/ProjectName/Config/xxx.ini`)
- **Copy button**: Copies all Disallowed configuration files to the target directory

After packaging, you may want to add excluded configuration manually:

1. Set “Copy Target Directory” to the packaging output path, such as `/Windows`
2. Set the configuration to exclude to “Disallowed”
3. Package the project
4. Click “Copy”
5. Files are copied to `Windows/YourProject/Config/xxx.ini`

## Clean the Destination Before Copying

**Clean Config Before Copy** is on by default. Before clicking **Copy**, check `TargetDir/ProjectName/Config/` for anything you need to keep. The plugin deletes that folder and then copies only the files currently marked `Disallowed`.

## Supply Configuration for Different Environments

```
1. Mark test-environment configuration as Disallowed
2. Package a clean base version
3. Use Copy to copy excluded configuration to the test deployment directory
4. Production uses the packaged default configuration
```

Copying preserves the subfolder structure under `Config`. Files read at runtime, such as Input configuration, can be supplied at deployment. Copying a file does not reapply values baked into the build, such as certain rendering settings.
