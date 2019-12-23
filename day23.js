class Packet {
    constructor(addr, x, y) {
        this.address = addr;
        this.x = x;
        this.y = y;
    }
}

var fs = require("fs");
var Intcode = require("./intcode");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split(",").map(Number);

let computers = [];
let packets = [];

for (let i = 0; i < 50; i++) {
    let comp = new Intcode();
    comp.input = input;
    comp.userInput.push(i);
    comp.start();

    computers.push(comp);
}

function isSolved() {
    for (let i = 0; i < packets.length; i++) {
        if (packets[i].address == 255) return packets[i];
    }

    return null;
}

function findNAT() {
    for (let i = packets.length - 1; i >= 0; i--) {
        if (packets[i].address == 255) return packets[i];
    }

    return null;
}

function getPackets(a) {
    let p = [];

    for (let i = 0; i < packets.length; i++) {
        if (packets[i].address == a) p.push(packets[i]);
    }

    return p;
}

function part1() {
    while (!isSolved()) {
        packets = [];

        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < computers[i].output.length; j+=3) {
                let p = new Packet(computers[i].output[j], computers[i].output[j + 1], computers[i].output[j + 2]);

                packets.push(p);
            }

            computers[i]._output = [];
        }

        for (let i = 0; i < 50; i++) {
            let p = getPackets(i);

            if (p.length == 0) {
                computers[i].userInput.push(-1);
            } else {
                for (let j = 0; j < p.length; j++) {
                    computers[i].userInput.push(p[j].x);
                    computers[i].userInput.push(p[j].y);
                }
            }
        }

        for (let i = 0; i < 50; i++) { computers[i].continue(); }
    }

    console.log(isSolved().y);
}

function part2() {
    let lastY = NaN;
    let nat = new Packet(-1, NaN, NaN);

    while (true) {
        if (packets.length == 0 && nat.address != -1) {
            packets.push(new Packet(0, nat.x, nat.y));
        } else {
            packets = [];
        }

        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < computers[i].output.length; j+=3) {
                let p = new Packet(computers[i].output[j], computers[i].output[j + 1], computers[i].output[j + 2]);

                packets.push(p);
            }

            computers[i]._output = [];
        }

        for (let i = 0; i < 50; i++) {
            let p = getPackets(i);

            if (p.length == 0) {
                computers[i].userInput.push(-1);
            } else {
                for (let j = 0; j < p.length; j++) {
                    computers[i].userInput.push(p[j].x);
                    computers[i].userInput.push(p[j].y);
                }
            }
        }

        for (let i = 0; i < 50; i++) { computers[i].continue(); }

        if (findNAT() != null) {
            lastY = nat.y;
            nat = findNAT();
        }

        if (lastY != NaN && lastY == nat.y) {
            console.log(lastY);
            break;
        }
    }
}
