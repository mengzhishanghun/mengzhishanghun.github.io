---
title: Creating Independent Multiwindow Interfaces in UE
description: Host UMG in native Slate windows with lifecycle, position, size, visibility, and DPI controls.
type: blog
slug: ue-multiwindow-interface
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
featured: false
draft: false
sitePublish: true
tags:
  - UMG
  - Multiwindow
  - UI tools
lang: en
translationKey: ue-multiwindow-interface
coverAlt: Independent UE multiwindow interface diagram
websiteCoverUrl: /assets/cases/ue-multiwindow-interface.png
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: 4facc3fcf500b4872ab49e9f5f7803fd028a15491fb306282d164a5dbea7f79d
translationStatus: translated
generatedBodyHash: 9958d47b04893cccd1e9a587dbfccc10feabd8bffa28f7b7f708a621a44ff512
---

## Controls outside the Main View

UE tools and simulations sometimes need parameter panels, debug information, or operator interfaces in separate windows to keep the main view available. This involves more than making UMG content: native-window creation, input forwarding, size changes, and closing behavior also need handling.

The project configuration enables the Marketplace MultiWindow plugin. The underlying window implementation belongs to that plugin, whose source-file headers credit YWT20. It uses Slate to create native windows and host UMG, providing a basis for integrating independent control panels.

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

Integration should therefore define what happens to the corresponding Actor, widget references, and business state after a close event. A window disappearing does not mean that all related objects have been released. For panels that open repeatedly, the application must also decide whether to rebuild each time or retain state for redisplay.

## Scope

The existing plugin targets independent tool windows and control panels. Its enabled state in the project is confirmed, but the project's two C++ modules contain no direct MultiWindow calls. Blueprint invocation and actual runtime behavior remain unconfirmed. The evidence supports describing the plugin's integration capabilities, without claiming personal authorship or an implementation delivered and running on site.

A native window hosting UMG does not automatically have an independent UWorld or camera render. Showing different camera views in different windows requires further assessment of viewports, image sources, and rendering resources. Ordinary parameter panels can begin with window relationships, focus, scaling, and closing lifecycles.
