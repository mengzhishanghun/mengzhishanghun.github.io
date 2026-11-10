---
title: Herbal exhibition
description: An interactive UE herbal exhibition combining search, illustrated and audio content, 3D models, microscope slides and external content maintenance.
type: case
slug: herbal-exhibition
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 5
status: Maintained
featured: false
draft: false
sitePublish: true
tags:
  - "Interactive exhibition"
  - "Herbal education"
  - "Multimedia display"
  - "Content management"
coverAlt: Herbal exhibition cover
websiteCoverUrl: /assets/cases/herbal-exhibition-cover.png
translationKey: herbal-exhibition
lang: en
sourceHash: "53d9907956e7c95f335e24cd9d863cdd94dc03e4be358e7904f731843a97047a"
translationStatus: translated
generatedBodyHash: "9709ccc23db1085fb21f07a4761ba8ea3cd17045f1614f2e186243ac156ff6d1"
---

## Project overview

This UE project provides interactive browsing and presentation of herbal information. The display application brings together search, text, images, voice, 3D models and microscope slides. A companion management tool maintains herb and slide records and their media.

Users can find herbs by category or name, view the selected information and models, and inspect slide images at configured magnifications. My work covers application interaction, data organization, resource loading and the management tool. The herbal knowledge, models and image production are not included in my development contribution.

## Project components and my responsibilities

| Component | Users | My contribution |
| --- | --- | --- |
| Interactive display | Visitors and information readers | Search, category selection, text, voice, models and slide browsing |
| Data and resources | Display and management applications | Organization and reading of herbs, categories, regions, slides and media |
| External management tool | Content maintainers | Adding and editing records, importing media, validation and saving |

## Features and implementation

### Search and category browsing

I organized query interfaces for herbs, categories and regions, supplying the interface with information for the current selection. When users search by category or name, the display reads the associated content and presents text, images, voice and models.

Data queries and scene presentation are separate. Built-in information and externally added content can appear in the same browsing list.

### Text, voice and multiple models

I integrated images, audio and multiple models, organized the resources for the selected record and handled asynchronous preloading. Herb models switch in their configured order, with presentation using the selected record's media configuration.

### Microscope slide browsing

I organized the relationship between slide records and magnification images, including switching between configured 4×, 10× and 40× images. Available magnifications remain associated with the actual record and its image resources.

### External content maintenance

The companion tool supports adding and editing herb and slide records and importing and checking images, audio and models. After maintainers save updates, restarting the display application loads the latest content.

Supported media includes PNG, JPG and JPEG images; OGG, WAV and MP3 audio; and self-contained GLB models. Import checks cover image decoding, audio headers and extensions, and GLB structure and internal references so that saved media meets the display application's requirements.

## Maintenance workflow

1. Add or select a herb or slide record and edit its information.
2. Import images, audio and self-contained GLB models, then configure media order and slide magnifications.
3. Check and save records and resources in a form the display can read.
4. Restart the display application and inspect the updated list, models and slide images.
