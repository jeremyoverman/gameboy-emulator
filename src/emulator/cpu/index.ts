import { Emitter } from "..";
import { RegisterEventMap, Registers } from "./registers";

export type CPUEventMap = RegisterEventMap;

export class CPU {
  registers: Registers;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.registers = new Registers(emit);
  }
}
