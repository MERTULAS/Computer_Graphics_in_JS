import { Box, initCanvas, Rectangle, Polygon, Triangle, ImageShape, Pixel, Point3D } from "./lib";

initCanvas("canvas1", window.innerWidth, window.innerHeight);

window.__ctx__.fillStyle = "black";
window.__ctx__.strokeStyle = "white";
window.__ctx__.lineWidth = 4;

const rect1 = new Rectangle(600, 500, 50, 50);
const rect2 = new Rectangle(50, 350, 300, 100);
const triangle1 = new Triangle([350, 300], [450, 50], [250, 200]);
const triangle2 = new Triangle([600, 500], [700, 200], [500, 600]);
const triangle3 = new Triangle([600, 500], [700, 200], [500, 600]);
const polygon1 = new Polygon([300, 300], [400, 150], [400, 300], [350, 350], [300, 400], [250, 200]);


rect2.translate(100, 0);

rect1.scale(2.5);
rect1.shearX(Math.sin(10));
rect2.scale(1.5);

polygon1.translate(50, 200);
polygon1.rotate(80);
polygon1.scale(.9);

// rect1.shearY(-Math.tan(15 * Math.PI / 180));
// rect1.shearX(Math.sin(30 * Math.PI / 180))
// rect1.shearY(-Math.sin(30 * Math.PI / 180))

const box1 = new Box([450, 450, 0], 400);

/*
const image = new Image();
image.crossOrigin = "anonymous";
image.src = "./assets/img.jpg";

image.onload = () => {
  const ctx = window.__ctx__;
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  ctx.drawImage(image, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;

  const imageShape = new ImageShape(0, 0, imageData.data, w, h);
  imageShape.translate(400, 400);
  imageShape.rotate(10);
  imageShape.rotate(20);
  imageShape.rotate(45);

  imageShape.scale(1.5);
  imageShape.shearX(Math.sin(10));
  imageShape.shearY(Math.cos(10));
  imageShape.shearXY(Math.sin(10), Math.cos(10));

  imageShape.draw();

  //let i = 0;
  const animate = () => {
    window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
    //imageShape.rotate(i);
    //i += 0.01;
    //imageShape.shearX(Math.sin(i));
    //imageShape.shearY(Math.cos(i));

    //imageShape.translate(Math.sin(i), Math.cos(i));
    imageShape.rotate(1);
    imageShape.draw();
    requestAnimationFrame(animate);
  }
  animate();
};
*/  


function animate () {
    window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
    box1.draw();
    requestAnimationFrame(animate);
}

animate();

addEventListener("mousemove", (e) => {
    console.log(e.movementX, e.movementY, e.movementZ);
    box1.rotateX(e.movementX * 0.1);
    box1.rotateY(e.movementY * 0.1);
    animate();
});


/*
let i = 0;  
function animate () {
    window.__ctx__.clearRect(0, 0, window.__canvas__.width, window.__canvas__.height);
    polygon1.draw(true);
    polygon1.rotate(1);
    polygon1.translate(Math.sin(i), Math.cos(i));
    i += 0.01;

    triangle1.draw(true);

    rect1.draw();

    requestAnimationFrame(animate);
}

animate();
*/

addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        box1.rotateX(10);
    }
    if (e.key === "ArrowDown") {
        box1.rotateX(-10);
    }
    if (e.key === "ArrowLeft") {
        box1.rotateY(10);
    }
    if (e.key === "ArrowRight") {
        box1.rotateY(-10);
    }
});
