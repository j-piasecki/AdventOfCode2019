var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();
intcode.input = input;

intcode.pushLine("OR A J");
intcode.pushLine("AND B J");
intcode.pushLine("AND C J");
intcode.pushLine("NOT J J");
intcode.pushLine("AND D J");

//part 2 commands
intcode.pushLine("OR E T");
intcode.pushLine("OR H T");
intcode.pushLine("AND T J");
intcode.pushLine("RUN");

intcode.execute();
console.log(intcode.output[intcode.output.length - 1]);