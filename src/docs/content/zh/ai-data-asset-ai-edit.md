---
title: 用 AI 编辑资产数据
type: doc
slug: ai-data-asset-ai-edit
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
docPage:
  work: ai-data-asset
  group: data
  slug: ai-edit
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/ai-data-asset/docs/ai-edit/
lang: zh
translationKey: doc:ai-data-asset:ai-edit
---

先在 UE 中创建需要使用的 DataAsset，并让插件生成对应 JSON，再把文件位置和修改需求告诉 AI。

## JSON 文件位置

JSON 文件存储在项目的 `Saved/AIDataAsset/` 目录下（可配置）。路径与内容浏览器结构一一对应：

| 资产路径（UE 内） | JSON 文件路径 |
|-------------------|--------------|
| `/Game/DA_Demo` | `Saved/AIDataAsset/Content/DA_Demo.json` |
| `/Game/Data/Characters/DA_Warrior` | `Saved/AIDataAsset/Content/Data/Characters/DA_Warrior.json` |

## JSON 格式

以编辑器中的 `CharacterStatsData` DataAsset 为例：

![](/media-occurrence/doc%3Aai-data-asset%3Aai-edit%3Amedia%3A1)

插件自动导出如下 JSON：

![](/media-occurrence/doc%3Aai-data-asset%3Aai-edit%3Amedia%3A2)

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

> **注意**：字段名与 UE 编辑器显示一致（如 `MaxHealth` 而非 `maxHealth`）。float 的 `%.9f` 固定小数位不能保证全部数值范围精确往返；double 使用 `%.17g`。修改后仍需按实际字段和允许误差核对。

## 用 AI 修改角色属性

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

## 修改后检查什么

- 修改 JSON 时保持 UE 编辑器运行，并开启自动同步；监听不会在编辑器关闭时工作。关闭期间的修改会在下次启动时按“同步 DataAsset 与 JSON”中的启动规则处理。
- 先创建 UE 资产，再编辑它对应的 JSON。单独新建 JSON 不会生成 DataAsset，孤立 JSON 还可能在启动清理时被删除。
- 保留导出的 JSON 结构，包括示例中的 `NativeClass` 字段。该字段描述导出的类型信息；当前导入会按 JSON 路径查找已有资产，不依靠它创建新资产。不能通过修改这个字段让插件生成新的资产类型。
- 无效 JSON 或资产字段结构变化可能导致导入失败。修改后应检查日志和实际资产内容，并在 UE 中测试；同步不替代游戏规则校验。

**常见情况。** JSON 没有更新时，先确认自动同步已开启、编辑器仍在运行、文件路径对应已有资产。资产数值已经变化但出现保存警告时，先检查文件是否可写及版本控制签出状态，再保存资产。仅删除 JSON 后没有立即生成新文件属于同步篇中的删除规则，不代表 UE 资产已被删除。
