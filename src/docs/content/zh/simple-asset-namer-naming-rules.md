---
title: 配置资产命名规则
type: doc
slug: simple-asset-namer-naming-rules
draft: false
sitePublish: true
tags:
  - 资产管理
  - 命名规范
workIds:
  - simple-asset-namer
docPage:
  work: simple-asset-namer
  group: features
  slug: naming-rules
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-namer/docs/naming-rules/
lang: zh
translationKey: doc:simple-asset-namer:naming-rules
---

## 按资产类型指定词缀

| 选项 | 说明 |
|------|------|
| Asset Type Naming Rules | 资产类型到前缀/后缀的映射，完全可自定义 |

**命名格式**：`前缀_名称_后缀`（后缀可选）

**默认规则（52 种类型）**：

| 分类 | 资产类型 | 前缀 | 后缀 | 示例 |
|------|---------|------|------|------|
| 游戏逻辑 | GameModeBase | GM | | `GM_MyMode` |
| | GameStateBase | GS | | `GS_MyState` |
| | PlayerController | PC | | `PC_MyController` |
| | PlayerState | PS | | `PS_MyState` |
| | Character | CHAR | | `CHAR_MyCharacter` |
| 蓝图 | Blueprint | BP | | `BP_MyActor` |
| | BlueprintGeneratedClass | BPI | | `BPI_MyInterface` |
| | BlueprintFunctionLibrary | BPFL | | `BPFL_MyLib` |
| | BlueprintMacroLibrary | BPML | | `BPML_MyMacro` |
| | UserDefinedEnum | E | | `E_MyEnum` |
| | UserDefinedStruct | F | | `F_MyStruct` |
| 网格 | StaticMesh | SM | | `SM_Chair` |
| | SkeletalMesh | SK | | `SK_Character` |
| 材质 | Material | M | | `M_Wood` |
| | MaterialInstance | MI | | `MI_Wood_Dark` |
| | MaterialInstanceConstant | MI | | `MI_Wood_Const` |
| | MaterialFunction | MF | | `MF_Blend` |
| | MaterialParameterCollection | MPC | | `MPC_Global` |
| | SubsurfaceProfile | SSP | | `SSP_Skin` |
| 动画 | AnimBlueprint | ABP | | `ABP_Character` |
| | AnimSequence | AS | | `AS_Walk` |
| | AnimMontage | AM | | `AM_Attack` |
| | AnimComposite | AC | | `AC_Combo` |
| | AimOffsetBlendSpace | AO | | `AO_Aim` |
| | BlendSpace | BS | | `BS_Locomotion` |
| | Skeleton | SKEL | | `SKEL_Character` |
| 音频 | SoundWave | S | | `S_Footstep` |
| | SoundCue | SC | | `SC_Ambient` |
| | SoundAttenuation | ATT | | `ATT_Default` |
| | SoundClass | SClass | | `SClass_Music` |
| | SoundMix | Mix | | `Mix_Default` |
| 特效 | ParticleSystem | PS | | `PS_Fire` |
| | NiagaraSystem | NS | | `NS_Smoke` |
| | NiagaraEmitter | NE | | `NE_Spark` |
| 贴图 | Texture2D | T | | `T_Wood_D` |
| | TextureCube | T | Cube | `T_Sky_Cube` |
| | TextureRenderTarget2D | RT | 2D | `RT_Scene_2D` |
| | TextureRenderTargetCube | RT | Cube | `RT_Reflect_Cube` |
| | TextureRenderTargetVolume | RT | Volume | `RT_Cloud_Volume` |
| | MediaTexture | MT | | `MT_Video` |
| UI | UserWidget | WBP | | `WBP_MainMenu` |
| | Font | Font | | `Font_Default` |
| | EditorUtilityWidget | EUW | | `EUW_MyTool` |
| AI | BehaviorTree | BT | | `BT_Enemy` |
| | BlackboardData | BB | | `BB_Enemy` |
| | BTDecorator | BTD | | `BTD_IsAlive` |
| | BTService | BTS | | `BTS_UpdateTarget` |
| | AIController | AIC | | `AIC_Enemy` |
| | EnvQuery | EQS | | `EQS_FindCover` |
| 数据 | DataTable | DT | | `DT_Items` |
| | DataAsset | DA | | `DA_Config` |
| | CurveFloat | Curve | Float | `Curve_Damage_Float` |
| | CurveVector | Curve | Vector | `Curve_Path_Vector` |
| | CurveLinearColor | Curve | Color | `Curve_Fade_Color` |
| 物理 | PhysicsAsset | PHYS | | `PHYS_Character` |
| | PhysicalMaterial | PM | | `PM_Metal` |
| 输入 | InputAction | IA | | `IA_Jump` |
| | InputMappingContext | IMC | | `IMC_Default` |
| 过场 | LevelSequence | LS | | `LS_Intro` |
| | CameraAnimationSequence | CA | | `CA_Shake` |
| 关卡 | World | MAP | | `MAP_Level1` |
| 地形 | LandscapeLayerInfoObject | LL | | `LL_Grass` |
| | LandscapeGrassType | LG | | `LG_Meadow` |
| 植被 | FoliageType | FT | | `FT_Tree` |
| Paper2D | PaperSprite | SPR | | `SPR_Player` |
| | PaperFlipbook | FB | | `FB_Walk` |
| | PaperTileSet | TS | | `TS_Ground` |
| | PaperTileMap | TM | | `TM_Level1` |

