---
title: 多视角GI丢失问题的解决办法
description: 以 UE 5.3 源码版为例，将相关实现的最大视角数量从 2 调整为 3，记录七处修改的源码截图与适用限制。
type: blog
slug: ue53-multiview-gi
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags:
  - Lumen
  - 多视角
  - UE 5.3
lang: zh
translationKey: ue53-multiview-gi
---

# 多视角GI丢失问题的解决办法

# 修改记录

这里必须要修改引擎源码，因为相关数据写死在实现中，非源码版修改无效。原始记录以 UE 5.3 为例。

下面是将最大视角数量从 2 调整为 3 的示例，共涉及七处关联修改。

![](/media-occurrence/blog%3Aue53-multiview-gi%3Amedia%3A1)

修改后需要重新构建引擎。截图用于记录修改位置，不是完整补丁；引擎版本变化后，应重新核对对应实现。

# 相关案例

这部分处理与三屏显示中的 Lumen GI 问题有关，可[查看解决驾考模拟器三屏显示不一致问题的案例](https://mzsh.me/cases/driving-simulator-three-screen/)。曝光同步属于案例中的另一项处理。
