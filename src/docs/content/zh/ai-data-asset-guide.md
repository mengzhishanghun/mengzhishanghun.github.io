---
title: AIDataAsset 使用文档
description: AIDataAsset 的完整中文产品使用文档
type: doc
slug: ai-data-asset-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/ai-data-asset-guide/
lang: zh
translationKey: ai-data-asset-guide
---

# AI DataAsset

通过 JSON 读取和修改已有 DataAsset，让 AI 或其他外部工具处理数据，再自动同步回 UE。支持常见基础类型和大多数结构体，包括嵌套结构体，以及 TArray、TMap、TSet 等常见容器中的属性数据。

## 功能特性

- **双向同步**：DataAsset 属性变更自动导出为 JSON；JSON 文件变更自动导入回 DataAsset
- **初始同步**：自动同步开启后，编辑器启动时按资产与 JSON 文件的修改时间选择方向；时间相同则跳过
- **孤立清理**：启动扫描进入清理阶段后，尝试删除没有对应 DataAsset 的 JSON；未扫描到任何 DataAsset 时会跳过清理
- **版本控制集成**：启用版本控制时，保存前尝试通过已配置的 Perforce/Git/SVN 签出文件
- **防循环机制**：避免插件自己的同步结果再次触发反复导入导出
- **高精度输出**：JSON 导出使用完整精度的浮点数值
- **属性名还原**：JSON 字段名与编辑器显示一致，而非 UE 内部的 camelCase 形式
- **智能写入**：仅在内容真正变化时才写入文件，避免版本控制中产生无意义的变更

## 安装

1. 将 `AIDataAsset` 文件夹复制到项目的 `Plugins/` 目录
2. 重启 Unreal 编辑器
3. 如未自动启用，在 编辑 > 插件 中启用

## 配置

打开 **项目设置 > 插件 > AIDataAsset**：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| JSON Output Directory | `Saved/AIDataAsset` | JSON 文件存储目录（相对于项目根目录） |
| Enable Auto Sync | `true` | 开启/关闭自动同步 |

**输出目录与版本管理。** 默认的 `Saved/AIDataAsset/` 是自动同步的中间目录，通常不应加入版本管理。实际运行使用的数据仍保存在 UE 资产中。需要跟踪 JSON 时，可在这里修改 `JSON Output Directory`，设为项目内需要纳入版本管理的目录，再将生成的 JSON 加入版本管理。也可以让 AI 工具协助修改这项配置；修改后应确认实际输出位置。

## 工作原理

**启动时如何选择数据。** 开启自动同步后，插件会在项目资产扫描完成后扫描 DataAsset，执行初始同步并显示进度，然后监听后续变化。启动时使用资产文件和 JSON 文件在磁盘上的修改时间，按以下规则处理：

| 资产与 JSON 的状态 | 处理结果 |
| --- | --- |
| UE 资产存在，对应 JSON 缺失 | 从已有资产导出 JSON |
| 两者都存在，资产文件较新 | 用资产内容更新 JSON |
| 两者都存在，JSON 文件较新 | 将 JSON 导入已有资产，并尝试自动保存 |
| 两个文件的修改时间相同 | 跳过本轮同步 |
| JSON 存在，对应 UE 资产不存在 | 不创建资产；扫描进入孤立文件清理阶段后，会尝试删除该 JSON。若没有扫描到任何 DataAsset，则提前结束，不清理孤立 JSON |

两端都被修改时，插件仍按文件修改时间选择方向，不会合并双方各自修改的字段。重要修改应先备份，避免把时间较早的一端覆盖掉。

**编辑器运行期间。**

- 修改 DataAsset 属性后，会自动导出对应 JSON。拖动滑块等连续交互中的临时属性变化会跳过，不会逐次导出。
- 新增 DataAsset 时生成对应 JSON；资产重命名后，尝试清理旧路径 JSON，再按新路径导出。重新加载资产并完成引用更新后，也会重新导出。
- AI 新增或修改已有资产对应的 JSON 时，会把文件中的属性导入该资产。插件先按 JSON 路径查找已有 DataAsset，找不到或资产无法加载时不会导入，也不会新建资产。
- 生成的 JSON 文本与现有内容完全相同时会跳过导入或导出，减少无意义写入。插件也会避免把自己写出的文件再次当作外部修改反复处理。

