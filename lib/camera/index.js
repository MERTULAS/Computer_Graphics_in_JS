import { Point3D } from "../shapes/point.js";

class Camera {
    constructor(...position) {
        // TODO: implement target, up vector, view matrix, projection matrix
        if ( !(position.length === 1 && position[0] instanceof Point3D) && position.length !== 3) {
            throw new Error(`Camera constructor requires either a Point3D instance or 3 values for position;
                Point3D instance example: new Camera(new Point3D(x, y, z));
                3 values example: new Camera(x, y, z)`);
        }
        this.position = position.length === 1 ? position[0] : new Point3D(...position);
    }

    move(...shifts) {
        if (shifts.length !== 3) {
            throw new Error("move method requires 3 values for x, y and z axis");
        }
        this.position.x += shifts[0];
        this.position.y += shifts[1];
        this.position.z += shifts[2];
    }

    get viewTransformerMatrix() {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [-this.position.x, -this.position.y, -this.position.z, 1]
        ];
    }
}

export { Camera };