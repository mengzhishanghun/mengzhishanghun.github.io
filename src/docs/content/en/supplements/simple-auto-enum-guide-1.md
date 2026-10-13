---
title: SimpleAutoEnum User Guide
description: Bind configuration arrays to enum ranges with macros to reduce repeated initialization code.
type: doc
slug: simple-auto-enum-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2025-10-12
draft: false
sitePublish: false
tags:
  - SimpleAutoEnum
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19136345
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19136345
workIds:
  - simple-auto-enum
lang: en
translationKey: doc:simple-auto-enum-guide:supplement:1
sourceHash: e03e1c5f56b73116f760ed2c056b666ffdb79c34040dbf1d485d5b100b2ac535
translationStatus: translated
generatedBodyHash: 9beb2c0a4cd93b696256e01165a1c6c553a8e3ee74d7191fa68ffe63eed355b5
---

# SimpleAutoEnum User Guide

Define enum boundaries and a UDeveloperSettings class first, then associate configuration arrays using binding macros. The original examples cover one-to-one binding, multiple ranges, and shared arrays across enums.

## Binding and Data Processing

#### 1\. Bind with One Macro Line

```cpp
// 传统方式:3个地方写代码
// 配置类 -> 手动调用初始化 -> 手动监听变化

// SimpleAutoEnum:一行搞定
SIMPLE_BIND_ENUM_TO_CONFIG(EAIType, None, MAX, UMySettings, AITypeList)
```

**How it works:**

-   Macro expansion creates a static initializer that registers automatically at engine startup
-   No manual subsystem code is needed
-   Anonymous namespaces prevent symbol conflicts

#### 2\. Comprehensive Data Validation

```cpp
// 自动去重
["Soldier", "Archer", "Soldier"] → ["Soldier", "Archer"]

// 过滤空值和空格
["", " ", "Mage "] → ["Mage"]

// 保护None/MAX
["None", "Soldier", "MAX"] → ["Soldier"]  // None和MAX不会被覆盖
```

#### 3\. Flexible Boundary Definitions

```cpp
// 标准模式
UENUM(BlueprintType)
enum class EWeaponType : uint8
{
    None,
    MAX
};
SIMPLE_BIND_ENUM_TO_CONFIG(EWeaponType, None, MAX, UMySettings, WeaponList)

// 自定义边界
UENUM(BlueprintType)
enum class EQuestState : uint8
{
    Begin,
    End
};
SIMPLE_BIND_ENUM_TO_CONFIG(EQuestState, Begin, End, UMySettings, QuestList)
```

#### 4\. Complete Logging System

```cpp
LogSimpleAutoEnum: Log: Registered pending enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Log: Processing 3 pending enum bindings from static initialization
LogSimpleAutoEnum: Log: Processed enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Warning: Duplicate value found: "Soldier"
```

These logs help diagnose problems.

## Usage Examples

The plugin supports three common usage patterns for different scenarios.

#### Example 1: Standard Usage — One-to-One Binding

The most common pattern binds one enum to one configuration array.

```cpp
// 1. 定义枚举框架
UENUM(BlueprintType)
enum class EWeaponType : uint8
{
    None,
    MAX
};

// 2. 创建配置类
UCLASS(Config=Game, DefaultConfig, meta=(DisplayName="Game Settings"))
class UMyGameSettings : public UDeveloperSettings
{
    GENERATED_BODY()
public:
    UPROPERTY(Config, EditAnywhere, Category="Weapons")
    TArray<FString> WeaponsList;
};

// 3. 绑定枚举
SIMPLE_BIND_ENUM_TO_CONFIG(EWeaponType, None, MAX, UMyGameSettings, WeaponsList)
```

**Configuration:**

```
WeaponsList: ["剑", "斧", "弓", "法杖"]
```

**Result:**

```cpp
EWeaponType::None, 剑, 斧, 弓, 法杖, EWeaponType::MAX
```

#### Example 2: Range Binding — Combining Multiple Arrays

Bind multiple configuration arrays to different ranges of one enum for category management.

```cpp
// 定义带有多个边界的枚举
UENUM(BlueprintType)
enum class ECombinedWeapons : uint8
{
    None            UMETA(DisplayName = "None"),
    PrimaryEnd      UMETA(DisplayName = "--- Primary End ---"),
    AllWeaponsEnd   UMETA(DisplayName = "--- All End ---")
};

// 绑定主武器到第一个范围
SIMPLE_BIND_ENUM_TO_CONFIG(ECombinedWeapons, None, PrimaryEnd, UMyGameSettings, PrimaryWeaponsList)
// 绑定副武器到第二个范围
SIMPLE_BIND_ENUM_TO_CONFIG(ECombinedWeapons, PrimaryEnd, AllWeaponsEnd, UMyGameSettings, SecondaryWeaponsList)
```

**Configuration:**

```
PrimaryWeaponsList: ["长剑", "战斧"]
SecondaryWeaponsList: ["匕首", "手枪"]
```

**Result:**

```cpp
None, 长剑, 战斧, PrimaryEnd, 匕首, 手枪, AllWeaponsEnd
```

**Use cases:**

-   Weapon systems (primary/secondary/special weapons)
-   Skill categories (active/passive/ultimate skills)
-   Item categories (consumables/equipment/materials)

#### Example 3: Shared Array — Multiple Enums

Multiple enums use the same configuration array to maintain consistent categories.

```cpp
// 品质等级枚举(用于UI显示)
UENUM(BlueprintType)
enum class EUIQuality : uint8
{
    None,
    Max
};
SIMPLE_BIND_ENUM_TO_CONFIG(EUIQuality, None, Max, UMyGameSettings, QualityLevelsArray)

// 物品品质枚举(用于道具系统)
UENUM(BlueprintType)
enum class EItemQuality : uint8
{
    Begin,
    End
};
// 使用同一个配置数组,保证UI和物品系统的品质分类一致
SIMPLE_BIND_ENUM_TO_CONFIG(EItemQuality, Begin, End, UMyGameSettings, QualityLevelsArray)
```

**Configuration:**

```
QualityLevelsArray: ["普通", "优秀", "稀有", "史诗", "传说"]
```

**Result:**

```cpp
// EUIQuality枚举:
None, 普通, 优秀, 稀有, 史诗, 传说, Max

// EItemQuality枚举:
Begin, 普通, 优秀, 稀有, 史诗, 传说, End

// 两个枚举的索引值完全对应
// EUIQuality::普通 (索引1) 和 EItemQuality::普通 (索引1)
// EUIQuality::传说 (索引5) 和 EItemQuality::传说 (索引5)
```

**Use cases:**

-   Color tiers (consistent UI/item/effect colors)
-   Rarity tiers (consistent equipment/item/monster grading)
-   Difficulty tiers (consistent level/quest/Boss difficulty)

## Usage Notes

Check enum boundaries, configuration-array ordering, empty strings, and duplicates. When multiple enums share an array, preserve the relationship between each enum's boundaries and the array indices.

---

Originally published on 2025-10-12 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19136345).
