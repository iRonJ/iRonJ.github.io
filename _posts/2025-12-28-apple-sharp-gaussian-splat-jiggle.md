---
layout: post
title:  "Bringing Photos to Life: Gaussian Splatting with Jiggle Physics in VisionOS"
author: ron
categories: [ AI, VisionOS, AR, research, computer-vision ]
image: assets/images/apple-sharp-splat.png
featured: true
toc: true
---

What if your photos could move? Not just play back as videos, but actually *exist* in space around you—touchable, interactive, alive with physics? That's the kind of impossible-sounding idea that AI and spatial computing are making real.

## When Memories Become 3D

We're living through a quiet revolution in how we interact with visual memories. For over a century, photos have been flat rectangles—windows into moments, sure, but always at a distance. Video added time but kept us behind the screen. Now, with AI-powered 3D reconstruction and spatial computing, something fundamentally different is emerging.

<video width="100%" controls>
  <source src="/assets/videos/ScreenRecording_12-28-2025 05-53-45_1.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>

Enter [Apple's SHARP project](https://github.com/apple/ml-sharp)—a research initiative that uses gaussian splatting to convert regular 2D images into full 3D scenes. Not photogrammetry requiring dozens of angles. Not depth maps that give you a cardboard cutout. Actual volumetric reconstruction from single images, powered by machine learning.

The promise is wild: take any photo and reconstruct it as a spatial scene you can walk around, explore from different angles, place in your living room through AR. Your memories stop being trapped in rectangles and start existing as places you can revisit.

## The Technical Journey: From WebGL Dreams to VisionOS Reality

Naturally, I had to experiment with this.

My first instinct was to run SHARP's model in the browser. Convert it to ONNX, run it through WebGL or WebGPU, let anyone with a browser interact with 3D-reconstructed photos. The appeal was obvious: no app install, works everywhere, instant access.

So I converted the model to ONNX format and started testing. On desktop? Worked beautifully. On mobile? Decent performance. On VisionOS Safari? **Instant crash.**

The problem was RAM. Gaussian splatting models, even optimized ones, require substantial memory for the intermediate representations. VisionOS Safari, running in a sandboxed browser environment, simply couldn't allocate enough memory before hitting hard limits. The browser would try, choke, and terminate.

This is the kind of constraint that forces you to rethink your approach entirely.

## CoreML and Native VisionOS: Where It Actually Works

If the browser couldn't handle it, the solution was to go native. I converted the SHARP model to CoreML—Apple's format optimized for on-device machine learning—and packaged it into a proper VisionOS application.

Suddenly, everything worked. The app had direct access to system memory, could leverage Apple's neural engine efficiently, and most importantly, could run the model without crashing. The 3D reconstructions rendered smoothly, placed naturally in AR space, tracked with the environment.

But here's where it got fun.

## Adding Jiggle Physics: Making Memories Interactive

Having a static 3D reconstruction floating in space is cool, but it's still passive. You're still just *looking* at it. So I added shader-based physics simulation—specifically, jiggle physics.

Now when you interact with the reconstructed scene, it *responds*. Tap it and it bounces. Wave your hand near it and it reacts to the motion. It's not just a visual artifact anymore—it's an object with simulated physical properties, existing in your space, reacting to you.

The video above shows it in action. What looks like a simple wobbling effect is actually the beginning of something much larger: the idea that our visual memories don't have to be static artifacts. They can be dynamic, interactive, responsive objects that exist alongside us in mixed reality.

This isn't just a gimmick. It's a proof of concept for a new category of interaction with photos and memories. Think about:

- **Family photos that react when you walk past them**, creating ambient awareness
- **Travel memories you can physically walk around**, exploring the space from new angles
- **Historical photos reconstructed in 3D**, letting you step into moments from the past
- **Interactive photo albums in AR**, where each memory exists as a tangible spatial object

The underlying technology—AI-powered 3D reconstruction combined with spatial computing—makes all of this possible. We're just beginning to scratch the surface.

## Why This Matters: The Convergence of AI and Spatial Computing

There's a pattern emerging across different domains. AI is teaching computers to understand our visual world with human-like perception. Spatial computing is giving us interfaces that exist in three dimensions, overlaid on reality. When these two technologies converge, entirely new interaction paradigms become possible.

Gaussian splatting is just one technique, and SHARP is just one implementation. But the principle is universal: **AI can transform flat media into spatial experiences, and spatial computing can make those experiences physically interactive.**

This has implications far beyond jiggling photos:

- Medical imaging reconstructed and manipulated in 3D space
- Architectural plans that become walkable spaces before construction begins
- Product designs you can hold and rotate in AR before manufacturing
- Educational content that exists spatially, touchable and explorable

We're moving from a world where computers show us information to a world where computers let us *inhabit* information.

## The Technical Reality: Constraints and Tradeoffs

Let's be clear about the current limitations, because they're important.

**The ONNX/WebGL approach failed** because browser sandboxing and memory limits are real constraints. This isn't a bug—it's intentional security architecture. For now, experiences like this require native apps with appropriate permissions.

**CoreML conversion works on VisionOS** but ties you to Apple's ecosystem. The model runs efficiently, but it's not portable. You can't trivially move this to Meta Quest or Android AR without significant rework.

**The jiggle physics are shader tricks**, not real physics simulation. They look good and feel responsive, but they're not calculating actual mass, momentum, or collision dynamics. It's visual feedback, not simulation.

These aren't failures—they're the current state of the art. Every new technology goes through this phase where you're fighting constraints, finding workarounds, discovering what actually works in practice versus what works in theory.

## What's Next: Beyond Jiggle Physics

The jiggle physics are just the beginning. Once you have 3D-reconstructed scenes running in AR with shader-based interactivity, the question becomes: what else can you do?

I'm exploring:

- **Multi-photo reconstruction**: Combining multiple images into coherent 3D spaces
- **Real-time interaction**: Using hand tracking to manipulate and reshape reconstructed scenes
- **Persistent placement**: Anchoring memories to specific locations in your physical space
- **Collaborative viewing**: Multiple people experiencing the same 3D memory simultaneously

The technical foundation is there. The hardware is capable. The models are increasingly efficient. We're in that early phase where the building blocks exist, but the applications are still being invented.

## Try It Yourself

The SHARP model is [open source on GitHub](https://github.com/apple/ml-sharp). If you have a Mac with Apple Silicon, you can convert it to CoreML and experiment. If you have a Vision Pro, you can build native VisionOS apps that run these models.

The future where photos become spatial, interactive objects isn't decades away. It's happening now, in research labs and side projects, through experiments like this one. We're figuring out what it means to interact with visual memories when they exist in three dimensions, when they respond to touch, when they inhabit space alongside us.

That's what makes this work exciting. Not the jiggle physics specifically, but what they represent: the first awkward steps toward a fundamentally different relationship with visual media. We're teaching our photos to move, and in doing so, we're learning what it means for technology to make memories *tangible*.
