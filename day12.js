var fs = require("fs");

let input = fs.readFileSync(__dirname +"/input.txt").toString().split("\n").filter(x => x);

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.z = z;
        this.y = y;
    }
}

class Moon {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

let moons = [];

for (let i = 0; i < input.length; i++) {
    let coords = input[i].substring(1, input[i].length - 1).split(" ");
    let pos = new Point(0, 0, 0);

    pos.x = Number(coords[0].substring(2, coords[0].length - 1));
    pos.y = Number(coords[1].substring(2, coords[1].length - 1));
    pos.z = Number(coords[2].substring(2));

    moons.push(new Moon(pos, new Point(0, 0, 0)));
}

function makeStep() {
    for (let first = 0; first < moons.length; first++) {
        for (let second = 0; second < moons.length; second++) {
            if (first != second) {
                if (moons[first].position.x > moons[second].position.x) {
                    moons[second].velocity.x++;
                    moons[first].velocity.x--;
                } else if (moons[first].position.x < moons[second].position.x) {
                    moons[first].velocity.x++;
                    moons[second].velocity.x--;
                }

                if (moons[first].position.y > moons[second].position.y) {
                    moons[second].velocity.y++;
                    moons[first].velocity.y--;
                } else if (moons[first].position.y < moons[second].position.y) {
                    moons[first].velocity.y++;
                    moons[second].velocity.y--;
                }

                if (moons[first].position.z > moons[second].position.z) {
                    moons[second].velocity.z++;
                    moons[first].velocity.z--;
                } else if (moons[first].position.z < moons[second].position.z) {
                    moons[first].velocity.z++;
                    moons[second].velocity.z--;
                }
            }
        }
    }

    for (let i = 0; i < moons.length; i++) {
        moons[i].position.x += moons[i].velocity.x / 2;
        moons[i].position.y += moons[i].velocity.y / 2;
        moons[i].position.z += moons[i].velocity.z / 2;
    }
}

function part1() {
    let steps = 1000;

    for (let step = 0; step <= steps; step++) {
        if (steps == step) {
            console.log("step: " + step);
            for (let i = 0; i < moons.length; i++) {
                console.log("pos: " + moons[i].position.x+" "+moons[i].position.y+" "+moons[i].position.z + " vel: " + (moons[i].velocity.x / 2)+" "+(moons[i].velocity.y / 2)+" "+(moons[i].velocity.z / 2));
            }
        }

        if (steps == step) break;

        makeStep();
    }

    let sum = 0;

    for (let i = 0; i < moons.length; i++) {
        let pot = Math.abs(moons[i].position.x) + Math.abs(moons[i].position.y) + Math.abs(moons[i].position.z);
        let kin = Math.abs(moons[i].velocity.x / 2) + Math.abs(moons[i].velocity.y / 2) + Math.abs(moons[i].velocity.z / 2);

        console.log("kin: " + kin + " pot: " + pot);

        sum += kin * pot;
    }

    console.log("total: " + sum);
}

function part2() {
    let xHistory = [];
    let xCycle = 0, xIndex = 0;
    let xFindingCycle = false, xFound = false;

    let yHistory = [];
    let yCycle = 0, yIndex = 0;
    let yFindingCycle = false, yFound = false;

    let zHistory = [];
    let zCycle = 0, zIndex = 0;
    let zFindingCycle = false, zFound = false;

    for (let i = 0; i < 1000000; i++) {
        if  (!xFound) {
            let xValue = moons[0].position.x + "," + moons[1].position.x + "," + moons[2].position.x + "," + moons[3].position.x;
            xHistory.push(xValue);

            if (i > 1) {
                if (xHistory[0] == xValue && !xFindingCycle) {
                    xCycle = i;
                    xIndex = 1;
                    xFindingCycle = true;
                } else if (xFindingCycle) {
                    if (xHistory[xIndex] == xValue) {
                        if (xIndex + 1 == xCycle) {
                            xFound = true;
                            console.log("x: " + xCycle);
                        }

                        xIndex++;
                    } else {
                        if (xHistory[0] == xValue) {
                            xCycle = i;
                            xIndex = 1;
                            xFindingCycle = true;
                        } else {
                            xFindingCycle = false;
                        }
                    }
                }
            }
        }

        if  (!yFound) {
            let yValue = moons[0].position.y + "," + moons[1].position.y + "," + moons[2].position.y + "," + moons[3].position.y;
            yHistory.push(yValue);

            if (i > 1) {
                if (yHistory[0] == yValue && !yFindingCycle) {
                    yCycle = i;
                    yIndex = 1;
                    yFindingCycle = true;
                } else if (yFindingCycle) {
                    if (yHistory[yIndex] == yValue) {
                        if (yIndex + 1 == yCycle) {
                            yFound = true;
                            console.log("y: " + yCycle);
                        }

                        yIndex++;
                    } else {
                        if (yHistory[0] == yValue) {
                            yCycle = i;
                            yIndex = 1;
                            yFindingCycle = true;
                        } else {
                            yFindingCycle = false;
                        }
                    }
                }
            }
        }

        if  (!zFound) {
            let zValue = moons[0].position.z + "," + moons[1].position.z + "," + moons[2].position.z + "," + moons[3].position.z;
            zHistory.push(zValue);

            if (i > 1) {
                if (zHistory[0] == zValue && !zFindingCycle) {
                    zCycle = i;
                    zIndex = 1;
                    zFindingCycle = true;
                } else if (zFindingCycle) {
                    if (zHistory[zIndex] == zValue) {
                        if (zIndex + 1 == zCycle) {
                            zFound = true;
                            console.log("z: " + zCycle);
                        }

                        zIndex++;
                    } else {
                        if (zHistory[0] == zValue) {
                            zCycle = i;
                            zIndex = 1;
                            zFindingCycle = true;
                        } else {
                            zFindingCycle = false;
                        }
                    }
                }
            }
        }

        makeStep();
    }
}