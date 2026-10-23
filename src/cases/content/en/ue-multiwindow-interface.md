---
title: Creating Independent Multiwindow Interfaces in UE
description: Host UMG in native Slate windows with lifecycle, position, size, visibility, and DPI controls.
type: case
slug: ue-multiwindow-interface
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - UMG
  - Multiwindow
  - UI tools
lang: en
translationKey: ue-multiwindow-interface
sourceHash: bc2bc23cb9d1977c607f9d35566c1521e29d44677a74d63e98434212a64b7bb8
translationStatus: translated
generatedBodyHash: e089e623155283605b48e8f8092fd14a55d2a1d9f0bed69dafeb94dfb73449a1
coverAlt: Independent UE multiwindow interface diagram
websiteCoverUrl: /assets/cases/ue-multiwindow-interface.png
---


## Controls outside the Main View

UE tools and simulations sometimes need parameter panels, debug information, or operator interfaces in separate windows to keep the main view available. This involves more than making UMG content: native-window creation, input forwarding, size changes, and closing behavior also need handling.

The NorthTravel project configuration enables the Marketplace MultiWindow plugin. This case describes the existing plugin's window capabilities and integration approach. The underlying window implementation belongs to that plugin, whose source-file headers credit YWT20. It uses Slate to create native windows and host UMG, providing a basis for independent control panels.

## Window Creation and Lifecycle

### Turning Creation Parameters into a Window

`CreateMultiWindow` accepts UMG content, window position, client-area size, title, margins, and sizing-related options. The plugin creates a Slate window, obtains Slate content through UMG's `TakeWidget`, and installs it in the new window. The window frame handles native-window behavior while UMG organizes controls and business interaction.

| Integration parameter | Behavior affected |
| --- | --- |
| UMG content | Controls displayed and used inside the window |
| Position and client-area size | Initial placement and available content area |
| Title and margins | Window identification and spacing around content |
| Sizing and related options | Permitted native-window appearance and operations |

The creation path uses the first visible Slate window as the native parent. This suits an application with an existing main window. More complex window relationships require checking which actual main window is selected; UMG hierarchy alone does not determine native parenting.

### One Management Actor per Window

MultiWindowActor holds window-related objects and exposes position, size, title, visibility, maximize, minimize, and close operations. After creation, business logic can manage the window through its Actor instead of locating the native window again for every button action.

The plugin also exposes activation and close events and forwards keyboard callbacks to UMG. A parameter panel can use these entry points to organize opening, focus, and closing behavior. Receiving window input and processing it in controls are separate stages. Integration still needs checks of actual focus and control settings.

### What Automatic Scaling Does

The plugin's automatic DPI handling calculates a scale from the original and current client-area dimensions, then applies `SetRenderScale` to UMG. Content can therefore change its displayed size proportionally when the window grows or shrinks.

This changes rendered widget size rather than automatically rearranging every control. It is also not complete system-DPI adaptation. Operating-system scaling, different displays, and UMG layout remain separate integration conditions. A two-column layout in a wide window or a collapsed control area in a narrow one requires additional UI layout rules.

### Explicit Close and Native Close

Closing explicitly through the plugin clears related references and bindings before requesting closure. Clicking the native window's close button follows a different path, whose existing callback primarily broadcasts a close event. The two paths do not have identical cleanup responsibilities, and the UMG pointer's lifecycle also needs attention.

Integration should therefore define what happens to the corresponding Actor, widget references, and business state after a close event. A disappeared window does not establish that all related objects have been released. Panels that open repeatedly also need a decision on rebuilding each time or retaining state for redisplay.

## Scope

The existing plugin targets independent tool windows and control panels. Its enabled state in NorthTravel is confirmed, but the project's two C++ modules contain no direct MultiWindow calls. Blueprint invocation and actual runtime behavior remain unconfirmed. This case describes integration capabilities and does not claim personal authorship of the plugin or an on-site delivered implementation.

A native window hosting UMG does not automatically have an independent UWorld or camera render. Showing different camera views in different windows requires further assessment of viewports, image sources, and rendering resources. Ordinary parameter panels can begin with window relationships, focus, scaling, and closing lifecycles.

## Discuss Your Project

If a UE application needs separate parameter panels, debug windows, or operator interfaces, share the UI content, window relationships, and runtime environment. I can help connect UMG and handle window controls and events.

[Get in touch](/en/contact/) to discuss it.
