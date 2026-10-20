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

多视角GI丢失问题的解决办法
===

这里必须要修改源码，因为是写死的数据，非源码版修改无效

以UE5.3为例

下面是修改最大视角2为3的示例，总共修改地点有七处
![](/media-occurrence/blog%3Aue53-multiview-gi%3Amedia%3A1)

