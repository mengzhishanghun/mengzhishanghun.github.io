---
title: Perforce 切换流工作区：预检与失败边界
description: 一个按钮同时改 Client Stream、同步和清理，容易让本地修改落在错误视图中。本文仅介绍通用 Python 自动化的保护流程，完全去掉私人服务器、账号和工作区信息。配套代码使用 fake P4，不连接真实服务器。
type: blog
slug: python-perforce-stream-switch-safety
categoryId: python
categoryName: PYTHON
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: python-perforce-stream-switch-safety
---

# Perforce 切换流工作区：预检与失败边界

## 问题与环境
一个按钮同时改 Client Stream、同步和清理，容易让本地修改落在错误视图中。本文仅介绍通用 Python 自动化的保护流程，完全去掉私人服务器、账号和工作区信息。配套代码使用 fake P4，不连接真实服务器。

## 切换前保护本地状态
明确用户授权的 client、目标 stream 和本地根目录。查询 opened 与 pending changelist，也检查未打开但有修改的文件、离线新增文件和未跟踪文件；只看 opened 不够。存在任何未保护修改时停止，让用户先提交、shelve 或备份，且确认保护结果。备份包含哪些文件必须明确，shelve 也不会自动包含所有未跟踪文件。

取得当前 client spec 并保留旧 Stream，检查目标可用性及同步预览。不要自动执行 clean、revert 或强制同步。更稳妥的选择是为另一条流使用独立工作区，减少反复映射同一本地目录。

## 失败不能笼统称为回滚
```text
预检全部通过 → 保存目标 Stream → 同步
改 Stream 前失败 → 本地状态尚未被该步骤改变
改 Stream 后失败 → 报告状态不完整并停止
```

把旧 Stream 写回仅恢复 spec 字段，不能保证已同步或已删除的磁盘文件、have list 和服务器状态全部复原。记录失败阶段及已完成步骤，重新读取 client 与本地状态后才能制定恢复动作；不要自动重试清理。

## 可验证例与限制
`p4_switch_fake.py` 的 fake 测试覆盖未提交修改阻止切换、成功切换和保存 Stream 后同步失败，后者必须报告 incomplete。该样例是状态流程演示，不是可直接投入使用的 P4 客户端；没有真实同步、锁、权限或恢复测试。

## 独立样例

保存为 `p4_switch_fake.py`：

```python
"""Fake-only state demonstration: intentionally no P4 imports or connections."""
from dataclasses import dataclass, field

@dataclass
class FakeP4:
    stream: str = '//example/main'
    unprotected_changes: bool = False
    sync_fails: bool = False
    events: list = field(default_factory=list)

    def preflight(self, target):
        self.events.append('preflight')
        if self.unprotected_changes:
            raise ValueError('protect local changes first')
        if target not in ('//example/main', '//example/dev'):
            raise ValueError('unknown example stream')

    def save_stream(self, target):
        self.events.append('save_stream')
        self.stream = target

    def sync(self):
        self.events.append('sync')
        if self.sync_fails:
            raise RuntimeError('injected sync failure')

def switch(fake, target):
    before = fake.stream
    try:
        fake.preflight(target)
    except Exception as error:
        return {'state': 'blocked', 'old_stream': before, 'error': str(error)}
    # From this boundary onward, even an exception from a save could be ambiguous.
    try:
        fake.save_stream(target)
        fake.sync()
    except Exception as error:
        return {'state': 'incomplete', 'old_stream': before,
                'observed_stream': fake.stream, 'error': str(error)}
    return {'state': 'complete', 'old_stream': before, 'observed_stream': fake.stream}

if __name__ == '__main__':
    print(switch(FakeP4(sync_fails=True), '//example/dev'))
```
