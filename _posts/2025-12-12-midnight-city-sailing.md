---
layout: post
title:  "Midnight City Sailing"
author: ron
categories: [ gamedev, webgl, sailing, atmospheric ]
image: assets/images/midnight-city-sailing.png
featured: true
toc: false
---

I'm excited to share a new experimental project: **Midnight City Sailing**. It's a serene, atmospheric sailing experience set in a procedurally-generated neo-gothic cityscape.

This game features a minimalist sailing mechanic where you navigate through a dark, mysterious city rendered entirely with WebGL shaders. The buildings have a gothic architectural style with buttresses and spires, creating an otherworldly atmosphere. The water responds dynamically to your boat's movement with realistic wave physics.

Built using ray-marching techniques and signed distance fields (SDF), the entire scene is procedurally rendered in real-time. This approach allows for smooth, infinite worlds with dramatic lighting and fog effects that give the experience its distinctive mood.

Most amazingly, this was prototyped and refined through conversations with AI, exploring the possibilities of shader-based rendering and procedural generation. It's fascinating how quickly we can now iterate on complex graphics techniques!

Take the helm and explore the midnight city. It works on both mobile and desktop.

**Controls:**
- **Mobile/Touch:** Drag the circular joystick at the bottom left to sail.
- **Desktop:** Click and drag the joystick to control your direction and speed.

<div style="margin-bottom: 10px; text-align: right;">
<a href="/assets/apps/midnight_city/dist/index.html" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 12px;">OPEN IN NEW WINDOW</a>
</div>

<iframe src="/assets/apps/midnight_city/dist/index.html" style="width:100%; height:800px; border:none; background: #000;"></iframe>
