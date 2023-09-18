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

  pc: number = 0;

  halted: boolean = false;
  stopped: boolean = false;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.instructions = new Instructions(this);
    this.opcodes = new OpCodes(this);
    this.registers = new Registers(emit);
    this.memory = new Memory();
  }

  step() {
    const instructionByte = this.memory.readByte(this.pc);
    const opcode = this.opcodes.opcodes[instructionByte];

    if (!opcode?.run) {
      throw new Error(`${instructionByte} not implemented!`);
    }

    this.pc = opcode.run(this.pc);
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
