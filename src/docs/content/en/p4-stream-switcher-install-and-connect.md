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
sourceHash: 5b6fed8effc5f562242f6cab7f651efe5a0b68cae05b80ead64ae0bcd7b1af57
translationStatus: translated
generatedBodyHash: ab1ada058a99ebcb58b959b1673e1b0c70985204bab290b84ba38d6ca46f8eac
docPage:
  work: p4-stream-switcher
  group: getting-started
  slug: install-and-connect
  order: 1
---

## Install dependencies and sign in

You need Windows, Python 3.10 or later with Tkinter, the Perforce CLI, and P4V. Your account needs access to the target streams and permission to create and delete clients. Before starting, set P4PORT and P4USER in your Perforce environment and sign in as usual.

In P4V, make sure you own at least one stream client with Host set to this machine and a Stream assigned.

Obtain the files from the [public source repository](https://github.com/MZSH-Tools/P4StreamSwitcher), then install dependencies and start from the project directory:

```powershell
python -m pip install p4python platformdirs
python Main.py
```

After launch, check the server and user in the status area. If the connection fails or the tool cannot find a stream client, use the checks below.

## Troubleshoot the connection and stream client

- Connection failure: check P4PORT, P4USER, login status, and server reachability.
- No stream client detected: confirm in P4V that the client belongs to the current user, has this host, and references a Stream.

[Switch a workspace for the first time](/en/works/p4-stream-switcher/docs/normal-switch/)
