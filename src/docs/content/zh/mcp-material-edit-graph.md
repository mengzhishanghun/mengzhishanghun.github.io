---
title: 编辑材质图与节点
type: doc
slug: mcp-material-edit-graph
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
docPage:
  work: mcp-material
  group: features
  slug: edit-graph
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/edit-graph/
lang: zh
translationKey: doc:mcp-material:edit-graph
---

## 检查表达式、节点与连接

`SearchMaterialExpressions` 返回稳定的 `ClassPath`、`Creatable`、不可创建原因以及输入/输出索引。短类名发生碰撞时，`ApplyMaterialPatch` 会拒绝猜测并要求精确 `ClassPath`；同名 Pin 必须使用 `[index]` 寻址。

`GetMaterialDetail` 对节点使用 `NodeOffset`/`MaxNodes`、对连接使用 `ConnectionOffset`/`MaxConnections`。响应会给出总数、当前返回数和下一游标，每页最多 1000 项。节点和连线分别翻页，找到目标节点后也要确认相关连接都已读到。

## 修改材质图

使用 `ApplyMaterialPatch` 批量编辑节点和连线，用 `SetMaterialProperties` 修改材质属性。`RemoveConnection` 移除连接，`FormatGraph` 调整布局。

`ApplyMaterialPatch` 不创建或删除需要专用编辑器结构管理的 Composite、PinBase、Function Input/Output、Named Reroute 等节点。

`ApplyMaterialPatch` 的 Nodes、Connections、RemoveNodes、UpdateNodes 各最多 1000 项，四者合计最多 2000 次操作。分页、预览尺寸、图布局间距、连接索引和参数类型等已知边界会在执行前校验。

`SetMaterialProperties` 与 `ApplyMaterialPatch.Defaults` 会按最终属性组合拒绝当前被条件禁用的属性。

写入前先关闭目标编辑器，修改后按[材质资产的关闭与保存规则](/zh/works/mcp-material/docs/material-assets/)保存。

## 编辑既有节点

调用 `GetMaterialDetail` 并设置 `IncludeEditableProperties: true`，可读取当前节点页的 `EditableProperties`（`Name`、`Type`、`ValueText`、`Editable`）和实际 `Inputs`/`Outputs`（`Index`、`Name`、数值形式的材质值 `Type`）。根响应还会包含材质的 `EditableMaterialProperties`。属性描述中的 `Type` 是 UE C++ 类型，`ValueText` 使用 UE 文本格式；`Editable` 同时反映服务端支持范围和当前属性组合。省略该开关时，响应保持原有结构。

找到要改的节点后，先在读回结果中确认目标属性可编辑，再把该节点的 GUID 填入请求。下面的示例原位修改一个节点的默认值：

```json
{
  "AssetPath": "/Game/Materials/M_Example",
  "Patch": {
    "UpdateNodes": [
      {"NodeGuid": "<GetMaterialDetail 返回的 GUID>", "Properties": {"DefaultValue": 0.75}}
    ]
  }
}
```

响应的 `UpdatedNodeGuids` 列出已更新节点。属性更新会保留节点 GUID、参数 GUID 和既有连线；同一 Patch 显式编辑连线时，按请求执行。修改 Constant3Vector 时，将 `Constant` 设为 UE 颜色字符串，例如 `"(R=1,G=0,B=0,A=1)"`。

`UpdateNodes` 接受 1–1000 项，与 `Nodes`、`Connections`、`RemoveNodes` 共用总计 2000 次操作的上限。GUID 必须指向请求材质内的既有节点；重复 GUID，以及同一节点同时更新和删除的请求都会被拒绝。该更新模式不开放身份修改、参数改名、动态引脚变更、容器及需要专用适配器的外部引用。原有 `Nodes.Defaults` 创建请求保留既有支持范围。

TextureSample 支持更新 `Texture` 引用。未指定 `SamplerType` 时，采样类型随最终纹理自动调整；显式指定的 `SamplerType` 始终优先，不受属性顺序或名称大小写影响。后续连接失败时，整个 Patch 会回滚。若返回 `StateUnknown`，表示恢复结果无法核实，应停止写入并检查资产。编辑后请编译材质，再显式保存。
