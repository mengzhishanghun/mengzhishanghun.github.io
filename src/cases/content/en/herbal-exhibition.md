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
  - Interactive exhibition
  - Herbal content
  - Data management
coverAlt: AI concept cover for Herbal exhibition, not a project screenshot
websiteCoverUrl: /assets/cases/herbal-exhibition-cover.png
translationKey: herbal-exhibition
lang: en
sourceHash: 9e8d798d93ce1f0b5ef59c748571900594ec38abc79ef4ad81368770a6920dc1
translationStatus: translated
generatedBodyHash: 71598f59d6d9fe504620d9ee5e9dc072f22691f0390c6ba45fe2d0fcfcb39dec
---

## Project overview

This Unreal Engine project provides interactive browsing of herbal content. Users can find entries by category or name, view descriptions, images, audio and 3D models, and examine microscope slide images at different magnifications.

## My contribution

- Organized herbal data, categories, regions and search interfaces for the browsing UI.
- Integrated images, audio and multiple models, with asynchronous preloading for selected content and related resources.
- Organized microscope slide content and image switching at 4×, 10× and 40× magnification.
- Provided an external content tool for adding and editing herbal and slide records, importing media and validating entries.

## Interactive display and content maintenance

The display separates content queries from scene presentation. Built-in entries and external additions can appear in the same browsing lists. Models follow their configured order, and microscope views use the magnifications and images available for each entry.

The maintenance tool imports images, audio and self-contained GLB models and checks content and resources when saving. Updated content is read after restarting the display application.

## Project scope

This case covers application development, data organization, resource loading and content maintenance. It does not attribute the production of herbal reference material, models or images to my development work.

The external content tool supports PNG, JPG and JPEG images, OGG, WAV and MP3 audio, and self-contained GLB models. Imported media must meet the display application's format requirements.
