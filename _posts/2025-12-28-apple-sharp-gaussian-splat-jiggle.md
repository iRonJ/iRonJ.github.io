---
layout: post
title:  "Bringing Photos to Life: Gaussian Splatting with Jiggle Physics in VisionOS"
author: ron
categories: [ AI, VisionOS, AR, research, computer-vision ]
image: assets/images/apple-sharp-splat.png
featured: true
toc: true
---

What if your photos could move? Not just play back as videos, but actually *exist* in space around you—touchable, interactive, alive with physics?

## When Memories Become 3D

<video width="100%" controls>
  <source src="/assets/videos/ScreenRecording_12-28-2025 05-53-45_1.mov" type="video/quicktime">
  Your browser does not support the video tag.
</video>

[Apple's SHARP project](https://github.com/apple/ml-sharp) uses gaussian splatting to convert regular 2D images into full 3D scenes. Not photogrammetry requiring dozens of angles, but actual volumetric reconstruction from single images using machine learning.

Take any photo and reconstruct it as a spatial scene you can walk around in AR.

## The ONNX Experiment

My first instinct was to run SHARP's model in the browser. Convert it to ONNX, run it through WebGL or WebGPU, let anyone with a browser interact with 3D-reconstructed photos.

I converted the model to ONNX format and started testing. On desktop? Worked beautifully. On mobile? Decent performance. On VisionOS Safari? **Instant crash.**

The problem was RAM. VisionOS Safari, running in a sandboxed browser environment, couldn't allocate enough memory before hitting hard limits. The browser would try, choke, and terminate.

## CoreML and Native VisionOS

If the browser couldn't handle it, the solution was to go native. I converted the SHARP model to CoreML and packaged it into a VisionOS application.

This took some trial and error. Getting the model conversion right, handling the input/output tensors correctly, and optimizing memory usage all required iteration. Once I got the CoreML integration working, I started adding interactive shaders. That was another round of experimentation—getting the shader parameters right, making the physics feel responsive without being too chaotic, and ensuring it performed well in AR.

Eventually, everything came together. The 3D reconstructions rendered smoothly, placed naturally in AR space, and tracked with the environment.

## Adding Jiggle Physics

Having a static 3D reconstruction floating in space is cool, but it's still passive. So I added shader-based jiggle physics.

Now when you interact with the reconstructed scene, it *responds*. Tap it and it bounces. Wave your hand near it and it reacts to the motion.

The video above shows it in action. This opens up possibilities for many other kinds of AR and VR splat interactions—physics-based manipulation, environmental responses, or collaborative interactions in shared spaces.

## Technical Constraints

**The ONNX/WebGL approach failed** due to browser sandboxing and memory limits. For now, experiences like this require native apps.

**CoreML works on VisionOS** but ties you to Apple's ecosystem. The model runs efficiently, but it's not portable to other platforms without rework.

**The jiggle physics are shader tricks**, not real physics simulation. They look good and feel responsive, but they're visual feedback rather than actual momentum calculations.

## What's Next

Potential directions to explore:

- Multi-photo reconstruction: Combining multiple images into coherent 3D spaces
- Hand tracking: Directly manipulate and reshape reconstructed scenes
- Persistent placement: Anchor memories to specific physical locations
- Collaborative viewing: Multiple people experiencing the same 3D memory simultaneously

## Try It Yourself

The SHARP model is [open source on GitHub](https://github.com/apple/ml-sharp). If you have a Mac with Apple Silicon, you can convert it to CoreML and experiment. If you have a Vision Pro, you can build native VisionOS apps that run these models.
