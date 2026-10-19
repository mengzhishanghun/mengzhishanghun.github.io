---
title: SimpleConfigExclude 使用文档
description: SimpleConfigExclude 的完整中文产品使用文档
type: doc
slug: simple-config-exclude-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - 打包
  - 配置管理
workIds:
  - simple-config-exclude
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-config-exclude-guide/
lang: zh
translationKey: simple-config-exclude-guide
supplementSources:
  - docs/content/zh/supplements/simple-config-exclude-guide-1.md
---

# SimpleConfigExclude 教程

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

### 复制

#### Copy Target Directory
- **默认**：/Windows
- **功能**：复制排除配置文件的目标目录
- **路径格式**：相对于项目目录（如 `/Windows`、`/Build/Output`）
- **跨平台**：支持 Windows、Mac、Linux
- **目录结构**：保留原始结构（`TargetDir/ProjectName/Config/xxx.ini`）
- **复制按钮**：将所有 Disallowed 配置文件复制到目标目录

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

### 示例 3：将排除的文件复制到打包产物

打包后，你可能想手动添加排除的配置：

1. 将 "Copy Target Directory" 设为打包输出路径（如 `/Windows`）
2. 将要排除的配置设为 "Disallowed"
3. 打包项目
4. 点击 "Copy" 按钮
5. 文件复制到 `Windows/YourProject/Config/xxx.ini`

---

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

### 复制前清理

启用 "Clean Config Before Copy" 时：
- 复制前删除 `TargetDir/ProjectName/Config/` 文件夹
- 仅复制当前 Disallowed 的文件
- 确保目标目录反映当前状态

---

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

### 复制后目标目录有多余文件

启用 "Clean Config Before Copy" 选项，在复制前清理目标 Config 文件夹

---

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
