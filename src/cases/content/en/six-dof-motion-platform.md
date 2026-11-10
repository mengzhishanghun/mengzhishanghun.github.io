---
title: Motion platform and virtual filming
description: "A UE virtual filming project for ocean scenes, with automatic ship assembly, multi-device controls, weather management, full-scene recording and six-axis platform integration."
type: case
slug: motion-platform-filming
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 2
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - "Simulation control"
  - "Motion platforms"
  - "Virtual production"
coverAlt: Motion platform and virtual filming cover
websiteCoverUrl: /assets/cases/motion-platform-filming-cover.png
translationKey: six-dof-motion-platform
lang: en
sourceHash: "11b5884126827c41623926eaf2ed28db0c34177fc51977f5473ce69e9d3816fa"
translationStatus: translated
generatedBodyHash: "9fdf145c6becdfeea486b3de7e9ffb593e1c97b56e0b68d94b7e3c2bf3c9a7a0"
---

## Project overview

This UE project supports virtual filming in an ocean scene, from scene preparation and ship control to camera placement, full-scene recording and playback of saved sequences. Users can configure ships and weather, control different ships with multiple devices, and use fixed camera positions, switch viewpoints or follow a subject.

Ocean states and ship movements are recorded with the scene. The saved sequence can be replayed to inspect motion and shots. For platform integration, a reference plane follows the ship's tilt and heading and is bound to the six-axis platform plane to calculate its motion data.

## My contribution

I built the UMG interface, weather and wave controls, shared ship base classes, multi-screen and multi-device controls, virtual camera functions, ocean recording integration, and scene recording and playback. Platform work included pose binding, motion solving, signal processing and LiveLink transmission.

| Module | My contribution |
| --- | --- |
| Ship setup | Shared base classes, automatic assembly by asset naming rules, ship parameters and interactions between ships |
| Interface and environment | UMG interface, ship selection and control, weather and wave parameters |
| Device controls | Device identification, input mapping, separate ships for different devices and independent windows |
| Virtual filming | Fixed camera positions, saved viewpoints, viewpoint switching, follow shots, focal length adjustment and external controls |
| Full-scene recording | Adapting the third-party ocean plugin to record ocean states and ship movements with the UE scene |
| Recorded playback | Saving sequences and controlling play, pause, stop and time seeking |
| Six-axis integration | Reference-plane binding, motion solving, filtering, amplitude and rate limits, and data transmission |
| Editor tools | Data table maintenance, asset saving, Blueprint reparenting and a sequence FBX export entry point |

## Features and implementation

### Shared ship base classes and automatic assembly

I put common ship functions in base classes and handled interactions between ships. Ship Blueprints identify and read assets using naming rules, then assemble them automatically. Artists name and import assets according to those rules; the shared Blueprint assembles a usable ship without repeating manual configuration for every vessel.

Ship motion and interaction with water use third-party components. I configured the hull, simulation mesh, propulsion and rudder, and handled mass, centre of mass and draft parameters. I also provided a helper that calculates buoyancy at a specified water level to assist with ship parameter adjustments.

Asset identification and automatic assembly run only in the UE editor.

### UMG interface and environment management

I built the UMG interface, including panels for the ship list, ship controls, ocean parameters and weather. Users can select and switch ships, adjust throttle and rudder, and view the corresponding ship's image and parameters.

Weather uses an existing sky and weather solution. I built the project management functions and controls for time, weather type, cloud coverage, rain, fog, wind direction and wind strength. The ocean panel controls wavelength, wave height, speed and direction so the environment can be adjusted for a shot.

### Multi-screen and multi-device ship controls

#### Implementation

Multiple devices can control different ships simultaneously, with each ship's view shown in an independent window. The main view is used only to observe the virtual camera; each ship is controlled by its assigned device.

The input layer maps device axes, buttons and directional pads to project control events. Axis values support offsets and scaling, while buttons have configurable outputs for press and release. The same flow handles device connection, disconnection and control configuration changes.

#### Challenges and implementation

Simultaneous input must retain its device identity so that each command reaches the correct ship. I maintain separate control instances by device name and connection index, use a device configuration table for input mappings, and let each instance control its assigned ship.

Device instances handle ship input, while window display and the main observation view are handled separately. Inputs from different devices therefore do not all go to one control target.

### Virtual camera and filming controls

Camera functions include fixed positions, saved viewpoints, viewpoint switching, position locking and subject following, with controls for focal length and movement speed. Users can switch viewpoints or follow a selected object to change the viewing angle and framing.

OSC messages and LiveLink tracking data provide external filming controls. Camera positions, follow settings and sequence records are stored in supporting data. The interface displays the current viewpoint, focal length and playback time for operation and review.

### Full ocean-scene recording and playback

#### Implementation

I integrated the third-party Oceanology plugin and adapted it for UE scene recording. Ocean states are recorded alongside ship and scene movements so playback can reproduce the recorded state.

Time, wavelength, wave height, speed and direction are exposed as interpolated properties for recording. Parameter changes notify the ocean system, while TimeCode accumulates during recording to preserve the timing of wave changes in the sequence.

Scene recording runs in the UE editor. TakePreset configures the recording sources, and Take Recorder saves the result. When recording finishes, the original scene Sequence is added to the new result as a SubSequence, offset using the recording start time, and saved.

Saved sequences reproduce the scene with controls for play, pause, stop and seeking to a specified time. The same ship movements, ocean changes and camera views can be reviewed repeatedly.

#### Challenges and implementation

Reliable ocean playback needs the wave parameters and their timing as well as Actor movements. I included the relevant plugin states in the UE recording flow so playback can restore the ocean from recorded data.

The original scene sequence and the new recording also need matching timing. I capture the original Sequence and start time when recording begins, then add the original sequence and calculate its offset when recording ends. Existing scene content and newly recorded actions can then play at their corresponding times.

#### Related technical record

- [Six-Axis Platform Kinematics and Ocean Recording Integration](/blog/six-dof-motion-platform/)

### Ship pose and six-axis platform integration

I use a reference plane in UE to follow the ship's tilt and heading, then bind it to the six-axis platform plane. As the ship changes pose, the reference plane follows, and the solver calculates motion data for the platform legs.

The ship, reference plane and platform can be inspected together in the scene. Centimetre-to-metre and degree-to-radian conversions are handled at the interface between the scene and the solver.

### Motion signal processing and transmission

#### Implementation

EMA, median and Butterworth filters reduce local fluctuations in motion data. Zero-point settings, output amplitude limits and rate limits are handled separately. Motion processing also includes high-pass and low-pass filtering, integration and tilt coordination.

Transform data is sent through LiveLink for the receiver to interpret and connect to the device. I handled motion solving, signal processing and transmission. The device system handles physical platform execution, calibration and hardware safety protection.

#### Challenges and implementation

Values within the allowed amplitude can still change too abruptly between frames. Stronger smoothing can also increase the delay when following fast movements.

I handle filtering, amplitude limits and rate limits separately, reducing local fluctuations while independently constraining the output range and change rate. Different inputs can use suitable filters instead of relying on one parameter set for every movement.

### Editor tools and data maintenance

Supporting functions query, add, remove and update data table records and save assets for ship presets, camera positions and sequence records. Editor tools also provide Blueprint reparenting and a Sequence FBX export entry point for organizing assets and filming sequences.
