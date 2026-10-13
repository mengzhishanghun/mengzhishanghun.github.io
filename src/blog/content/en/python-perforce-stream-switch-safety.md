---
title: "Switching Perforce stream workspaces: preflight and failure boundaries"
description: A button that changes Client Stream, syncs and cleans can place local changes under the wrong view. This article describes a generic Python protection
type: blog
slug: python-perforce-stream-switch-safety
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
translationKey: python-perforce-stream-switch-safety
publishedAt: 2026-10-13
sourceHash: 20214f0d92b87f41dc8f8a9142bd842ffe000b06d25bd9bed84e0a1fb94a6397
generatedBodyHash: 8e8a921be735ff72502b5bbd40eb5c48076674103929d1c09c2b3bc4fe6564e5
translationStatus: translated
---

# Switching Perforce stream workspaces: preflight and failure boundaries

## Problem and environment
A button that changes Client Stream, syncs and cleans can place local changes under the wrong view. This article describes a generic Python protection workflow with private server, account and workspace information removed. Its sample uses fake P4 and never connects to a real server.

## Protect local state first
Identify the authorized client, destination stream and local root. Inspect opened files and pending changelists, but also modified unopened files, offline additions and untracked files. Checking opened alone is insufficient. Stop when any change is unprotected, then have the user submit, shelve or back it up and confirm protection. Define backup coverage explicitly; shelving does not automatically include all untracked files.

Fetch the client spec and retain its original Stream. Check destination availability and preview the sync. Do not automatically clean, revert or force sync. A separate workspace for another stream can be a safer choice than repeatedly remapping one directory.

## Failure is not necessarily rollback
```text
All preflight checks pass → save destination Stream → sync
Failure before Stream change → this step has not changed local state
Failure after Stream change → report incomplete state and stop
```

Writing the old Stream back restores only a spec field. It does not guarantee restoration of synced or deleted disk files, the have list or other server state. Record the failing stage and completed steps, then reread client and local state before deciding recovery. Do not retry cleanup automatically.

## Try it and understand the limits
The fake tests in `p4_switch_fake.py` cover unprotected changes blocking a switch, a successful switch and sync failing after Stream is saved. The last case must report incomplete. This is a state-flow demonstration, not a production P4 client. It has no real sync, lock, permission or recovery testing.

## Standalone sample

Save as `p4_switch_fake.py`:

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
