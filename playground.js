import { Box, initCanvas, Rectangle, Polygon, Triangle, ImageShape, Pixel, Point3D, Vector, Matrix, Group } from "./lib/index.js";

const { ctx, clearCanvas } = initCanvas("canvas1");

ctx.fillStyle = "black";
ctx.strokeStyle = "white";
ctx.lineWidth = 4;

const rect1 = new Rectangle(600, 500, 50, 50);
const rect1copy = new Rectangle(600, 500, 50, 50);

const rect2 = new Rectangle(50, 350, 300, 100);
const triangle1 = new Triangle([350, 300], [450, 50], [250, 200]);
const triangle2 = new Triangle([600, 500], [700, 200], [500, 600]);
const triangle3 = new Triangle([600, 500], [700, 200], [500, 600]);
const polygon1 = new Polygon([300, 300], [400, 150], [400, 300], [350, 350], [300, 400], [250, 200]);

const group1 = new Group(rect1, rect1copy, rect2, triangle1, triangle2, triangle3, polygon1);

const tetrisRect1 = new Rectangle(100, 100, 50, 50);
const tetrisRect2 = new Rectangle(150, 100, 50, 50);
const tetrisRect3 = new Rectangle(200, 100, 50, 50);
const tetrisRect4 = new Rectangle(250, 100, 50, 50);


const tetrisRect5 = new Rectangle(100, 100, 50, 50);
const tetrisRect6 = new Rectangle(150, 100, 50, 50);
const tetrisRect7 = new Rectangle(200, 100, 50, 50);
const tetrisRect8 = new Rectangle(150, 50, 50, 50);

const group2 = new Group(tetrisRect1, tetrisRect2, tetrisRect3, tetrisRect4);
const group3 = new Group(tetrisRect5, tetrisRect6, tetrisRect7, tetrisRect8);

group3.translate(100, 100);

const vec = new Vector();

console.log(Vector.normalize([1, 1, 1]));


const box1 = new Box(400);
console.log('Box1 Center:', box1.center);
console.log('Box1 Points:', box1.points);
box1.translate3D(300, 300, 0);
console.log('Box1 Center after translation:', box1.center);
console.log('Box1 Points after translation:', box1.points);

console.log(box1.points);

addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        box1.translate3D(0, 10, 0);
        //group2.translate(0, 10);
        //console.log(box1.points);
    }
    if (e.key === "ArrowDown") {
        box1.translate3D(0, -10, 0);
        //group2.translate(0, -10);
    }
    if (e.key === "ArrowLeft") {
        box1.translate3D(-10, 0, 0);
        //group2.translate(-10, 0);
    }
    if (e.key === "ArrowRight") {
        box1.translate3D(10, 0, 0);
        //group2.translate(10, 0);
    }
});

const animate = () => {
    clearCanvas();

    //group1.draw();
    //group1.rotate(1);
    //group2.draw();
    //group2.rotate(45);

    //group3.draw();
    
    box1.rotateX(.5);
    box1.rotateY(.5);
    box1.rotateZ(.5);

    box1.draw();

    requestAnimationFrame(animate);
  }
  animate();
