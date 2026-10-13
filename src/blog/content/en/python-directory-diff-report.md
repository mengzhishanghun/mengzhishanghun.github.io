---
title: "Comparing directories in Python: start with a content-difference report"
description: When only some files changed between two large directories, you need additions, modifications and removals. The original workflow also copied files an
type: blog
slug: python-directory-diff-report
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
translationKey: python-directory-diff-report
publishedAt: 2026-10-13
sourceHash: 5e5986ead5f481d5f94d4c78f1fe011d1fa9c2aa6e7a9da9ee302a603499b956
generatedBodyHash: 9f3cd37dd0b0ebbc6e9776903a65f49f4ac0668ff07ca1d1f9bb53775f6cc1f7
translationStatus: translated
---

# Comparing directories in Python: start with a content-difference report

## Problem and environment
When only some files changed between two large directories, you need additions, modifications and removals. The original workflow also copied files and scheduled deletion. This article narrows it to a read-only Python 3 standard-library report.

## Compare contents, not timestamps
Build recursive relative-path inventories and report added, removed, content-changed and file/directory type-changed entries. Matching size and timestamps do not prove equal contents. `directory_diff.py` compares actual bytes in chunks rather than treating filecmp's default shallow comparison as final.

The roots must be independent, neither equal nor nested. Write the JSON report outside both trees. Reject symlinks and Windows junctions or other reparse points rather than following them out of scope. A directory-read failure such as PermissionError raises an error immediately and stops without a successful report. Implement wildcard filtering explicitly with tools such as fnmatch; dircmp's ignored-name list is not a wildcard language.

## Usage
```console
python directory_diff.py old new report.json
```

The report uses relative paths. `removed` means an entry exists only in the old tree; it does not delete it. Empty directories can appear too. Stop if the output already exists rather than overwriting earlier evidence.

## Limits and test cases
Keep inputs stable during comparison; rerun if another process changes them. A report is not a snapshot backup. Test equal-sized files with equal timestamps but different bytes, then additions, removals, type changes and nested-root rejection. Patch creation, copying and deletion are separate later tasks, not actions performed by this reporter.

## Standalone sample

Save as `directory_diff.py`:

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
