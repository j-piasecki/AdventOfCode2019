var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);
let intcode = new Intcode();

for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
        intcode.input = input;
        intcode.execute(a, b);

        if (intcode.output == 19690720)
            console.log(100 * a + b);
    }
}
