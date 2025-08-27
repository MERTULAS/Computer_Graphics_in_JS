import { Vector } from "../VectorJS/vector.js";
import { Point } from "./point.js";

const DEG2RAD = Math.PI / 180;

class Transform {
    translate(...shifts) {
        this.points.forEach((point, index) => {
            this.points[index] = new Point(point.x + shifts[0], point.y + shifts[1]);
        });
    }

    rotate(deg) {
        const rotatorMatrix = [
            [Math.cos(deg * DEG2RAD), Math.sin(deg * DEG2RAD)],
            [-Math.sin(deg * DEG2RAD), Math.cos(deg * DEG2RAD)]
        ]
        let rotatedMatrix;

        let tempCenter = this.center.asArray;
        this.translate(-tempCenter[0], -tempCenter[1]);

        this.points.forEach((point, index) => {
            rotatedMatrix = Vector.dot([point.asArray], rotatorMatrix);
            this.points[index] = new Point(...rotatedMatrix[0]);
        });

        this.translate(...tempCenter);
    }

    shearX(shifter) {
        let shifterMatrix = [
            [1, 0],
            [shifter, 1]];

        let shiftedMatrix;

        let tempCenter = this.center.asArray;
        this.points.forEach((point, index) => {
            shiftedMatrix = Vector.dot([point.asArray], shifterMatrix);
            this.points[index] = new Point(...shiftedMatrix[0]);
        })
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

    shearY(shifter) {
        let shifterMatrix = [
            [1, shifter],
            [0, 1]];


        let shiftedMatrix;

        let tempCenter = this.center.asArray;
        this.points.forEach((point, index) => {
            shiftedMatrix = Vector.dot([point.asArray], shifterMatrix);
            this.points[index] = new Point(...shiftedMatrix[0]);
        })
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

    shearXY(shifterX, shifterY) {
        let shifterMatrix = [
            [1, shifterY],
            [shifterX, 1]];


        let shiftedMatrix;

        let tempCenter = this.center.asArray;
        this.points.forEach((point, index) => {
            shiftedMatrix = Vector.dot([point.asArray], shifterMatrix);
            this.points[index] = new Point(...shiftedMatrix[0]);
        })
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

    scale(scalarMultiple) {
        let multiplerMatrix = [
            [scalarMultiple, 0],
            [0, scalarMultiple]
        ];

        let scaledMatrix;

        let tempCenter = this.center.asArray;
        this.points.forEach((point, index) => {
            scaledMatrix = Vector.dot([point.asArray], multiplerMatrix);
            this.points[index] = new Point(...scaledMatrix[0]);
        })
        let newCenter = this.center.asArray;
        this.translate(-(newCenter[0] - tempCenter[0]), -(newCenter[1] - tempCenter[1]));
    }

}

class Polygon extends Transform {
    constructor(...points) {
        if (points.length < 3) {
            throw new Error("Polygon needs at least 3 points");
        }
        super();
        this.points = points.map(p => p instanceof Point ? p : new Point(p[0], p[1]));
    }

    draw(fill = false) {
        window.__ctx__.beginPath();
        window.__ctx__.moveTo(...this.points[0].asArray);
        this.points.forEach(point => {
            window.__ctx__.lineTo(...point.asArray);
        })
        window.__ctx__.lineTo(...this.points[0].asArray);

        if (fill) {
            window.__ctx__.fill();
        }

        window.__ctx__.stroke();
    }

    get center() {
        let xCenter = 0;
        let yCenter = 0;

        this.points.forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
        })

        return new Point(xCenter / this.points.length, yCenter / this.points.length);
    }
}

class Triangle extends Polygon {
    constructor(a, b, c) {
        if (arguments.length !== 3) {
            throw new Error("Triangle must have 3 points");
        }
        super(a, b, c);
    }
}

class Rectangle extends Polygon {
    /*
     * p1.......p2
     * .        .
     * p4.......p3
     */
    constructor(x, y, w, h) {
        super([x, y], [x + w, y], [x + w, y + h], [x, y + h]);
    }
}

export {
    Triangle,
    Rectangle,
    Polygon
}
