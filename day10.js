var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let data = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceFrom(p) {
        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) *  (this.y - p.y));
    }
}

function load() {
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x] == undefined) data[x] = [];

            if (input[y].charAt(x) == "#") {
                data[x][y] = 1;
            } else {
                data[x][y] = 0;
            }
        }
    }
}

function nwd(a, b) {
    if (a == 0) return b;
    if (b == 0) return a;
    
	while (Math.abs(a - b) > 0.1) {
		if (a > b)
			a -= b;
		else 
            b -= a;
	}

	return a;
}

function lineOfSight(station, point) {
    if (station.x == point.x && station.y == point.y) return false;

    let changeX = point.x - station.x;
    let changeY = point.y - station.y;

    let nw = nwd(Math.abs(changeX), Math.abs(changeY));
    
    changeY /= nw;
    changeX /= nw;

    let x = station.x + changeX, y = station.y + changeY;

    while (true) {
        if (data[x][y] != 0) {
            if (x == point.x && y == point.y) return true;
            else return false;
        }

        x += changeX;
        y += changeY;
    }
}

function getVisibleCount(station) {
    let res = 0;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x][y] != 0 && lineOfSight(station, new Point(x, y))) {
                res++;
            }
        }
    }

    return res;
}

function getVisibleCount(station) {
    let res = 0;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x][y] != 0 && lineOfSight(station, new Point(x, y))) {
                res++;
            }
        }
    }

    return res;
}

function getVisible(station) {
    let res = [];

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x][y] != 0 && lineOfSight(station, new Point(x, y))) {
                res.push(new Point(x,y));
            }
        }
    }

    return res;
}

function part1() {
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x][y] != 0) {
                data[x][y] = getVisibleCount(new Point(x, y));
            }
        }
    }
    
    let p = new Point(0, 0);
    let res = 0;
    
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (data[x][y] > res) {
                res = data[x][y];
                p.x = x;
                p.y = y;
            }
        }
    }

    return p;
}

function part2() {
    var toDestroy = getVisible(station);
    let index = 0;

    do {
        toDestroy.sort((v1, v2) => {
            return Math.atan2(v2.x - station.x, v2.y - station.y) - Math.atan2(v1.x - station.x, v1.y - station.y);
        });

        for (let i = 0; i < toDestroy.length; i++) {
            console.log((index + 1) + ": " + toDestroy[i].x+" "+toDestroy[i].y);
            data[toDestroy[i].x][toDestroy[i].y] = 0;
            index++;
        }

        toDestroy = getVisible(station);
    } while (toDestroy.length > 0);
}

load();
let station = part1();
load();
part2();
