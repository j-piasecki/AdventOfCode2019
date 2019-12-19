var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

function part1() {
    let a = 0;
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            intcode.input = input;
            intcode.userInput = [x, y];

            intcode.execute();

            if (intcode.output[intcode.output.length - 1] == 1) a++;
        }
    }

    console.log(a);
}

function part2() {
    let x = 200, y = 100;

    while (true) {
        if (inBeam(x, y)) {
            if (inBeam(x - 99, y + 99)) {
                console.log(10000 * (x - 99) + y);
                break;
            } else {
                x++;
            }
        } else {
            y++;
        }

        console.log(x+" "+y);
    }
}

function inBeam(x, y) {
    intcode.input = input;
    intcode.userInput = [x, y];

    intcode.execute();
    return intcode.output[intcode.output.length - 1] == 1;
}

part2();