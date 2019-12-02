var fs = require("fs");

for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
        let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);

        input[1] = a;
        input[2] = b;

        let index = 0;
        while (input[index] != 99) {
            let code = input[index];

            if (code == 1) {
                input[input[index + 3]] = input[input[index + 1]] + input[input[index + 2]];
            } else {
                input[input[index + 3]] = input[input[index + 1]] * input[input[index + 2]];
            }

            index += 4;
        }

        if (input[0] == 19690720) {
            console.log(100 * a + b);
        }
    }
}
