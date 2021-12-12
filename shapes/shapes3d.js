import { Point, Point3D } from "./point.js"
import { Vector } from "./../VectorJS/vector.js"

const DEG2RAD = Math.PI / 180;

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


class Transform3D {
    projectionTo2D () {
        let projectorMatrix = [];
        let tempCenter = this.center.asArray;
        let projectionResult;

        Object.keys(this._normalizedPoints).forEach(key => {
            let z = 1 / (1.5 - this._normalizedPoints[key].z);
            projectorMatrix = [
                [z, 0],
                [0, z],
                [0, 0]
            ];
            projectionResult = Vector.dot([ this._normalizedPoints[key].asArray ], projectorMatrix);
            this.projectedPoints[key] = new Point(projectionResult[0][0], projectionResult[0][1]);
        });

        this.scale(this._scale);
        this.translate2D(tempCenter[0], tempCenter[1]);
        
    } 

    translate3D (...shifts) {
        let newPoints = {...this.points};
        Object.keys(newPoints).forEach(key => {
            newPoints[key] = new Point3D(
                newPoints[key].x + shifts[0], 
                newPoints[key].y + shifts[1], 
                newPoints[key].z + shifts[2]
                );
        }); 
        Object.assign(this.points, newPoints);
    }

    translate2D (...shifts) {
        let newPoints = {...this.projectedPoints};
        Object.keys(newPoints).forEach(key => {
            newPoints[key] = new Point(
                newPoints[key].x + shifts[0], 
                newPoints[key].y + shifts[1]
                );
        }); 
        Object.assign(this.projectedPoints, newPoints);
    }

    rotateX (deg) {
        const rad = deg * DEG2RAD;
        const [ cosVal, sinVal ] = [ Math.cos(rad), Math.sin(rad) ];

        let rotaterMatrix = [
            [1, 0, 0],
            [0, cosVal, sinVal],
            [0, -sinVal, cosVal]
        ]

        let rotatedMatrix;
        Object.keys(this._normalizedPoints).forEach(key => {
            rotatedMatrix = Vector.dot([ this._normalizedPoints[key].asArray ], rotaterMatrix);
            this._normalizedPoints[key] = new Point3D(...rotatedMatrix[0]);
        })

    }

    rotateY (deg) {
        const rad = deg * DEG2RAD;
        const [ cosVal, sinVal ] = [ Math.cos(rad), Math.sin(rad) ];

        let rotaterMatrix = [
            [cosVal, 0, sinVal],
            [0, 1, 0],
            [-sinVal, 0, cosVal]
        ]

        let rotatedMatrix;
        Object.keys(this._normalizedPoints).forEach(key => {
            rotatedMatrix = Vector.dot([ this._normalizedPoints[key].asArray ], rotaterMatrix);
            this._normalizedPoints[key] = new Point3D(...rotatedMatrix[0]);
        })
    }

    rotateZ (deg) {
        const rad = deg * DEG2RAD;
        const [ cosVal, sinVal ] = [ Math.cos(rad), Math.sin(rad) ];

        let rotaterMatrix = [
            [cosVal, sinVal, 0],
            [-sinVal, cosVal, 0],
            [0, 0, 1],
        ]

        let rotatedMatrix;
        Object.keys(this._normalizedPoints).forEach(key => {
            rotatedMatrix = Vector.dot([ this._normalizedPoints[key].asArray ], rotaterMatrix);
            this._normalizedPoints[key] = new Point3D(...rotatedMatrix[0]);
        })
    }

    scale (scalarMultiple) {
        let multiplerMatrix = [
            [scalarMultiple, 0],
            [0, scalarMultiple]
        ];

        let scaledMatrix;
        Object.keys(this.projectedPoints).forEach(key =>{
            scaledMatrix = Vector.dot([ this.projectedPoints[key].asArray ], multiplerMatrix);
            this.projectedPoints[key] = new Point(...scaledMatrix[0])
        });
        
    }

    normalize () {
        Object.keys(this.points).forEach(key => {
            this._normalizedPoints[key] = new Point3D (...Vector.normalize(this.points[key].asArray))
        })
    }

}

class Cube extends Transform3D{
    /*
          p4-------p3
         / |      /|
        p8-------p7|
        |  p1----|-p2
        | /      |/ 
        p5-------p6 

        cubeCenter => is must be 3 dimension vector. 
    */
    constructor(cubeCenter, scale) {
        super();
        this._scale = scale;
        this.points = {
            p1 : new Point3D(
                cubeCenter[0] - (this._scale / 2),
                cubeCenter[1] - (this._scale / 2),
                cubeCenter[2] - (this._scale / 2)
                ),
            p2 : new Point3D(
                cubeCenter[0] + (this._scale / 2),
                cubeCenter[1] - (this._scale / 2),
                cubeCenter[2] - (this._scale / 2)
                ),
            p3 : new Point3D(
                cubeCenter[0] + (this._scale / 2),
                cubeCenter[1] + (this._scale / 2),
                cubeCenter[2] - (this._scale / 2)
                ),
            p4 : new Point3D(
                cubeCenter[0] - (this._scale / 2),
                cubeCenter[1] + (this._scale / 2),
                cubeCenter[2] - (this._scale / 2)
                ),
            p5 : new Point3D(
                cubeCenter[0] - (this._scale / 2),
                cubeCenter[1] - (this._scale / 2),
                cubeCenter[2] + (this._scale / 2)
                ),
            p6 : new Point3D(
                cubeCenter[0] + (this._scale / 2),
                cubeCenter[1] - (this._scale / 2),
                cubeCenter[2] + (this._scale / 2)
                ),
            p7 : new Point3D(
                cubeCenter[0] + (this._scale / 2),
                cubeCenter[1] + (this._scale / 2),
                cubeCenter[2] + (this._scale / 2)
                ),
            p8 : new Point3D(
                cubeCenter[0] - (this._scale / 2),
                cubeCenter[1] + (this._scale / 2),
                cubeCenter[2] + (this._scale / 2)
                ),
        };
        this.projectedPoints = {};
        this.center = this.getCenter;
        this._normalizedPoints = {};
        this.translate3D(...this.center.asArray.map(point => -point));
        this.normalize();
    }

    draw () {
        this.projectionTo2D();
        let projectedPointsAsArray = Object.values(this.projectedPoints);
        
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = "yellow";
        for (let i = 0; i < 4; i++) {
                ctx.moveTo(...projectedPointsAsArray[i].asArray);
                ctx.lineTo(...projectedPointsAsArray[(i + 1) % 4].asArray);

                ctx.moveTo(...projectedPointsAsArray[i + 4].asArray);
                ctx.lineTo(...projectedPointsAsArray[((i + 1) % 4) + 4].asArray);
            
                ctx.moveTo(...projectedPointsAsArray[i].asArray);
                ctx.lineTo(...projectedPointsAsArray[i + 4].asArray);
        }
        ctx.stroke();
    }

    get getCenter () {
        let [xCenter, yCenter, zCenter] = [0, 0, 0];

        Object.values(this.points).forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
            zCenter += point.z;
        })

        return new Point3D(xCenter / 8, yCenter / 8, zCenter / 8);
    }

    get projectionCenter () {
        let [xCenter, yCenter] = [0, 0];

        Object.values(this.projectedPoints).forEach(point => {
            xCenter += point.x;
            yCenter += point.y;
        })

        return new Point(xCenter / 8, yCenter / 8);
    }
}


export {
    Cube
}