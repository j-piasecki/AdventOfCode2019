var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let map = [];

for (let y = 0; y < 5; y++) {
    map[y] = [];
    for (let x = 0; x < 5; x++) {
        map[y][x] = (input[y].charAt(x) == "#") ? 1 : 0;
    }
}

function print() {
    for (let y = 0; y < 5; y++) {
        let line = "";
        for (let x = 0; x < 5; x++) {
            line += (map[y][x] == 1) ? "#" : ".";
        }

        console.log(line);
    }

    console.log(" ");
}

function getAdjacent(x, y) {
    let res = 0;

    if (x > 0 && map[y][x - 1] == 1) res++;
    if (x < 4 && map[y][x + 1] == 1) res++;
    if (y > 0 && map[y - 1][x] == 1) res++;
    if (y < 4 && map[y + 1][x] == 1) res++;

    return res;
}

function update() {
    let nMap = [];

    for (let y = 0; y < 5; y++) {
        nMap[y] = [];
        for (let x = 0; x < 5; x++) {
            if (map[y][x] == 1 && getAdjacent(x, y) != 1) nMap[y][x] = 0;
            else if (map[y][x] == 0 && (getAdjacent(x, y) == 1 || getAdjacent(x, y) == 2)) nMap[y][x] = 1;
            else nMap[y][x] = map[y][x];
        }
    }

    map = nMap;
}

function getRating() {
    let res = 0;

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            if (map[y][x] == 1) {
                res += Math.pow(2, y * 5 + x);
            }
        }
    }

    return res;
}

let history = [];
let rating = -1;

do {
    history.push(rating);
    rating = getRating();
    update();
} while (history.indexOf(rating) == -1);

console.log(rating);