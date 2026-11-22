---
title: 复制被排除的配置
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
  group: packaging
  slug: copy-excluded
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-config-exclude/docs/copy-excluded/
lang: zh
translationKey: doc:simple-config-exclude:copy-excluded
---

## 设置目标目录并复制

- **默认**：/Windows
- **功能**：复制排除配置文件的目标目录
- **路径格式**：相对于项目目录（如 `/Windows`、`/Build/Output`）
- **跨平台**：支持 Windows、Mac、Linux
- **目录结构**：保留原始结构（`TargetDir/ProjectName/Config/xxx.ini`）
- **复制按钮**：将所有 Disallowed 配置文件复制到目标目录

打包后，你可能想手动添加排除的配置：

1. 将 "Copy Target Directory" 设为打包输出路径（如 `/Windows`）
2. 将要排除的配置设为 "Disallowed"
3. 打包项目
4. 点击 "Copy" 按钮
5. 文件复制到 `Windows/YourProject/Config/xxx.ini`

## 复制前清理目标目录

**Clean Config Before Copy** 默认启用。点击 **Copy** 前，确认 `TargetDir/ProjectName/Config/` 不包含要保留的文件：该目录会被删除，随后只复制当前标为 `Disallowed` 的配置。

## 为不同部署环境补充配置

```
1. 将测试环境配置标记为 Disallowed
2. 打包得到干净的基础版本
3. 用 Copy 功能将排除的配置复制到测试环境部署目录
4. 生产环境使用打包后的默认配置
```

复制时保留 `Config` 下的子目录结构。运行时加载的配置（如 Input）可以在部署时补充；已在构建中烘焙的设置（如某些渲染设置）不会因复制而重新生效。
