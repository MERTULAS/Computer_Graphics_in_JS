import { Vector } from "../VectorJS/vector.js";
import { Point, Pixel } from "./point.js";

const DEG2RAD = Math.PI / 180;

class Transform {
    translate(...shifts) {
        this.points.forEach((point, index) => {
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(point.x + shifts[0], point.y + shifts[1], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(point.x + shifts[0], point.y + shifts[1]);
            }
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
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(...rotatedMatrix[0], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(...rotatedMatrix[0]);
            }
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
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(...shiftedMatrix[0], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(...shiftedMatrix[0]);
            }
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
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(...shiftedMatrix[0], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(...shiftedMatrix[0]);
            }
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
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(...shiftedMatrix[0], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(...shiftedMatrix[0]);
            }
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
            if (point instanceof Pixel) {
                this.points[index] = new Pixel(...scaledMatrix[0], point.r, point.g, point.b, point.a);
            } else {
                this.points[index] = new Point(...scaledMatrix[0]);
            }
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

class ImageShape extends Transform {
    constructor(x, y, imageData, w, h) {
        super();
        this.w = w;
        this.h = h;
        this.points = []; // [Pixel]
        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                this.points.push(new Pixel(
                    x + i,
                    y + j,
                    imageData[j * w * 4 + i * 4],
                    imageData[j * w * 4 + i * 4 + 1],
                    imageData[j * w * 4 + i * 4 + 2],
                    imageData[j * w * 4 + i * 4 + 3]
                )
                );
            }
        }
    }

    draw() {
        this.points.forEach(pixel => {
            window.__ctx__.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
            window.__ctx__.fillRect(pixel.x, pixel.y, 1, 1);
        });
    }

    get center() {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this.points.forEach(pixel => {
            minX = Math.min(minX, pixel.x);
            minY = Math.min(minY, pixel.y);
            maxX = Math.max(maxX, pixel.x);
            maxY = Math.max(maxY, pixel.y);
        });

        return new Point((minX + maxX) / 2, (minY + maxY) / 2);
    }
}

export {
    Triangle,
    Rectangle,
    Polygon,
    ImageShape
}
