---
title: 配置并验证打包规则
type: doc
slug: simple-config-exclude-staging-rules
draft: false
sitePublish: true
tags:
  - 打包
  - 配置管理
workIds:
  - simple-config-exclude
docPage:
  work: simple-config-exclude
  group: packaging
  slug: staging-rules
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-config-exclude/docs/staging-rules/
lang: zh
translationKey: doc:simple-config-exclude:staging-rules
---

## 为每个 INI 文件选择打包状态

插件为每个配置文件提供三种状态：

| 状态 | 含义 | 效果 |
| --- | --- | --- |
| **Default** | 默认 | 跟随 UE 默认行为 |
| **Allowed** | 强制包含 | 确保该配置文件一定会被打包 |
| **Disallowed** | 强制排除 | 确保该配置文件不会被打包 |

在项目设置面板中，每个 `.ini` 文件旁边都有一个三态切换控件（`SSegmentedControl`），点击即可切换。

这是仅在编辑器运行的插件。它通过项目的打包规则决定 `Config` 中的哪些 INI 文件进入包体。

1.  找到你要排除的配置文件
2.  点击 `Disallowed` 即可排除
3.  需要强制包含的点击 `Allowed`
4.  修改即时生效，无需额外保存

适用场景见 [SimpleConfigExclude 作品页](/zh/works/simple-config-exclude/)。

## 扫描配置、刷新列表

打开编辑器时，插件递归扫描 `Config` 中的 INI 文件，再用磁盘上的 `[Staging]` 规则填充列表。文件增删或列表过期时，点击 **Refresh Config List**；没有找到文件时，核对它是否位于项目 `Config` 下且扩展名为 `.ini`。

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

这里直接读取文件内容，再解析 AllowedConfigFiles 和 DisallowedConfigFiles，避免只依赖 `GConfig` 中已有的缓存。

## 保存规则、签出与插件配置保护

- 插件设置保存在 `DefaultSimpleConfigExclude.ini`
- 排除规则保存在 `DefaultGame.ini` 的 `[Staging]` 段
- 两个文件都应提交到版本控制

调整规则后，插件会写回 `DefaultGame.ini`，并重新加载配置，让设置面板与磁盘内容对应。写入涉及版本控制签出或只读文件处理，应检查签出状态及最终文件差异。

UE 打包时通过 `DefaultGame.ini` 中的 `[Staging]` 区段控制配置文件的包含与排除：

```ini
[Staging]
+AllowedConfigFiles=MyProject/Config/DefaultInput.ini
+DisallowedConfigFiles=MyProject/Config/DefaultDebug.ini
```

配置选择最终需要转换为这个区段中的包含与排除规则。

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

示例在状态变更后重写 `[Staging]` 区段，再通过卸载和重新加载配置，让缓存与文件内容保持一致。

-   **隐藏插件自身配置**：默认隐藏 `DefaultSimpleConfigExclude.ini`，防止误操作导致插件配置丢失
-   **源控制集成**：修改 `DefaultGame.ini` 前自动检出（支持 Perforce/Git）
-   **只读保护**：未使用源控制时自动移除只读属性

要在列表中查看插件自己的配置，取消勾选 **Hide Plugin Config**；如果误显示该文件，可重新启用此选项。

## 排除调试文件与强制包含配置

如果有 `DefaultDebugSettings.ini` 包含不应出现在发行版中的调试热键：

1. 打开 项目设置 > Plugins > Simple Config Exclude
2. 在列表中找到 `Config/DefaultDebugSettings.ini`
3. 选择 "Disallowed"
4. 打包项目——文件将被排除

如果有 `DefaultCustomSettings.ini` 必须被打包：

1. 打开插件设置
2. 找到 `Config/DefaultCustomSettings.ini`
3. 选择 "Allowed"
4. 打包项目——文件将被强制包含

```
DefaultDebug.ini → Disallowed
```

## 验证产物与管理敏感配置

正常打包项目，检查打包目录中的 `Config` 文件夹，确认排除的文件不存在。

1. 检查 `DefaultGame.ini` 是否包含 `[Staging]` 段
2. 尝试点击 "Refresh Config List"
3. 重启编辑器并重新打包

```
DefaultEncryption.ini → Disallowed  // 密钥配置不随包发布
DefaultServer.ini → Disallowed      // 服务器配置通过运维单独部署
```

排除规则只控制哪些文件进入打包产物。若另行复制了敏感配置，仍需限制目标目录的访问权限，并核对 `DefaultGame.ini` 的版本控制差异。
