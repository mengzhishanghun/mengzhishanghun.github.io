---
title: SimpleConfigExclude User Manual
description: Complete English product manual for SimpleConfigExclude
type: doc
slug: simple-config-exclude-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Packaging
  - Configuration Management
workIds:
  - simple-config-exclude
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-config-exclude-guide/
lang: en
translationKey: simple-config-exclude-guide
supplementSources:
  - en/supplements/simple-config-exclude-guide-1.md
sourceHash: f9de2dd3b9ceddf57e9edcf25276e1a4aee9a14f648b98221ea6a30bb41bcee0
translationStatus: translated
generatedBodyHash: 1f68a744547e28ac5580497320de22a9ee026437d36b8b161d55eb7fd8449fc3
---

# SimpleConfigExclude Tutorial

**Supported Unreal Engine versions**: 5.2–5.8

Visually manage which configuration files (.ini) are included or excluded when packaging an Unreal Engine project.

---

## Configuration

**Location**: Editor > Project Settings > Plugins > Simple Config Exclude

### Settings

#### Hide Plugin Config
- **Default**: Enabled
- **Function**: Hide DefaultSimpleConfigExclude.ini from the configuration list
- **Purpose**: Prevent accidental exclusion of the plugin's own settings

#### Clean Config Before Copy
- **Default**: Enabled
- **Function**: Delete the target Config folder before copying excluded files
- **Purpose**: Ensure the target directory contains only the latest excluded files

### Copy

#### Copy Target Directory
- **Default**: /Windows
- **Function**: Target directory for copying excluded configuration files
- **Path format**: Relative to the project directory, such as `/Windows` or `/Build/Output`
- **Cross-platform**: Supports Windows, Mac, and Linux
- **Directory structure**: Preserves the original structure (`TargetDir/ProjectName/Config/xxx.ini`)
- **Copy button**: Copies all Disallowed configuration files to the target directory

### Configuration Exclusion Rules

Three-state selectors for .ini files in all Config folders:

| Policy | Description |
|------|------|
| **Default** | Use UE's default behavior, usually based on file type |
| **Allowed** | Force inclusion in the package, even if UE would exclude it |
| **Disallowed** | Force exclusion from the package |

#### Refresh Config List Button

Click to rescan Config folders. Useful when:
- Adding configuration files
- Deleting configuration files
- The list is out of sync with actual files

---

## Examples

### Example 1: Exclude Debug Configuration

If `DefaultDebugSettings.ini` contains debug hotkeys that should not ship in a release:

1. Open Project Settings > Plugins > Simple Config Exclude
2. Find `Config/DefaultDebugSettings.ini` in the list
3. Select “Disallowed”
4. Package the project — the file is excluded

### Example 2: Force Inclusion of Custom Configuration

If `DefaultCustomSettings.ini` must be packaged:

1. Open the plugin settings
2. Find `Config/DefaultCustomSettings.ini`
3. Select “Allowed”
4. Package the project — the file is forcibly included

### Example 3: Copy Excluded Files into the Packaged Output

After packaging, you may want to add excluded configuration manually:

1. Set “Copy Target Directory” to the packaging output path, such as `/Windows`
2. Set the configuration to exclude to “Disallowed”
3. Package the project
4. Click “Copy”
5. Files are copied to `Windows/YourProject/Config/xxx.ini`

---

## Important Notes

### Default Behavior

All configuration files initially use “Default,” following UE's default packaging behavior. UE decides by file type; engine.ini, game.ini, and input.ini are packaged.

### Plugin Configuration Protection

The plugin hides `DefaultSimpleConfigExclude.ini` by default because:
- It contains the plugin's own settings
- Excluding it may cause plugin malfunction
- Uncheck “Hide Plugin Config” to display it

### Settings Persistence

- Plugin settings are stored in `DefaultSimpleConfigExclude.ini`
- Exclusion rules are stored in the `[Staging]` section of `DefaultGame.ini`
- Both files should be committed to version control

### Cleanup Before Copying

When “Clean Config Before Copy” is enabled:
- Delete `TargetDir/ProjectName/Config/` before copying
- Copy only currently Disallowed files
- Ensure the target directory reflects the current state

---

## Troubleshooting

### Files Missing from the List

1. Click “Refresh Config List”
2. Ensure the file is in `Config` or a subfolder
3. Ensure the extension is `.ini`

### Rules Not Applied after Packaging

1. Check that `DefaultGame.ini` contains a `[Staging]` section
2. Try clicking “Refresh Config List”
3. Restart the editor and package again

### Plugin Configuration Appears in the List

Check “Hide Plugin Config” and enable it to hide DefaultSimpleConfigExclude.ini

### Extra Files in the Target Directory after Copying

Enable “Clean Config Before Copy” to clean the target Config folder before copying

---

## Frequently Asked Questions

**Q: Does this affect the game at runtime?**
A: No. This is an editor-only plugin affecting only packaging.

**Q: Are subfolders supported?**
A: Yes. The plugin recursively scans Config and all subfolders, preserving directory structure during copying.

**Q: Can copied excluded configuration be used?**
A: It depends on the configuration type. Runtime configuration such as Input can be used; configuration baked at compile time, such as rendering settings, cannot.

---

## Version History

See [CHANGELOG.md](../CHANGELOG.md).


Open **Edit → Project Settings**, go to SimpleConfigExclude settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