**命名规则配置：**

按资产类型填写各自的前缀与后缀：

```cpp
USTRUCT(BlueprintType)
struct FAssetNamingRule
{
    FString Prefix;  // 如 "BP"
    FString Suffix;  // 如 "Mat"
};

// 配置示例
TMap<TSoftClassPtr<UObject>, FAssetNamingRule> AssetTypeNamingRules;
// UBlueprint      → Prefix: "BP",  Suffix: ""
// UStaticMesh     → Prefix: "SM",  Suffix: ""
// UMaterialInstance → Prefix: "MI", Suffix: ""
// UTexture2D      → Prefix: "T",   Suffix: ""
```

**核心名称提取：**

插件会先**分析现有名称结构**，提取核心名称，再生成标准命名，而非直接在原名前加前缀：

```
输入: "bp_MyCharacter"    → 核心: "MyCharacter"  → 输出: "BP_MyCharacter"
输入: "SM-tree-01"        → 核心: "tree-01"      → 输出: "SM_tree_01"
输入: "Blueprint_Player"  → 核心: "Player"       → 输出: "BP_Player"
输入: "MyMaterial_Mat"    → 核心: "MyMaterial"   → 输出: "M_MyMaterial"
```

提取过程会尝试匹配并移除：

1.  当前类型配置的前缀/后缀
2.  旧词缀列表（`LegacyAffixes`）中的所有词缀
3.  分隔符识别列表中的分隔符（`_`、`-`、`.`）

在 **Asset Type Naming Rules** 下点击 **+** 添加规则。

## 限制资产路径

分批启用时，先用白名单选一个测试目录，检查该目录内的资产类型能否匹配规则，再扩大范围。路径不在筛选范围内时，先检查路径设置，再调整词缀。

`Filter Type` 默认使用黑名单，跳过 `Exclude Paths` 下的资产。白名单只处理 `Include Paths` 下的资产，适合分批推行规则。下方是默认排除路径和一组白名单示例。

```
ExcludePaths:
  /Game/__ExternalActors__    // World Partition 自动生成
  /Game/__ExternalObjects__   // World Partition 自动生成
  /Game/Developers            // 开发者个人目录
  /Game/Collections           // 集合目录
```

```
IncludePaths:
  /Game/Characters/
  /Game/Items/
```

## 配置分隔符并识别旧词缀

| 选项 | 说明 | 默认值 |
|------|------|--------|
| Delimiter | 生成名称时使用的分隔符 | `_` |
| Delimiter Detection List | 用于检测现有名称中的分隔符 | `_`、`-`、`.` |
| Legacy Affixes | 用于检测旧命名模式的前缀/后缀列表 | - |

**示例**：输入 `bp-MyActor` 或 `bp.MyActor` → 输出 `BP_MyActor`

```cpp
// 生成命名时使用的连接符
FString Delimiter = "_";               // BP_MyActor

// 识别现有命名时的分隔符列表
TArray<FString> DelimiterDetectionList = {"_", "-", "."};

// 旧词缀列表（用于识别历史命名的前缀和后缀）
TArray<FString> LegacyAffixes;  // 如 "bp", "Blueprint", "sm", "mat"
```
