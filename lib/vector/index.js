const deg2Rad = Math.PI / 180;

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
        const rotatorMatrix = [
            [Math.cos(degree * deg2Rad), Math.sin(degree * deg2Rad)],
            [-Math.sin(degree * deg2Rad), Math.cos(degree * deg2Rad)]
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
        let vectorMagnitude = vector
            .reduce((dim1, dim2) => Math.sqrt(dim1 * dim1 + dim2 * dim2));
        return vector
            .map(dimension => dimension / vectorMagnitude);
    }

}

export {
    Vector
}
