---
title: Install and Connect to Perforce
type: doc
slug: p4-stream-switcher-install-and-connect
draft: false
sitePublish: true
tags:
  - Perforce
  - Version control
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/install-and-connect/
lang: en
translationKey: doc:p4-stream-switcher:install-and-connect
sourceHash: 07d701d038ee1f730d55cc4b50980e0cb6433799bdfdc64b1d0d58d505f33eda
translationStatus: translated
generatedBodyHash: fb402f715362f01d6e3c43af34b3d1b605d70bb1b1ad6cf1120acaa2b24925fd
docPage:
  work: p4-stream-switcher
  group: setup
  slug: install-and-connect
  order: 1
---

## Install dependencies and sign in

Prepare Windows, Python 3.10 or later with Tkinter, the Perforce CLI, and P4V. Your server account needs permission to access the target streams and create and delete clients, with a valid login. The current host must already have at least one stream client owned by the current user, with Host set to this machine and a Stream assigned.

Obtain the files from the [public source repository](https://github.com/MZSH-Tools/P4StreamSwitcher), then install dependencies and start from the project directory:

```powershell
python -m pip install p4python platformdirs
python Main.py
```

Before starting, configure P4PORT and P4USER in your own Perforce environment and establish a valid session through your normal login process.

## Troubleshoot the connection and stream client

- Connection failure: check P4PORT, P4USER, login status, and server reachability.
- No stream client detected: confirm in P4V that the client belongs to the current user, has this host, and references a Stream.

[Switch a workspace for the first time](/en/works/p4-stream-switcher/docs/normal-switch/)
