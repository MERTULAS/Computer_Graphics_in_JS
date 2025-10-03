import { Matrix } from "../matrix";
import { Point, Pixel } from "./point.js";

const DEG2RAD = Math.PI / 180;

class Transform {
    translate(...shifts) {
        if (this instanceof ImageShape) {
            this.center.x += shifts[0];
            this.center.y += shifts[1];
        }

        const pointsLength = this.points.length;

        for (let i = 0; i < pointsLength; i++) {
            const point = this.points[i];
            point.x += shifts[0];
            point.y += shifts[1];
        }
    }

    rotate(deg) {
        const [cx, cy] = this.center.asArray;

        const theta = deg * DEG2RAD;

        const rotatorAffineMatrix = [
            [Math.cos(theta), Math.sin(theta), 0],
            [-Math.sin(theta), Math.cos(theta), 0],
            [-cx * Math.cos(theta) + cy * Math.sin(theta) + cx, -cx * Math.sin(theta) - cy * Math.cos(theta) + cy, 1]
        ]

        this.#calculatePoints(rotatorAffineMatrix);
    }

    shearX(sx) {
        const [_, cy] = this.center.asArray;

        let shearAffineMatrix = [
            [1, 0, 0],
            [sx, 1, 0],
            [-cy * sx, 0, 1]
        ];

        this.#calculatePoints(shearAffineMatrix);
    }

    shearY(sy) {
        const [cx, _] = this.center.asArray;

        let shearAffineMatrix = [
            [1, sy, 0],
            [0, 1, 0],
            [0, -cx * sy, 1]
        ];

        this.#calculatePoints(shearAffineMatrix);
    }

    shearXY(sx, sy) {
        const [cx, cy] = this.center.asArray;

        let shearAffineMatrix = [
            [1, sy, 0],
            [sx, 1, 0],
            [-cy * sx, -cx * sy, 1]
        ];

        this.#calculatePoints(shearAffineMatrix);
    }

    scale(scaleX, scaleY) {
        const [cx, cy] = this.center.asArray;

        let scaleAffineMatrix = [
            [scaleX, 0, 0],
            [0, scaleY, 0],
            [-cx * scaleX + cx, -cy * scaleY + cy, 1]
        ];

        this.#calculatePoints(scaleAffineMatrix);


        if (this instanceof ImageShape) {

            for (let j = 0; j < this.h - 1; ++j) {
                for (let i = 0; i < this.w - 1; ++i) {
                    const point1 = this.points[j * this.w + i];
                    const point2 = this.points[j * this.w + i + 1];
                    const point3 = this.points[(j + 1) * this.w + i];
                    const point4 = this.points[(j + 1) * this.w + i + 1];
                    const firstIntermediatePoints = this.#linearInterpolation(point1, point2, scaleX);
                    const secondIntermediatePoints = this.#linearInterpolation(point3, point4, scaleX);


                    for (let i = 0; i < firstIntermediatePoints.length; i++) {
                        for (const intermediatePoint of this.#linearInterpolation(firstIntermediatePoints[i], secondIntermediatePoints[i], scaleY)) {
                            this.points.push(intermediatePoint);
                        }
                    }
                }
            }
            this.w *= scaleX;
            this.h *= scaleY;
        }

    }

    #calculatePoints(affineMatrix) {
        const pointsLength = this.points.length;
        for (let i = 0; i < pointsLength; i++) {
            const point = this.points[i];
            const scaledMatrix = Matrix.dot([point.homogeneous], affineMatrix)[0];
            point.x = scaledMatrix[0];
            point.y = scaledMatrix[1];
        }
    }

    #linearInterpolation(point1, point2, step) {
        const newPoints = [];
        for (let i = 0; i < step; i++) {
            const denominator = i / step;
            newPoints.push(
                new Pixel(
                    point1.x + (point2.x - point1.x) * denominator,
                    point1.y + (point2.y - point1.y) * denominator,
                    point1.r + (point2.r - point1.r) * denominator,
                    point1.g + (point2.g - point1.g) * denominator,
                    point1.b + (point2.b - point1.b) * denominator,
                    point1.a + (point2.a - point1.a) * denominator
                )
            );
        }
        return newPoints;
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
        for (const point of this.points) {
            window.__ctx__.lineTo(...point.asArray);
        }
        window.__ctx__.lineTo(...this.points[0].asArray);

        if (fill) {
            window.__ctx__.fill();
        }

        window.__ctx__.stroke();
    }

    get center() {
        let xCenter = 0;
        let yCenter = 0;

        for (const point of this.points) {
            xCenter += point.x;
            yCenter += point.y;
        }

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
        this.center = new Point(x + w / 2, y + h / 2);
    }

    draw() {
        for (const pixel of this.points) {
            window.__ctx__.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
            window.__ctx__.fillRect(pixel.x, pixel.y, 1, 1);
        }
    }
}

class Group extends Transform {
    constructor(...shapes) {
        super();
        this.points = shapes.map(shape => shape.points).flat();
        this.shapes = shapes;
    }

    get center() {
        let xCenter = 0;
        let yCenter = 0;

        for (const shape of this.shapes) {
            xCenter += shape.center.x;
            yCenter += shape.center.y;
        }

        return new Point(xCenter / this.shapes.length, yCenter / this.shapes.length);
    }

    addShape(shape) {
        this.shapes.push(shape);
        this.points = this.shapes.map(shape => shape.points).flat();
    }

    draw() {
        for (const shape of this.shapes) {
            shape.draw();
        }
    }
}

export {
    Triangle,
    Rectangle,
    Polygon,
    ImageShape,
    Group
}
