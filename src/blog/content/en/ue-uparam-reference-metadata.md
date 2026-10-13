---
title: "Unreal Blueprint parameters: references and display names"
description: "A C++ reference parameter may appear as a different Blueprint pin direction than expected. Type, `const` and metadata all matter. These UE5 reflected "
type: blog
slug: ue-uparam-reference-metadata
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: ue-uparam-reference-metadata
publishedAt: 2026-10-13
sourceHash: 24f7cee5d0cdb2ec933f35b9d3a61a8f5037a09aa4714e1e79637f68fcfb5cf4
generatedBodyHash: c2ad0ee11b69783bcb56230a43f4d9839dda778494e2722c3acf283c388f3adc
translationStatus: translated
---

# Unreal Blueprint parameters: references and display names

## Problem and environment
A C++ reference parameter may appear as a different Blueprint pin direction than expected. Type, `const` and metadata all matter. These UE5 reflected declarations have not been compiled in an engine.

## Give each parameter a clear intent
```cpp
UFUNCTION(BlueprintCallable)
static void OffsetValues(float Offset, UPARAM(ref) TArray<int32>& Values);

UFUNCTION(BlueprintCallable)
static void InspectValues(const TArray<int32>& Values);

UFUNCTION(BlueprintCallable)
static void SetAge(UPARAM(DisplayName="Age in years") int32 Age);
```

`UPARAM(ref)` applies to the following parameter and expresses a non-const reference as an input reference; the function can still modify the array. It need not be the first parameter. `const TArray<int32>&` suits read-only input. An ordinary non-const reference is often exposed as an output, so inspect the resulting pins. `DisplayName` changes the displayed label rather than the C++ identifier.

## Limits
For class selectors, `AllowAbstract`, `MustImplement` and `DeterminesOutputType` concern abstract-class selection, interface filtering and output-type inference. They do not replace runtime validation; check supported metadata locations in your engine version. `TFunctionRef` is a non-owning C++ callback view, not a normal Blueprint-reflected parameter, and must not retain a temporary lambda.

## Try it
Implement `OffsetValues` in a temporary Blueprint Function Library, pass an array as the second argument and inspect its values after the call. Check the read-only input pin and displayed age label too. Refresh existing nodes after rebuilding so cached pins do not distort the result.
