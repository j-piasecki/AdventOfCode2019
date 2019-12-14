class Reaction {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

class Pair {
    constructor(name, count) {
        this.name = name;
        this.count = count;
    }
}

var fs = require("fs");
let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let data = [];

for (let i = 0; i < input.length; i++) {
    let a = input[i].split("=>");

    let result = new Pair(a[1].trim().split(" ")[1], Number(a[1].trim().split(" ")[0]));
    let inp = [];

    let pairs = a[0].trim().split(",");
    for (let j = 0; j < pairs.length; j++) {
        let p = new Pair(pairs[j].trim().split(" ")[1], Number(pairs[j].trim().split(" ")[0]));

        inp.push(p);
    }

    data.push(new Reaction(inp, result));
}

function getReaction(name) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].output.name == name) return data[i];
    }
}

function dependsOn(input, dependency) {
    if (dependency == "ORE") return true;
    if (input == "ORE") return false;

    let react = getReaction(input);

    for (let i = 0; i < react.input.length; i++) {
        if (react.input[i].name == dependency) return true;

        if (dependsOn(react.input[i].name, dependency)) return true;
    }

    return false;
}

function getDependencyCount(table, pair) {
    let r = 0;
    for (let i = 0; i < table.length; i++) {
        if (table[i] != pair) {
            if (dependsOn(pair.name, table[i].name)) r++;
        }
    }
    return r;
}

function addReq(req, name, count) {
    for (let i = 0; i < req.length; i++) {
        if (req[i].name == name) { req[i].count += count; return }
    }

    req.push(new Pair(name, count));
}

function getRequirements(req) {
    if (req.length == 1 && req[0].name == "ORE") return req[0].count;

    let maxDep = 0;
    let index = 0;

    for (let i = 0; i < req.length; i++) {
        let d = getDependencyCount(req, req[i]);

        if (d > maxDep) {
            maxDep = d;
            index = i;
        }
    }

    let reaction = getReaction(req[index].name);
    let multiplier = req[index].count;

    req.splice(index, 1);
    
    for (let i = 0; i < reaction.input.length; i++) {
        addReq(req, reaction.input[i].name, reaction.input[i].count * Math.ceil(multiplier / reaction.output.count));
    }
    
    return getRequirements(req);
}

//part1
console.log(getRequirements([new Pair("FUEL", 1)]));

//part2
let ore = 1000000000000;
let fuel = 1;

while (getRequirements([new Pair("FUEL", fuel)]) <= ore) {
    fuel *= 2;
}

fuel /= 2;
let add = fuel;

while (Math.floor(add) > 0) {
    while (getRequirements([new Pair("FUEL", fuel + add)]) > ore) {
        add /= 2;
    }
    fuel += add;
}

console.log(fuel);