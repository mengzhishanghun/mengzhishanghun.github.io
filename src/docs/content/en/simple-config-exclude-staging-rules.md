---
title: Set and Verify Packaging Rules
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
sourceHash: 7b731fdfabeb06ab84e9b983d545ab5467d28157c61714c8b686ea782513184b
translationStatus: translated
generatedBodyHash: f11c67be043a13e6abc234ef16cd824a723f31c84372c22a1ddb39f6bbfe49c0
docPage:
  work: simple-config-exclude
  group: features
  slug: staging-rules
  order: 1
---

## Choose a Packaging State for Each INI File

The plugin offers three states for each configuration file:

| State | Meaning | Effect |
| --- | --- | --- |
| **Default** | Default | Follow UE's default behavior |
| **Allowed** | Force inclusion | Ensure the configuration file is packaged |
| **Disallowed** | Force exclusion | Ensure the configuration file is not packaged |

Each `.ini` file has a three-state control (`SSegmentedControl`) beside it in project settings; click to switch states.

The plugin runs in the editor. Its packaging rules determine which INI files from `Config` ship in the package.

1.  Find the configuration file to exclude
2.  Click `Disallowed` to exclude it
3.  Click `Allowed` for forced inclusion
4.  Changes are written to configuration without a separate save. If writing fails, check checkout and file differences as described below.

See the [SimpleConfigExclude work page](/en/works/simple-config-exclude/) for use cases.

## Scan Configuration and Refresh the List

On editor startup, the plugin recursively scans `Config` for INI files and populates the list from the `[Staging]` rules on disk. After adding or removing files, click **Refresh Config List**. If a file is missing, check that it is under the project’s `Config` folder and has an `.ini` extension.

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

## Save Rules, Check Out Files, and Protect Plugin Settings

- Plugin settings are stored in `DefaultSimpleConfigExclude.ini`
- Exclusion rules are stored in the `[Staging]` section of `DefaultGame.ini`
- Both files should be committed to version control

After rule changes, the plugin writes `DefaultGame.ini` and reloads configuration so the settings panel corresponds to disk contents. Writing involves version-control checkout or read-only file handling; check checkout status and final file differences.

During packaging, UE reads `[Staging]` in `DefaultGame.ini` to determine which configuration files to include or exclude:

```ini
[Staging]
+AllowedConfigFiles=MyProject/Config/DefaultInput.ini
+DisallowedConfigFiles=MyProject/Config/DefaultDebug.ini
```

The selector translates each choice into an inclusion or exclusion rule in this section.

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

-   **Hide the plugin's own configuration**: Hide `DefaultSimpleConfigExclude.ini` by default to prevent accidental loss of plugin configuration
-   **Source control integration**: Automatically check out `DefaultGame.ini` before modifying it, supporting Perforce/Git
-   **Read-only protection**: Automatically remove the read-only attribute when source control is not used

Clear **Hide Plugin Config** to see the plugin’s own settings in the list. Re-enable it to hide the file again.

## Exclude Debug Files and Force Inclusion

If `DefaultDebugSettings.ini` contains debug hotkeys that should not ship in a release:

1. Open Project Settings > Plugins > Simple Config Exclude
2. Find `Config/DefaultDebugSettings.ini` in the list
3. Select “Disallowed”
4. Package the project — the file is excluded

If `DefaultCustomSettings.ini` must be packaged:

1. Open the plugin settings
2. Find `Config/DefaultCustomSettings.ini`
3. Select “Allowed”
4. Package the project — the file is forcibly included

```
DefaultDebug.ini → Disallowed
```

## Verify the Package and Handle Sensitive Configuration

To verify the exclusion rule, inspect the current package before copying anything into it. For the two example files, check that the excluded file is absent and the included file is present.

Package the project normally and check its `Config` output folder to confirm excluded files are absent.

1. Check that `DefaultGame.ini` contains a `[Staging]` section
2. Try clicking “Refresh Config List”
3. Restart the editor and package again

```
DefaultEncryption.ini → Disallowed  // 密钥配置不随包发布
DefaultServer.ini → Disallowed      // 服务器配置通过运维单独部署
```

Exclusion rules control which files ship in the package. If you copy sensitive configuration separately, restrict access to the destination and review the version control diff for `DefaultGame.ini`.
