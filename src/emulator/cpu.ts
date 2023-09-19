import { Emitter } from ".";
import { Instructions } from "./instructions";
import { Memory } from "./memory";
import { OpCodes } from "./opcodes";
import { RegisterEventMap, Registers } from "./registers";

export type CPUEventMap = RegisterEventMap;

export class CPU {
  registers: Registers;
  instructions: Instructions;
  memory: Memory;
  opcodes: OpCodes;

  halted: boolean = false;
  stopped: boolean = false;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.instructions = new Instructions(this);
    this.opcodes = new OpCodes(this);
    this.registers = new Registers(emit);
    this.memory = new Memory();
  }

  step() {
    let isPrefix = false;
    let instructionByte = this.memory.readByte(this.registers.get('pc'));

    if (instructionByte === 0xcb) {
      isPrefix = true;
      instructionByte = this.memory.readByte(this.registers.get('pc') + 1);
    }

    const opcodeTable = isPrefix ? this.opcodes.cb_opcodes : this.opcodes.opcodes;
    const opcode = opcodeTable[instructionByte];

    if (!opcode) {
      throw new Error(`${instructionByte} not implemented!`);
    }

    // Prefix instructions don't have arguments
    const args = isPrefix ? new Uint8Array(0) : this.memory.readNext(this.registers.get('pc'), opcode.length - 1)
    const result = opcode.run(this.registers.get('pc'), args);

    if (result !== undefined) {
      this.registers.set('pc', result);
    } else {
      this.registers.set('pc', this.registers.get('pc') + opcode.length);
    }
  }

  halt() {
    this.halted = true;
  }

  isHalted() {
    return this.halted;
  }

  stop() {
    this.stopped = true;
  }

  isStopped() {
    return this.stopped;
  }
}
