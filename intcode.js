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

        this.argumentModes = [];
        this.argumentIndexes = [];
    }

    getArgument(i) {
        return (this.argumentModes[i] == 1) ? this.getArgumentIndex(i) : this.computer.memory[this.getArgumentIndex(i)];
    }

    getArgumentIndex(i) {
        return this.argumentIndexes[i] + ((this.argumentModes[i] == 2) ? this.computer.relativeIndex : 0);
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

        for (let i = 1; i <= 3; i++)
            result.argumentIndexes.push(this.memory[index + i]);

        for (let i = 3; i <= 5; i++)
            result.argumentModes.push(Number(instruction.charAt(instruction.length - i)));

        return result;
    }

    add(instruction) {
        this.memory[instruction.getArgumentIndex(2)] = instruction.getArgument(0) + instruction.getArgument(1);

        return 4;
    }

    multiply(instruction) {
        this.memory[instruction.getArgumentIndex(2)] = instruction.getArgument(0) * instruction.getArgument(1);

        return 4;
    }

    getInput(instruction) {
        this.memory[instruction.getArgumentIndex(0)] = this._userInput[this.inputIndex++];

        return 2;
    }

    writeOutput(instruction) {
        console.log(instruction.getArgument(0));

        this._output.push(instruction.getArgument(0));

        return 2;
    }

    jumpIfTrue(instruction) {
        return (instruction.getArgument(0) != 0) ? instruction.getArgument(1) : instruction.index + 3;
    }

    jumpIfFalse(instruction) {
        return (instruction.getArgument(0) == 0) ? instruction.getArgument(1) : instruction.index + 3;
    }

    lessThan(instruction) {
        this.memory[instruction.getArgumentIndex(2)] = (instruction.getArgument(0) < instruction.getArgument(1)) ? 1 : 0;

        return 4;
    }

    equals(instruction) {
        this.memory[instruction.getArgumentIndex(2)] = (instruction.getArgument(0) == instruction.getArgument(1)) ? 1 : 0;

        return 4;
    }

    setRelativeBase(instruction) {
        this.relativeIndex += instruction.getArgument(0);

        return 2;
    }
}