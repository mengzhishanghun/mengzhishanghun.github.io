---
title: 同步 DataAsset 与 JSON
type: doc
slug: ai-data-asset-sync
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
docPage:
  work: ai-data-asset
  group: features
  slug: sync
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ai-data-asset/docs/sync/
lang: zh
translationKey: doc:ai-data-asset:sync
---

通过 JSON 读取和修改已有 DataAsset，让 AI 或其他外部工具处理数据，再自动同步回 UE。支持常见基础类型和大多数结构体，包括嵌套结构体，以及 TArray、TMap、TSet 等常见容器中的属性数据。

DataAsset 以 UE 序列化后的 .uasset 文件保存，常用于技能表、角色属性、掉落表和 AI 行为参数。外部 AI 工具难以直接处理这些字段，通过 JSON 可以调整基础字段、嵌套结构体和容器数据，减少把 AI 输出手工填回编辑器的工作。LLM 生成关卡配置、强化学习调整平衡数值，以及策划批量修改，都可以使用这条数据通道；修改后的结果仍需在 UE 中检查和测试。

插件的用途与适用场景见 [AIDataAsset 作品页](/zh/works/ai-data-asset/)。

## 何时同步

如果刚在外部改过 JSON，准备重启编辑器前先比对两侧文件的修改时间。两端都有重要改动时，先保留副本，再启动同步。

编辑器启动时，插件检查磁盘上的资产和 JSON；启动同步结束后，插件监听两侧的变更。

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

## 导入结果与保存失败

Perforce 等版本控制系统管理的 `.uasset` 可能是只读文件。启用 Perforce、Git 或 SVN 时，插件会通过当前服务提供方尝试签出。

当前实现先在撤销事务中调用 `Modify()`，将 JSON 数据写入内存资产，再调用 `PostEditChange()` 通知编辑器。随后检查 `ISourceControlModule` 是否启用，启用时通过当前 provider 尝试 Checkout，最后调用 `UPackage::Save` 保存。

这里没有检查 Checkout 的返回结果。保存成功才表示磁盘资产已更新；保存失败会将包标记为待保存并输出警告，不能仅凭内存中的属性变化认定文件已保存。

## 重复通知与相同内容

插件用 `bIsSyncing` 跳过同步过程中触发的资产回调；导出时还用 `PendingSelfChanges` 记录真正写入的路径，防止稍后到达的目录通知把它算成外部编辑。导出和导入都会比较完整的 JSON 文本，只有文本完全相同才跳过；空白或字段顺序不同可能仍会触发同步。

`OnObjectPropertyChanged` 会跳过 `Interactive` 连续交互事件。包重载时在 `PostPackageFixup` 之后重新导出；目录监听仅对新增或修改的 `.json` 尝试导入。

## 关闭插件与撤销

导入通过 `FScopedTransaction` 支持撤销和重做；插件关闭时注销 `IDirectoryWatcher` 以及资产、属性变化等回调，避免监听器继续引用已销毁的同步管理器。

## JSON 属性转换

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

## 浮点数输出与属性名

浮点数输出格式会影响数值参数的可读性与往返结果。实现记录中曾以编辑器中的 `0.3` 导出成 `0.30000000000000004` 为例，将其视为伤害系数、概率权重和物理参数等敏感数据需要关注的问题；这样的十进制表现也可能来自二进制浮点数本身，不能据此断言所有 UE JSON 转换都丢失精度。

该实现选择自定义 JSON PrintPolicy：float 使用 `%.9f`（小数点后 9 位），double 使用 `%.17g`（17 位有效数字，用于 IEEE 754 双精度输出）。原实现说明据此提出 DataAsset → JSON → DataAsset 完全一致的往返目标，但固定小数位不等于有效数字，也不能单凭格式字符串保证任意量级 float 均无损；实际结果仍需按字段类型、序列化路径与允许误差核对。

`FJsonObjectConverter` 在序列化时会将属性名的首字母转为小写——编辑器里的 `MaxHealth` 导出后变成 `maxHealth`。

这不只是美观问题。AI 读到 JSON 中的 `maxHealth`，再看编辑器里的 `MaxHealth`，字段名对不上会增加理解成本。更麻烦的是，如果 AI 按编辑器里看到的名字写了 `MaxHealth` 到 JSON，反序列化时可能匹配不上。

解决方案是在导出后递归遍历 JSON 对象的所有字段，将首字母还原为大写；导入前做反向转换。缩写、嵌套结构和名称冲突需要按实际字段核对，不能假设首字母转换对所有资产都可逆。
