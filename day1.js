var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let result1 = 0, result2 = 0;

input.forEach((value) => {
    let add = Math.floor(value / 3) - 2;
    result1 += add;
    result2 += add;

    while (Math.floor(add / 3) - 2 > 0) {
        add = Math.floor(add / 3) - 2;
        result2 += add;
    }
});

console.log(result1);
console.log(result2);
