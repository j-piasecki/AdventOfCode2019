var fs = require("fs");

let min = 193651, max = 649729;

let pos = 0;

for (let i = min; i <= max; i++) {
    let s = String(i);
    let stop = false;

    let pairs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let first = Number(s[5]);
    for (let j = 4; j >= 0; j--) {
        let current = Number(s[j]);
        if (current > first) {
            stop = true;        
        }

        if (current == first) {
            pairs[current]++;
        }

        first = current;
    }

    if (stop) continue;

    if (pairs.find((e) => { return e == 1; }) == undefined) continue;

    pos++;
}

console.log(pos);