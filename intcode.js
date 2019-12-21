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

    get userInput() {
        return this._userInput;
    }

    get halted() {
        return this.memory[this.index] == Opcode.HALT;
    }

    pushLine(line) {
        for (let i = 0; i < line.length; i++) {
            this._userInput.push(line.charCodeAt(i));
        }

        this._userInput.push(10);
    }

    execute(noun, verb) {
        this.index = 0;

        this._output = [];

        this.inputIndex = 0;
        this.relativeIndex = 0;
        this.memory[1] = (noun == undefined) ? this.memory[1] : noun;
        this.memory[2] = (verb == undefined) ? this.memory[2] : verb;

        while (!this.halted) {
            let instruction = this.createInstruction(this.index);
            
            let result = this.executeInstruction(instruction);
            if (Number.isNaN(result)) return;
            
            this.index += result;
        }
    }

    start() {
        this.index = 0;
        this._output = [];
        this.inputIndex = 0;
        this.relativeIndex = 0;

        this.continue();
    }

    continue() {
        while (!this.halted) {
            let instruction = this.createInstruction(this.index);
            
            if (instruction.opcode == Opcode.INPUT && this._userInput[this.inputIndex] == undefined)
                break;

            let result = this.executeInstruction(instruction);
            if (Number.isNaN(result)) return;

            this.index += result;
        }
    }

    executeInstruction(instruction) {
        switch (instruction.opcode) {
            case Opcode.ADD:
                return this.add(instruction);

            case Opcode.MULTIPLY:
                return this.multiply(instruction);

            case Opcode.INPUT:
                return this.getInput(instruction);

            case Opcode.OUTPUT:
                return this.writeOutput(instruction);

            case Opcode.JUMP_IF_TRUE:
                return this.jumpIfTrue(instruction)

            case Opcode.JUMP_IF_FALSE:
                return this.jumpIfFalse(instruction)

            case Opcode.LESS_THAN:
                return this.lessThan(instruction);
                
            case Opcode.EQUALS:
                return this.equals(instruction);

            case Opcode.SET_RELATIVE_BASE:
                return this.setRelativeBase(instruction);

            default:
                console.log("Unknown opcode: " + instruction.opcode + " at index: " + instruction.index);
                return NaN;
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
        //console.log(instruction.getArgument(0));

        this._output.push(instruction.getArgument(0));

        return 2;
    }

    jumpIfTrue(instruction) {
        return (instruction.getArgument(0) != 0) ? instruction.getArgument(1) - instruction.index : 3;
    }

    jumpIfFalse(instruction) {
        return (instruction.getArgument(0) == 0) ? instruction.getArgument(1) - instruction.index : 3;
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