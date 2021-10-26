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
        this.translate3D(-tempCenter[0], -tempCenter[1], -tempCenter[2]);

        let projectionResult;
        Object.keys(this.points).forEach(key => {
            let z = 1 / (50 - this.points[key].z)
            projectorMatrix = [
                [z, 0],
                [0, z],
                [0, 0]
            ];
            projectionResult = Vector.dot([ this.points[key].asArray ], projectorMatrix);
            this.projectedPoints[key] = new Point(projectionResult[0][0] * 125, projectionResult[0][1] * 125);
        });

        this.translate3D(...tempCenter);
        this.translate2D(tempCenter[0], tempCenter[1]);
        console.log(this.projectedPoints);
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
            newPoints[key] = new Point3D(
                newPoints[key].x + shifts[0], 
                newPoints[key].y + shifts[1]
                );
        }); 
        Object.assign(this.projectedPoints, newPoints);
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
    constructor(cubeCenter, edgeWidth) {
        super();
        this.cubeCenter = new Point3D(...cubeCenter);
        this.perspectiveZ = 1;
        this.points = {
            p1 : new Point3D(
                cubeCenter[0] - (edgeWidth / 2),
                cubeCenter[1] - (edgeWidth / 2),
                cubeCenter[2] - (edgeWidth / 2)
                ),
            p2 : new Point3D(
                cubeCenter[0] + (edgeWidth / 2),
                cubeCenter[1] - (edgeWidth / 2),
                cubeCenter[2] - (edgeWidth / 2)
                ),
            p3 : new Point3D(
                cubeCenter[0] + (edgeWidth / 2),
                cubeCenter[1] + (edgeWidth / 2),
                cubeCenter[2] - (edgeWidth / 2)
                ),
            p4 : new Point3D(
                cubeCenter[0] - (edgeWidth / 2),
                cubeCenter[1] + (edgeWidth / 2),
                cubeCenter[2] - (edgeWidth / 2)
                ),
            p5 : new Point3D(
                cubeCenter[0] - (edgeWidth / 2),
                cubeCenter[1] - (edgeWidth / 2),
                cubeCenter[2] + (edgeWidth / 2)
                ),
            p6 : new Point3D(
                cubeCenter[0] + (edgeWidth / 2),
                cubeCenter[1] - (edgeWidth / 2),
                cubeCenter[2] + (edgeWidth / 2)
                ),
            p7 : new Point3D(
                cubeCenter[0] + (edgeWidth / 2),
                cubeCenter[1] + (edgeWidth / 2),
                cubeCenter[2] + (edgeWidth / 2)
                ),
            p8 : new Point3D(
                cubeCenter[0] - (edgeWidth / 2),
                cubeCenter[1] + (edgeWidth / 2),
                cubeCenter[2] + (edgeWidth / 2)
                ),
        };
        this.projectedPoints = {};
        Object.keys(this.points).forEach(point => {
            this.projectedPoints[point] = new Point(this.points[point].x, this.points[point].y);
        });
    }

    draw () {
        this.projectionTo2D();
        let projectedPointsAsArray = Object.values(this.projectedPoints);
        console.log(projectedPointsAsArray);
        ctx.beginPath();
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

    get center () {
        return this.cubeCenter;
    }


}


export {
    Cube
}