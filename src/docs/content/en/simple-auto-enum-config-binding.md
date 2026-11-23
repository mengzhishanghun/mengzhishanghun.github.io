---
title: Bind Enums to Configuration
type: doc
slug: simple-auto-enum-config-binding
draft: false
sitePublish: true
tags:
  - Configuration Management
  - Enums
workIds:
  - simple-auto-enum
documentKind: product-manual
websiteRoute: /en/works/simple-auto-enum/docs/config-binding/
lang: en
translationKey: doc:simple-auto-enum:config-binding
sourceHash: f923dd0380333ee539cb44a67049593bb3950088c31da771a5616bb56ff90122
translationStatus: translated
generatedBodyHash: a74849837b3127a04d74e60bad655b693035e48073091ff739d2c1671516b482
docPage:
  work: simple-auto-enum
  group: features
  slug: config-binding
  order: 1
---

## Declare the Enum and Configuration Array

Declare the enum and a `UDeveloperSettings` class in C++, then bind the enum to a `TArray<FString>` property with `SIMPLE_BIND_ENUM_TO_CONFIG`. Blueprint alone cannot define the binding.

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EnumType, MinValue, MaxValue, SettingsClass, ArrayProperty)
```

1. **EnumType**: Your enum class, such as `EMyWeapons`
2. **MinValue**: Starting boundary value, such as `None`
3. **MaxValue**: Ending boundary value, such as `Max`
4. **SettingsClass**: Settings class derived from `UDeveloperSettings`
5. **ArrayProperty**: Name of the `TArray<FString>` property in the settings class

**Step 1: Create a settings class**

```cpp
// MyGameSettings.h
UCLASS(config = Game, defaultconfig)
class UMyGameSettings : public UDeveloperSettings
{
    GENERATED_BODY()
public:
    UPROPERTY(config, EditAnywhere, Category = "Weapons")
    TArray<FString> WeaponsList;
};
```

**Step 2: Define an enum with boundaries**

```cpp
// MyEnums.h
UENUM(BlueprintType)
enum class EMyWeapons : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
```

**Step 3: Bind the enum to configuration**

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EMyWeapons, None, Max, UMyGameSettings, WeaponsList);
```

**Step 4: Configure in project settings**
Go to **Project Settings > Game > Your Settings** and add string values to the array.

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

## One-to-One Binding

*The most common pattern — a simple enum-to-array binding*

![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A1)

```cpp
UENUM(BlueprintType)
enum class EDemo_StandardWeapons : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_StandardWeapons, None, Max, USimpleAutoEnumTestSettings, Demo_PrimaryWeaponsArray);
```

This example fills a range in one enum from a single configuration array.

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

## Range Binding with Multiple Arrays

*Combine multiple arrays into different ranges of one enum*

![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A2)

```cpp
UENUM(BlueprintType)
enum class EDemo_CombinedWeapons : uint8
{
    None            UMETA(DisplayName = "None"),
    PrimaryEnd      UMETA(DisplayName = "--- Primary End ---"),
    AllWeaponsEnd   UMETA(DisplayName = "--- All End ---")
};
// 绑定主武器（None -> PrimaryEnd）
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_CombinedWeapons, None, PrimaryEnd, USimpleAutoEnumTestSettings, Demo_PrimaryWeaponsArray);
// 绑定副武器（PrimaryEnd -> AllWeaponsEnd）
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_CombinedWeapons, PrimaryEnd, AllWeaponsEnd, USimpleAutoEnumTestSettings, Demo_SecondaryWeaponsArray);
```

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

## Share One Array Across Enums

*Multiple enums use the same configuration array*

![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A3)

```cpp
UENUM(BlueprintType)
enum class EDemo_UIColors : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_UIColors, None, Max, USimpleAutoEnumTestSettings, Demo_SharedColorsArray);

UENUM(BlueprintType)
enum class EDemo_ItemColors : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
// 两个枚举使用相同的配置数组
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_ItemColors, None, Max, USimpleAutoEnumTestSettings, Demo_SharedColorsArray);
```

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

The plugin supports three common usage patterns for different scenarios.

## Set and Check Enum Boundaries

Compare the configuration with runtime values one range at a time. Boundary entries should still be present, and configured values should appear in the intended range. If a value is missing, check for empty strings, duplicates, and incorrect boundaries before checking the log.

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

Check the boundaries, array order, empty strings, and duplicates. If enums share an array, check that each enum’s boundaries match the intended array indices.

## Input Validation and Logs

The plugin removes duplicates, filters empty values, and preserves enum boundaries. Check `LogSimpleAutoEnum` if a binding does not produce the expected result.

```cpp
// 自动去重
["Soldier", "Archer", "Soldier"] → ["Soldier", "Archer"]

// 过滤空值和空格
["", " ", "Mage "] → ["Mage"]

// 保护None/MAX
["None", "Soldier", "MAX"] → ["Soldier"]  // None和MAX不会被覆盖
```

```cpp
LogSimpleAutoEnum: Log: Registered pending enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Log: Processing 3 pending enum bindings from static initialization
LogSimpleAutoEnum: Log: Processed enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Warning: Duplicate value found: "Soldier"
```

## Check Project Settings and Runtime Values

**Project settings configuration:**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A4)

**Final runtime result:**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A5)

The plugin generates enum values dynamically from configuration, enabling:

- Adding enum values without modifying code
- Consistent naming across systems
- Shared configuration across multiple enums
