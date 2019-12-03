class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.steps1 = Number.MAX_SAFE_INTEGER;
        this.steps2 = Number.MAX_SAFE_INTEGER;
    }

    get stepsSum() {
        return this.steps1 + this.steps2;
    }

    distanceFrom(p) {
        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) *  (this.y - p.y));
    }
}

class Line {
    constructor(p1, p2) {
        this.start = p1;
        this.end = p2;
    }

    intersection(line) {
        let x = NaN, y = NaN;

        if (this.start.x == this.end.x) x = this.start.x;
        else if (this.start.y == this.end.y) y = this.start.y;
        
        if (line.start.x == line.end.x) x = line.start.x;
        else if (line.start.y == line.end.y) y = line.start.y;

        let res = new Point(x, y);

        if ((x != 0 || y != 0) && Math.abs(this.start.distanceFrom(this.end) - this.start.distanceFrom(res) - this.end.distanceFrom(res)) < 0.1 &&
            Math.abs(line.start.distanceFrom(line.end) - line.start.distanceFrom(res) - line.end.distanceFrom(res)) < 0.1) {
                return res;
            }

        return null;
    }
}

var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

let first = [], second = [];


for (let i = 0; i < input.length; i++) {
    let steps = input[i].split(",").filter(x => x);

    let prev = new Point(0, 0);

    for (let j = 0; j < steps.length; j++) {
        let direction = steps[j].charAt(0);
        let move = Number(steps[j].substring(1));

        let current = new Point(prev.x, prev.y);

        switch (direction) {
            case "U": current.y += move; break;
            case "D": current.y -= move; break;
            case "R": current.x += move; break;
            case "L": current.x -= move; break;
        }

        if (i == 0)
            first.push(new Line(prev, current));
        else
            second.push(new Line(prev, current));

        prev = current;
    }
}

let closest = Number.MAX_SAFE_INTEGER;
let intersections = [];

for (let i = 0; i < first.length; i++) {
    for (let j = 0; j < second.length; j++) {
        let intersection = first[i].intersection(second[j]);

        if (intersection != null) {
            intersections.push(intersection);
            let distance = Math.abs(intersection.x) + Math.abs(intersection.y);

            if (distance < closest)
                closest = distance;
        }
    }
}

console.log(closest);


for (let i = 0; i < input.length; i++) {
    let steps = input[i].split(",").filter(x => x);

    let current = new Point(0, 0);
    let stepCount = 0;

    for (let j = 0; j < steps.length; j++) {
        let direction = steps[j].charAt(0);
        let move = Number(steps[j].substring(1));

        while (move > 0) {
            switch (direction) {
                case "U": current.y += 1; break;
                case "D": current.y -= 1; break;
                case "R": current.x += 1; break;
                case "L": current.x -= 1; break;
            }

            stepCount++;
            move--;

            for (let k = 0; k < intersections.length; k++) {
                if (intersections[k].x == current.x && intersections[k].y == current.y) {
                    if (i == 0 && intersections[k].steps1 > stepCount) {
                        intersections[k].steps1 = stepCount;
                    } else if (i == 1 && intersections[k].steps2 > stepCount) {
                        intersections[k].steps2 = stepCount;
                    }
                }
            }
        }
    }
}

intersections.sort((a, b) => { return a.stepsSum - b.stepsSum; })

console.log(intersections[0].stepsSum);