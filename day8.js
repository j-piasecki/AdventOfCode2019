var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().trim();

let width = 25, height = 6;
/*let data = [];

for (let i = 0; i < input.length; i++) {
    let layer = Math.floor(i / (width * height));
    let x = i % width;
    let y = Math.floor(i / width);

    if (data[layer] == undefined) {
        data[layer] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    data[layer][Number(input.charAt(i))]++;
}

let min = Number.MAX_SAFE_INTEGER;
let index = -1;



for (let i = 0; i < data.length; i++) {
    //console.log(data[i]);
    if (data[i][0] < min) {
        min = data[i][0];
        index = i;
    }
}

console.log((data[index][1] * data[index][2])+" "+index);*/

let data = [];
for (let i = 0; i < input.length; i++) {
    let layer = Math.floor(i / (width * height));
    let x = i % width;
    let y = Math.floor((i - layer * width * height) / width);

    if (data[x] == undefined) {
        data[x] = [];

        for (let j = 0; j < height; j++) {
            data[x][j] = 2;
        }
    }

    if (data[x][y] == 2)
        data[x][y] = Number(input.charAt(i));
}

for (let y = 0; y < height; y++) {
    let line = "";

    for (let x = 0; x < width; x++) {
        if (data[x][y] == 1)
            line += "O";
        else
            line += " ";
    }

    console.log(line);
}