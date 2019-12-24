const LayerEdge = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

class Layer {
    constructor() {
        this.map = [];
        this.child = null;
        this.parent = null;
        this.depth = 0;

        for (let y = 0; y < 5; y++) {
            this.map[y] = [];
            for (let x = 0; x < 5; x++) {
                this.map[y][x] = 0;
            }
        }
    }

    print(dir) {
        if (this.parent != null && (dir == undefined || dir == 1)) this.parent.print(1);

        console.log("depth: " + this.depth);
        for (let y = 0; y < 5; y++) {
            let line = "";
            for (let x = 0; x < 5; x++) {
                line += (this.map[y][x] == 1) ? "#" : ".";
            }
    
            console.log(line);
        }
    
        console.log(" ");

        if (this.child != null && (dir == undefined || dir == -1)) this.child.print(-1);
    }

    getRating() {
        let res = 0;
    
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (this.map[y][x] == 1) {
                    res += Math.pow(2, y * 5 + x);
                }
            }
        }
    
        return res;
    }

    calculateNext(dir) {
        this.nMap = [];
        
        for (let y = 0; y < 5; y++) {
            this.nMap[y] = [];
            for (let x = 0; x < 5; x++) {
                if (this.map[y][x] == 1 && this.getAdjacent(x, y) != 1) this.nMap[y][x] = 0;
                else if (this.map[y][x] == 0 && (this.getAdjacent(x, y) == 1 || this.getAdjacent(x, y) == 2)) this.nMap[y][x] = 1;
                else this.nMap[y][x] = this.map[y][x];

                if (this.parent == null && this.map[y][x] == 1 && ((x == 0 || x == 4 || y == 0 || y == 4))) { this.parent = new Layer(); this.parent.child = this; this.parent.depth = this.depth - 1; }
                if (this.child == null && this.map[y][x] == 1 && (x == 1 || x == 3 || y == 1 || y == 3)) { this.child = new Layer(); this.child.parent = this; this.child.depth = this.depth + 1; }
            }
        }

        this.nMap[2][2] = 0;
    
        if (dir == 1 && this.parent != null) this.parent.calculateNext(1);
        else if (dir == -1 && this.child != null) this.child.calculateNext(-1);
        else if (dir == undefined) {
            if (this.parent != null) this.parent.calculateNext(1);
            if (this.child != null) this.child.calculateNext(-1);
        }

        return this.nMap;
    }

    update(dir) {
        this.map = this.nMap;

        if (dir == 1 && this.parent != null) this.parent.update(1);
        else if (dir == -1 && this.child != null) this.child.update(-1);
        else if (dir == undefined) {
            if (this.parent != null) this.parent.update(1);
            if (this.child != null) this.child.update(-1);
        }
    }

    getAdjacent(x, y) {
        let res = 0;
    
        if (x > 0 && this.map[y][x - 1] == 1) res++;
        if (x < 4 && this.map[y][x + 1] == 1) res++;
        if (y > 0 && this.map[y - 1][x] == 1) res++;
        if (y < 4 && this.map[y + 1][x] == 1) res++;

        if (this.child != null) {
            if (x == 1 && y == 2) res += this.child.getEgde(LayerEdge.LEFT);
            if (x == 3 && y == 2) res += this.child.getEgde(LayerEdge.RIGHT);
            if (y == 1 && x == 2) res += this.child.getEgde(LayerEdge.TOP);
            if (y == 3 && x == 2) res += this.child.getEgde(LayerEdge.BOTTOM);
        }

        if (this.parent != null) {
            if (x == 0) res += this.parent.map[2][1];
            if (x == 4) res += this.parent.map[2][3];
            if (y == 0) res += this.parent.map[1][2];
            if (y == 4) res += this.parent.map[3][2];
        }
    
        return res;
    }

    getEgde(e) {
        let r = 0;

        switch (e) {
            case LayerEdge.TOP: for (let x = 0; x < 5; x++) r += this.map[0][x]; break;
            case LayerEdge.BOTTOM: for (let x = 0; x < 5; x++) r += this.map[4][x]; break;
            case LayerEdge.LEFT: for (let y = 0; y < 5; y++) r += this.map[y][0]; break;
            case LayerEdge.RIGHT: for (let y = 0; y < 5; y++) r += this.map[y][4]; break;
        }

        return r;
    }

    getAllBugs(dir) {
        let r = 0;

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                r += this.map[y][x];
            }
        }

        if (dir == 1 && this.parent != null) r += this.parent.getAllBugs(1);
        else if (dir == -1 && this.child != null) r += this.child.getAllBugs(-1);
        else if (dir == undefined) {
            if (this.parent != null) r += this.parent.getAllBugs(1);
            if (this.child != null) r += this.child.getAllBugs(-1);
        }

        return r;
    }
}

var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let first = new Layer();

for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
        if (input[y].charAt(x) == "#") first.map[y][x] = 1;
    }
}

for (let i = 0; i < 200; i++) {
    first.calculateNext();
    first.update();
}

console.log(first.getAllBugs());