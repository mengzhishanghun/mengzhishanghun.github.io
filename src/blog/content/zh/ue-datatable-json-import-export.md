---
title: UE DataTable 与 JSON：先验证，再替换
description: 文件夹中的 JSON 行可以汇成 DataTable，但“先清空表再逐文件解析”会在中途失败时丢失旧数据。适用于 UE5 C++ 的编辑器导入工具；运行时修改内存表与保存编辑器资产是两件事。下面给出流程和生命周期片段，未编译为完整工具。
type: blog
slug: ue-datatable-json-import-export
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: ue-datatable-json-import-export
---

# UE DataTable 与 JSON：先验证，再替换

## 问题与环境
文件夹中的 JSON 行可以汇成 DataTable，但“先清空表再逐文件解析”会在中途失败时丢失旧数据。适用于 UE5 C++ 的编辑器导入工具；运行时修改内存表与保存编辑器资产是两件事。下面给出流程和生命周期片段，未编译为完整工具。

## 分两阶段导入
先读取全部文件，排序并生成明确的行名，拒绝重复行名、非法文件名、无效 JSON 和不匹配字段。不要从未经规范化的路径截取字符串作为行名。确认 RowStruct 非空并符合 DataTable 行结构要求。

泛型行使用 `FStructOnScope` 管理初始化和销毁，避免只 `Malloc` 后直接写入含字符串或数组的结构：

```cpp
#include "UObject/StructOnScope.h"
#include "JsonObjectConverter.h"

FStructOnScope TemporaryRow(RowStruct);
bool bParsed = FJsonObjectConverter::JsonObjectToUStruct(
    JsonObject.ToSharedRef(), RowStruct,
    TemporaryRow.GetStructMemory(), 0, 0);
```

`JsonObject` 必须来自成功的输入反序列化。先把全部成功行装入临时 DataTable，校验业务必填字段，再替换目标。编辑器中在修改前调用 `Modify()` 并使用事务；事务不能替代磁盘备份，也不保证进程中断后自动恢复。导入失败时不清原表。

## 导出也要留旧结果
先输出到新的暂存目录，每行检查转换和写文件的返回值，完成后读取验证，再由用户确认采用新目录。不要先递归删除旧导出目录；行名还需验证不能包含路径分隔符或越界片段。

## 可验证例与限制
用两条合法行和一条坏 JSON 导入副本，预期失败时目标表不变；再试重复行名和缺必填字段。导出含 FString、TArray 的行并读回比较字段。这里只给验证步骤，未声称可打包运行或已在 UE 实测。
