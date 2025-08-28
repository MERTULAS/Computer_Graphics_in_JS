const deg2Rad = Math.PI / 180;

class Vector {
    constructor(vector) {
        /*
            vector => [x, y] (2D)
            vector => [x, y, z] (3D)
        */
        this.vector = vector;
    }

    static dot (firstMatrix, secondMatrix) {
        let n = firstMatrix[0].length, m = firstMatrix.length, k = secondMatrix[0].length, l = secondMatrix.length;
        if (n !== l) 
            throw "These matrices have not available sizes for dot multiplication operation. Must be like these => [m x n] . [n x k]";
        
        let resultMatrix = []

        for (let i = 0; i < m; i++) {
            let matrixElement = new Array(k).fill(0);
            for (let j = 0; j < n; j++) {
                for (let p = 0; p < k; p++) {
                    matrixElement[p] += firstMatrix[i][j] * secondMatrix[j][p]
                }
            }
            resultMatrix.push(matrixElement);
        }
        
        return resultMatrix;
    }

    static rotate (matrix, degree) {
        const rotatorMatrix = [
            [Math.cos(degree * deg2Rad), Math.sin(degree * deg2Rad)],
            [-Math.sin(degree * deg2Rad), Math.cos(degree * deg2Rad)]
        ]
        
        let newPoint;
        Object.values(matrix).forEach(point => {
            newPoint =  this.dot([Object.values(point)], rotatorMatrix)[0];
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
