---
title: Python 按列名更新 Excel：组合键与独立输出
description: 参照表提供新值，目标表按多个列匹配后更新指定列。原工具把匹配字段用下划线拼起来，`("A_B", "C")` 与 `("A", "B_C")` 就可能撞键。本文将核心处理独立出来，适用于 Python 3 与 openpyxl 的普通 `.xlsx`；不复刻原 GUI。
type: blog
slug: python-excel-column-update
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
translationKey: python-excel-column-update
---

# Python 按列名更新 Excel：组合键与独立输出

## 问题与环境
参照表提供新值，目标表按多个列匹配后更新指定列。原工具把匹配字段用下划线拼起来，`("A_B", "C")` 与 `("A", "B_C")` 就可能撞键。本文将核心处理独立出来，适用于 Python 3 与 openpyxl 的普通 `.xlsx`；不复刻原 GUI。

## 明确输入规则
指定参照和目标的工作表名称，同一张表完成读取与写回，不混用首表和活动表。表头必须唯一，列映射数量一致。用 tuple 保留多列边界，匹配前决定数字与文本是否视为相同；示例严格保留值类型，不自动把 `001` 转成 `1`。

空匹配字段不参加匹配；参照表重复组合键直接报错，避免隐含“最后一行覆盖”。参照替换值为空时仍表示显式清空目标单元格，需业务确认此规则。目标同键多行都会更新。不匹配行保持原值。

## 操作顺序与样例
先验证两表结构并构造完整更新计划，再修改内存工作簿。输出另一个新文件，拒绝输出等于任一输入或覆盖已有输出，保存到同目录临时文件并采用独占创建方式写出最终结果。`excel_update.py` 提供无 GUI 的核心函数，使用时传入文件、sheet 名、键列与替换列；先用两个小工作簿测试。

## 可验证例与限制
参照含 `A_B/C` 与 `A/B_C` 两行时应更新各自目标；重复参照键报错且不产生输出；目标活动表不是指定表时仍只修改指定表。源文件不应改变。openpyxl 不计算公式，示例拒绝匹配列或替换列中的公式；复杂图表、宏和外部链接不在承诺范围。配套纯数据用例可验证匹配逻辑，完整工作簿往返需安装 openpyxl 后单独验证。

## 独立样例

保存为 `excel_update.py`：

```python
"""Generic xlsx update example. openpyxl is an optional runtime dependency."""
from pathlib import Path
import os
import shutil
import tempfile

def key(values):
    if any(v is None or v == '' for v in values):
        return None
    return tuple((type(v).__name__, v) for v in values)

def reference_index(rows):
    result = {}
    for values, replacements in rows:
        item_key = key(values)
        if item_key is None:
            continue
        if item_key in result:
            raise ValueError('duplicate reference key')
        result[item_key] = tuple(replacements)
    return result

def update(reference, target, output, reference_sheet, target_sheet,
           reference_keys, target_keys, reference_values, target_values):
    from openpyxl import load_workbook
    paths = [Path(p).resolve() for p in (reference, target, output)]
    if any(p.suffix.lower() != '.xlsx' for p in paths):
        raise ValueError('only ordinary xlsx files are supported')
    if paths[2] in paths[:2] or paths[2].exists():
        raise ValueError('output must be new and different from inputs')
    if not reference_keys or not reference_values:
        raise ValueError('key and replacement columns are required')
    if len(reference_keys) != len(target_keys) or len(reference_values) != len(target_values):
        raise ValueError('column mapping lengths differ')
    if any(len(set(cols)) != len(cols) for cols in
           (reference_keys, target_keys, reference_values, target_values)):
        raise ValueError('duplicate mapped column')
    ref = load_workbook(paths[0], data_only=False)
    tgt = None
    temporary = None
    try:
        tgt = load_workbook(paths[1], data_only=False)
        rs, ts = ref[reference_sheet], tgt[target_sheet]
        def columns(ws, required):
            header = [cell.value for cell in ws[1]]
            names = [v for v in header if v is not None]
            if len(set(names)) != len(names):
                raise ValueError('duplicate header')
            mapping = {name: i + 1 for i, name in enumerate(header) if name is not None}
            if any(name not in mapping for name in required):
                raise ValueError('missing column')
            return mapping
        rc = columns(rs, reference_keys + reference_values)
        tc = columns(ts, target_keys + target_values)
        def values(ws, row, names, mapping):
            cells = [ws.cell(row, mapping[name]) for name in names]
            if any(cell.data_type == 'f' for cell in cells):
                raise ValueError('formulas in participating columns are unsupported')
            return [cell.value for cell in cells]
        lookup = reference_index(
            (values(rs, r, reference_keys, rc), values(rs, r, reference_values, rc))
            for r in range(2, rs.max_row + 1))
        plan = []
        for r in range(2, ts.max_row + 1):
            item_key = key(values(ts, r, target_keys, tc))
            values(ts, r, target_values, tc)
            if item_key is not None and item_key in lookup:
                plan.append((r, lookup[item_key]))
        for r, replacements in plan:
            for name, value in zip(target_values, replacements):
                ts.cell(r, tc[name], value=value)
                if value is None:
                    ts.cell(r, tc[name]).value = None
        fd, temporary = tempfile.mkstemp(suffix='.xlsx', dir=paths[2].parent)
        os.close(fd)
        tgt.save(temporary)
        # Exclusive creation prevents overwriting a file created after preflight.
        created = False
        try:
            with paths[2].open('xb') as destination:
                created = True
                with open(temporary, 'rb') as source:
                    shutil.copyfileobj(source, destination)
        except BaseException:
            if created:
                paths[2].unlink(missing_ok=True)
            raise
        return len(plan)
    finally:
        ref.close()
        if tgt is not None:
            tgt.close()
        if temporary is not None:
            Path(temporary).unlink(missing_ok=True)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('reference', 'target', 'output', 'reference_sheet', 'target_sheet'):
        parser.add_argument(name)
    for name in ('reference_keys', 'target_keys', 'reference_values', 'target_values'):
        parser.add_argument('--' + name.replace('_', '-'), nargs='+', required=True)
    print(update(**vars(parser.parse_args())))
```
