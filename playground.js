import { Box, initCanvas, Rectangle, Polygon, Triangle, ImageShape, Pixel, Point3D, Vector, Matrix } from "./lib/index.js";

initCanvas("canvas1", window.innerWidth, window.innerHeight);

window.__ctx__.fillStyle = "black";
window.__ctx__.strokeStyle = "white";
window.__ctx__.lineWidth = 4;

const rect1 = new Rectangle(600, 500, 50, 50);
const rect1copy = new Rectangle(600, 500, 50, 50);

const rect2 = new Rectangle(50, 350, 300, 100);
const triangle1 = new Triangle([350, 300], [450, 50], [250, 200]);
const triangle2 = new Triangle([600, 500], [700, 200], [500, 600]);
const triangle3 = new Triangle([600, 500], [700, 200], [500, 600]);
const polygon1 = new Polygon([300, 300], [400, 150], [400, 300], [350, 350], [300, 400], [250, 200]);


const image = new Image();
image.crossOrigin = "anonymous";
image.src = "./assets/img.jpg";

const box1 = new Box([350, 300, 0], 100);


image.onload = () => {
  const ctx = window.__ctx__;
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  ctx.drawImage(image, 100, 100, w, h);

  const imageData = ctx.getImageData(100, 100, w, h);

  const imageShape = new ImageShape(0, 0, imageData.data, w, h);
  imageShape.translate(350, 100);
  imageShape.scale(-1, 1);
  box1.rotateX(1);
  box1.draw();
  imageShape.draw();

  const animate = () => {
    window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
    
    imageShape.rotate(1);
    box1.rotateX(1);
    imageShape.draw();
    box1.draw();

    requestAnimationFrame(animate);
  }
  animate();

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        imageShape.translate(0, 10);
    }
    if (e.key === "ArrowDown") {
        imageShape.translate(0, -10);
    }
    if (e.key === "ArrowLeft") {
        imageShape.translate(10, 0);
    }
    if (e.key === "ArrowRight") {
        imageShape.translate(-10, 0);
    }
});
};

