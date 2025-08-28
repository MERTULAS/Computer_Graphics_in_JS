# Computer Graphics in JS (Canvas, CPU-Based)

## Demo GIFs (English)

### 1) 3D Box: wireframe rotation with simple projection
![3D Box Rotation](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2VkNGF0ZDd5dmkyemExZjM4NHpudzZpcnBhZ2p4Nmw2MWpnbzdkMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TeGPVT1zqusqfMLJgr/giphy.gif)

- Shows live 2D transformations on polygons/rectangles using a simple animation loop.
- The center-compensation keeps objects rotating/scaling around their centroid.

### 2) ImageData: per-pixel rendering as a vector and transformation
![ImageData Translate](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHA4dnFpZWQxenFweXJ5MXd0YjBxdWU0dWl3YXd3cHExb3M1N2pmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uQRw9fJgMdqMzPNNve/giphy.gif)

- The image is drawn pixel-by-pixel via `ImageData` and moved with a simple translate.
- Indexing uses `base = (y * width + x) * 4` to access RGBA channels correctly.

### 3) 2D Transforms: rotate, scale, shear
![2D Transforms](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHVvbnJqdGcyNnhhZGRmYmoyaHJ6YXp1eGR6MmoybDBhZTc4ZjloZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f3M9w24ftUmY7Ckxka/giphy.gif)

- A minimal 3D-to-2D pipeline renders a rotating cube in wireframe.
- Mouse-driven rotation simulates a camera-like experience.

> A playground to learn and implement core computer graphics techniques in JavaScript on the CPU, step by step.

This project aims to demonstrate matrices, vectors, transformations (translate/rotate/scale/shear), a simple 3D → 2D projection, and pixel-level operations (ImageData) with an approachable, experiment-friendly setup. Everything intentionally runs on the CPU; the goal is learning rather than performance.

## Contents & Architecture

- 2D module (`shapes/shapes2d.js`)
  - Types: `Point`, `Pixel`
  - `Transform` base: `translate`, `rotate`, `scale`, `shearX/Y/XY` (with center compensation)
  - `Polygon`, `Rectangle`, `Triangle` (Triangle = Polygon[3])
  - `ImageShape`: builds pixels from `ImageData` and renders 1×1 `fillRect`s (RGBA)
- 3D module (`shapes/shapes3d.js`)
  - `Transform3D` and `Box` (wireframe cube)
  - A simple perspective approach and 2D projection (minimal teaching pipeline)
- Canvas bootstrap (`canvas/canvas.js`)
  - A single canvas/context exposed as `window.__canvas__`, `window.__ctx__`
- Vector/Matrix helpers (`VectorJS/vector.js`)
  - `dot` (matrix multiplication), `normalize`, 2D rotation helpers

## Installation

```bash
npm i
npm run dev
```

Vite is used only for development (devDependency). A production-ready `dist/` build or alternative bundlers can be added later.

## Quick Start

The snippet below adds a rectangle and a polygon to the scene and applies basic transforms:

```javascript
import { initCanvas } from "./canvas/canvas.js";
import { Rectangle, Polygon } from "./shapes/shapes2d.js";

initCanvas("canvas1", window.innerWidth, window.innerHeight);

const rect = new Rectangle(100, 100, 120, 80);
const poly = new Polygon([300, 300], [360, 220], [420, 320], [340, 360]);

function animate() {
  window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
  rect.rotate(1);
  poly.shearX(Math.sin(0.01));
  rect.draw();
  poly.draw(true);
  requestAnimationFrame(animate);
}

animate();
```

## Working with ImageData (Pixel Level)

- Draw the image onto the canvas, then grab the pixel buffer with `getImageData`.
- Correct indexing: `base = (y * width + x) * 4` → iterate `[r,g,b,a]` in order.
- `ImageShape` converts pixels into `Pixel` objects and paints them with 1×1 `fillRect`s.

```javascript
const image = new Image();
image.src = "./assets/img.jpg";
image.onload = () => {
  const w = image.naturalWidth, h = image.naturalHeight;
  window.__ctx__.drawImage(image, 0, 0, w, h);
  const { data } = window.__ctx__.getImageData(0, 0, w, h);
  const img = new ImageShape(0, 0, data, w, h);
  img.translate(200, 200);
  img.rotate(37);
  img.draw();
};
```

Note: If you want to use alpha in the 0–1 range, divide by 255 (`a/255`).

## 3D → 2D Projection (Educational)

- A `Box` is created in 3D space and projected to 2D before drawing.
- Rotations (`rotateX/Y/Z`) operate directly on 3D vertices, around the shape’s center.
- Camera model/focal length and related parameters can be extended later.

```javascript
import { Box } from "./shapes/shapes3d.js";
const box = new Box([500, 500, 1.5], 500);
function animate() {
  window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
  box.rotateY(1);
  box.draw();
  requestAnimationFrame(animate);
}
animate();
```

## Design Choices & Learning Notes

- As long as transforms are affine, a shape’s centroid moves linearly; center handling matters.
- For GUI slider inputs, prefer “absolute” semantics (e.g., scale relative to the original, not cumulatively per frame).
- If canvas CSS size differs from its real resolution, you might see blur; consider `devicePixelRatio`.
- A global `ctx` keeps things simple; later we can pass it explicitly for better encapsulation/testing.

## Roadmap

- [ ] Camera parameters (orthographic/perspective, `f`, near/far, view matrix)
- [ ] Absolute T·R·S model matrix per frame (reduce cumulative errors)
- [ ] Triangle rasterization, barycentric coordinates, z-buffer (depth test)
- [ ] Basic lighting (Lambert/Phong) — CPU-based
- [ ] OffscreenCanvas / Worker experiment for pixel rendering
- [ ] Production package (ESM/CJS) and a minimal demo page

## Run / Development

```bash
npm run dev   # development server
# npm run build  # production build (planned)
```

## Contributing

- Feel free to open issues or PRs for bugs and improvements.
- Since the goal is learning, small, focused PRs with explanatory commit messages are appreciated.

---

This repository is meant to be a practical toolbox for “Computer Graphics 101”. Code and comments are intentionally simple to maximize learnability and experimentation. Have fun!
