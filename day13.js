var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

const Tiletype = {
    Empty: 0,
    Wall: 1,
    Block: 2,
    Horizontal_paddle: 3,
    Ball: 4
};

class Tile {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

let data = [];
let ballX = 0, ballY = 0;
let paddleX = 0, paddleY = 0;

function setTile(x, y, id) {
    if (id == Tiletype.Horizontal_paddle) { paddleX = x; paddleY = y; /*console.log("p: "+x+" "+y);*/}
    if (id == Tiletype.Ball) { ballX = x; ballY = y; /*console.log("b: "+x+" "+y);*/}

    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            data[i].id = id;
            return;
        }
    }

    data.push(new Tile(x, y, id));
}

function part2() {
    intcode.input = input;
    intcode.memory[0] = 2;
    intcode.start();
    let c = 500;
    while (!intcode.halted) {
        for (let i = 0; i < intcode.output.length; i += 3) {
            if (intcode.output[i] == -1 && intcode.output[i + 1] == 0) {
                let count = part1();
                
                if (c > count) {
                    console.log("score: " + intcode.output[i + 2] + " " + count);
                    c = count;
                }

                if (count == 0) { console.log("score: " + intcode.output[i + 2] + " " + count); return;}
            } else {
                setTile(intcode.output[i], intcode.output[i + 1], intcode.output[i + 2]);
            }
        }

        intcode.userInput.push(Math.sign(ballX - paddleX));

        intcode.continue();
    }

    for (let i = 0; i < intcode.output.length; i += 3) {
        if (intcode.output[i] == -1 && intcode.output[i + 1] == 0) {
            console.log("score: " + intcode.output[i + 2]);
        }
    }
}

function part1() {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == Tiletype.Block) {count++;}
    }

    return count;
}

part2();