import { Emitter } from ".";
import { Instructions } from "./instructions";
import { Memory } from "./memory";
import { RegisterEventMap, Registers } from "./registers";

export type CPUEventMap = RegisterEventMap;

export class CPU {
  registers: Registers;
  instructions: Instructions;
  memory: Memory;

  pc: number = 0;

  halted: boolean = false;
  stopped: boolean = false;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.registers = new Registers(emit);
    this.instructions = new Instructions(this);
    this.memory = new Memory();
  }

  // step() {
  //   const instructionByte = this.memory.readByte(this.pc);
  // }

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
