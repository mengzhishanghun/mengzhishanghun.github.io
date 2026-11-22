---
title: Install and Configure Source Control
type: doc
slug: simple-asset-cleaner-setup
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/setup/
lang: en
translationKey: doc:simple-asset-cleaner:setup
sourceHash: 17e50fabc08288d410e0b33f2dc376ef8e90e44498c0d8e5d975bdcf3c474f9b
translationStatus: translated
generatedBodyHash: f54e934831b4b01215cdd43a6d429445e133cda9e26ac02ff6676346445e0ce8
docPage:
  work: simple-asset-cleaner
  group: setup
  slug: setup
  order: 1
---

**SimpleAssetCleaner** automatically identifies and removes unreferenced assets in Unreal Engine projects to keep repositories tidy.

> **Important**: This plugin can delete assets from version control. Read carefully before use.

**Compatibility**: Unreal Engine 5.2–5.8

---

## Configuration

**Location**: Editor > Project Settings > General > Simple Asset Cleaner

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A1)

### Version Control Provider (Important!)

The plugin automatically wraps your version control provider in a proxy to monitor submissions.

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A2)

**Do not select a proxy provider manually!**
- Always select your actual version control provider, such as Perforce, Git, or SVN
- The plugin wraps it automatically in the background
- Selecting a proxy directly may cause problems

**Correct settings**:
- Use: `Perforce`, `Git`, `Subversion`, etc.
- Avoid: `Perforce_Proxy`, `Git_Proxy`, or any provider ending in `_Proxy`

### General Settings

#### Language
- **Default**: English
- **Options**: Chinese / English
- **Function**: Switch the language of all UI text and logs
- **Behavior**: Takes effect immediately without restarting the editor

#### Enable Verbose Logging
- **Default**: Disabled
- **Function**: Detailed logs for debugging
- **Recommendation**: Enable only when troubleshooting

## Support

**When reporting issues, provide**:
- Unreal Engine version
- Version control system (Perforce/Git/SVN)
- Plugin settings screenshot
- Log output with verbose logging enabled

---

**Compatibility**: Unreal Engine 5.2–5.8 | Tested on Windows; theoretically supports all platforms

**Remember**: Start conservatively. Assets can always be deleted, but restoration requires version control history!

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## SimpleAssetCleaner User Guide

Identifies candidate unreferenced assets using roots and reference relationships, with entry points for submission handling and full cleanup.

## Installation and Configuration

### Step 1: Install the Plugin

1.  Copy the plugin folder into your project's `Plugins` directory
    
    ```
    YourProject/
    └── Plugins/
        └── SimpleAssetCleaner/
    ```
    
2.  Open the project and search for `SimpleAssetCleaner` under `Edit > Plugins`
    
3.  Enable it and restart the editor

### Step 2: Basic Configuration

Open project settings: `Editor > Project Settings > General > Simple Asset Cleaner`

**Automatic cleanup toggle:**

Configure the root assets and protected paths to retain before checking `Enable Auto Clean`.

With default configuration, the plugin:

-   Uses all maps as root assets
-   Automatically checks and cleans on submission
-   Protects plugin and engine assets outside the project

**Advanced configuration (recommended for teams):**

**1\. Configure root asset types**

Add to `Root Asset Classes`:

-   `UWorld` - Maps (included by default)
-   `UBlueprint` - Blueprint classes, if Blueprints are core assets
-   `UDataAsset` - DataAssets, if the project has substantial configuration data

**2\. Add protected paths**

Add to `Additional Root Paths`:

-   `/Game/Core/` - Core systems directory
-   `/Game/Config/` - Configuration directory
-   `/Game/Managers/` - Manager directory

**3\. Optionally enable verbose logging**

On first use, enable `Enable Verbose Logging` to observe the plugin. Once familiar, disable it to reduce log output.

## Features and Parameters

### Logging Options

The plugin provides optional verbose logging for debugging and monitoring.

**Enable it:**  
Check `Enable Verbose Logging` in project settings

**Logs include:**

-   Files scanned
-   Unreferenced assets detected
-   Cleanup operations performed
-   Reference-chain tracing for debugging

Enable verbose logging on first use or when problems arise to understand the plugin's operation.

### 5.2 Source Control Providers

SimpleAssetCleaner supports all version control systems supported by Unreal Engine:

-   ✅ Perforce
-   ✅ Git
-   ✅ SVN
-   ✅ Plastic SCM
-   ✅ Other systems integrated through the UE API

**Configuration points:**

Choose your actual provider, such as Perforce, Git, or Subversion, under `Editor > Preferences > Source Control`.

⚠️ **Important:** Do not choose options ending in `_Proxy`, such as `Perforce_Proxy`. These are internal plugin implementations and are handled automatically.
