var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
//let input = "109,1,1202,-1,1,100,4,100,99".split(",").map(Number);
let intcode = new Intcode();

intcode.input = input;
intcode.userInput = [1];
intcode.execute();

intcode.input = input;
intcode.userInput = [2];
intcode.execute();
