import { Triangle, Rectangle } from "./shapes/shapes.js";
import { Matrix } from "./matrixJS/matrix.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


let rect1 = new Rectangle(50, 350, 300, 100);
let triangle1 = new Triangle(350, 300, 450, 50, 250, 200);
let triangle2 = new Triangle(600, 500, 700, 200, 500, 600);
let triangle3 = new Triangle(600, 500, 700, 200, 500, 600);

rect1.draw();

rect1.translate(600, 0);

rect1.shearXY(1, 0.1);

rect1.draw();

function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triangle1.rotate(2);
    rect1.rotate(-110);
    triangle2.rotate(5);
    triangle3.rotate(-5);

    triangle3.draw();
    triangle2.draw();
    triangle1.draw();
    rect1.draw();

    requestAnimationFrame(animate);
}

animate();
