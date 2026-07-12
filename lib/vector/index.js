import { DEG2RAD } from "../constants";

class Vector {
    constructor(vector) {
        /*
            vector => [x, y] (2D)
            vector => [x, y, z] (3D)
        */
        this.vector = vector;
    }

    static dot(v, w) {
        let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * w[i]; return s;
    }

    static rotate(matrix, degree) {
        const rad = degree * DEG2RAD;
        const rotatorMatrix = [
            [Math.cos(rad), Math.sin(rad)],
            [-Math.sin(rad), Math.cos(rad)]
        ]

        let newPoint;
        Object.values(matrix).forEach(point => {
            newPoint = this.dot([Object.values(point)], rotatorMatrix)[0];
            point.x = newPoint[0]
            point.y = newPoint[1]
        })

    }

    static normalize(vector) {
        /*
            vector => [x, y] (2D)
            vector => [x, y, z] (3D)
        */
        let vectorMagnitude = Math.sqrt(
            vector.reduce((sum, dimension) => sum + dimension * dimension, 0)
        );
        return vector
            .map(dimension => dimension / vectorMagnitude);
    }

}

export {
    Vector
}
