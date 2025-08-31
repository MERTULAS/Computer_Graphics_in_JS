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
    }

    #calculatePoints (affineMatrix) {
        const pointsLength = this.points.length;
        for (let i = 0; i < pointsLength; i++) {
            const point = this.points[i];
            const scaledMatrix = Matrix.dot([point.homogeneous], affineMatrix)[0];
            point.x = scaledMatrix[0];
            point.y = scaledMatrix[1];
        }
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
        this.center = new Point(x + w / 2, y + h / 2);
    }

    draw() {
        this.points.forEach(pixel => {
            window.__ctx__.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
            window.__ctx__.fillRect(pixel.x, pixel.y, 1, 1);
        });
    }
}

export {
    Triangle,
    Rectangle,
    Polygon,
    ImageShape
}
