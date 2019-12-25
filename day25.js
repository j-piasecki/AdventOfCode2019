var fs = require("fs");
var readline = require('readline')
var Intcode = require("./intcode");

let cmd = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();
intcode.input = input;

intcode.start();

getCmd();

function getCmd() {
    cmd.question(getText(), (answer) => {
        intcode.pushLine(answer.trim());
        intcode.continue();

        getCmd();
    });
}

function getText() {
    let r = "";

    for (let i = 0; i < intcode.output.length; i++) {
        r += String.fromCharCode(intcode.output[i]);
    }

    intcode.output = [];

    return r;
}