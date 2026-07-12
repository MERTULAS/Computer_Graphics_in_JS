import { Point, Point3D } from "./point";
import { Vector } from "../vector";
import { Matrix } from "../matrix";
import { DEG2RAD } from "../constants";

class Transform3D {
    projectionTo2D() {
        // TODO: implement perspective projection
        let projectorMatrix = [];
        let projectionResult = [];
        this.projectedPoints = [];

        this.points.forEach(point => {
            let z = 1 / (1.5 - point.z);
            projectorMatrix = [
                [z, 0, 0, 0],
                [0, z, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]
            ];
            projectionResult = Matrix.dot([point.homogeneous], projectorMatrix)[0];
            this.projectedPoints.push(new Point(projectionResult[0], projectionResult[1]));
        });

        // console.log('Original Points:');
        // console.log(this.points);
        // console.log('Projected Points:');
        // console.log(this.projectedPoints);
        // throw new Error("projectionTo2D method is not fully implemented yet");
    }

    translate3D(...shifts) {
        if (shifts.length !== 3) {
            throw new Error("translate3D method requires 3 values for x, y and z axis");
        }

        const pointsLength = this.points.length;
        for (let i = 0; i < pointsLength; i++) {
            const point = this.points[i];
            point.x += shifts[0];
            point.y += shifts[1];
            point.z += shifts[2];
        }

        this.center.x += shifts[0];
        this.center.y += shifts[1];
        this.center.z += shifts[2];
    }

    translate2D(...shifts) {
        // This method is used to translate the projected 2D points after projection
        if (shifts.length !== 2) {
            throw new Error("translate2D method requires 2 values for x and y axis");
        }
        let newPoints = { ...this.projectedPoints };
        Object.keys(newPoints).forEach(key => {
            newPoints[key] = new Point(
                newPoints[key].x + shifts[0],
                newPoints[key].y + shifts[1]
            );
        });
        Object.assign(this.projectedPoints, newPoints);
    }

    rotateX(deg) {
        const rad = deg * DEG2RAD;
        const [cosVal, sinVal] = [Math.cos(rad), Math.sin(rad)];
        const [_, cy, cz] = this.center.asArray;

        let affineRotaterMatrix = [
            [1, 0, 0, 0],
            [0, cosVal, sinVal, 0],
            [0, -sinVal, cosVal, 0],
            [0, -cy * cosVal + cz * sinVal + cy, -cy * sinVal - cz * cosVal + cz, 1]
        ];

        this.#applyPoints(affineRotaterMatrix);
    }

    rotateY(deg) {
        const rad = deg * DEG2RAD;
        const [cosVal, sinVal] = [Math.cos(rad), Math.sin(rad)];
        const [cx, _, cz] = this.center.asArray;

        let affineRotaterMatrix = [
            [cosVal, 0, sinVal, 0],
            [0, 1, 0, 0],
            [-sinVal, 0, cosVal, 0],
            [-cx * cosVal + cz * sinVal + cx, 0, -cx * sinVal - cz * cosVal + cz, 1]
        ]

        this.#applyPoints(affineRotaterMatrix);
    }

    rotateZ(deg) {
        const rad = deg * DEG2RAD;
        const [cosVal, sinVal] = [Math.cos(rad), Math.sin(rad)];
        const [cx, cy, _] = this.center.asArray;

        let affineRotaterMatrix = [
            [cosVal, sinVal, 0, 0],
            [-sinVal, cosVal, 0, 0],
            [0, 0, 1, 0],
            [-cx * cosVal + cy * sinVal + cx, -cx * sinVal - cy * cosVal + cy, 0, 1]
        ]

        this.#applyPoints(affineRotaterMatrix);
    }

    scale(uniformScale) {
        const [cx, cy, cz] = this.center.asArray;
        const [scaleX, scaleY, scaleZ] = [uniformScale, uniformScale, uniformScale];

        let affineScaleMatrix = [
            [scaleX, 0, 0, 0],
            [0, scaleY, 0, 0],
            [0, 0, scaleZ, 0],
            [cx * (1 - scaleX), cy * (1 - scaleY), cz * (1 - scaleZ), 1]
        ];

        this.#applyPoints(affineScaleMatrix);
    }

    normalize() {
        this._normalizedPoints = [];
        this.points.forEach(point => {
            this._normalizedPoints.push(new Point3D(...Vector.normalize(point.asArray)));
        })
    }

    #applyPoints(affineMatrix) {
        const pointsLength = this.points.length;
        for (let i = 0; i < pointsLength; i++) {
            const point = this.points[i];
            const transformedMatrix = Matrix.dot([point.homogeneous], affineMatrix)[0];
            point.x = transformedMatrix[0];
            point.y = transformedMatrix[1];
            point.z = transformedMatrix[2];
        }
    }
}

class Box extends Transform3D {
    /*
          p4-------p3
         / |      /|
        p8-------p7|
        |  p1----|-p2
        | /      |/ 
        p5-------p6 

        cubeCenter => is must be 3 dimension vector. 
        
        scale => size of edges for cube
    */

    #wireframeType = "triangles";
    #size = 0;
    constructor(size) {
        super();
        this.#size = size;
        this.center = new Point3D(0, 0, 0);
        this.points = [
            new Point3D(-.5, .5, -.5),      // p1
            new Point3D(.5, .5, -.5),       // p2
            new Point3D(.5, -.5, -.5),      // p3
            new Point3D(-.5, -.5, -.5),     // p4
            new Point3D(-.5, .5, .5),       // p5
            new Point3D(.5, .5, .5),        // p6
            new Point3D(.5, -.5, .5),       // p7
            new Point3D(-.5, -.5, .5)       // p8
        ];
        this.edges = [
            [0, 1, 2, 3],    // front face
            [4, 5, 6, 7],    // back face
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];
        this.triangles = [
            [0, 1, 2],    // back face
            [0, 2, 3],
            [4, 5, 6],    // front face
            [4, 6, 7],
            [0, 1, 5],    // bottom face
            [0, 5, 4],
            [2, 3, 7],    // top face
            [2, 6, 7],
            [1, 2, 6],    // right face
            [1, 5, 6],
            [0, 3, 7],    // left face
            [0, 4, 7]
        ];
        this.projectedPoints = [];
        this.scale(this.#size);
        console.log(this.points);
    }

    get getCenter() {
        let [xCenter, yCenter, zCenter] = [0, 0, 0];

        this.points.forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
            zCenter += point.z;
        })

        return new Point3D(xCenter / 8, yCenter / 8, zCenter / 8);
    }

    get projectionCenter() {
        let [xCenter, yCenter] = [0, 0];

        Object.values(this.projectedPoints).forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
        })

        return new Point(xCenter / 8, yCenter / 8);
    }

    get size() {
        return this.#size;
    }

    get wireframeType() {
        return this.#wireframeType;
    }

    set wireframeType(type) {
        if (type !== "edges" && type !== "triangles") {
            throw new Error("wireframeType can only be 'edges' or 'triangles'");
        }
        this.#wireframeType = type;
    }
}

export {
    Box
}
