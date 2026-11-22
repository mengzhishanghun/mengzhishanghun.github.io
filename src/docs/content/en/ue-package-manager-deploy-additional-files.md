---
title: Deploy Additional Files
type: doc
slug: ue-package-manager-deploy-additional-files
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/deploy-additional-files/
lang: en
translationKey: doc:ue-package-manager:deploy-additional-files
sourceHash: 33c1567375f0b73ab81d946133d6154494caa0ae8661d9ca71aa7122f906ff6c
translationStatus: translated
generatedBodyHash: 15d24f9b41e7c711a3fdfa5f7383c4fc815e67645a5c9845fc2eec3dfecb4dfe
docPage:
  work: ue-package-manager
  group: output
  slug: deploy-additional-files
  order: 1
---

## Set copy rules

In the GUI, use Additional files to select files or folders and set a destination subdirectory and recursive ignore patterns for each rule. In the CLI, use `copy-list` to inspect rules, `copy-add` to add a rule, and `copy-remove --index 0` to remove the first rule in the example. Use `--no-copy` to skip deployment for this run.

## Copy timing and path limits

Additional copying runs only after UE packaging succeeds. Directory copying skips `.trash`, `.svn`, `.git`, `.codex`, `.agents`, `.vs`, `.idea`, `__pycache__`, and `.pyc`, and checks file integrity afterward. Each rule also supports semicolon-separated name patterns to recursively ignore files or folders at any level, with `*` and `?` wildcards, for example `README*.md; Cache`. The destination must be a relative directory inside the package root; absolute paths, drive letters, and `..` are prohibited. Recursive ignore entries accept name patterns only and cannot contain paths.

[See the full CLI example](/en/works/ue-package-manager/docs/package-project/)
