---
title: "Traditional Chinese medicine visualization"
description: "A UE application for exploring herbal 3D models, microscope slides, medicinal properties and meridians, with search and content maintenance tools."
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
coverAlt: "Traditional Chinese medicine visualization cover"
websiteCoverUrl: /assets/cases/herbal-exhibition-cover.png
translationKey: herbal-exhibition
lang: en
sourceHash: "4d78cfe3b5f6b414a6687d9dff244a90714dc00fca7cec4e019c25e99f218c6f"
translationStatus: translated
generatedBodyHash: "84ec7a4261168f4b1d4182655c3708b402d3509a9b9bf1fbf15f3f9a39edaca0"
---

## Project overview

This UE project brings together herbal 3D models, microscope slides, medicinal properties and human meridians in an interactive application. Users can browse herbs by category, read or listen to descriptions, switch between models and slides, and explore meridian paths and the meridians associated with each herb.

I developed the interaction and data handling, including herb model fitting, controls for viewing the human model, meridian and acupoint displays, and image, audio and model loading. I also built a Python editor and a JSON-to-DataTable UE plugin so externally maintained content could use the application's existing queries and displays.

The application presents existing material and supports later additions. Within the configured categories and supported formats, maintainers use the editor to manage records and resources; the display application reads, checks and presents them. Herbal knowledge, models and images are supplied as content. My contribution covers the software, interaction and supporting tools.

## My responsibilities

| Module | My work |
| --- | --- |
| Herb search and properties | Queries by category, name and keyword; organization of properties and detailed descriptions |
| Herb models | Multiple models, display size settings and automatic fitting |
| Asynchronous loading and preloading | Loading models and audio asynchronously, with the next item prepared in the background |
| Microscope slides | Linking slides to herbs and presenting images at configured magnifications |
| Human model controls | Drag rotation, camera zoom, movement limits and reset |
| Meridians and herb associations | Meridian selection, herb associations, acupoint labels and animation playback |
| Python editor | Editing herb and slide JSON records and their media through a separate interface |
| JSON-to-DataTable plugin | Converting external JSON into runtime data tables for existing data interfaces |
| Built-in and external content | Reading records, validating media and combining content for search and display |

## Implementation

### Herb search and properties

I organized herb records by category, name, properties and origin, with query and filtering interfaces for the display. Users can choose a category and then find a herb. Keyword searches also match the names, identifiers and property text configured in the records.

Selecting a herb loads its description, thumbnail, background, audio and model settings for the interface. Short property summaries and full descriptions are stored separately, allowing lists to show a brief introduction and detail pages to expand it. The content does not need to be written into interface logic.

Built-in herbs and records added through the external editor appear in a shared browsing list. The display handles selection and content changes through the same interfaces, while maintainers can add records under existing categories.

### Model switching and automatic fitting

A herb can have several display models, with names and array order defining the selection. A whole plant, root or other form can be supplied as separate entries, depending on the available assets.

I implemented automatic model fitting and a target display size for each model. Since source models vary in scale, the display adjusts them according to their settings when switching. This makes them easier to view in the same scene and reduces manual size adjustments.

The external editor also supports model names, file selection and a target longest-edge size. The application carries these settings into the display, so newly added models use the same switching and fitting logic.

### Asynchronous loading and next-item preloading

Major display resources, including models and audio, load asynchronously. I separated content selection from resource preparation, using asynchronous tasks for file reading, audio decoding and model loading before passing the results to the display.

While a user views the current herb, the application prepares the next herb's models and audio in the background and retains loaded resources. Sequential browsing can use content prepared in advance, reducing the wait and pauses caused by reading, decoding and loading at the moment of selection.

Built-in resources use UE's asynchronous loading interfaces. External models use background file processing and asynchronous model construction; external audio is read and decoded in the background before returning to the display. Both sources participate in preloading for the current and next items, and the interface is notified when resources are ready.

Request identifiers distinguish new selections from old ones, and obsolete loading tasks are cancelled so a previous herb's results do not return to the current view. Refreshing resources also rechecks loading for the current record, keeping the display aligned with updated content and media.

### Microscope slide browsing

Slide records are linked to herb identifiers and contain descriptions and images at different magnifications. I implemented data reading, herb associations and magnification handling so users can open a herb's slides and inspect the available images.

The configuration supports 4×, 10× and 40× images, with multiple images at each magnification. The interface presents magnifications backed by actual images and excludes those without resources.

Externally added slides use the same display interfaces. Maintainers select images for each magnification in the editor, and the application organizes them alongside existing slide records for the same browsing experience.

### Human model rotation and camera zoom

I added drag controls and camera zoom for the human model. Dragging horizontally within its interaction area rotates the assembled model to view it from different directions. The mouse wheel moves the camera closer or farther away to inspect the whole body or a local area.

