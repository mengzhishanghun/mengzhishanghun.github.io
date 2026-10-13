---
title: SimpleAutoEnum User Manual
description: Complete English product manual for SimpleAutoEnum
type: doc
slug: simple-auto-enum-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Configuration Management
  - Enums
workIds:
  - simple-auto-enum
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-auto-enum-guide/
lang: en
translationKey: simple-auto-enum-guide
supplementSources:
  - docs/content/en/supplements/simple-auto-enum-guide-1.md
sourceHash: 27f8af88bb18be2ca936bb254c91914b0d5a346c912a8c22b746268d79590014
translationStatus: translated
generatedBodyHash: d428584829a2947b72f3a180e0378f372e96e656f440ab95e891df3f42684d3c
---

# 📘 SimpleAutoEnum Plugin Tutorial

**Supported Unreal Engine versions**: 5.2–5.8

**SimpleAutoEnum** is a lightweight plugin that automatically binds Unreal Engine enums to configurable string arrays.
Define enum values in project settings; the plugin dynamically fills enum entries at runtime.

> ⚠️ **Note**: This plugin requires **C++ code** to define enums and configuration arrays; it is not a Blueprint-only solution.

---

## 📝 How to Use

### SIMPLE_BIND_ENUM_TO_CONFIG Macro Parameters:

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EnumType, MinValue, MaxValue, SettingsClass, ArrayProperty)
```

1. **EnumType**: Your enum class, such as `EMyWeapons`
2. **MinValue**: Starting boundary value, such as `None`
3. **MaxValue**: Ending boundary value, such as `Max`
4. **SettingsClass**: Settings class derived from `UDeveloperSettings`
5. **ArrayProperty**: Name of the `TArray<FString>` property in the settings class

### Complete Setup:

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

---

## 🎯 Usage Examples

### Example 1: Standard Usage
*The most common pattern — a simple enum-to-array binding*

![](/media-occurrence/doc%3Asimple-auto-enum-guide%3Amedia%3A1)

```cpp
UENUM(BlueprintType)
enum class EDemo_StandardWeapons : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
SIMPLE_BIND_ENUM_TO_CONFIG(EDemo_StandardWeapons, None, Max, USimpleAutoEnumTestSettings, Demo_PrimaryWeaponsArray);
```

### Example 2: Range Binding
*Combine multiple arrays into different ranges of one enum*

![](/media-occurrence/doc%3Asimple-auto-enum-guide%3Amedia%3A2)

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

### Example 3: Shared Array
*Multiple enums use the same configuration array*

![](/media-occurrence/doc%3Asimple-auto-enum-guide%3Amedia%3A3)

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

---

## ⚙️ Configuration and Runtime Results

**Project settings configuration:**
![](/media-occurrence/doc%3Asimple-auto-enum-guide%3Amedia%3A4)

**Final runtime result:**
![](/media-occurrence/doc%3Asimple-auto-enum-guide%3Amedia%3A5)

The plugin generates enum values dynamically from configuration, enabling:
- Adding enum values without modifying code
- Consistent naming across systems
- Shared configuration across multiple enums

---

## ⚠️ Important Notes and Limitations

### Blueprint Functions
- **Issue**: Blueprint functions store enum values as `FString`, so enum name or position changes may not update automatically
- **Solution**: Right-click the Blueprint function and choose **Refresh** to synchronize current enum values

### DataAssets
- **Behavior**: DataAssets use enum indices and synchronize automatically when names change
- **Warning**: Reordering enum values shifts DataAsset values; for example, swapping positions 1 and 2 causes a DataAsset storing value 1 to refer to position 2
- **Recommendation**: Avoid reordering existing enum entries in production; append new values only

---

## Version History



Open **Edit → Project Settings**, go to SimpleAutoEnum settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
