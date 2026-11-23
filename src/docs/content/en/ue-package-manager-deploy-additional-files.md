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
sourceHash: 073d16940ca765470e3699d6de5440de4cab9a1817e2eb03b74749c1328e9086
translationStatus: translated
generatedBodyHash: d2a40f1431b30f7a39392b54eea31684381b9d85f3faf99ac132bf9f899df8d2
docPage:
  work: ue-package-manager
  group: features
  slug: deploy-additional-files
  order: 3
---

## Set copy rules

In the GUI, choose the files or folders to ship under Additional files, then set a destination subdirectory inside the package for each rule. When copying folders, you can also set recursive ignore patterns.

In the CLI, use `copy-list` to view rules, `copy-add` to add a rule, and `copy-remove --index 0` to remove the first rule in the example. Use `--no-copy` to skip additional file copying for the current build.

## Copy timing and path limits

Additional copying runs only after UE packaging succeeds. Directory copying skips `.trash`, `.svn`, `.git`, `.codex`, `.agents`, `.vs`, `.idea`, `__pycache__`, and `.pyc`, and checks file integrity afterward. Each rule also supports semicolon-separated name patterns to recursively ignore files or folders at any level, with `*` and `?` wildcards, for example `README*.md; Cache`. The destination must be a relative directory inside the package root; absolute paths, drive letters, and `..` are prohibited. Recursive ignore entries accept name patterns only and cannot contain paths.

[See the full CLI example](/en/works/ue-package-manager/docs/package-project/)
