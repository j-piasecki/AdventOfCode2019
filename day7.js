var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);

function getOutput(c) {
    for (let i = c.output.length - 1; i >= 0; i--) {
        if (!Number.isNaN(c.output[i])) {
            return c.output[i];
        }
    }
}

function part2() {
    let comA = new Intcode(), comB = new Intcode(), comC = new Intcode(), comD = new Intcode(), comE = new Intcode();

    let res = 0;

    for (let a = 5; a < 10; a++) {
        for (let b = 5; b < 10; b++) {
            if (b == a) continue;

            for (let c = 5; c < 10; c++) {
                if (c == a || c == b) continue;

                for (let d = 5; d < 10; d++) {
                    if (d == a || d == b || d == c) continue;

                    for (let e = 5; e < 10; e++) {
                        if (e == a || e == b || e == c || e == d) continue;
                        let inputA = [0], inputB = [], inputC = [], inputD = [], inputE = [];

                        let prevRes = -1;

                        while (true) {
                            comA.input = comB.input = comC.input = comD.input = comE.input = input;

                            comA.userInput = [a, ...inputA];
                            comA.execute();
                            inputB.push(getOutput(comA));

                            comB.userInput = [b, ...inputB];
                            comB.execute();
                            inputC.push(getOutput(comB));

                            comC.userInput = [c, ...inputC];
                            comC.execute();
                            inputD.push(getOutput(comC));

                            comD.userInput = [d, ...inputD];
                            comD.execute();
                            inputE.push(getOutput(comD));

                            comE.userInput = [e, ...inputE];
                            comE.execute();
                            inputA.push(getOutput(comE));

                            if (getOutput(comE) == prevRes) {
                                if (getOutput(comE) > res) res = getOutput(comE);

                                break;
                            }

                            prevRes = getOutput(comE);
                        }
                    }
                }
            }
        }
    }

    console.log(res);
}

function part1() {
    let intcode = new Intcode();
    let res = 0;

    for (let a = 0; a < 5; a++) {
        intcode.input = input;
        intcode.userInput = [a, 0];
        intcode.execute();

        let outA = intcode.output[0];

        for (let b = 0; b < 5; b++) {
            if (b == a) continue;

            intcode.input = input;
            intcode.userInput = [b, outA];
            intcode.execute();

            let outB = intcode.output[0];

            for (let c = 0; c < 5; c++) {
                if (c == a || c == b) continue;

                intcode.input = input;
                intcode.userInput = [c, outB];
                intcode.execute();
        
                let outC = intcode.output[0];

                for (let d = 0; d < 5; d++) {
                    if (d == a || d == b || d == c) continue;

                    intcode.input = input;
                    intcode.userInput = [d, outC];
                    intcode.execute();
            
                    let outD = intcode.output[0];

                    for (let e = 0; e < 5; e++) {
                        if (e == a || e == b || e == c || e == d) continue;

                        intcode.input = input;
                        intcode.userInput = [e, outD];
                        intcode.execute();
                
                        let outE = intcode.output[0];

                        if (outE > res) {
                            res = outE;
                        }
                    }
                }
            }
        }
    }

    console.log(res);
}

part1();
part2();