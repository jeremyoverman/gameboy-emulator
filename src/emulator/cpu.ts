import { Emitter } from ".";
import { Instructions } from "./instructions";
import { Memory } from "./memory";
import { OpCodeDefinition, OpCodes } from "./opcodes";
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
    const pc = this.registers.get('pc');

    let instructionByte = this.memory.readByte(pc);
    let opcode: OpCodeDefinition;
    let args = new Uint8Array(0);

    if (instructionByte === 0xcb) {
      instructionByte = this.memory.readByte(pc + 1);
      opcode = this.opcodes.prefixOpcodes[instructionByte];
    } else {
      opcode = this.opcodes.opcodes[instructionByte];
      args = this.memory.readNext(pc, (opcode?.length || 1) - 1)
    }

    if (!opcode) {
      throw new Error(`${instructionByte} not implemented!`);
    }

    const result = opcode.run(pc, args);
    this.registers.set('pc', result != undefined ? result : pc + opcode.length);
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
