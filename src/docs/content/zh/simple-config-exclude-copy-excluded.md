---
title: 复制排除的配置文件
type: doc
slug: simple-config-exclude-copy-excluded
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
  slug: copy-excluded
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-config-exclude/docs/copy-excluded/
lang: zh
translationKey: doc:simple-config-exclude:copy-excluded
---

### 复制

#### Copy Target Directory
- **默认**：/Windows
- **功能**：复制排除配置文件的目标目录
- **路径格式**：相对于项目目录（如 `/Windows`、`/Build/Output`）
- **跨平台**：支持 Windows、Mac、Linux
- **目录结构**：保留原始结构（`TargetDir/ProjectName/Config/xxx.ini`）
- **复制按钮**：将所有 Disallowed 配置文件复制到目标目录

### 示例 3：将排除的文件复制到打包产物

打包后，你可能想手动添加排除的配置：

1. 将 "Copy Target Directory" 设为打包输出路径（如 `/Windows`）
2. 将要排除的配置设为 "Disallowed"
3. 打包项目
4. 点击 "Copy" 按钮
5. 文件复制到 `Windows/YourProject/Config/xxx.ini`

---

### 复制前清理

启用 "Clean Config Before Copy" 时：
- 复制前删除 `TargetDir/ProjectName/Config/` 文件夹
- 仅复制当前 Disallowed 的文件
- 确保目标目录反映当前状态

---

### 复制后目标目录有多余文件

启用 "Clean Config Before Copy" 选项，在复制前清理目标 Config 文件夹

---

### 1.3 复制排除文件

被排除的配置文件不会出现在打包目录中。部署到不同环境等场景下，可能需要手动补充这些文件。

插件提供了**一键复制**功能：

-   配置目标目录（默认 `/Windows`）
-   点击 `Copy` 按钮
-   所有标记为 `Disallowed` 的配置文件会被复制到目标目录
-   可选在复制前清理目标 Config 文件夹

复制功能可用于在部署时补充不同环境的配置文件。
