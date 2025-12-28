---
layout: post
title:  "Gaussian Splatting Experiments: Apple's ML-SHARP to ONNX"
author: ron
categories: [ ai, machine-learning, computer-vision, 3d ]
image: assets/images/gaussian-splatting.png
featured: true
toc: false
---

I'm excited to share some experiments I've been doing with **Gaussian Splatting**, a fascinating technique for reconstructing 3D scenes from 2D images. Apple Research recently released an incredible project called [ML-SHARP](https://github.com/apple/ml-sharp) that can turn regular images into 3D Gaussian splats.

**What is Gaussian Splatting?**

Gaussian splatting is a revolutionary approach to 3D scene reconstruction. Unlike traditional mesh-based rendering or neural radiance fields (NeRF), Gaussian splatting represents a 3D scene as a collection of 3D Gaussian distributions. Each "splat" is a small 3D Gaussian that has a position, orientation, color, and opacity. When rendered together, these splats create photorealistic 3D scenes that can be viewed from any angle.

The technique has gained massive popularity because it's incredibly fast compared to NeRF while maintaining high quality. It's perfect for applications in AR/VR, digital twins, and immersive media.

**Apple's ML-SHARP**

Apple's ML-SHARP (Machine Learning - Scalable High-fidelity Asset Reconstruction Pipeline) is their take on making Gaussian splatting more accessible and efficient. The project provides tools to convert images into 3D Gaussian splat representations that can be rendered in real-time.

**My ONNX Conversion Experiments**

I took Apple's model and experimented with converting it to ONNX format. ONNX (Open Neural Network Exchange) is an open standard for machine learning models that enables interoperability between different frameworks. Converting to ONNX opens up possibilities for:

- **Cross-platform deployment**: Run the model on various devices and frameworks
- **Performance optimization**: Take advantage of ONNX Runtime's optimizations
- **Hardware acceleration**: Better support for different accelerators (GPU, NPU, etc.)
- **Integration flexibility**: Easier integration with production systems

The conversion process had some interesting challenges, particularly around handling the custom operations in the Gaussian splatting pipeline. I also experimented with Core ML integration to see how it could run natively on Apple devices.

Check out the screen recording below showing some of the experiments in action:

<div style="margin-bottom: 20px;">
<video width="100%" controls>
  <source src="/assets/videos/ScreenRecording_12-28-2025 05-53-45_1.mov" type="video/quicktime">
  <source src="/assets/videos/ScreenRecording_12-28-2025 05-53-45_1.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

**What's Next?**

This is just the beginning of exploring Gaussian splatting for real-world applications. The combination of Apple's ML-SHARP with ONNX and Core ML opens up exciting possibilities for on-device 3D reconstruction and rendering.

I'm particularly interested in:
- Optimizing the model for mobile devices
- Real-time splatting from live camera feeds
- Integration with AR frameworks
- Exploring compression techniques for the Gaussian representations

The field of 3D reconstruction is evolving rapidly, and Gaussian splatting represents a major leap forward in making photorealistic 3D content creation accessible to everyone.

**Resources:**
- [Apple ML-SHARP GitHub Repository](https://github.com/apple/ml-sharp)
- [ONNX Documentation](https://onnx.ai/)
- [Core ML Framework](https://developer.apple.com/documentation/coreml)
