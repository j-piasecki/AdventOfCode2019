var fs = require("fs");

let min = 193651, max = 649729;

let r1 = 0, r2 = 0;

for (let i = min; i <= max; i++) {
    let s = Array.from(String(i)).map(Number);
    let sorted = [...s].sort((a, b) => { return a - b; });

    if (s.join("") == sorted.join("")) {
        let pairs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let j = 0; j < 5; j++) {
            if (s[j] == s[j + 1]) pairs[s[j]]++;
        }

        if (pairs.find((e) => { return e >= 1; }) != undefined) r1++;
        if (pairs.find((e) => { return e == 1; }) != undefined) r2++;
    }
}

console.log(r1);
console.log(r2);