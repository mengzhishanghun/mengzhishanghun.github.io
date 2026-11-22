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
  group: workflows
  slug: config-binding
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-auto-enum/docs/config-binding/
lang: zh
translationKey: doc:simple-auto-enum:config-binding
---

**支持的虚幻引擎版本**：5.2–5.8

**SimpleAutoEnum** 是一个轻量级插件，可将 Unreal Engine 枚举自动绑定到可配置的字符串数组。
在项目设置中定义枚举值，插件会在运行时动态填充枚举条目。

> ⚠️ **注意**：此插件需要 **C++ 代码**来定义枚举和配置数组，不是纯蓝图方案。

---

## 📝 使用方法

### SIMPLE_BIND_ENUM_TO_CONFIG 宏参数：

```cpp
SIMPLE_BIND_ENUM_TO_CONFIG(EnumType, MinValue, MaxValue, SettingsClass, ArrayProperty)
```

1. **EnumType**：你的枚举类（如 `EMyWeapons`）
2. **MinValue**：起始边界值（如 `None`）
3. **MaxValue**：结束边界值（如 `Max`）
4. **SettingsClass**：继承自 `UDeveloperSettings` 的设置类
5. **ArrayProperty**：设置类中 `TArray<FString>` 属性的名称

### 完整设置流程：

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

---

## 🎯 使用示例

### 示例 1：标准用法
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

### 示例 2：范围绑定
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

### 示例 3：共享数组
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

---

## ⚙️ 配置与运行时结果

**项目设置配置：**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A4)

**最终运行时结果：**
![](/media-occurrence/doc%3Asimple-auto-enum%3Aconfig-binding%3Amedia%3A5)

插件根据配置动态生成枚举值，方便实现：
- 无需修改代码即可添加新枚举值
- 在不同系统间保持一致的命名
- 多个枚举共享配置

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleAutoEnum 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleAutoEnum 使用指南

先定义枚举边界与 UDeveloperSettings 配置类，再通过绑定宏关联配置数组。原文的示例覆盖一对一绑定、多个范围绑定和多枚举共用数组。

## 绑定方式与数据处理

#### 1\. 一行宏完成绑定

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

#### 2\. 完善的数据验证

```cpp
// 自动去重
["Soldier", "Archer", "Soldier"] → ["Soldier", "Archer"]

// 过滤空值和空格
["", " ", "Mage "] → ["Mage"]

// 保护None/MAX
["None", "Soldier", "MAX"] → ["Soldier"]  // None和MAX不会被覆盖
```

#### 3\. 灵活的边界定义

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

#### 4\. 完整的日志系统

```cpp
LogSimpleAutoEnum: Log: Registered pending enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Log: Processing 3 pending enum bindings from static initialization
LogSimpleAutoEnum: Log: Processed enum binding: EAIType -> UMySettings::AITypeList
LogSimpleAutoEnum: Warning: Duplicate value found: "Soldier"
```

这些日志便于排查问题。

## 使用示例

插件支持以下三种常见使用模式。

#### 示例1: 标准用法 - 一对一绑定

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

#### 示例2: 范围绑定 - 多数组组合

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

#### 示例3: 共享数组 - 多枚举共用

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

## 使用注意

检查枚举起止边界、配置数组顺序、空字符串和重复值。多个枚举共用数组时，需要保持各自边界与数组索引之间的对应关系。

---

原文于 2025-10-12 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19136345)。
