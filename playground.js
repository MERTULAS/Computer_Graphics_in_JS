import { Box, initCanvas, Rectangle, Polygon, Triangle, ImageShape, Pixel, Point3D, Vector, Matrix, Group, Camera, Renderer } from "./lib/index.js";

const { ctx, clearCanvas, canvas } = initCanvas("canvas1");

ctx.fillStyle = "black";
ctx.strokeStyle = "white";
ctx.lineWidth = 4;

// const rect1 = new Rectangle(600, 500, 50, 50);
// const rect1copy = new Rectangle(600, 500, 50, 50);

// const rect2 = new Rectangle(50, 350, 300, 100);
// const triangle1 = new Triangle([350, 300], [450, 50], [250, 200]);
// const triangle2 = new Triangle([600, 500], [700, 200], [500, 600]);
// const triangle3 = new Triangle([600, 500], [700, 200], [500, 600]);
// const polygon1 = new Polygon([300, 300], [400, 150], [400, 300], [350, 350], [300, 400], [250, 200]);

// const group1 = new Group(rect1, rect1copy, rect2, triangle1, triangle2, triangle3, polygon1);

// const tetrisRect1 = new Rectangle(100, 100, 50, 50);
// const tetrisRect2 = new Rectangle(150, 100, 50, 50);
// const tetrisRect3 = new Rectangle(200, 100, 50, 50);
// const tetrisRect4 = new Rectangle(250, 100, 50, 50);


// const tetrisRect5 = new Rectangle(100, 100, 50, 50);
// const tetrisRect6 = new Rectangle(150, 100, 50, 50);
// const tetrisRect7 = new Rectangle(200, 100, 50, 50);
// const tetrisRect8 = new Rectangle(150, 50, 50, 50);

// const group2 = new Group(tetrisRect1, tetrisRect2, tetrisRect3, tetrisRect4);
// const group3 = new Group(tetrisRect5, tetrisRect6, tetrisRect7, tetrisRect8);

// group3.translate(100, 100);

//const CENTER_X = window.__canvas__.width / 2;
//const CENTER_Y = window.__canvas__.height / 2;
//const CENTER_POINT = new Point3D(CENTER_X, CENTER_Y, 0);

const camera = new Camera(0, 0, 0); // const camera = new Camera(new Point3D(0, 0, 500));

const renderer = new Renderer(canvas, camera);

const box1 = new Box(200);
const box2 = new Box(100);

renderer.addObject(box1);
renderer.addObject(box2);

//box1.translate3D(300, 300, 0);
//box2.translate3D(300, 300, 0);

addEventListener("keydown", (e) => {
    if (e.key === "w") {
        box1.translate3D(0, -10, 0);
    }
    if (e.key === "s") {
        box1.translate3D(0, 10, 0);
    }
    if (e.key === "a") {
        box1.translate3D(-10, 0, 0);
    }
    if (e.key === "d") {
        box1.translate3D(10, 0, 0);
    }
    if (e.key === "ArrowUp") {
        box1.scale(1.1);
        console.log(box1.points);
    }
    if (e.key === "ArrowDown") {
        box1.scale(0.9);
        console.log(box1.points);
    }
    if (e.key === "q") {
        box1.rotateX(10);
        console.log(box1.points);
    }
    if (e.key === "e") {
        box1.rotateY(10);
        console.log(box1.points);
    }
    if (e.key === "z") {
        box1.wireframeType = "edges";
    }
    if (e.key === "x") {
        box1.wireframeType = "triangles";
    }
});

const animate = () => {
    clearCanvas();
    
    box1.rotateX(-.5);
    box1.rotateY(-.5);
    box1.rotateZ(-.5);
    
    box2.rotateX(.5);
    box2.rotateY(.5);
    box2.rotateZ(.5);

    renderer.showFPS();
    renderer.render();

    requestAnimationFrame(animate);
}

animate();
