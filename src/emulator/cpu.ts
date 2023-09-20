import { Emitter } from ".";
import { Graphics } from "./graphics";
import { Instructions } from "./instructions";
import { Memory } from "./memory";
import { OpCodeDefinition, OpCodes } from "./opcodes";
import { Registers } from "./registers";

export type CPUEventMap = {
  vblank: () => void;
  pause: () => void;
  resume: () => void;
}

export class CPU {
  // Emulator
  emit: Emitter<keyof CPUEventMap>;
  paused: boolean = true;

  // Targets
  targetFps: number = 60;
  targetCyclesPerSecond: number = 4194304;
  targetCyclesPerFrame: number = 0;

  // Intervals
  vblankClockInterval: NodeJS.Timeout | undefined;

  // Components
  graphics: Graphics;
  registers: Registers;
  instructions: Instructions;
  memory: Memory;
  opcodes: OpCodes;

  // Counters
  cycles: number = 0;
  scanlineCycles: number = 0;

  // CPU Control flags
  halted: boolean = false;
  stopped: boolean = false;

  // Interrupt flags
  interrupMasterEnabled: boolean = true;
  interruptEnable: boolean = false;

  constructor(emit: Emitter<keyof CPUEventMap>) {
    this.emit = emit;
    this.instructions = new Instructions(this);
    this.opcodes = new OpCodes(this);
    this.registers = new Registers();
    this.memory = new Memory();
    this.graphics = new Graphics(this);

    this.setCyclesPerFrame();
  }

  interrupt() {
    this.interruptEnable = true;
  }

  private addCycles(cycles: number) {
    this.cycles += cycles;
    this.scanlineCycles += cycles;
  }

  private setCyclesPerFrame() {
    this.targetCyclesPerFrame = this.targetCyclesPerSecond / this.targetFps;
  }

  pause() {
    if (this.vblankClockInterval) {
      clearInterval(this.vblankClockInterval)
      this.paused = true;
      this.emit('pause')
    } else {
      throw new Error('No vblank clock interval to pause!')
    }
  }

  resume() {
    this.vblankClock();
    this.paused = false;
    this.emit('resume')
  }

  vblankClock() {
    this.vblankClockInterval = setInterval(() => {
      try {
        this.memory.setInterruptFlag('vblank', true);
        this.executeFrame();
        this.emit('vblank');
      } catch (e) {
        console.error(e);
        this.pause();
      }
    }, 1000 / this.targetFps);
  }

  executeFrame() {
    this.cycles = 0;
    while (this.cycles < this.targetCyclesPerFrame) {
      if (this.paused) {
        break;
      }
      this.step();
    }
  }

  step() {
    const pc = this.registers.get('pc');

    if (this.scanlineCycles >= 456) {
      this.scanlineCycles -= 456;
      this.graphics.renderScanline();
    }

    // 2. If the IME flag is set & the corresponding IE flag
    // is set, the following 3 steps are performed.
    // 3. Reset the IME flag and prevent all interrupts.
    // 4. The PC (program counter) is pushed onto the stack.
    // 5. Jump to the starting address of the interrupt.

    // if (this.interrupMasterEnabled && this.interruptEnable) {
    //   this.setIME(false);
    //   this.instructions.push('pc');
    // }

    let instructionByte = this.memory.readByte(pc);

    if (instructionByte === undefined) {
      throw new Error(`Instruction byte at ${pc} is undefined!`);
    }

    let opcode: OpCodeDefinition;
    let args = new Uint8Array(0);

    if (instructionByte === 0xcb) {
      instructionByte = this.memory.readByte(pc + 1);
      opcode = this.opcodes.prefixOpcodes[instructionByte];
    } else {
      opcode = this.opcodes.opcodes[instructionByte];
      const bytes = opcode?.length !== undefined ? opcode.length : 1;
      args = this.memory.readBytes(pc + 1, bytes - 1)
    }

    if (!opcode) {
      throw new Error(`${instructionByte} not implemented!`);
    }

    this.registers.set('pc', pc + opcode.length);
    const result = opcode.run(pc, args);

    if (Array.isArray(opcode.cycles)) {
      // If the instruction took a branch, we need to add the
      // extra cycles to the total. The only opcodes that have
      // multiple cycles are branches.
      if (result !== undefined) {
        this.addCycles(opcode.cycles[1])
      } else {
        this.addCycles(opcode.cycles[0])
      }
    } else {
      this.addCycles(opcode.cycles)
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

  setIME(enabled: boolean) {
    this.interrupMasterEnabled = enabled;
  }
}
