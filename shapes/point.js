class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    get asArray () {
        return [this.x, this.y];
    }
    
}

class Point3D extends Point {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    get asArray () {
        return [this.x, this.y, this.z];
    }
}

export {
    Point,
    Point3D
}