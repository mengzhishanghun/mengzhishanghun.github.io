---
title: 博客列表
type: page
slug: blog-index
draft: false
sitePublish: true
websiteRoute: /blog/
template: blog/index.html
lang: zh
translationKey: blog-index
---

![](/media-occurrence/page%3Ablog-index%3Amedia%3A1)

# 博客

技术思考、排障与开发记录

UE35C++2Python4Perforce7

搜索当前分类

默认顺序

标签

[## Windows 源码版 UE：让团队使用一致的引擎关联名称

Windows 下，同一份源码引擎可能在不同电脑上注册成不同标识，导致 `.uproject` 的 `EngineAssociation` 产生无意义变更。统一关联名称可以减少这类差异；它不决定 UnrealBuildTool 是否重新编译。

](/blog/ue-source-engine-association/)[## UE 蓝图函数参数：引用方向与显示名称

UE C++ 的引用参数在蓝图节点上不一定呈现为预期的输入引脚。声明类型、`const` 和参数元数据共同影响节点表现。以下示例用于 UE5 的反射函数声明，未在引擎中编译。

](/blog/ue-uparam-reference-metadata/)[## Windows UE 5.6 与 Cursor：先跑通构建，再处理编辑体验

这是一份 Windows、UE 5.6 的配置经历整理。原记录未留下完整 Cursor 和扩展版本，因此不能视为当前版本兼容性承诺。目标是用 Cursor 编辑 UE C++，并保留独立可用的编译与调试入口。

](/blog/ue-cursor-workflow-notes/)[## Fab 提交经验：把发布包和使用说明一起检查

功能在开发工程里能用，不等于交付包能安装和复现。这份记录提炼过去的 UE 内容发布经验，不介绍具体插件产品，也不声称代表当前 Fab 审核规则。

](/blog/ue-fab-submission-notes/)[## UE DataTable 与 JSON：先验证，再替换

文件夹中的 JSON 行可以汇成 DataTable，但“先清空表再逐文件解析”会在中途失败时丢失旧数据。适用于 UE5 C++ 的编辑器导入工具；运行时修改内存表与保存编辑器资产是两件事。下面给出流程和生命周期片段，未编译为完整工具。

](/blog/ue-datatable-json-import-export/)[## UE 编辑器资产保存：签出、脏标记与保存结果

自动化工具修改了资产，磁盘文件却未更新，常见原因包括包未标脏、目标路径错误或版本控制阻止写入。本文限于 UE5 编辑器资产保存；不把编辑器 API 当成游戏运行时的通用存档方案。

](/blog/ue-editor-asset-saving/)[## 批量拆开 Level Instance：范围明确，失败就停

拆开 Level Instance 可能暴露更多嵌套实例。每轮只要找到实例就继续循环，遇到无法拆开的实例会一直重复。本文仅讨论 UE5 编辑器中的批量展开流程，不能作为运行时操作教程。

](/blog/ue-level-instance-break-safety/)[## 游戏公式解析：先定义语法，再处理优先级

游戏事件需要计算 `1 + 2 * 3` 之类的文本公式。用正则排除几个非法片段，再在数组里删除 token，不足以保证完整语法和运算顺序。本文从原 UE C++ 记录提炼解析方法，去掉项目 Subsystem 依赖；配套样例只实现整数四则运算、括号和一元正负号。

](/blog/ue-expression-parser-basics/)[## C++ 常用选择：容器、排序与值类别

容器和排序应从访问方式与顺序要求选择，而不是根据旧版编译器的实现细节。本文采用 C++17 标准语义，合并容器、算法和引用的常见误区。

](/blog/cpp-algorithms-containers-value-categories/)[## Python 按列名更新 Excel：组合键与独立输出

参照表提供新值，目标表按多个列匹配后更新指定列。原工具把匹配字段用下划线拼起来，`("A_B", "C")` 与 `("A", "B_C")` 就可能撞键。本文将核心处理独立出来，适用于 Python 3 与 openpyxl 的普通 `.xlsx`；不复刻原 GUI。

](/blog/python-excel-column-update/)[## Python 比较目录：先生成内容差异报告

两个大目录只改了一部分文件，希望知道新增、修改和删除项。原方案还复制文件并安排删除；本篇收窄为 Python 3 标准库的只读报告，避免把比对与修改混在一起。

](/blog/python-directory-diff-report/)[## Perforce 切换流工作区：预检与失败边界

一个按钮同时改 Client Stream、同步和清理，容易让本地修改落在错误视图中。本文仅介绍通用 Python 自动化的保护流程，完全去掉私人服务器、账号和工作区信息。配套代码使用 fake P4，不连接真实服务器。

](/blog/python-perforce-stream-switch-safety/)[## 多视角GI丢失问题的解决办法

以 UE 5.3 源码版为例，将相关实现的最大视角数量从 2 调整为 3，记录七处修改的源码截图与适用限制。

Lumen多视角UE 5.3](/blog/ue53-multiview-gi/)[## 如何让 AI 直接修改 DataAsset

讨论 DataAsset 与 JSON 双向同步中的格式选择、属性转换、循环触发和文件写入问题。

AIDataAssetJSON](/blog/cnblogs-20159718/)[## 蓝图继承中的组件状态污染与修复思路

分析 Actor 蓝图组件模板的 CreationMethod 异常，以及继承链、SCS 和 ICH 的检查与修复流程。

蓝图继承链](/blog/cnblogs-20030737/)[## 如何解决渲染时UMG大小不变的问题

当你需要将UMG渲染出来的时候你可能会碰到一种很恶心的情况，你渲染出来的UMG大小不跟随你设置的输出分辨率变化

UMG渲染](/blog/cnblogs-19813721/)[## 如何在蓝图中实现数据序列化与字节转换

介绍内存表示与字节数组转换、CustomThunk 泛型结构体参数，以及 JSON 字段名和浮点数输出处理。

蓝图序列化](/blog/cnblogs-19770934/)[## 如何管理打包时的配置文件排除

介绍 DefaultGame.ini 的 Staging 包含与排除规则，以及配置扫描、文件写回和缓存重新加载流程。

打包配置管理](/blog/cnblogs-19770930/)[## 如何用材质制作圆角矩形

这个我都记不清是什么之后记录的了，整理笔记的时候翻到了，是通过材质来制作圆角矩形，因为目标是在一个三合一屏幕的项目中使用，所以数值大小按照三块屏幕设置的，如要使用，请注意修改。

材质](/blog/cnblogs-19379355/)[## 怎么查看打包到底打包了哪些文件

这个是打包后的文件，不同于平常的打包文件，这个可以看到打包完成后包含的所有配置文件以及资产，插件之类的

打包](/blog/cnblogs-19379306/)[## 材质基础知识之if判断节点

这个图是前两天群友萌新发出的提问，说是为什么dissolve是0的时候，这个材质不可见。

材质](/blog/cnblogs-19379337/)[## 缓存路径修改

最简单的办法就是通过Evenyting搜索\Engine\Config\BaseEngine.ini

缓存配置管理](/blog/cnblogs-19379365/)[## 论运行时动画录制的关键-正确获取骨骼数据与保存

在 UE5.4 中实现运行时动画录制，最关键的两个问题是：

动画骨骼](/blog/cnblogs-19197541/)[## 中英双语设置小技巧

发现最近UE新人好多，索性整理出来一些小技巧供大家使用。

本地化](/blog/cnblogs-19183986/)[## 快速创建一个地图

这里只讨论如何快速创建一个可用的标准地图，不包括世界分区地图。

关卡](/blog/cnblogs-19184043/)[## 多屏幕全屏后只有一个屏幕显示怎么办

这里讨论的是，多个屏幕时，用N卡的Surround融合为一个屏幕，当开始游戏后发生的问题

多屏显示](/blog/cnblogs-19174288/)[## 如何调用DLL

说说我的方法吧，不知道正不正确，但是能用，哈哈哈哈，跟着官方的第三方库弄的 打包dll那一套我就不赘述了，就说说拿到DLL和Lib怎么办 以官方模板创建得插件TestThird为例 将dll，lib文件放到TestThird\Source\ThirdParty\TestTh…

DLL](/blog/cnblogs-19174295/)[## PixelStreaming 像素流送

开启PixelStreaming插件即可

PixelStreaming](/blog/cnblogs-19165494/)[## 多屏幕如何设置曝光同步

新建一个LocalPlayer，重写函数

多屏显示曝光](/blog/cnblogs-19165561/)[## 如何设置监听服务器

开启监听服务器的最简单办法，创建一个桌面快捷方式，修改目标为UnrealEditor.exe MyProject.uproject ?listen -game

监听服务器](/blog/cnblogs-19165553/)[## 无缝地图切换

无缝地图切换有别于传统的流送地图，流送地图是在一个地图中放置子关卡，通过控制子关卡的加载和卸载来切换不同的地图 而无缝地图切换，是在切换地图的时候，先切换到一个简单的地图中，在后台加载地图，加载完成后再切换到那个地图中

关卡无缝切换](/blog/cnblogs-19165504/)[## 自定义配置DeveloperSettings

创建一个继承自UDeveloperSettings的类 类属性中Config=Game意思是在Game.ini中配置，加上DefaultConfig，就是DefaultGame.ini config=后面跟的就是配置文件名 所以这里是在DefaultVehicle.ini中配置

DeveloperSettings配置管理](/blog/cnblogs-19165500/)[## 解决UObject蓝图缺少上下文的问题

通常情况下，当你新建一个蓝图继承自UObejct的时候，你会发现不仅不能获取到PlayerController

UObject蓝图](/blog/cnblogs-19165488/)[## 遍历Actor所有属性进入Sequence记录

这里通过递归，将这个Actor内需要记录的结构体设置为了CPF_Interp，这个属性代表这个值能被LevelSequence记录，这个函数会遍历结构体内的所有属性，同样也设置为CPF_Interp

ActorSequence](/blog/cnblogs-19165520/)[## 一键解决MetaHuman播放动画时头部穿模问题

这是最近做MetaHuman项目发现的问题，当头部和身体同时播放不同动画的时候，脖子附近会出现穿模现象，这个问题在LevelSequence中暂时没有发现。

MetaHuman动画](/blog/cnblogs-19136316/)
