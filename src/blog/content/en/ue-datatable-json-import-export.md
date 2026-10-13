---
title: "Unreal DataTable and JSON: validate before replacing"
description: JSON files can become DataTable rows, but clearing the table before parsing can destroy old data on a later failure. This workflow targets a UE5 C++ e
type: blog
slug: ue-datatable-json-import-export
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
translationKey: ue-datatable-json-import-export
publishedAt: 2026-10-13
sourceHash: 844aa63f46c9f25eba0bb4ed3181f7f6a680e178bfe786cda3a175691723474c
generatedBodyHash: ec1857e7f96e761cde8ab6c519dca971b6a06d52cdbc25e572d6dcc325ec7b99
translationStatus: translated
---

# Unreal DataTable and JSON: validate before replacing

## Problem and environment
JSON files can become DataTable rows, but clearing the table before parsing can destroy old data on a later failure. This workflow targets a UE5 C++ editor importer. Mutating a runtime table in memory and saving an editor asset are different operations. The lifecycle fragment is not a compiled complete tool.

## Import in two phases
Read all files first, sort them and derive explicit row names. Reject duplicate names, invalid filenames, invalid JSON and incompatible fields. Do not create row names by slicing an unnormalized path. Check that RowStruct exists and meets DataTable row requirements.

Use `FStructOnScope` for generic row initialization and destruction rather than writing strings or arrays into a raw `Malloc` allocation:

```cpp
#include "UObject/StructOnScope.h"
#include "JsonObjectConverter.h"

FStructOnScope TemporaryRow(RowStruct);
bool bParsed = FJsonObjectConverter::JsonObjectToUStruct(
    JsonObject.ToSharedRef(), RowStruct,
    TemporaryRow.GetStructMemory(), 0, 0);
```

`JsonObject` must come from successfully deserializing the input. Populate a temporary DataTable with all valid rows, validate required business fields, then replace the target. In the editor, call `Modify()` before modification and use a transaction. Transactions do not replace disk backups or guarantee recovery after interruption. Failed imports must leave the original table intact.

## Preserve previous exports too
Write to a new staging directory. Check conversion and file-write results for each row and read the completed output back before the user adopts the new directory. Do not recursively delete the old export first. Validate row names against separators and path traversal.

## Try it and understand the limits
Import two valid rows and one malformed JSON into a copy: failure should leave the target unchanged. Also try duplicate names and missing required fields. Export rows containing FString and TArray, read them back and compare fields. These are proposed checks, not claims of engine testing or packaged-runtime support.
