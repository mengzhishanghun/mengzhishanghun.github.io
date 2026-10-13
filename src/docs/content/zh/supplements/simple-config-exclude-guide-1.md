---
title: SimpleConfigExclude 使用指南
description: 在项目设置中管理配置文件的默认、包含和排除状态，并复制排除文件。
type: doc
slug: simple-config-exclude-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleConfigExclude
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770930
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770930
workIds:
  - simple-config-exclude
lang: zh
translationKey: doc:simple-config-exclude-guide:supplement:1
---

# SimpleConfigExclude 使用指南

在项目设置中选择配置文件的包含与排除状态，并按需复制排除文件。

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

### 1.3 复制排除文件

打包后，被排除的配置文件不会出现在打包目录中。但有些场景下你可能需要在打包后手动补充某些配置文件（比如部署到不同环境时）。

插件提供了**一键复制**功能：

-   配置目标目录（默认 `/Windows`）
-   点击 `Copy` 按钮
-   所有标记为 `Disallowed` 的配置文件会被复制到目标目录
-   可选在复制前清理目标 Config 文件夹

复制功能可用于在部署时补充不同环境的配置文件。

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

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770930)。
