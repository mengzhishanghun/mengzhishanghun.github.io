---
title: Python 比较目录：先生成内容差异报告
description: 两个大目录只改了一部分文件，希望知道新增、修改和删除项。原方案还复制文件并安排删除；本篇收窄为 Python 3 标准库的只读报告，避免把比对与修改混在一起。
type: blog
slug: python-directory-diff-report
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
translationKey: python-directory-diff-report
---

# Python 比较目录：先生成内容差异报告

## 问题与环境
两个大目录只改了一部分文件，希望知道新增、修改和删除项。原方案还复制文件并安排删除；本篇收窄为 Python 3 标准库的只读报告，避免把比对与修改混在一起。

## 内容比较而非时间比较
递归建立相对路径清单，分类为新增、删除、内容变化和文件/目录类型变化。相同大小与时间戳不代表内容相同。配套 `directory_diff.py` 用分块读取实际字节比较；不采用 `filecmp` 的默认浅比较结果作为最终判断。

输入目录必须独立，不能相同或互相包含；输出 JSON 在两棵目录之外。拒绝符号链接和 Windows junction 等重解析点，不跟随它们跳出范围。目录读取失败（例如 PermissionError）立即报错并停止，不输出成功报告。过滤规则若采用通配符，应显式使用 fnmatch 等工具；dircmp 的 ignore 名称列表不能直接当作通配符语言。

## 使用例
```console
python directory_diff.py old new report.json
```

报告保留相对路径，`removed` 只表示旧目录独有项，不执行删除；目录为空也可以出现在报告中。输出已经存在则停止，避免覆盖之前的证据。

## 限制与可验证例
比较期间输入应保持稳定；有文件被其他进程修改时需要重新比较，报告不是快照备份。用相同大小、相同时间戳、不同字节的两文件验证仍识别修改，再测试新增、删除、类型变化和嵌套路径拒绝。制作补丁、复制和删除属于后续独立任务，不由这个报告程序执行。

## 独立样例

保存为 `directory_diff.py`：

```python
"""Read-only content report. Refuse links, reparse points and overlapping roots."""
from pathlib import Path
import json
import os
import stat

def reparse(path):
    return path.is_symlink() or bool(getattr(path.lstat(), 'st_file_attributes', 0)
                                    & getattr(stat, 'FILE_ATTRIBUTE_REPARSE_POINT', 0x400))

def inventory(root):
    result = {}
    def fail_on_error(error):
        raise error
    for current, directories, files in os.walk(root, followlinks=False, onerror=fail_on_error):
        for name in directories + files:
            item = Path(current) / name
            if reparse(item):
                raise ValueError('links and reparse points are unsupported')
            if not item.is_dir() and not item.is_file():
                raise ValueError('unsupported filesystem entry')
            result[item.relative_to(root).as_posix()] = 'directory' if item.is_dir() else 'file'
    return result

def same_bytes(left, right):
    with left.open('rb') as a, right.open('rb') as b:
        while True:
            chunk_a, chunk_b = a.read(1024 * 1024), b.read(1024 * 1024)
            if chunk_a != chunk_b:
                return False
            if not chunk_a:
                return True

def compare(old, new, output):
    raw = [Path(p).absolute() for p in (old, new, output)]
    for path in raw:
        # Check ancestors too: a path beneath a junction is not isolated.
        for component in (path, *path.parents):
            if component.exists() and reparse(component):
                raise ValueError('path uses a link or reparse point')
    old, new, output = [p.resolve() for p in raw]
    if not old.is_dir() or not new.is_dir():
        raise ValueError('input roots must exist')
    if old == new or old.is_relative_to(new) or new.is_relative_to(old):
        raise ValueError('input roots overlap')
    if output.is_relative_to(old) or output.is_relative_to(new):
        raise ValueError('report must be outside input roots')
    left, right = inventory(old), inventory(new)
    report = {'added': sorted(right.keys() - left.keys()),
              'removed': sorted(left.keys() - right.keys()),
              'changed': [], 'type_changed': []}
    for name in sorted(left.keys() & right.keys()):
        if left[name] != right[name]:
            report['type_changed'].append(name)
        elif left[name] == 'file' and not same_bytes(old / name, new / name):
            report['changed'].append(name)
    with output.open('x', encoding='utf-8') as destination:
        json.dump(report, destination, ensure_ascii=False, indent=2)
    return report

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('old', 'new', 'output'):
        parser.add_argument(name)
    print(json.dumps(compare(**vars(parser.parse_args()))))
```
