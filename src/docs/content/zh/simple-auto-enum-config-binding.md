---
title: 从配置绑定枚举
type: doc
slug: simple-auto-enum-config-binding
draft: false
sitePublish: true
tags:
  - 配置管理
  - 枚举
workIds:
  - simple-auto-enum
docPage:
  work: simple-auto-enum
  group: enum-binding
  slug: config-binding
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-auto-enum/docs/config-binding/
lang: zh
translationKey: doc:simple-auto-enum:config-binding
---

## 声明枚举和配置数组

先用 C++ 声明枚举和 `UDeveloperSettings` 配置类，再用 `SIMPLE_BIND_ENUM_TO_CONFIG` 将枚举与 `TArray<FString>` 属性绑定。仅使用蓝图无法完成定义。

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EnumType, MinValue, MaxValue, SettingsClass, ArrayProperty)
```

1. **EnumType**：你的枚举类（如 `EMyWeapons`）
2. **MinValue**：起始边界值（如 `None`）
3. **MaxValue**：结束边界值（如 `Max`）
4. **SettingsClass**：继承自 `UDeveloperSettings` 的设置类
5. **ArrayProperty**：设置类中 `TArray<FString>` 属性的名称

**步骤 1：创建设置类**

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

**步骤 2：定义带边界的枚举**

```cpp
// MyEnums.h
UENUM(BlueprintType)
enum class EMyWeapons : uint8
{
    None UMETA(DisplayName = "None"),
    Max  UMETA(DisplayName = "Max")
};
```

**步骤 3：绑定枚举到配置**

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EMyWeapons, None, Max, UMyGameSettings, WeaponsList);
```

**步骤 4：在项目设置中配置**
前往 **项目设置 > Game > Your Settings** 并向数组中添加字符串值。

```cpp
// 传统方式:3个地方写代码
// 配置类 -> 手动调用初始化 -> 手动监听变化

// SimpleAutoEnum:一行搞定
SIMPLE_BIND_ENUM_TO_CONFIG(EAIType, None, MAX, UMySettings, AITypeList)
```

**原理:**

-   宏展开后创建静态初始化器,自动在引擎启动时注册
-   无需在子系统中手动编写任何代码
-   使用匿名命名空间避免符号冲突

## 标准绑定：一个枚举对应一个数组

*最常见的模式 - 简单的枚举到数组绑定*

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

最常见的模式,一个枚举绑定一个配置数组。

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

**配置:**

```
WeaponsList: ["剑", "斧", "弓", "法杖"]
```

**结果:**

```cpp
EWeaponType::None, 剑, 斧, 弓, 法杖, EWeaponType::MAX
```

## 范围绑定：一个枚举对应多个数组

*将多个数组组合到一个枚举的不同范围中*

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

将多个配置数组绑定到一个枚举的不同范围,适合分类管理。

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

**配置:**

```
PrimaryWeaponsList: ["长剑", "战斧"]
SecondaryWeaponsList: ["匕首", "手枪"]
```

**结果:**

```cpp
None, 长剑, 战斧, PrimaryEnd, 匕首, 手枪, AllWeaponsEnd
```

**适用场景:**

-   武器系统(主武器/副武器/特殊武器)
-   技能分类(主动技能/被动技能/终极技能)
-   物品分类(消耗品/装备/材料)

## 共享绑定：多个枚举读取同一数组

*多个枚举使用同一个配置数组*

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

多个枚举使用同一个配置数组,保证分类一致性。

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

**配置:**

```
QualityLevelsArray: ["普通", "优秀", "稀有", "史诗", "传说"]
```

**结果:**

```cpp
// EUIQuality枚举:
None, 普通, 优秀, 稀有, 史诗, 传说, Max

// EItemQuality枚举:
Begin, 普通, 优秀, 稀有, 史诗, 传说, End

// 两个枚举的索引值完全对应
// EUIQuality::普通 (索引1) 和 EItemQuality::普通 (索引1)
// EUIQuality::传说 (索引5) 和 EItemQuality::传说 (索引5)
```

**适用场景:**

-   颜色等级(UI/物品/特效统一配色)
-   稀有度等级(装备/道具/怪物统一分级)
-   难度等级(关卡/任务/Boss统一难度)

插件支持以下三种常见使用模式。

## 设置并核对枚举边界

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

检查起止边界、数组顺序、空字符串和重复项。多个枚举共用数组时，确认每个枚举的边界对应预期的数组索引范围。

## 输入验证与日志

插件会去重、过滤空值并保留枚举边界。绑定未得到预期结果时，检查 `LogSimpleAutoEnum`。

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

## 在项目设置中查看运行结果

**项目设置配置：**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A4)

**最终运行时结果：**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A5)

插件根据配置动态生成枚举值，方便实现：

- 无需修改代码即可添加新枚举值
- 在不同系统间保持一致的命名
- 多个枚举共享配置
