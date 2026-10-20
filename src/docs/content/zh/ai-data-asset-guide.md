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

DataAsset 以 UE 序列化后的 .uasset 文件保存，常用于技能表、角色属性、掉落表和 AI 行为参数。外部 AI 工具难以直接处理这些字段，通过 JSON 可以调整基础字段、嵌套结构体和容器数据，减少把 AI 输出手工填回编辑器的工作。LLM 生成关卡配置、强化学习调整平衡数值，以及策划批量修改，都可以使用这条数据通道；修改后的结果仍需在 UE 中检查和测试。

插件的用途与适用场景见 [AIDataAsset 作品页](/zh/works/ai-data-asset/)。

## 功能特性

- **双向同步**：DataAsset 属性变更自动导出为 JSON；JSON 文件变更自动导入回 DataAsset
- **初始同步**：自动同步开启后，编辑器启动时按资产与 JSON 文件的修改时间选择方向；时间相同则跳过
- **孤立清理**：启动扫描进入清理阶段后，尝试删除没有对应 DataAsset 的 JSON；未扫描到任何 DataAsset 时会跳过清理
- **版本控制集成**：启用版本控制时，保存前尝试通过已配置的 Perforce/Git/SVN 签出文件
- **防循环机制**：避免插件自己的同步结果再次触发反复导入导出
- **浮点数输出**：历史实现为 float 使用 `%.9f`、double 使用 `%.17g`；往返精度需按实际数值范围和序列化路径核对
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

### JSON 中间格式与属性转换

DataAsset 与外部工具需要一种都能处理的中间格式。CSV、XML、YAML 都可以考虑，我选择 JSON，主要是因为：

-   几乎所有编程语言和 AI 框架原生支持
-   人类可读，方便调试
-   支持文本 diff，需要审查数据变化时，可以比较具体字段
-   结构灵活，能表达 UE 中常见的嵌套数据类型

UE 内置的 JSON 序列化工具类 `FJsonObjectConverter` 提供了两个主要函数：

-   **UStructToJsonObject**：将任意 UStruct（包括 DataAsset 的所有 UPROPERTY）序列化为 FJsonObject
-   **JsonObjectToUStruct**：反向操作，将 FJsonObject 反序列化回 UStruct

它能处理绝大多数 UPROPERTY 类型：基本类型、FString、FName、枚举、嵌套 UStruct、TArray、TMap、TSet，甚至软引用（FSoftObjectPath）。具体属性类型与软引用仍需结合引擎版本和资产定义检查。

**如果你只需要单向、手动触发的导出或导入，到这里就够了。** 写个编辑器工具按钮，点一下导出 JSON，AI 改完再点一下导入，功能上完全可行。

如果要让编辑器里的 DataAsset 变化自动更新 JSON，外部 JSON 变化也自动更新 DataAsset，就还需要处理双向同步。

### 浮点数输出与属性名

浮点数输出格式会影响数值参数的可读性与往返结果。实现记录中曾以编辑器中的 `0.3` 导出成 `0.30000000000000004` 为例，将其视为伤害系数、概率权重和物理参数等敏感数据需要关注的问题；这样的十进制表现也可能来自二进制浮点数本身，不能据此断言所有 UE JSON 转换都丢失精度。

该实现选择自定义 JSON PrintPolicy：float 使用 `%.9f`（小数点后 9 位），double 使用 `%.17g`（17 位有效数字，用于 IEEE 754 双精度输出）。原实现说明据此提出 DataAsset → JSON → DataAsset 完全一致的往返目标，但固定小数位不等于有效数字，也不能单凭格式字符串保证任意量级 float 均无损；实际结果仍需按字段类型、序列化路径与允许误差核对。

`FJsonObjectConverter` 在序列化时会将属性名的首字母转为小写——编辑器里的 `MaxHealth` 导出后变成 `maxHealth`。

这不只是美观问题。AI 读到 JSON 中的 `maxHealth`，再看编辑器里的 `MaxHealth`，字段名对不上会增加理解成本。更麻烦的是，如果 AI 按编辑器里看到的名字写了 `MaxHealth` 到 JSON，反序列化时可能匹配不上。

