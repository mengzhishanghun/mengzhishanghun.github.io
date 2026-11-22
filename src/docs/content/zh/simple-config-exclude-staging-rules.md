---
title: 为打包设置三态排除规则
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
  group: workflows
  slug: staging-rules
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-config-exclude/docs/staging-rules/
lang: zh
translationKey: doc:simple-config-exclude:staging-rules
---

**支持的虚幻引擎版本**：5.2–5.8

以可视化方式管理 Unreal Engine 项目打包时要包含或排除的配置文件（.ini）。

---

## 配置

**位置**：编辑器 > 项目设置 > Plugins > Simple Config Exclude

### 设置

#### Hide Plugin Config
- **默认**：启用
- **功能**：在配置列表中隐藏 DefaultSimpleConfigExclude.ini
- **目的**：防止意外排除插件自身的设置

#### Clean Config Before Copy
- **默认**：启用
- **功能**：复制排除文件前删除目标 Config 文件夹
- **目的**：确保目标目录仅包含最新排除的文件

### 配置排除规则

所有 Config 文件夹中 .ini 文件的三态选择器：

| 策略 | 说明 |
|------|------|
| **Default** | 使用 UE 默认行为（通常基于文件类型） |
| **Allowed** | 强制包含在打包中（即使 UE 会排除） |
| **Disallowed** | 强制排除出打包 |

#### Refresh Config List 按钮

点击重新扫描 Config 文件夹。适用于：
- 新增配置文件
- 删除配置文件
- 列表与实际文件不同步

---

## 示例

### 示例 1：排除调试配置

如果有 `DefaultDebugSettings.ini` 包含不应出现在发行版中的调试热键：

1. 打开 项目设置 > Plugins > Simple Config Exclude
2. 在列表中找到 `Config/DefaultDebugSettings.ini`
3. 选择 "Disallowed"
4. 打包项目——文件将被排除

### 示例 2：强制包含自定义配置

如果有 `DefaultCustomSettings.ini` 必须被打包：

1. 打开插件设置
2. 找到 `Config/DefaultCustomSettings.ini`
3. 选择 "Allowed"
4. 打包项目——文件将被强制包含

## 重要说明

### 默认行为

所有配置文件默认为 "Default" 状态，使用 UE 的默认打包行为。UE 根据文件类型自动决定（engine.ini、game.ini、input.ini 会被打包）。

### 插件配置保护

插件默认隐藏 `DefaultSimpleConfigExclude.ini` 因为：
- 它包含插件自身的设置
- 排除它可能导致插件功能异常
- 取消勾选 "Hide Plugin Config" 可以显示它

### 设置持久化

- 插件设置保存在 `DefaultSimpleConfigExclude.ini`
- 排除规则保存在 `DefaultGame.ini` 的 `[Staging]` 段
- 两个文件都应提交到版本控制

调整规则后，插件会写回 `DefaultGame.ini`，并重新加载配置，让设置面板与磁盘内容对应。写入涉及版本控制签出或只读文件处理，应检查签出状态及最终文件差异。

## 故障排查

### 文件未在列表中显示

1. 点击 "Refresh Config List" 按钮
2. 确保文件在 `Config` 文件夹或子文件夹中
3. 确保文件扩展名为 `.ini`

### 打包后规则未生效

1. 检查 `DefaultGame.ini` 是否包含 `[Staging]` 段
2. 尝试点击 "Refresh Config List"
3. 重启编辑器并重新打包

### 插件配置出现在列表中

检查 "Hide Plugin Config" 设置，启用它以隐藏 DefaultSimpleConfigExclude.ini

## 常见问题

**Q：这会影响游戏运行时吗？**
A：不会，这是仅编辑器插件，只影响打包过程。

**Q：支持子文件夹吗？**
A：是的，插件递归扫描 Config 文件夹及所有子文件夹，复制时保留目录结构。

**Q：复制的排除配置能用吗？**
A：取决于配置类型。运行时配置（如 Input）可用，编译时烘焙的配置（如渲染设置）不行。

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleConfigExclude 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleConfigExclude 使用指南

在项目设置中选择配置文件的包含与排除状态，并按需复制排除文件。

