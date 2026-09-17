---
title: 解决驾考模拟器三屏显示不一致问题
description: 围绕三屏 Lumen GI 光反射失效与曝光不一致，定位并改写引擎相关实现。
slug: driving-simulator-three-screen
categoryId: simulation
categoryName: 显示与仿真
categoryOrder: 1
order: 0
status: 已完成
featured: false
---
## 背景
驾考模拟器自主学习系统需要在三块屏幕上呈现一致的训练画面。

## 主要方案
针对三屏场景中的 Lumen GI 光反射与曝光差异，检查问题链路并改写引擎源码中的相关实现。

## 最终效果
三屏显示问题得到处理，项目继续用于模拟考试教学场景。
