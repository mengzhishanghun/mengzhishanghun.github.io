---
title: Set Three-State Packaging Rules
type: doc
slug: simple-config-exclude-staging-rules
draft: false
sitePublish: true
tags:
  - Packaging
  - Configuration Management
workIds:
  - simple-config-exclude
documentKind: product-manual
websiteRoute: /en/works/simple-config-exclude/docs/staging-rules/
lang: en
translationKey: doc:simple-config-exclude:staging-rules
sourceHash: c4bc97a301ae37fdfc547cd1bce6e9e3378342dac441a56af287e2fe476250be
translationStatus: translated
generatedBodyHash: 0265740628d74133416a4905855ef9674654f0bea2f5b7f1b484f78eca3d93a0
docPage:
  work: simple-config-exclude
  group: workflows
  slug: staging-rules
  order: 1
---

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

After rule changes, the plugin writes `DefaultGame.ini` and reloads configuration so the settings panel corresponds to disk contents. Writing involves version-control checkout or read-only file handling; check checkout status and final file differences.

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

## Frequently Asked Questions

**Q: Does this affect the game at runtime?**
A: No. This is an editor-only plugin affecting only packaging.

**Q: Are subfolders supported?**
A: Yes. The plugin recursively scans Config and all subfolders, preserving directory structure during copying.

**Q: Can copied excluded configuration be used?**
A: It depends on the configuration type. Runtime configuration such as Input can be used; configuration baked at compile time, such as rendering settings, cannot.

---

## Version History



Open **Edit → Project Settings**, go to SimpleConfigExclude settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## SimpleConfigExclude User Guide

Choose inclusion/exclusion states for configuration files in project settings and copy excluded files as needed.

Debug flags, profiling settings, test server addresses, development keys and internal plugin settings may not belong in a production package. Test and production builds may also need different configuration sets. These packaging rules apply to INI files in `Config`; inspect the resulting package to verify what shipped.

UE reads configuration packaging rules from `[Staging]` in `DefaultGame.ini`. When editing by hand, use the correct syntax for `+AllowedConfigFiles` and `+DisallowedConfigFiles`, including the project name prefix.

See the [SimpleConfigExclude work page](/en/works/simple-config-exclude/) for what the plugin does and when to use it.

## Features and Parameters

### 1.1 Three-State Configuration Selector

The plugin offers three states for each configuration file:

| State | Meaning | Effect |
| --- | --- | --- |
| **Default** | Default | Follow UE's default behavior |
| **Allowed** | Force inclusion | Ensure the configuration file is packaged |
| **Disallowed** | Force exclusion | Ensure the configuration file is not packaged |

Each `.ini` file has a three-state control (`SSegmentedControl`) beside it in project settings; click to switch states.

### 1.2 Automatic Scanning and Application

The plugin's workflow is fully automated:

1.  **At editor startup**, automatically scan all `.ini` files under `Config`
2.  **Read existing rules** from the `[Staging]` section in `DefaultGame.ini`
3.  **Generate the configuration list** in the settings panel
4.  **Changes take effect immediately**: switching a state writes to `DefaultGame.ini` at once

State changes write back to configuration files and handle the relevant files' writable state.

### Read and write staging rules

#### UE staging

During packaging, UE reads `[Staging]` in `DefaultGame.ini` to determine which configuration files to include or exclude:

```ini
[Staging]
+AllowedConfigFiles=MyProject/Config/DefaultInput.ini
+DisallowedConfigFiles=MyProject/Config/DefaultDebug.ini
```

The selector translates each choice into an inclusion or exclusion rule in this section.

#### Scan configuration files and synchronize rules

```cpp
void USimpleConfigExcludeSettings::ScanAndUpdateConfigFiles()
{
    // 递归扫描 Config 目录下所有 .ini 文件
    IFileManager::Get().FindFilesRecursive(FoundIniFiles, *ConfigDir, TEXT("*.ini"), true, false);

    // 直接从文件读取 [Staging] section（不依赖 GConfig 缓存）
    // 解析 AllowedConfigFiles 和 DisallowedConfigFiles
    // 重建规则列表，匹配现有配置状态
}
```

Read the file directly before parsing `AllowedConfigFiles` and `DisallowedConfigFiles` so the scan does not depend on what `GConfig` has cached.

#### Apply the rules

```cpp
void USimpleConfigExcludeSettings::ApplyExcludeRules()
{
    // 移除旧的 [Staging] 区段
    // 根据当前规则列表重新生成
    // 写回 DefaultGame.ini
    // 重新加载配置以保持状态一致
    GConfig->UnloadFile(IniFilePath);
    GConfig->LoadFile(IniFilePath);
}
```

When a selection changes, this example rewrites `[Staging]`, then unloads and reloads the configuration to update the cache.

### 1.4 Safety Design

-   **Hide the plugin's own configuration**: Hide `DefaultSimpleConfigExclude.ini` by default to prevent accidental loss of plugin configuration
-   **Source control integration**: Automatically check out `DefaultGame.ini` before modifying it, supporting Perforce/Git
-   **Read-only protection**: Automatically remove the read-only attribute when source control is not used

## Installation and Configuration

### Step 1: Install the Plugin

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

### Step 2: Open the Settings Panel

Path: `Edit > Project Settings > Plugins > Simple Config Exclude`

The panel has three areas:

1.  **Settings**: General settings, including hiding plugin configuration and cleaning the target directory before copying
2.  **Copy**: Copy excluded files to the target directory
3.  **Config Exclude Rules**: Configuration file list and three-state selectors

### Step 3: Configure Rules

1.  Find the configuration file to exclude
2.  Click `Disallowed` to exclude it
3.  Click `Allowed` for forced inclusion
4.  Changes take effect immediately; no additional save is needed

### Step 4: Verify Packaging

Package the project normally and check its `Config` output folder to confirm excluded files are absent.

* * *

## Configuration Examples

### Scenario 1: Exclude Debug Configuration

The project has `DefaultDebug.ini` storing debug parameters that production does not need:

```
DefaultDebug.ini → Disallowed
```

### Scenario 2: Multi-Environment Deployment

```
1. Mark test-environment configuration as Disallowed
2. Package a clean base version
3. Use Copy to copy excluded configuration to the test deployment directory
4. Production uses the packaged default configuration
```

### Scenario 3: Protect Sensitive Configuration

```
DefaultEncryption.ini → Disallowed  // 密钥配置不随包发布
DefaultServer.ini → Disallowed      // 服务器配置通过运维单独部署
```

## Notes

Changing configuration states writes to DefaultGame.ini. When copying excluded files, check the target directory and whether cleanup before copying is enabled.

Excluding a file from the package does not protect copies in the destination folder. Manage access to those copies under your project's usual permissions. Before release, review the staging rules, destination and version control diff.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770930).
