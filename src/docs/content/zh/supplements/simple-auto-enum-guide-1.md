---
title: SimpleAutoEnum 使用指南
description: 通过宏将配置数组绑定到枚举范围，减少重复的初始化代码。
type: doc
slug: simple-auto-enum-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2025-10-12
draft: false
sitePublish: false
tags:
  - SimpleAutoEnum
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19136345
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19136345
workIds:
  - simple-auto-enum
lang: zh
translationKey: doc:simple-auto-enum-guide:supplement:1
---

# SimpleAutoEnum 使用指南

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
