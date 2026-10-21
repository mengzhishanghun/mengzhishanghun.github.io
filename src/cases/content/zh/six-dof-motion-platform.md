---
title: 六轴平台运动解算与海洋虚拍录制适配
description: 实现 Stewart 平台正逆解、运动数据处理，以及海洋场景的 Take Recorder、Sequence 与 LiveLink 发送适配。
type: case
slug: six-dof-motion-platform
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 仿真
  - 硬件联动
coverAlt: 六自由度运动平台联动的流程图
websiteCoverUrl: /assets/cases/six-dof-motion-platform.png
lang: zh
translationKey: six-dof-motion-platform
---

## 把场景姿态转换成平台运动数据

六自由度平台的接入，需要处理场景姿态、机构尺寸和控制数据之间的关系。我参与的 StewartControl 实现包含平台运动学、数据换算、限幅与平滑，也延伸到海洋场景的录制和虚拍数据发送。

### 正解、逆解与单位换算

StewartKinematics 根据平台姿态求六根杆的长度，也提供由杆长求平台姿态的正解。实现中使用 Newton 迭代和解析雅可比，并处理厘米与米、角度与弧度的换算。

平台数据还经过零位处理、限幅、按帧限速和滤波，便于把场景输出转换成受约束的运动数据。运动数据处理包含高低通滤波和倾斜协调。

## 海洋场景与虚拍录制

在海洋场景中，我做了环境参数和录制流程的适配。水体表现与力计算由 Oceanology 提供，项目侧处理参数变化、时间记录和序列组织。

- 通过 TakePreset、Take Recorder 和 Level Sequence 录制 Actor。
- 将录制得到的 Sequence 组织成 SubSequence 并保存，便于放入后续序列流程。
- 为海洋组件暴露可插值的时间、波长、波高、波速与波向属性；录制期间累计 TimeCode，参数改变时广播通知。
- 将六轴参数作为 LiveLink Transform 发送，为下游接入提供数据接口。

这里的 LiveLink 范围是发送端。接收设备、平台动作与录制画面的完整同步，仍需在具体系统里接入和验证。

## 平台接入的实际范围

这项工作提供了运动解算、数据处理和录制适配的软件实现。实机标定精度、机构安全和最终运动体验，需要结合平台尺寸、控制协议与现场测试确认。

海洋虚拍部分可作为环境参数录制和序列组织的基础；风场、接收端和录制延迟补偿不在本案例的已实现范围内。

## 相关需求

如果项目需要把 UE 场景接到六轴平台，或录制可调整的海洋环境，可以先提供平台结构、通信协议、已有录制流程和接收端要求，再确定软件适配与现场联调的边界。

欢迎[联系我聊聊](/zh/contact/)。