调试开关、性能分析参数、测试服务器地址、开发密钥和插件内部配置可能不适合随正式包发布；测试与生产环境也可能需要不同配置集。配置排除以打包时对 Config 目录内 ini 文件的处理为背景，最终应检查实际包内容。

UE 通过 `DefaultGame.ini` 中的 `[Staging]` 区段控制配置文件的打包行为。手工维护时，需要写对 `+AllowedConfigFiles` / `+DisallowedConfigFiles` 的格式，并带上项目名前缀。

插件的用途与适用场景见 [SimpleConfigExclude 作品页](/zh/works/simple-config-exclude/)。

## 功能与参数

### 1.1 三态配置选择器

插件为每个配置文件提供三种状态：

| 状态 | 含义 | 效果 |
| --- | --- | --- |
| **Default** | 默认 | 跟随 UE 默认行为 |
| **Allowed** | 强制包含 | 确保该配置文件一定会被打包 |
| **Disallowed** | 强制排除 | 确保该配置文件不会被打包 |

在项目设置面板中，每个 `.ini` 文件旁边都有一个三态切换控件（`SSegmentedControl`），点击即可切换。

### 1.2 自动扫描与应用

插件的工作流完全自动化：

1.  **编辑器启动时**自动扫描 `Config` 目录下所有 `.ini` 文件
2.  **读取现有规则**从 `DefaultGame.ini` 的 `[Staging]` 区段
3.  **生成配置列表**展示在设置面板中
4.  **修改即生效**切换状态后立即写入 `DefaultGame.ini`

状态切换会写回配置文件，并处理相关文件的可写状态。

### Staging 规则的读取与写回

#### UE 的 Staging 机制

UE 打包时通过 `DefaultGame.ini` 中的 `[Staging]` 区段控制配置文件的包含与排除：

```ini
[Staging]
+AllowedConfigFiles=MyProject/Config/DefaultInput.ini
+DisallowedConfigFiles=MyProject/Config/DefaultDebug.ini
```

配置选择最终需要转换为这个区段中的包含与排除规则。

#### 扫描与规则同步

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

#### 规则应用

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

### 1.4 安全设计

-   **隐藏插件自身配置**：默认隐藏 `DefaultSimpleConfigExclude.ini`，防止误操作导致插件配置丢失
-   **源控制集成**：修改 `DefaultGame.ini` 前自动检出（支持 Perforce/Git）
-   **只读保护**：未使用源控制时自动移除只读属性

## 安装与配置

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：打开设置面板

路径：`Edit > Project Settings > Plugins > Simple Config Exclude`

面板分为三个区域：

1.  **Settings**：通用设置（是否隐藏插件配置、复制前是否清理目标目录）
2.  **Copy**：复制排除文件到目标目录
3.  **Config Exclude Rules**：配置文件列表和三态选择器

### 步骤3：配置规则

1.  找到你要排除的配置文件
2.  点击 `Disallowed` 即可排除
3.  需要强制包含的点击 `Allowed`
4.  修改即时生效，无需额外保存

### 步骤4：打包验证

正常打包项目，检查打包目录中的 `Config` 文件夹，确认排除的文件不存在。

* * *

## 配置示例

### 场景1：排除调试配置

项目中有 `DefaultDebug.ini` 存储调试参数，生产环境不需要：

```
DefaultDebug.ini → Disallowed
```

### 场景2：多环境部署

```
1. 将测试环境配置标记为 Disallowed
2. 打包得到干净的基础版本
3. 用 Copy 功能将排除的配置复制到测试环境部署目录
4. 生产环境使用打包后的默认配置
```

### 场景3：保护敏感配置

```
DefaultEncryption.ini → Disallowed  // 密钥配置不随包发布
DefaultServer.ini → Disallowed      // 服务器配置通过运维单独部署
```

## 注意事项

修改配置状态会写回 DefaultGame.ini。复制排除文件时，检查目标目录及是否启用了复制前清理。

排除配置不等于完成敏感信息保护：复制目录中的副本仍需按项目权限管理。打包规则、复制目标和版本控制差异都需要在发布前核对。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770930)。