Tagged body components rotate together, keeping meridians and acupoints aligned. The model's interaction area is handled separately from other interface controls. Dragging state is cleared when dragging ends, the interaction area becomes invalid or the page closes. The model's orientation can also be reset.

Camera settings control movement increments and distance limits. Zoom can follow the viewing direction or the position under the mouse, and an interface restores the initial camera position. A minimum distance prevents the camera from continuing into the model.

### Meridians, acupoints and herb associations

Users can select an individual meridian or open the meridians associated with a herb. A herb may refer to several meridians; the application reads the configuration and controls the corresponding meridian and acupoint displays together.

I used scene model tags to manage the body, organs, meridians and acupoints, with interfaces for visibility and filtering. Selecting a meridian retains the relevant meridians and acupoints. Users can also restore the full view or control organ visibility separately to inspect spatial relationships.

Acupoint names are associated with scene tags through configuration and support visibility controls and name filtering. Labels follow their models and adjust their display size with camera distance for whole-body and close-up viewing.

Configured sequence animations show meridian paths. I handled playback, stopping and completion notifications for the current selection. Selecting a herb's meridian associations can load the corresponding animations, connecting the herb description to the meridians shown on the body.

### Python editor for external content

I built a Python editor separate from the UE display application to maintain herb and microscope slide JSON records. Maintainers select a record from a list, edit its fields, choose media and save. The tool handles reading and writing the data files.

Herb records include names, descriptions, categories, origins, thumbnails, audio and multiple model settings. Each model can have a display name and target size. Slide records contain descriptions and images for the available magnifications. The editor also supports adding, editing, renaming, recategorizing and deleting records.

Images, audio and models are selected through file dialogs. The tool stores records and resources in the agreed data directories and maintains their associations, reducing the need to reopen the UE project to configure each addition.

The editor displays checks for missing information and resource problems. It can also read validation reports from the display application and map engine-side failures to specific records and fields, helping maintainers correct and recheck them.

### JSON-to-DataTable plugin

I wrote a UE plugin that converts external JSON records into runtime DataTables. The Python editor maintains the content, the plugin converts it into UE data structures, and the display continues to use existing queries and interaction logic.

In this project, each external JSON record becomes one table row, with its filename defining the row identifier. The plugin reads the configured directories and table templates, checks identifiers and field structures, creates runtime tables and reports records that could not be converted.

The herb and slide modules read these tables and then validate the associated images, audio and models. This conversion lets externally maintained content enter the existing data flow without a separate interface for displaying JSON records.

### Combining external and built-in content

I connected external content to the application's existing query and display flow. At startup, the conversion plugin reads JSON and creates runtime tables. The herb module retrieves the records, validates their resources, adds valid external herbs to their categories and rebuilds the shared browsing and search lists.

Built-in data assets are preserved, while external content is added to runtime copies. The interface retrieves records through shared queries; loading then selects the appropriate path for packaged resources or external files. Newly added herbs can therefore be selected and displayed alongside built-in herbs.

This extension currently covers herb and microscope slide content. After updating records and media in the editor, maintainers restart the display application to load the changes. Adding content within the supported scope does not require repackaging the application.

#### Challenge: bringing external records and media into the display

External import has to handle record formats, media files and the display's loading methods together. Parsing a record is only part of the process. Its models, images and audio must also load successfully before the content can be displayed.

I defined identifiers, categories and media associations for each JSON record. The editor checks for duplicate external records, valid paths and required information, as well as numerical settings such as model size. The conversion plugin checks whether records fit the table structure, and the display excludes external herbs whose identifiers conflict with built-in content. These checks help maintainers locate specific data problems.

Media validation has two stages. The editor checks image decoding, audio headers and formats, and basic model file structure. The display application then attempts to load the images, audio and models. Herb records that fail validation are excluded from the combined list, with problems written to a report the editor can read and present for correction.

Built-in and external models require different loading methods. I connected both through shared content interfaces. External models and audio are registered with the loading modules and retrieved by the display logic using their records. Newly added content can use the existing interface and switching flow while built-in content is preserved.

Saving also needs to keep records and media consistent. I added checks for changes before saving, stopping an overwrite if another operation has changed the content. Records are written to temporary files before replacing the originals. Managed resources left unreferenced after replacement or deletion move to a recovery directory first, reducing losses from accidental deletion during maintenance.

## Content maintenance

1. Add or select a herb or slide record in the editor, fill in its information and choose a category.
2. Select images, audio and models for herbs, and configure model names and display sizes. Select images for each slide magnification.
3. Save the content and correct any reported missing information, format problems or resource associations.
4. Restart the display application, find the new content in the existing list, and check its models, audio and slides.
5. If the display reports resource loading problems, locate the record in the editor, correct the media and validate it again.

External import supports PNG, JPG and JPEG images; OGG, WAV and MP3 audio; and self-contained glTF 2.0 GLB models. Model geometry, materials and textures must be contained in the same GLB file. Slide images are configured for the magnifications actually supplied.
