class Matrix {

    static dot(firstMatrix, secondMatrix) {
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

}


export { Matrix };
