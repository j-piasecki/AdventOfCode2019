const Opcode = {
    ADD: 1,
    MULTIPLY: 2,
    HALT: 99
};

module.exports = class IntcodeComputer {
    constructor(input) {
        this.memory = (input == undefined) ? [] : input;
    }

    get output() {
        return this.memory[0];
    }

    set input(value) {
        this.memory = [...value];
    }

    execute(noun, verb) {
        let index = 0;

        this.memory[1] = (noun == undefined) ? this.memory[1] : noun;
        this.memory[2] = (verb == undefined) ? this.memory[2] : verb;

        while (this.memory[index] != Opcode.HALT) {
            switch (this.memory[index]) {
                case Opcode.ADD:
                    index += this.add(this.memory[index + 1], this.memory[index + 2], this.memory[index + 3]);
                    break;

                case Opcode.MULTIPLY:
                    index += this.multiply(this.memory[index + 1], this.memory[index + 2], this.memory[index + 3]);
                    break;

                default:
                    console.log("Unknown opcode: " + this.memory[index]);
                    return;
            }
        }
    }

    add(first, second, output) {
        this.memory[output] = this.memory[first] + this.memory[second];

        return 4;
    }

    multiply(first, second, output) {
        this.memory[output] = this.memory[first] * this.memory[second];

        return 4;
    }
}