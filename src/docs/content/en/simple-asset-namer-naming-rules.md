---
title: Configure Asset Naming Rules
type: doc
slug: simple-asset-namer-naming-rules
draft: false
sitePublish: true
tags:
  - Asset Management
  - Naming Conventions
workIds:
  - simple-asset-namer
documentKind: product-manual
websiteRoute: /en/works/simple-asset-namer/docs/naming-rules/
lang: en
translationKey: doc:simple-asset-namer:naming-rules
sourceHash: f80311967150534e572d79101384443ab8d7cec1eddb89da108a4254897b7443
translationStatus: translated
generatedBodyHash: df2e59dff64ac1ba3e2a38a46fdbfd52f9ebbab62dc78bc0183e7bff2b1028e8
docPage:
  work: simple-asset-namer
  group: naming
  slug: naming-rules
  order: 1
---

## Assign Affixes by Asset Type

| Option | Description |
|------|------|
| Asset Type Naming Rules | Fully customizable mapping from asset types to prefixes/suffixes |

**Naming format**: `Prefix_Name_Suffix` (suffix optional)

**Default rules (52 types)**:

| Category | Asset type | Prefix | Suffix | Example |
|------|---------|------|------|------|
| Game logic | GameModeBase | GM | | `GM_MyMode` |
| | GameStateBase | GS | | `GS_MyState` |
| | PlayerController | PC | | `PC_MyController` |
| | PlayerState | PS | | `PS_MyState` |
| | Character | CHAR | | `CHAR_MyCharacter` |
| Blueprint | Blueprint | BP | | `BP_MyActor` |
| | BlueprintGeneratedClass | BPI | | `BPI_MyInterface` |
| | BlueprintFunctionLibrary | BPFL | | `BPFL_MyLib` |
| | BlueprintMacroLibrary | BPML | | `BPML_MyMacro` |
| | UserDefinedEnum | E | | `E_MyEnum` |
| | UserDefinedStruct | F | | `F_MyStruct` |
| Mesh | StaticMesh | SM | | `SM_Chair` |
| | SkeletalMesh | SK | | `SK_Character` |
| Material | Material | M | | `M_Wood` |
| | MaterialInstance | MI | | `MI_Wood_Dark` |
| | MaterialInstanceConstant | MI | | `MI_Wood_Const` |
| | MaterialFunction | MF | | `MF_Blend` |
| | MaterialParameterCollection | MPC | | `MPC_Global` |
| | SubsurfaceProfile | SSP | | `SSP_Skin` |
| Animation | AnimBlueprint | ABP | | `ABP_Character` |
| | AnimSequence | AS | | `AS_Walk` |
| | AnimMontage | AM | | `AM_Attack` |
| | AnimComposite | AC | | `AC_Combo` |
| | AimOffsetBlendSpace | AO | | `AO_Aim` |
| | BlendSpace | BS | | `BS_Locomotion` |
| | Skeleton | SKEL | | `SKEL_Character` |
| Audio | SoundWave | S | | `S_Footstep` |
| | SoundCue | SC | | `SC_Ambient` |
| | SoundAttenuation | ATT | | `ATT_Default` |
| | SoundClass | SClass | | `SClass_Music` |
| | SoundMix | Mix | | `Mix_Default` |
| Effects | ParticleSystem | PS | | `PS_Fire` |
| | NiagaraSystem | NS | | `NS_Smoke` |
| | NiagaraEmitter | NE | | `NE_Spark` |
| Texture | Texture2D | T | | `T_Wood_D` |
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
| Data | DataTable | DT | | `DT_Items` |
| | DataAsset | DA | | `DA_Config` |
| | CurveFloat | Curve | Float | `Curve_Damage_Float` |
| | CurveVector | Curve | Vector | `Curve_Path_Vector` |
| | CurveLinearColor | Curve | Color | `Curve_Fade_Color` |
| Physics | PhysicsAsset | PHYS | | `PHYS_Character` |
| | PhysicalMaterial | PM | | `PM_Metal` |
| Input | InputAction | IA | | `IA_Jump` |
| | InputMappingContext | IMC | | `IMC_Default` |
| Cinematics | LevelSequence | LS | | `LS_Intro` |
| | CameraAnimationSequence | CA | | `CA_Shake` |
| Level | World | MAP | | `MAP_Level1` |
| Landscape | LandscapeLayerInfoObject | LL | | `LL_Grass` |
| | LandscapeGrassType | LG | | `LG_Meadow` |
| Foliage | FoliageType | FT | | `FT_Tree` |
| Paper2D | PaperSprite | SPR | | `SPR_Player` |
| | PaperFlipbook | FB | | `FB_Walk` |
| | PaperTileSet | TS | | `TS_Ground` |
| | PaperTileMap | TM | | `TM_Level1` |

**Naming rule configuration:**

Each asset type can have its own prefix and suffix:

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

**Core name extraction:**

The plugin does more than prepend a prefix. It first **analyzes the existing name structure**, extracts the core name, then generates the standard name:

```
Input: "bp_MyCharacter"    → Core: "MyCharacter"  → Output: "BP_MyCharacter"
Input: "SM-tree-01"        → Core: "tree-01"      → Output: "SM_tree_01"
Input: "Blueprint_Player"  → Core: "Player"       → Output: "BP_Player"
Input: "MyMaterial_Mat"    → Core: "MyMaterial"   → Output: "M_MyMaterial"
```

Extraction attempts to match and remove:

1.  The prefix/suffix configured for the current type
2.  All affixes in the legacy list (`LegacyAffixes`)
3.  Separators in the detection list (`_`, `-`, `.`)

Click **+** under **Asset Type Naming Rules** to add a rule.

## Limit Asset Paths

`Filter Type` defaults to a blocklist and skips assets under `Exclude Paths`. An allowlist processes only paths in `Include Paths`, which is useful for introducing rules gradually. The blocks below show the default exclusions and an example allowlist.

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

## Set Delimiters and Recognize Legacy Affixes

| Option | Description | Default |
|------|------|--------|
| Delimiter | Separator used in generated names | `_` |
| Delimiter Detection List | Delimiters recognized in existing names | `_`, `-`, `.` |
| Legacy Affixes | Prefix/suffix list for recognizing older naming patterns | - |

**Example**: Input `bp-MyActor` or `bp.MyActor` → output `BP_MyActor`

```cpp
// 生成命名时使用的连接符
FString Delimiter = "_";               // BP_MyActor

// 识别现有命名时的分隔符列表
TArray<FString> DelimiterDetectionList = {"_", "-", "."};

// 旧词缀列表（用于识别历史命名的前缀和后缀）
TArray<FString> LegacyAffixes;  // 如 "bp", "Blueprint", "sm", "mat"
```
