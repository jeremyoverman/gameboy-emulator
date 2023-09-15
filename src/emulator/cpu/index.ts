import { Emitter } from "..";
import { Instructions } from "./instructions";
import { RegisterEventMap, Registers } from "./registers";

export type CPUEventMap = RegisterEventMap;

export class CPU {
  registers: Registers;
  instructions: Instructions;

  halted: boolean = false;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.registers = new Registers(emit);
    this.instructions = new Instructions(this);
  }

  halt() {
    this.halted = true;
  }
}
