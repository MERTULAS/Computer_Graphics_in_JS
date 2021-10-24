import { Point3D } from "./point.js"
import { Vector } from "./../VectorJS/vector.js"

class Transform3D {
    constructor() {
        
    }

}

class Cube extends Transform3D{
    /*
          p6-------p7
         / |      /|
        p2-------p3|
        |  p5----|-p8
        | /      |/ 
        p1-------p4 

        cubeCenter => is must be 3 dimension vector. 
    */
    constructor(cubeCenter, edgeWidth) {
        super();
        this.p1 = new Point3D(
            cubeCenter[0] - (edgeWidth / 2),
            cubeCenter[1] - (edgeWidth / 2),
            cubeCenter[2] + (edgeWidth / 2)
            );
        this.p2 = new Point3D(
            cubeCenter[0] - (edgeWidth / 2),
            cubeCenter[1] + (edgeWidth / 2),
            cubeCenter[2] + (edgeWidth / 2)
            );
        this.p3 = new Point3D(
            cubeCenter[0] + (edgeWidth / 2),
            cubeCenter[1] + (edgeWidth / 2),
            cubeCenter[2] + (edgeWidth / 2)
            );
        this.p4 = new Point3D(
            cubeCenter[0] + (edgeWidth / 2),
            cubeCenter[1] - (edgeWidth / 2),
            cubeCenter[2] + (edgeWidth / 2)
            );
        this.p5 = new Point3D(
            cubeCenter[0] - (edgeWidth / 2),
            cubeCenter[1] - (edgeWidth / 2),
            cubeCenter[2] - (edgeWidth / 2)
            );
        this.p6 = new Point3D(
            cubeCenter[0] - (edgeWidth / 2),
            cubeCenter[1] + (edgeWidth / 2),
            cubeCenter[2] - (edgeWidth / 2)
            );
        this.p7 = new Point3D(
            cubeCenter[0] + (edgeWidth / 2),
            cubeCenter[1] + (edgeWidth / 2),
            cubeCenter[2] - (edgeWidth / 2)
            );
        this.p8 = new Point3D(
            cubeCenter[0] + (edgeWidth / 2),
            cubeCenter[1] - (edgeWidth / 2),
            cubeCenter[2] - (edgeWidth / 2)
            );
    }

    draw () {
        
    }


}


export {
    Cube
}