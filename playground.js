import { Triangle, Rectangle, Polygon } from "./shapes/shapes2d.js";
import { Cube } from "./shapes/shapes3d.js";
import { Vector } from "./VectorJS/vector.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


let rect1 = new Rectangle(50, 350, 300, 100);
let rect2 = new Rectangle(50, 350, 300, 100);
let triangle1 = new Triangle(350, 300, 450, 50, 250, 200);
let triangle2 = new Triangle(600, 500, 700, 200, 500, 600);
let triangle3 = new Triangle(600, 500, 700, 200, 500, 600);
let polygon1 = new Polygon([300, 300], [400, 150], [400, 300], [350, 350], [300, 400], [250, 200]);

// let image = new Image();
// image.src = "ricknmorty.jpg";
// window.onload = () => {
//     ctx.drawImage(image, 50, 50, 350, 200);
//     ctx.putImageData(imageData, 0,0);
// }

// var imageData = ctx.getImageData(0,0, 250, 200);
// var pix = imageData.data;

// // Loop over each pixel and set a transparent red.
// for (let i = 0, n = pix.length; i < n; i += 4) {
// 	pix[i+3] = 150; // alpha channel
// }
// ctx.putImageData(imageData, 0,0);



//rect1.draw();

rect2.translate(400, 0);
rect1.translate(400, 0);

rect1.scale(1.5);
rect2.scale(1.5);

//rect2.draw();


polygon1.translate(50, 200);
polygon1.rotate(80);
polygon1.scale(.9);
polygon1.draw();
//rect1.draw();

//rect2.rotate(30);
//rect2.draw();

rect1.shearY(-Math.tan(15 * Math.PI / 180));
rect1.shearX(Math.sin(30 * Math.PI / 180))
rect1.shearY(-Math.sin(30 * Math.PI / 180))

//rect1.draw();

let shears = [1, 0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75, -1];
let i = 0;
let inc = 1;






// console.log(Vector.normalize([5, 12, 13]))

function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    i += inc;
    if (i == 8) inc = -1 ;
    if (i == 0) inc = 1;
    rect2.shearY(shears[i]);
    triangle1.rotate(2);
    rect1.rotate(-10);
    triangle2.rotate(5);
    triangle3.rotate(-5);
    polygon1.rotate(10);
    
    polygon1.draw();
    //triangle3.draw();
    //triangle2.draw();
    //triangle1.draw();
    //rect1.draw();
    rect2.draw();

    requestAnimationFrame(animate);
}

let cube1 = new Cube([700, 600, 500], 50);
cube1.draw();


// animate();


