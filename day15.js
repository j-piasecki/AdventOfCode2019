class Tile {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;

        this.hasOxygen = false;
    }
}

var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

intcode.input = input;
intcode.start();

let data = [];

function nextPos(pos, dir) {
    switch (dir) {
        case 1: return new Tile(pos.x, pos.y - 1, pos.id);
        case 2: return new Tile(pos.x, pos.y + 1, pos.id);
        case 3: return new Tile(pos.x + 1, pos.y, pos.id);
        case 4: return new Tile(pos.x - 1, pos.y, pos.id);
    }
}

let startX = 0, startY = 0, endX = 0, endY = 0;

function add(x, y, type) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            data[i].id = type;

            if (type == 2) data[i].hasOxygen = true;
            return;
        }
    }

    let t = new Tile(x, y, type);
    if (type == 2) t.hasOxygen = true;
    data.push(t);

    if (startX > x) startX = x;
    if (startY > y) startY = y;
    if (endX < x) endX = x;
    if (endY < y) endY = y;
}

function print() {
    for (let y = startY; y <= endY; y++) {
        let line = "";
        for (let x = startX; x <= endX; x++) {
            let a = get(x, y);

            if (x == 0 && y == 0) line += "S";
            else if (a == null) line += " ";
            else if (a.hasOxygen) line += "O";
            else switch (a.id) {
                case 0: line += "."; break;
                case 1: line += "#"; break;
            }
        }
        console.log(line);
    }
}

function get(x, y) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            return data[i];
        }
    }

    return null;
}


let history = [];
let pos = new Tile(0, 0, -1), lastDir = 0, save = true;
add(pos.x, pos.y, 0);

function nextMove() {
    let dir = 0;
    let nP;
    do {
        dir++;
        nP = nextPos(pos, dir);

        if (dir > 4) {
            let last = history.pop();
            save = false;

            switch (last.id) {
                case 1: return 2;
                case 2: return 1;
                case 3: return 4;
                case 4: return 3;
            }

            break;
        }
    } while (get(nP.x, nP.y) != null);

    return dir;
}

while (true) {
    save = true;
    lastDir = nextMove();

    intcode.userInput.push(lastDir);
    intcode.continue();

    let result = intcode.output[intcode.output.length - 1];

    let nP = nextPos(pos, lastDir);
    if (nP.x == 0 && nP.y == 0) break;

    if (result == 1) {
        add(nP.x, nP.y, 0);

        if (save) {
            pos.id = lastDir;
            history.push(pos);
        }

        pos = nP;
    } else if (result == 0) {
        add(nP.x, nP.y, 1);
    } else {
        add(nP.x, nP.y, 2);
        
        if (save) {
            pos.id = lastDir;
            history.push(pos);
        }

        pos = nP;

        console.log("part 1: " + history.length);
    }
}

let steps = 0;
function step() {
    let toUpdate = [];

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            let a = get(x, y);

            if (a != null && a.hasOxygen) {
                if (get(x, y - 1).id == 0 && !get(x, y - 1).hasOxygen) toUpdate.push(get(x, y - 1));
                if (get(x, y + 1).id == 0 && !get(x, y + 1).hasOxygen) toUpdate.push(get(x, y + 1));
                if (get(x - 1, y).id == 0 && !get(x - 1, y).hasOxygen) toUpdate.push(get(x - 1, y));
                if (get(x + 1, y).id == 0 && !get(x + 1, y).hasOxygen) toUpdate.push(get(x + 1, y));
            }
        }
    }

    if (toUpdate.length == 0) {
        console.log("part 2: " + steps);
    } else {
        toUpdate.forEach(x => { x.hasOxygen = true; });
        steps++;

        step();
    }
}

step();