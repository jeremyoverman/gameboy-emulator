import { Emitter, EventMap } from '.'
import { INTERRUPTS, INTERRUPT_PRIORITY } from './constants'
import { Graphics } from './graphics'
import { Instructions } from './instructions'
import { Memory } from './memory'
import { OpCodes } from './opcodes'
import { Registers } from './registers'
import { OpCodeDefinition } from './types/cpu'
import { CPUEventMap } from './types/events'
import { Interrupt } from './types/memory'

export class CPU {
  // Emulator
  emit: Emitter<keyof CPUEventMap>
  paused: boolean = true

  // Targets
  targetFps: number = 60
  targetCyclesPerSecond: number = 4194304
  targetCyclesPerFrame: number = 0

  // Intervals
  vblankClockInterval: NodeJS.Timeout | undefined

  // Components
  graphics: Graphics
  registers: Registers
  instructions: Instructions
  memory: Memory
  opcodes: OpCodes

  // Counters
  cycles: number = 0
  scanlineCycles: number = 0

  // CPU Control flags
  halted: boolean = false
  stopped: boolean = false

  // Interrupt flags
  interrupMasterEnabled: boolean = true
  interruptEnable: boolean = false

  constructor(emit: Emitter<keyof EventMap>) {
    this.emit = emit
    this.instructions = new Instructions(this)
    this.opcodes = new OpCodes(this)
    this.registers = new Registers()
    this.memory = new Memory()
    this.graphics = new Graphics(this, emit)

    this.setCyclesPerFrame()
  }

  interrupt(interrupt: Interrupt) {
    this.memory.setInterruptFlag(interrupt, true)
  }

  private addCycles(cycles: number) {
    this.cycles += cycles
    this.scanlineCycles += cycles
  }

  private setCyclesPerFrame() {
    this.targetCyclesPerFrame = this.targetCyclesPerSecond / this.targetFps
  }

  pause() {
    if (this.vblankClockInterval) {
      clearInterval(this.vblankClockInterval)
      this.paused = true
      this.emit('pause')
    } else {
      throw new Error('No vblank clock interval to pause!')
    }
  }

  resume() {
    this.vblankClock()
    this.paused = false
    this.emit('resume')
  }

  vblankClock() {
    this.vblankClockInterval = setInterval(() => {
      try {
        this.memory.setInterruptFlag('vblank', true)
        this.executeFrame()
        this.emit('vblank')
        this.graphics.render()
      } catch (e) {
        console.log('error executing frame', this.registers.get('pc').toString(16))
        this.pause()
      }
    }, 1000 / this.targetFps)
  }

  executeFrame() {
    this.cycles = 0
    while (this.cycles < this.targetCyclesPerFrame) {
      if (this.paused) {
        break
      }
      this.step()
    }
  }

  handleInterrupt() {
    if (!this.interrupMasterEnabled) {
      return
    }

    let jumpAddress: number | undefined

    INTERRUPT_PRIORITY.some((interrupt) => {
      if (this.memory.getInterruptFlag(interrupt)) {
        this.memory.setInterruptFlag(interrupt, false)
        jumpAddress = INTERRUPTS[interrupt].jump
        return true
      }
    })

    return jumpAddress
  }

  step() {
    const pc = this.registers.get('pc')
    this.memory.incDivider()

    if (this.scanlineCycles >= 456) {
      this.scanlineCycles -= 456
      this.graphics.incrementScanline()
    }

    let opcode: OpCodeDefinition
    let args = new Uint8Array(0)

    let instructionByte = this.memory.readByte(pc)
    const interruptJumpAddress = this.handleInterrupt()

    if (interruptJumpAddress !== undefined) {
      instructionByte = 0xcd // CALL a16
      opcode = this.opcodes.opcodes[instructionByte]
      args = new Uint8Array([interruptJumpAddress & 0xff, (interruptJumpAddress >> 8) & 0xff])
    } else if (instructionByte === 0xcb) {
      instructionByte = this.memory.readByte((pc + 1) & 0xffff)
      opcode = this.opcodes.prefixOpcodes[instructionByte]
    } else {
      opcode = this.opcodes.opcodes[instructionByte]
      const bytes = opcode?.length !== undefined ? opcode.length : 1
      // TODO: This won't handle wrapping
      args = this.memory.readBytes((pc + 1) & 0xffff, bytes - 1)
    }

    if (!opcode) {
      throw new Error(`Unknown opcode ${instructionByte.toString(16)} at ${pc.toString(16)}`)
    }

    if (interruptJumpAddress === undefined) {
      this.registers.set('pc', pc + opcode.length)
    }

    let result: number | void
    const originalPc = pc

    try {
      result = opcode.run(pc, args)
    } catch (e) {
      console.error(
        'Failed running opcode',
        originalPc.toString(16),
        opcode,
        [...args].map((v) => v.toString(16)),
        e
      )
      throw e
    }

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
    this.halted = true
  }

  isHalted() {
    return this.halted
  }

  stop() {
    this.stopped = true
  }

  isStopped() {
    return this.stopped
  }

  setIME(enabled: boolean) {
    this.interrupMasterEnabled = enabled
  }
}
