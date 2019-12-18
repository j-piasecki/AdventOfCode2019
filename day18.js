class Tile {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;

        this.visited = false;
    }

    toString() {
        return "(x: " + this.x + ", y: " + this.y + ")";
    }
}

var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);
let data = [];

let startX = 0, startY = 0, endX = 0, endY = 0, savedX, savedY;
let pos = new Tile(); pos.id = 1;
let keySymbols = [];

function print() {
    for (let y = startY; y <= endY; y++) {
        let line = "";
        for (let x = startX; x <= endX; x++) {
            let a = get(x, y);

            if (x == pos.x && y == pos.y) line += "@";
            else line += a.id;
        }
        console.log(line);
    }
}

function add(x, y, id) {
    if (id == "@") { pos.x = savedX = x; pos.y = savedY = y; id = "." };

    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            data[i].id = id;
            data[i].visited = false;
        
            return;
        }
    }

    let t = new Tile(x, y, id);
    data.push(t);

    if (startX > x) startX = x;
    if (startY > y) startY = y;
    if (endX < x) endX = x;
    if (endY < y) endY = y;

    if (id != "." && id != "#" && id.toLowerCase() == id  && keySymbols.indexOf(id) == -1) {
        keySymbols.push(id);
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

function reset() {
    for (let i = 0; i < data.length; i++) {
        data[i].visited = false;
    }
}

function nextPos(pos, dir) {
    switch (dir) {
        case 1: return new Tile(pos.x, pos.y - 1, dir);
        case 2: return new Tile(pos.x + 1, pos.y, dir);
        case 3: return new Tile(pos.x, pos.y + 1, dir);
        case 4: return new Tile(pos.x - 1, pos.y, dir);
    }
}

function canGo(tile, ignoreDoors) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].x == tile.x && data[i].y == tile.y && data[i].visited) return false;
    }

    if (tile.id == ".") return true;
    if (tile.id == "#") return false;

    if (tile.id.toLowerCase() == tile.id) return true;
    if (tile.id.toUpperCase() == tile.id) 
        if (ignoreDoors == false || ignoreDoors == undefined)
            return false;
        else
            return true;
}

let save = true;
function nextMove(history, ignoreDoors) {
    let dir = 0;
    let nP;
    do {
        dir++;
        nP = nextPos(pos, dir);
        
        if (dir > 4) {
            let last = history.pop();
            if (last == undefined) return -1;

            save = false;
            
            switch (last.id) {
                case 1: return 3;
                case 2: return 4;
                case 3: return 1;
                case 4: return 2;
            }

            break;
        }
    } while (!canGo(get(nP.x, nP.y), ignoreDoors));

    return dir;
}

function getSteps(destX, destY, ignoreDoors) {
    let history = [];
    let availableKeys = [];
    let doorsVisited = [];

    while (true) {
        get(pos.x, pos.y).visited = true;
        save = true;
        let dir = nextMove(history, (destY == 0 && destX == 0) || ignoreDoors);
        if (dir == -1) return availableKeys;

        nP = nextPos(pos, dir);
    
        let tile = get(nP.x, nP.y);
        tile.visited = true;

        if (save) {
            pos.id = dir;
            history.push(pos);
        }
        
        if (tile.id != "." && tile.id != "#" && tile.id.toLowerCase() == tile.id) {
            if (destY == 0 && destX == 0) {
                let f = availableKeys.find(x => { return x[0] == tile.id; } );
                if (f == undefined) availableKeys.push([tile.id, history.length, [...doorsVisited]]);
                else if (f[1] < history.length)  { f[1] = history.length; f[2] = [...doorsVisited];}
            } else if (!ignoreDoors) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id.toLowerCase() == tile.id && data[i] != tile) {
                        data[i].id = ".";
                    }
    
                    data[i].visited = false;
                }
    
                tile.id = ".";
                pos = nP;
    
                return history.length + getSteps(destX, destY);
            }
        } else if (tile.id != "." && tile.id != "#" && tile.id.toUpperCase() == tile.id) {
            if (doorsVisited.indexOf(tile.id) == -1) doorsVisited.push(tile.id);
            else doorsVisited.splice(doorsVisited.indexOf(tile.id), 1);
        }

        if (nP.x == destX && nP.y == destY) {
            return history.length;
        }

        pos = nP;

        /*print();
        console.log(history.length);*/
    }
}

function isReachable(required, collected) {
    if (required.length == 0) return true;
    if (collected.length < required.length) return false;

    for (let i = 0; i < required.length; i++) {
        if (collected.indexOf(required[i].toLowerCase()) == -1) return false;
    }

    return true;
}

function isSubset(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) == -1) return false;
    }

    return true;
}

function findKey(sym) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == sym)
            return data[i];
    }
}

for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
        add(j, i, input[i].charAt(j));
    }
}

distances = [];

console.log("start distance between keys calculation");
for (let i = 0; i < keySymbols.length; i++) {
    for (let j = i + 1; j < keySymbols.length; j++) {
        let start = findKey(keySymbols[i]), end = findKey(keySymbols[j]);

        reset();
        pos.x = start.x;
        pos.y = start.y;

        distances.push([keySymbols[i]+" "+keySymbols[j], getSteps(end.x, end.y, true)]);
    }

    let end = findKey(keySymbols[i]);

    reset();
    pos.x = savedX;
    pos.y = savedY;

    distances.push([keySymbols[i]+" start", getSteps(end.x, end.y, true)]);

    console.log(keySymbols[i] + " (" + i + "/" + keySymbols.length + ") done");
}
console.log("end distance between keys calculation");

let min = Number.MAX_SAFE_INTEGER;
function findPaths(history, remaining) {
    if (remaining.length == 0) {
        let sum = distances.find(x => { return x[0] == history[0] + " start"; })[1];
        for (let i = 0; i < history.length - 1; i++) {
            sum += distances.find(x => { return x[0] == history[i] + " " + history[i + 1] || x[0] == history[i + 1] + " " + history[i]; })[1];
        }

        if (sum < min) {
            console.log(history.join(" ") + " " + sum);
            min = sum;
        }
    }

    for (let i = 0; i < remaining.length; i++) {
        if (isReachable(remaining[i][2], history) && (i == 0 || !isSubset(remaining[i - 1][2], remaining[i][2]))) {
            let newInv = [...history, remaining[i][0]];
            findPaths(newInv, [...remaining.slice(0, i), ...remaining.slice(i + 1, remaining.length)]);
        }
    }
}

pos.x = savedX;
pos.y = savedY;
reset();
findPaths([], getSteps(0, 0));