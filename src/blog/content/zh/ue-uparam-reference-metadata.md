---
title: UE 蓝图函数参数：引用方向与显示名称
description: UE C++ 的引用参数在蓝图节点上不一定呈现为预期的输入引脚。声明类型、`const` 和参数元数据共同影响节点表现。以下示例用于 UE5 的反射函数声明，未在引擎中编译。
type: blog
slug: ue-uparam-reference-metadata
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
translationKey: ue-uparam-reference-metadata
---

# UE 蓝图函数参数：引用方向与显示名称

## 问题与环境
UE C++ 的引用参数在蓝图节点上不一定呈现为预期的输入引脚。声明类型、`const` 和参数元数据共同影响节点表现。以下示例用于 UE5 的反射函数声明，未在引擎中编译。

## 一个参数一个意图
```cpp
UFUNCTION(BlueprintCallable)
static void OffsetValues(float Offset, UPARAM(ref) TArray<int32>& Values);

UFUNCTION(BlueprintCallable)
static void InspectValues(const TArray<int32>& Values);

UFUNCTION(BlueprintCallable)
static void SetAge(UPARAM(DisplayName="Age in years") int32 Age);
```

`UPARAM(ref)` 修饰它后面的参数，让非 const 引用按引用输入表达；函数仍可修改该数组。它不要求位于第一个参数位置。`const TArray<int32>&` 适合只读输入。普通非 const 引用常被反射为输出参数，发布前应检查实际引脚方向。`DisplayName` 改节点显示，不改变 C++ 参数名。

## 使用边界
类选择器的 `AllowAbstract`、`MustImplement` 和 `DeterminesOutputType` 分别涉及抽象类可选性、接口筛选和输出类型推导，不能代替运行时校验。具体适用位置要对照当前引擎支持的元数据。`TFunctionRef` 是 C++ 非拥有回调视图，不是普通蓝图可反射参数，也不能长期保存临时 lambda。

## 可验证例
在临时 Blueprint Function Library 中实现 `OffsetValues`，用第二个参数传数组，调用后比较数组内容；再检查只读示例的输入引脚和名称示例的显示文本。重新编译后刷新旧节点，避免旧引脚缓存误导判断。