**删除与恢复。** 删除 UE 资产时，插件会尝试删除对应 JSON。只删除 JSON 不会删除 UE 资产，也不会立即补回 JSON；自动同步开启、资产仍存在且能正常加载时，下次启动编辑器会从资产重新导出。期间再次修改该资产，也可能提前生成 JSON。

**导入与保存。** 导入会更新编辑器中的 DataAsset，支持撤销和重做，并通知编辑器属性已变化。版本控制启用时，插件会尝试签出资产，再保存到磁盘。保存失败会输出警告，并把资产保留为待保存状态；此时先解决可写或保存问题，再检查磁盘上的资产，不能只看编辑器中的数值判断保存成功。

## AI 集成

先在 UE 中创建需要使用的 DataAsset，并让插件生成对应 JSON，再把文件位置和修改需求告诉 AI。

### JSON 文件位置

JSON 文件存储在项目的 `Saved/AIDataAsset/` 目录下（可配置）。路径与内容浏览器结构一一对应：

| 资产路径（UE 内） | JSON 文件路径 |
|-------------------|--------------|
| `/Game/DA_Demo` | `Saved/AIDataAsset/Content/DA_Demo.json` |
| `/Game/Data/Characters/DA_Warrior` | `Saved/AIDataAsset/Content/Data/Characters/DA_Warrior.json` |

### JSON 格式

以编辑器中的 `CharacterStatsData` DataAsset 为例：

![](/media-occurrence/doc%3Aai-data-asset-guide%3Amedia%3A1)

插件自动导出如下 JSON：

![](/media-occurrence/doc%3Aai-data-asset-guide%3Amedia%3A2)

```json
{
    "DisplayName": "",
    "MaxHealth": 100,
    "AttackDamage": 10,
    "MoveSpeed": 600,
    "CritRate": 0.15000000596046448,
    "NativeClass": "/Script/CoreUObject.Class'/Script/UEPluginDev.CharacterStatsData'"
}
```

> **注意**：字段名与 UE 编辑器显示一致（如 `MaxHealth` 而非 `maxHealth`）。浮点数使用完整精度，防止往返转换时丢失数据。

### AI 工作流示例

1. **告诉 AI 数据文件的位置**：

   ```
   游戏角色数据在：
   D:/MyProject/Saved/AIDataAsset/Content/

   读取 DA_Demo.json，将 MaxHealth 提升 20%，CritRate 降低到 0.1，
   然后保存文件。
   ```

2. **AI 读取 JSON、修改数值、写回文件**：

   ```json
   {
       "DisplayName": "",
       "MaxHealth": 120,
       "AttackDamage": 10,
       "MoveSpeed": 600,
       "CritRate": 0.10000000149011612,
       "NativeClass": "/Script/CoreUObject.Class'/Script/UEPluginDev.CharacterStatsData'"
   }
   ```

3. **插件检测变化并导入已有 DataAsset**：保持 UE 编辑器运行并开启自动同步，保存 JSON 后即可在编辑器中查看修改。插件随后尝试签出和保存资产；若出现保存警告，请按日志处理。

### 使用建议

- 修改 JSON 时保持 UE 编辑器运行，并开启自动同步；监听不会在编辑器关闭时工作。关闭期间的修改会在下次启动时按前述规则处理。
- 先创建 UE 资产，再编辑它对应的 JSON。单独新建 JSON 不会生成 DataAsset，孤立 JSON 还可能在启动清理时被删除。
- 保留导出的 JSON 结构，包括示例中的 `NativeClass` 字段。该字段描述导出的类型信息；当前导入会按 JSON 路径查找已有资产，不依靠它创建新资产。不能通过修改这个字段让插件生成新的资产类型。
- 无效 JSON 或资产字段结构变化可能导致导入失败。修改后应检查日志和实际资产内容，并在 UE 中测试；同步不替代游戏规则校验。

**常见情况。** JSON 没有更新时，先确认自动同步已开启、编辑器仍在运行、文件路径对应已有资产。资产数值已经变化但出现保存警告时，先检查文件是否可写及版本控制签出状态，再保存资产。仅删除 JSON 后没有立即生成新文件属于上述删除规则，不代表 UE 资产已被删除。

## 支持的引擎版本

- Unreal Engine 5.2–5.8

## 版本历史



打开 **编辑 → 项目设置**，进入 AI DataAsset 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 联系方式

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
