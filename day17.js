var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

intcode.input = input;
intcode.execute();

let lines = [""];

for (let i = 0; i < intcode.output.length; i++) {
    if (intcode.output[i] == 35) lines[lines.length - 1] += "#";
    if (intcode.output[i] == 46) lines[lines.length - 1] += ".";
    if (intcode.output[i] == 60) lines[lines.length - 1] += "<";
    if (intcode.output[i] == 62) lines[lines.length - 1] += ">";
    if (intcode.output[i] == 121) lines[lines.length - 1] += "v";
    if (intcode.output[i] == 94) lines[lines.length - 1] += "^";
    if (intcode.output[i] == 10) {console.log(lines[lines.length - 1]);lines.push("");}
}

function part1() {
    let res = 0;

    for (let i = 1; i < lines.length - 1; i++) {
        for (let j = 1; j < lines[i].length - 1; j++) {
            if (lines[i].charAt(j) == "#" && lines[i].charAt(j - 1) == "#" && lines[i].charAt(j + 1) == "#" && lines[i - 1].charAt(j) == "#" && lines[i + 1].charAt(j) == "#") {
                res += i * j;
            }
        }
    }

    console.log(res);
}

class Point {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
    }
}

let pos, direction;

function findPos() {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            switch (lines[i].charAt(j)) {
                case "^": pos = new Point(j, i); direction = 0; break;
                case ">": pos = new Point(j, i); direction = 1; break;
                case "v": pos = new Point(j, i); direction = 2; break;
                case "<": pos = new Point(j, i); direction = 3; break;
            }
        }
    }
}

function nextPos(pos, dir) {
    switch (dir) {
        case 0: return new Point(pos.x, pos.y - 1);
        case 1: return new Point(pos.x + 1, pos.y);
        case 2: return new Point(pos.x, pos.y + 1);
        case 3: return new Point(pos.x - 1, pos.y);
    }
}

function getFacing() {
    switch (direction) {
        case 0: if (pos.y > 0) return lines[pos.y - 1].charAt(pos.x); else return null;
        case 1: if (pos.x < lines[pos.y].length - 1) return lines[pos.y].charAt(pos.x + 1); else return null;
        case 2: if (pos.y < lines.length - 1) return lines[pos.y + 1].charAt(pos.x); else return null;
        case 3: if (pos.x > 0) return lines[pos.y].charAt(pos.x - 1); else return null;
    }
}

findPos();

function nextMove() {
    let steps = 0, startDir = direction, rotated = false;
    let d;

    while (startDir == direction) {
        while (getFacing() == null || getFacing() == "." || getFacing().length == 0) {
            direction++;
            if (direction > 3) direction = 0;

            if (!rotated && (direction - startDir == 2 || direction - startDir == -2)) {direction++; rotated = true;}
            if (direction > 3) direction = 0;
        }

        if (direction == startDir) {
            pos = nextPos(pos, direction);
            steps++;
        } else {
            let change = direction - startDir;
            
            if (change == 2 || change == -2) d = "stop";
            else if ((change > 0 || change == -3) && change != 3) d = "R";
            else d = "L";
        }
    }

    return [steps, d];
}

function count(instr, part) {
    let count = 0;
    let index = 0;

    for (let i = 0; i < instr.length; i++) {
        if (instr[i] == part[index]) {
            index++;

            if (index == part.length) {
                index = 0;
                count++;
            }
        } else {
            index = 0;
        }
    }

    return count;
}

function find(instr, part) {
    let start = 0, index = 0;

    for (let i = 0; i < instr.length; i++) {
        if (instr[i] == part[index]) {
            index++;

            if (index == part.length) return start;
        } else {
            start = i + 1;
            index = 0;
        }
    }

    return -1;
}

function replace(instr, part, obj) {
    let f = find(instr, part);

    while (f != -1) {
        instr.splice(f, part.length, obj);
        f = find(instr, part);
    }
}

let instr = [];

let move = nextMove();
while (move[1] != "stop") {
    if (move[0] != 0)
        instr.push(move[0]);
    instr.push(move[1]);

    move = nextMove();
}
instr.push(move[0]);


let proc = ["L 12 R 8 L 6 R 8 L 6".split(" "), "R 8 L 12 L 12 R 8".split(" "), "L 6 R 6 L 12".split(" ")];

replace(instr, proc[0], "A");
replace(instr, proc[1], "B");
replace(instr, proc[2], "C");

intcode = new Intcode(input);
intcode.memory[0] = 2;

for (let i = 0; i < instr.length; i++) {
    if (instr[i] == "A") intcode.userInput.push(65);
    if (instr[i] == "B") intcode.userInput.push(66);
    if (instr[i] == "C") intcode.userInput.push(67);

    if (i != instr.length -1) intcode.userInput.push(44);
}
intcode.userInput.push(10);

for (let k = 0; k < proc.length; k++) {
    for (let i = 0; i < proc[k].length; i++) {
        if (proc[k][i] == "R") intcode.userInput.push(82);
        else if (proc[k][i] == "L") intcode.userInput.push(76);
        else {
            if (proc[k][i].length == 1)
                intcode.userInput.push(Number(proc[k][i]) + 48);
            else {
                intcode.userInput.push(Number(proc[k][i][0]) + 48);
                intcode.userInput.push(Number(proc[k][i][1]) + 48);
            }
        }

        if (i != proc[k].length -1) intcode.userInput.push(44);
    }
    intcode.userInput.push(10);
}

intcode.userInput.push(121);
intcode.userInput.push(10);

intcode.execute();
console.log(intcode.output[intcode.output.length - 1]);