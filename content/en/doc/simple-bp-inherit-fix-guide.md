---
title: SimpleBPInheritFix User Manual
description: Complete English product manual for SimpleBPInheritFix
type: doc
slug: simple-bp-inherit-fix-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Blueprints
  - Inheritance Chain
workIds:
  - simple-bp-inherit-fix
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-bp-inherit-fix-guide/
lang: en
translationKey: simple-bp-inherit-fix-guide
supplementSources:
  - en/supplements/simple-bp-inherit-fix-guide-1.md
sourceHash: bb610964032c37630a649dae94e9eb3ede9e20a7c1ca88c360eba37493b7ec36
translationStatus: translated
generatedBodyHash: df3c5fe302ca4095eb5b3cb70ff81bfd6fa5e3dd065727c44db788bce1bd8b78
---

# 📘 SimpleBPInheritFix Tutorial

**Supported Unreal Engine versions**: 5.2–5.8

Fix component pollution in Actor Blueprint inheritance chains with one click.

> ⚠️ This plugin modifies multiple Blueprints in the inheritance chain. Changes are conservative, but check that automatically checked-out files match expectations before submitting to version control.

---

## 📝 How to Use

1. Install the plugin and compile successfully
2. In the Content Browser, **right-click any affected Actor Blueprint**, whether ancestor, self, or descendant
3. Select **Component Repair → Fix Inheritance Pollution**
4. Open the Output Log and filter `LogSBIF` to monitor execution
5. The editor shows a save dialog — **save the Blueprints marked dirty** to finish

---

## ❓ Frequently Asked Questions

**The scan returns 0 findings despite visible corruption?**  
You may have a problem outside this plugin's scope (rare). Paste the complete `LogSBIF` log for diagnosis.

**What if CheckOut fails?**  
The plugin continues repairing in memory, but you must resolve checkout manually before saving (`p4 edit` / `git lfs lock` / `svn lock`). Common causes include another user's lock, an unreachable server, or a mapping that excludes the file.

**Which Blueprint should be the anchor?**  
Choose any — ancestors, self, and descendants are scanned, yielding the same result.

**Can I use it without Perforce?**  
- Git: CheckOut is effectively a no-op; files are writable by default
- Git LFS: Sends an LFS lock request
- SVN: Runs `svn lock`
- No version control: Skips the CheckOut stage

---

## ⚠️ Limitations

- Handles only the specific component pollution covered by this plugin; other Blueprint issues are outside its scope
- Does not scan components created dynamically in Construction Script

---

## Version History



Open **Edit → Project Settings**, go to SimpleBPInheritFix settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