解决方案是在导出后递归遍历 JSON 对象的所有字段，将首字母还原为大写；导入前做反向转换。缩写、嵌套结构和名称冲突需要按实际字段核对，不能假设首字母转换对所有资产都可逆。

### 启动同步与删除规则

**启动时如何选择数据。** 开启自动同步后，插件会在项目资产扫描完成后扫描 DataAsset，执行初始同步并显示进度，然后监听后续变化。扫描排除 `/Engine/` 下的资产，先完成初始同步，再注册运行期间的资产和目录监听。启动时使用资产文件和 JSON 文件在磁盘上的修改时间，按以下规则处理：

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

**删除与恢复。** 启动清理根据本轮扫描收集的资产路径集合判断孤立 JSON；未扫描到任何 DataAsset 时会提前返回，不执行清理。删除 UE 资产时，插件会尝试删除对应 JSON。只删除 JSON 不会删除 UE 资产，也不会立即补回 JSON；自动同步开启、资产仍存在且能正常加载时，下次启动编辑器会从资产重新导出。期间再次修改该资产，也可能提前生成 JSON。

**导入与保存。** 导入会更新编辑器中的 DataAsset，支持撤销和重做，并通知编辑器属性已变化。版本控制启用时，插件会尝试签出资产，再保存到磁盘。保存失败会输出警告，并把资产保留为待保存状态；此时先解决可写或保存问题，再检查磁盘上的资产，不能只看编辑器中的数值判断保存成功。

### 防止循环同步

双向同步可能沿着这条路径反复触发：

1.  用户在编辑器里改了 DataAsset
2.  监听到变化，自动导出写入 JSON
3.  文件系统检测到 JSON 变化
4.  监听到变化，自动导入更新 DataAsset
5.  回到步骤 2，无限循环

实现中用了两层防护：

-   **同步标记 `bIsSyncing`**：启动同步和处理目录变更时设为 true。资产属性、新增、删除、重命名及包重载回调发现正在同步就返回，避免导入过程中再次导出。
-   **自写入路径集合 `PendingSelfChanges`**：导出实际写入文件后记录规范化路径。目录监听收到该路径的通知时，移除标记并跳过这条通知，避免把自己的导出当作外部修改。

文件系统通知可能晚于同步标记复位，所以还需要路径追踪。导出前会比较已有文件与新生成的 JSON 文本，导入前也会比较当前资产的序列化文本与文件内容；字符串完全一致就跳过。这里比较的是文本，不是忽略空白和字段顺序后的 JSON 语义。

运行期间，`OnObjectPropertyChanged` 跳过 `Interactive` 类型的连续交互事件，其余 DataAsset 属性变更会导出；新增资产也会导出。重命名先尝试删除旧路径 JSON，再生成新路径 JSON；资产包重载则在 `PostPackageFixup` 阶段导出更新后的资产。

目录监听只对 `.json` 的新增和修改事件尝试导入。插件先按路径加载已有 DataAsset，找不到资产就记录警告并返回，不会根据 JSON 新建资产；JSON 删除事件也不会触发资产删除。

### 资产导入、签出与保存实现

Perforce 等版本控制系统管理的 .uasset 文件可能处于只读状态，因此还要处理资产保存。

当前实现先在撤销事务中调用 `Modify()`，将 JSON 数据写入内存资产，再调用 `PostEditChange()` 通知编辑器。随后检查 `ISourceControlModule` 是否启用，启用时通过当前 provider 尝试 Checkout，最后调用 `UPackage::Save` 保存。

这里没有检查 Checkout 的返回结果。保存成功才表示磁盘资产已更新；保存失败会将包标记为待保存并输出警告，不能仅凭内存中的属性变化认定文件已保存。

### 同步管理器的生命周期

导入通过 `FScopedTransaction` 支持撤销和重做；插件关闭时注销 `IDirectoryWatcher` 以及资产、属性变化等回调，避免监听器继续引用已销毁的同步管理器。

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

> **注意**：字段名与 UE 编辑器显示一致（如 `MaxHealth` 而非 `maxHealth`）。float 的 `%.9f` 固定小数位不能保证全部数值范围精确往返；double 使用 `%.17g`。修改后仍需按实际字段和允许误差核对。

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

## 技术说明来源

双向同步实现说明于 2026-05-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/20159718)。

## 联系方式

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
