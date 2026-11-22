---
title: 启用和禁用插件
type: doc
slug: plugin-manager-enable-disable
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 依赖分析
workIds:
  - plugin-manager
docPage:
  work: plugin-manager
  group: workflows
  slug: enable-disable
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/enable-disable/
lang: zh
translationKey: doc:plugin-manager:enable-disable
---

### 插件操作
- **启用/禁用** - 修改 .uproject，支持依赖连锁确认
- **恢复默认** - 从 .uproject 移除配置，恢复插件默认状态
- **移动插件** - 项目插件和商城插件可互相移动（引擎插件不可移动）
- **删除插件** - 移至回收站（引擎插件不可删除）
- **目录修正** - 修正乱码文件夹名为插件同名

## 注意事项

- **操作前建议**：关闭 UE 编辑器后再进行插件移动、删除、目录修正等操作
- **只读文件**：工具会自动移除只读属性，兼容 Perforce 等版本控制系统
- **冲突插件**：同名插件需先删除其中一个才能启用或移动
