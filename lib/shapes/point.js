class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    get asArray () {
        return [this.x, this.y];
    }

    get homogeneous () {
        return [this.x, this.y, 1];
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

class Pixel extends Point {
    constructor(x, y, r, g, b, a) {
        super(x, y);
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
};

export {
    Point,
    Point3D,
    Pixel
}