import { BUS_REGISTERS, CYCLES_PER_DIV, CYCLES_PER_SECOND, FPS, TIMER_FLAGS, TMA } from './constants'
import { Emitter, Emulator } from './emulator'
import { ClockEventMap } from './types'

export class Clock {
  // Emulator
  emulator: Emulator
  emit: Emitter<keyof ClockEventMap>
  paused: boolean = true

  // Intervals
  vblankClockInterval: NodeJS.Timeout | undefined

  // Counters
  cycles: number = 0
  divCycles: number = 0
  timaCycles: number = 0
  dotCycles: number = 0

  // Targets
  targetFps: number = FPS
  targetCyclesPerSecond: number = CYCLES_PER_SECOND
  targetCyclesPerFrame: number = this.targetCyclesPerSecond / this.targetFps

  constructor(emulator: Emulator) {
    this.emulator = emulator
    this.emit = emulator.emit

    this.setCyclesPerFrame()
  }

  executeFrame() {
    this.cycles = 0
    while (this.cycles < this.targetCyclesPerFrame) {
      if (this.paused) {
        break
      }
      this.emulator.cpu.tick()
      this.emulator.ppu.tick()
      this.addCycles(4)
      this.updateTimers()
    }
  }

  addCycles(cycles: number) {
    this.cycles += cycles
    this.divCycles += cycles
    this.timaCycles += cycles
    this.dotCycles += cycles
  }

  setCyclesPerFrame() {
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
        this.executeFrame()
      } catch (e) {
        console.error(e)
        this.pause()
      }
    }, 1000 / this.targetFps)
  }

  updateTimers() {
    if (this.divCycles >= CYCLES_PER_DIV) {
      this.divCycles -= CYCLES_PER_DIV
      this.emulator.bus.div = (this.emulator.bus.div + 1) & 0xffff
    }

    const tac = this.emulator.bus.readByte(BUS_REGISTERS.tac)
    if (tac & TIMER_FLAGS.enable) {
      const cycles = tac & TMA[tac & 0b11]
      if (this.timaCycles >= cycles) {
        this.timaCycles -= cycles
        this.emulator.bus.tima = this.emulator.bus.tima + 1

        if (this.emulator.bus.tima > 0xff) {
          this.emulator.bus.tima = this.emulator.bus.readByte(BUS_REGISTERS.tma)
          this.emulator.cpu.interrupt('timer')
        }
      }
    }
  }
}
