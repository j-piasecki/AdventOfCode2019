var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

class Block {
    constructor(x,y,color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

let data = [];
let painted = 0;

function paint(x, y, color) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            data[i].color = color;
            
            return;
        }
    }

    painted++;
    data.push(new Block(x, y, color));
}

function getColor(x, y) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].x == x && data[i].y == y) {
            return data[i].color;
        }
    }

    return 0;
}

function part1() {
    intcode.input = input;
    intcode.start();
    let posX = 0, posY = 0, direction = 0; //0-up, 1-right, 2-down, 3-left

    while (!intcode.halted) {
        let currentColor = getColor(posX, posY);
        intcode.userInput.push(currentColor);
        intcode.continue();

        paint(posX, posY, intcode.output[intcode.output.length - 2]);
        let rotation = intcode.output[intcode.output.length - 1];
        
        direction += rotation * 2 - 1;
        if (direction < 0) direction += 4;
        if (direction >= 4) direction -= 4;

        switch (direction) {
            case 0: posY--; break;
            case 1: posX++; break;
            case 2: posY++; break;
            case 3: posX--; break;
        }
    }

    console.log(painted);
}

function part2() {
    intcode.input = input;
    intcode.start();
    let posX = 0, posY = 0, direction = 0; //0-up, 1-right, 2-down, 3-left

    data.push(new Block(0, 0, 1));

    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    while (!intcode.halted) {
        let currentColor = getColor(posX, posY);
        intcode.userInput.push(currentColor);
        intcode.continue();

        paint(posX, posY, intcode.output[intcode.output.length - 2]);
        let rotation = intcode.output[intcode.output.length - 1];
        
        if (posX > maxX) maxX = posX;
        if (posX < minX) minX = posX;
        if (posY > maxY) maxY = posY;
        if (posY < minY) minY = posY;

        direction += rotation * 2 - 1;
        if (direction < 0) direction += 4;
        if (direction >= 4) direction -= 4;

        switch (direction) {
            case 0: posY--; break;
            case 1: posX++; break;
            case 2: posY++; break;
            case 3: posX--; break;
        }
    }

    for (let y = minY; y <= maxY; y++) {
        let line = "";

        for (let x = minX; x <= maxX; x++) {
            let m = getColor(x, y);
            line += (m == 1) ? "X" : " ";
        }

        console.log(line+" ");
    }
}

part2();
