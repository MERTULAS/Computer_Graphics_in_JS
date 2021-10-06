import { Matrix } from "../matrixJS/matrix.js";

const DEG2RAD = Math.PI / 180;

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    get asArray () {
        return [this.x, this.y];
    }
    
}


class Transform {

    rotate (deg) {
        const rotatorMatrix = [
            [Math.cos(deg * DEG2RAD), Math.sin(deg * DEG2RAD)],
            [-Math.sin(deg * DEG2RAD), Math.cos(deg * DEG2RAD)]
        ]
        let rotatedMatrix;

        let tempCenter = this.center.asArray;
        this.translate(-tempCenter[0], -tempCenter[1]);

        let newPoints = {...this};

        Object.keys(newPoints).forEach(key => {
            rotatedMatrix = Matrix.dot([ Object.values(newPoints[key]) ], rotatorMatrix)
            newPoints[key] = new Point(...rotatedMatrix[0]);
        });

        Object.assign(this, newPoints);
        this.translate(tempCenter[0], tempCenter[1]);
    } 

    translate (...shifts) {
        let newPoints = {...this};
        Object.keys(newPoints).forEach(key => {
            newPoints[key] = new Point(newPoints[key].x + shifts[0], newPoints[key].y + shifts[1]);
        });
        Object.assign(this, newPoints);
    }

    shearX (shifter) {
        let shifterMatrix = [
            [1, 0],
            [shifter, 1]];

        let shiftedMatrix;
        let newPoints = {...this};

        let tempCenter = this.center.asArray;

        Object.keys(newPoints).forEach(key => {
            shiftedMatrix = Matrix.dot([ Object.values(newPoints[key]) ], shifterMatrix);
            newPoints[key] = new Point(...shiftedMatrix[0]);
        })
        Object.assign(this, newPoints);
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
        console.log(newPoints);
    }

    shearY (shifter) {
        let shifterMatrix = [
            [1, shifter],
            [0, 1]];

        let shiftedMatrix;
        let newPoints = {...this};

        let tempCenter = this.center.asArray;

        Object.keys(newPoints).forEach(key => {
            shiftedMatrix = Matrix.dot([ Object.values(newPoints[key]) ], shifterMatrix);
            newPoints[key] = new Point(...shiftedMatrix[0]);
        })
        Object.assign(this, newPoints);
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

    shearXY (shifterX, shifterY) {
        let shifterMatrix = [
            [1, shifterY],
            [shifterX, 1]];

        let shiftedMatrix;
        let newPoints = {...this};

        let tempCenter = this.center.asArray;

        Object.keys(newPoints).forEach(key => {
            shiftedMatrix = Matrix.dot([ Object.values(newPoints[key]) ], shifterMatrix);
            newPoints[key] = new Point(...shiftedMatrix[0]);
        })
        Object.assign(this, newPoints);
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

    scale (scalarMultiple) {
        let multiplerMatrix = [
            [scalarMultiple, 0],
            [0, scalarMultiple]
        ];

        let scaledMatrix;
        let newPoints = {...this};

        let tempCenter = this.center.asArray;

        Object.keys(newPoints).forEach(key => {
            scaledMatrix = Matrix.dot([ Object.values(newPoints[key]) ], multiplerMatrix);
            newPoints[key] = new Point(...scaledMatrix[0]);
        })
        Object.assign(this, newPoints);
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

}


class Triangle extends Transform{

    constructor(...args) {
        super();
        /* 
               p1
              .  . 
             .    .
            p3.....p2
        */
        if (args.length !== 6) throw "You must give parameters like a this format => new Triangle(x1, y1, x2, y2, x3, y4)";
        this.p1 = new Point(args[0], args[1]);
        this.p2 = new Point(args[2], args[3]);
        this.p3 = new Point(args[4], args[5]);
    }

    draw () {
        ctx.lineWidth = 6;
        ctx.beginPath();

        ctx.moveTo(...Object.values(this.p1));
        ctx.lineTo(...Object.values(this.p2));
        ctx.lineTo(...Object.values(this.p3));
        ctx.lineTo(...Object.values(this.p1));

        ctx.stroke();
    }

    get center () {
        let xCenter = 0;
        let yCenter = 0;

        Object.values(this).forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
        });

        return new Point(xCenter / 3, yCenter / 3);
    }

}


class Rectangle extends Transform {
    constructor(x, y, w, h) {
        super();
        /* 
            p1.......p2
            .        . 
            .        .
            p3.......p4
        */
        this.p1 = new Point(x, y);
        this.p2 = new Point(x + w, y);
        this.p3 = new Point(x, y + h);
        this.p4 = new Point(x + w, y + h);
    }

    draw () {
        ctx.lineWidth = 6;
        ctx.beginPath();

        ctx.moveTo(...Object.values(this.p1));
        ctx.lineTo(...Object.values(this.p2));
        ctx.lineTo(...Object.values(this.p4));
        ctx.lineTo(...Object.values(this.p3));
        ctx.lineTo(...Object.values(this.p1));

        ctx.stroke();
    }

    get center () {
        let xCenter = 0;
        let yCenter = 0;

        Object.values(this).forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
        });

        return new Point(xCenter / 4, yCenter / 4);
    }

}


export {
    Triangle,
    Rectangle
}
