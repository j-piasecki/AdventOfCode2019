var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString();

let base = [0, 1, 0, -1];

function part2() {
    let skip = Number(input.substring(0, 7));
    let data = [];
    for (let i = 0; i < 10000; i++) for (let j = 0; j < input.length; j++) data.push(Number(input.charAt(j)));

    for (let k = 0; k < 100; k++) {
        let newData = [data[data.length - 1]];
        let sum = newData[0];

        for (let i = data.length - 2; i >= 0; i--) {
            sum += data[i];
            newData.push(Math.abs(sum % 10));
        }

        data = newData.reverse();
    }

    console.log(data.slice(skip, skip + 8).join(""));
}

function part1() {
    for (let k = 0; k < 100; k++) {
        let r = "";
        for (let i = 0; i < input.length; i++) {
            let baseIndex = 1;
            let result = 0;

            for (let j = 0; j < input.length; j++) {
                let index = Math.floor(baseIndex / (i + 1));
                if (index >= base.length) baseIndex = index = 0;

                result += Number(input.charAt(j)) * base[index];

                baseIndex++;
            }

            r += str.charAt(str.length - 1);
        }

        input = r;
    }
    console.log(input.substring(0, 8));
}

part2();