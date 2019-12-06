var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let data = {};
let orbits = 0;

for (let i = 0; i < input.length; i++) {
    let pair = input[i].split(")");

    data[pair[1]] = pair[0]; 
}

let keys = Object.keys(data);

for (let i = 0; i < keys.length; i++) {
    let current = data[keys[i]];
    let search = true;

    let o = 1;
    
    while (search) {
        search = false;

        for (let j = 0; j < keys.length; j++) {
            if (current == keys[j]) {
                current = data[keys[j]];
                search = true;

                o++;
            }
        }
    }

    orbits += o;
}

console.log(orbits);

function find(obj) {
    for (let j = 0; j < keys.length; j++) {
        if (obj == keys[j]) {
            return data[keys[j]];
        }
    }

    return null;
}

function findOrbiting(obj) {
    let r = [];

    for (let j = 0; j < keys.length; j++) {
        if (obj == data[keys[j]]) {
            r.push(keys[j]);
        }
    }

    return r;
}

function exists(e) {
    let p = Object.keys(paths);
    for (let i = 0; i < p.length; i++) {
        if (p[i] == e) {
            return true;
        }
    }

    return false;
}

let start = find("YOU"), end = find("SAN");
let paths = {};

distance([start], 0);

function distance(node, d) {
    if (node == undefined)
        return;
    
    paths[node] = d;

    if (!exists(data[node])) {
        distance(data[node], d + 1);
    }

    let orbiting = findOrbiting(node);

    for (let i = 0; i < orbiting.length; i++) {
        if (!exists(orbiting[i])) {
            distance(orbiting[i], d + 1);
        }
    }
}

console.log(paths[end]);