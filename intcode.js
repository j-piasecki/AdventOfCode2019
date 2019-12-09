const Opcode = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
    SET_RELATIVE_BASE: 9,
    HALT: 99
};

class Instruction {
    constructor(computer, index, code) {
        this.computer = computer;
        this.index = index;
        this.opcode = code;

        this.firstArgumentIndex = 0;
        this.secondArgumentIndex = 0;
        this.thirdArgumentIndex = 0;

        this.firstArgumentMode = 0;
        this.secondArgumentMode = 0;
        this.thirdArgumentMode = 0;
    }

    get firstArgument() {
        if (this.firstArgumentMode == 1) {
            return this.firstArgumentIndex;
        } else {
            return this.computer.memory[this.firstArgumentIndex];
        }
    }

    get secondArgument() {
        if (this.secondArgumentMode == 1) {
            return this.secondArgumentIndex;
        } else {
            return this.computer.memory[this.secondArgumentIndex];
        }
    }

    get thirdArgument() {
        if (this.thirdArgumentMode == 1) {
            return this.thirdArgumentIndex;
        } else {
            return this.computer.memory[this.thirdArgumentIndex];
        }
    }
}

module.exports = class IntcodeComputer {
    constructor(input) {
        this.memory = (input == undefined) ? [] : input;

        this._userInput = [];

        this._output = [];
    }

    get output() {
        return this._output;
    }

    set input(value) {
        this.memory = [...value];

        this._output = [];

        for (let i = 0; i < value.length * 1000; i++) {
            this.memory.push(0);
        }
    }

    set userInput(value) {
        this._userInput = [...value];
    }

    execute(noun, verb) {
        let index = 0;

        this._output = [];

        this.inputIndex = 0;
        this.relativeIndex = 0;
        this.memory[1] = (noun == undefined) ? this.memory[1] : noun;
        this.memory[2] = (verb == undefined) ? this.memory[2] : verb;

        while (this.memory[index] != Opcode.HALT) {
            let instruction = this.createInstruction(index);
            //console.log(index);
            switch (instruction.opcode) {
                case Opcode.ADD:
                    index += this.add(instruction);
                    break;

                case Opcode.MULTIPLY:
                    index += this.multiply(instruction);
                    break;

                case Opcode.INPUT:
                    index += this.getInput(instruction);
                    break;

                case Opcode.OUTPUT:
                    index += this.writeOutput(instruction);
                    break;

                case Opcode.JUMP_IF_TRUE:
                    index = this.jumpIfTrue(instruction)
                    break;

                case Opcode.JUMP_IF_FALSE:
                    index = this.jumpIfFalse(instruction)
                    break;

                case Opcode.LESS_THAN:
                    index += this.lessThan(instruction);
                    break;
                    
                case Opcode.EQUALS:
                    index += this.equals(instruction);
                    break;

                case Opcode.SET_RELATIVE_BASE:
                    index += this.setRelativeBase(instruction);
                    break;

                default:
                    console.log("Unknown opcode: " + instruction.opcode + " at index: " + index);
                    return;
            }
        }
    }

    createInstruction(index) {
        let instruction = String(this.memory[index]);

        let result = new Instruction(this, index, Number(instruction.charAt(instruction.length - 2) + instruction.charAt(instruction.length - 1)));

        result.firstArgumentIndex = this.memory[index + 1];
        result.secondArgumentIndex = this.memory[index + 2];
        result.thirdArgumentIndex = this.memory[index + 3];

        result.firstArgumentMode = Number(instruction.charAt(instruction.length - 3));
        result.secondArgumentMode = Number(instruction.charAt(instruction.length - 4));
        result.thirdArgumentMode = Number(instruction.charAt(instruction.length - 5));

        if (result.firstArgumentMode == 2) result.firstArgumentIndex += this.relativeIndex;
        if (result.secondArgumentMode == 2) result.secondArgumentIndex += this.relativeIndex;
        if (result.thirdArgumentMode == 2) result.thirdArgumentIndex += this.relativeIndex;

        return result;
    }

    add(instruction) {
        this.memory[instruction.thirdArgumentIndex] = instruction.firstArgument + instruction.secondArgument;

        return 4;
    }

    multiply(instruction) {
        this.memory[instruction.thirdArgumentIndex] = instruction.firstArgument * instruction.secondArgument;

        return 4;
    }

    getInput(instruction) {
        this.memory[instruction.firstArgumentIndex] = this._userInput[this.inputIndex++];

        return 2;
    }

    writeOutput(instruction) {
        console.log(instruction.firstArgument);

        this._output.push(instruction.firstArgument);

        return 2;
    }

    jumpIfTrue(instruction) {
        return (instruction.firstArgument != 0) ? instruction.secondArgument : instruction.index + 3;
    }

    jumpIfFalse(instruction) {
        return (instruction.firstArgument == 0) ? instruction.secondArgument : instruction.index + 3;
    }

    lessThan(instruction) {
        this.memory[instruction.thirdArgumentIndex] = (instruction.firstArgument < instruction.secondArgument) ? 1 : 0;

        return 4;
    }

    equals(instruction) {
        this.memory[instruction.thirdArgumentIndex] = (instruction.firstArgument == instruction.secondArgument) ? 1 : 0;

        return 4;
    }

    setRelativeBase(instruction) {
        this.relativeIndex += instruction.firstArgument;

        return 2;
    }
}