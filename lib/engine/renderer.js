import { Matrix } from "../matrix";
import { Point3D, Point } from "../shapes";

class Renderer {
    constructor(canvas, camera = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = camera;

        this.frameCount = 0;
        this.fps = 0;
        this.lastTime = performance.now();

        this.objects = [];
    }

    #drawEdge(point1, point2) {
        this.ctx.beginPath();
        this.ctx.moveTo(...point1.asArray);
        this.ctx.lineTo(...point2.asArray);
        this.ctx.stroke();
    }

    #draw(object, transformedPoints) {
        let edges = [];

        if (object.wireframeType === "edges") {
            edges = object.edges;
        } else if (object.wireframeType === "triangles") {
            edges = object.triangles;
        }

        for (const edge of edges) {
            for (let i = 0; i < edge.length; i++) {
                const point1 = transformedPoints[edge[i]];
                const point2 = transformedPoints[edge[(i + 1) % edge.length]];
                this.#drawEdge(point1, point2);
            }
        };
    }

    #updateFPS() {
        const now = performance.now();
        this.frameCount++;

        if (now - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }

    #transformToSpace(points, space) {
        if (!space) return points;

        const transformedPoints = [];
        let transformedPoint;

        for (const point of points) {
            const transformedMatrix = Matrix.dot([point.homogeneous], space)[0];
            transformedPoint = new Point3D(transformedMatrix[0], transformedMatrix[1], transformedMatrix[2]);
            transformedPoints.push(transformedPoint);
        }

        return transformedPoints;
    }

    #toScreenTransform(points, space) {
        const transformedPoints = [];
        let transformedPoint;

        for (const point of points) {
            const transformedMatrix = Matrix.dot([point.homogeneous], space)[0];
            transformedPoint = new Point(transformedMatrix[0], transformedMatrix[1]);
            transformedPoints.push(transformedPoint);
        }

        return transformedPoints;
    }

    get screenTransformerMatrix() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        return [
            [1, 0],
            [0, 1],
            [0, 0],
            [width / 2, height / 2]
        ];
    };

    showFPS() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }

    render() {
        const cameraViewMatrix = this.camera ? this.camera.viewTransformerMatrix : null;

        for (const object of this.objects) {
            this.#draw(object, this.#toScreenTransform(
                this.#transformToSpace(
                    object.points,
                    cameraViewMatrix
                ),
                this.screenTransformerMatrix));
        }

        this.#updateFPS();
    }

    addObject(object) {
        this.objects.push(object);
    }
};

export { Renderer };
