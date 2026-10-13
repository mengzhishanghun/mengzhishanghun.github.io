---
title: "Updating Excel by column names in Python: tuple keys and separate output"
description: A reference workbook supplies values to update a target using several matching columns. Joining keys with underscores makes `("A_B", "C")` collide wit
type: blog
slug: python-excel-column-update
categoryId: python
categoryName: PYTHON
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: python-excel-column-update
publishedAt: 2026-10-13
sourceHash: 129f2579a8e59ef6da7356aeaf5642e61f64d619ed16844108b50d04ec70d9c5
generatedBodyHash: ed57cf45a322e28c09d3a29534ddb96112138ebc26656ab8ab1776aaecf6756d
translationStatus: translated
---

# Updating Excel by column names in Python: tuple keys and separate output

## Problem and environment
A reference workbook supplies values to update a target using several matching columns. Joining keys with underscores makes `("A_B", "C")` collide with `("A", "B_C")`. This article isolates the core logic for Python 3 and openpyxl with ordinary `.xlsx` files rather than rebuilding the original GUI.

## Define input rules
Specify reference and target sheet names and read/write the same selected sheet. Do not mix the first sheet with the active sheet. Headers must be unique and column mappings must have matching lengths. Use tuple keys to retain field boundaries. Decide whether numeric and text values should match; the sample preserves types strictly and does not automatically turn `001` into `1`.

Rows with empty key fields do not match. Duplicate reference keys raise an error rather than silently keeping the last row. An empty replacement value explicitly clears the target cell; confirm that business rule. All target rows sharing a key are updated, while unmatched rows retain their values.

## Workflow and sample
Validate both schemas and build a complete update plan before mutating the in-memory workbook. Write a new output file, rejecting either input path and existing output paths. Save through a temporary file in the output directory and create the final result exclusively. `excel_update.py` exposes a non-GUI core function taking paths, sheet names, key columns and replacement columns. Start with two small workbooks.

## Try it and understand the limits
Reference rows `A_B/C` and `A/B_C` should update distinct targets. Duplicate reference keys should fail without output. A different active sheet must not change the selected destination. Source files must remain unchanged. openpyxl does not calculate formulas; the sample rejects formulas in participating key or replacement columns. Complex charts, macros and external links are outside scope. Pure-data cases exercise matching logic; install openpyxl and separately check a workbook round trip.

## Standalone sample

Save as `excel_update.py`:

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
