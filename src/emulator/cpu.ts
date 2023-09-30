import { Emulator } from './emulator'
import { INTERRUPTS, INTERRUPT_PRIORITY } from './constants'
import { Instructions } from './instructions'
import { OpCodes } from './opcodes'
import { Registers } from './registers'
import { OpCodeDefinition } from './types'
import { Interrupt } from './types'

export class CPU {
  emulator: Emulator

  // Components
  registers: Registers
  instructions: Instructions
  opcodes: OpCodes

  // CPU Control flags
  halted: boolean = false
  stopped: boolean = false

  // Interrupt flags
  interrupMasterEnabled: boolean = true
  interruptEnable: boolean = false

  constructor(emulator: Emulator) {
    this.emulator = emulator
    this.registers = new Registers()
    this.instructions = new Instructions(emulator)
    this.opcodes = new OpCodes(this)
  }

  interrupt(interrupt: Interrupt) {
    this.emulator.bus.setInterruptFlag(interrupt, true)
  }

  handleInterrupt() {
    if (!this.interrupMasterEnabled) {
      return
    }

    let jumpAddress: number | undefined

    INTERRUPT_PRIORITY.some((interrupt) => {
      if (this.emulator.bus.getInterruptFlag(interrupt)) {
        this.emulator.bus.setInterruptFlag(interrupt, false)
        jumpAddress = INTERRUPTS[interrupt].jump
        return true
      }
    })

    return jumpAddress
  }

  tick() {
    const pc = this.registers.get('pc')

    let opcode: OpCodeDefinition
    let args = new Uint8Array(0)

    let instructionByte = this.emulator.bus.readByte(pc)
    const interruptJumpAddress = this.handleInterrupt()

    if (interruptJumpAddress !== undefined) {
      instructionByte = 0xcd // CALL a16
      opcode = this.opcodes.opcodes[instructionByte]
      args = new Uint8Array([interruptJumpAddress & 0xff, (interruptJumpAddress >> 8) & 0xff])
    } else if (instructionByte === 0xcb) {
      instructionByte = this.emulator.bus.readByte((pc + 1) & 0xffff)
      opcode = this.opcodes.prefixOpcodes[instructionByte]
    } else {
      opcode = this.opcodes.opcodes[instructionByte]
      const bytes = opcode?.length !== undefined ? opcode.length : 1
      // TODO: This won't handle wrapping
      args = this.emulator.bus.readBytes((pc + 1) & 0xffff, bytes - 1)
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
        this.emulator.clock.addCycles(opcode.cycles[1])
      } else {
        this.emulator.clock.addCycles(opcode.cycles[0])
      }
    } else {
      this.emulator.clock.addCycles(opcode.cycles)
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
