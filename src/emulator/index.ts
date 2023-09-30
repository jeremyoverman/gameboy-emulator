import { CPU } from './cpu'
import { CPUEventMap } from './types/events'
import { PPUEventMap } from './types/graphics'
import { Button } from './types/memory'

export type EventMap = CPUEventMap & PPUEventMap

export type SubscriptionFunction = () => void
export type Emitter<T extends keyof EventMap> = (event: T) => void

export class Emulator {
  public cpu: CPU

  private eventListeners: {
    [key in keyof EventMap]?: Array<EventMap[key]>
  } = {}

  constructor() {
    this.cpu = new CPU(this.emit)
  }

  bootstrapWithoutRom() {
    this.cpu.registers.set('a', 0x01)
    this.cpu.registers.set('f', 0b1000_0000)
    this.cpu.registers.set('b', 0x00)
    this.cpu.registers.set('c', 0x13)
    this.cpu.registers.set('d', 0x00)
    this.cpu.registers.set('e', 0xd8)
    this.cpu.registers.set('h', 0x01)
    this.cpu.registers.set('l', 0x4d)
    this.cpu.registers.set('pc', 0x0100)
    this.cpu.registers.set('sp', 0xfffe)

    this.cpu.memory.writeByte(0xff00, 0xcf)
    this.cpu.memory.writeByte(0xff01, 0x00)
    this.cpu.memory.writeByte(0xff02, 0x7e)
    this.cpu.memory.writeByte(0xff04, 0xab)
    this.cpu.memory.writeByte(0xff05, 0x00)
    this.cpu.memory.writeByte(0xff06, 0x00)
    this.cpu.memory.writeByte(0xff07, 0xf8)
    this.cpu.memory.writeByte(0xff0f, 0xe1)
    this.cpu.memory.writeByte(0xff10, 0x80)
    this.cpu.memory.writeByte(0xff11, 0xbf)
    this.cpu.memory.writeByte(0xff12, 0xf3)
    this.cpu.memory.writeByte(0xff13, 0xff)
    this.cpu.memory.writeByte(0xff14, 0xbf)
    this.cpu.memory.writeByte(0xff16, 0x3f)
    this.cpu.memory.writeByte(0xff17, 0x00)
    this.cpu.memory.writeByte(0xff18, 0xff)
    this.cpu.memory.writeByte(0xff19, 0xbf)
    this.cpu.memory.writeByte(0xff1a, 0x7f)
    this.cpu.memory.writeByte(0xff1b, 0xff)
    this.cpu.memory.writeByte(0xff1c, 0x9f)
    this.cpu.memory.writeByte(0xff1d, 0xff)
    this.cpu.memory.writeByte(0xff1e, 0xbf)
    this.cpu.memory.writeByte(0xff20, 0xff)
    this.cpu.memory.writeByte(0xff21, 0x00)
    this.cpu.memory.writeByte(0xff22, 0x00)
    this.cpu.memory.writeByte(0xff23, 0xbf)
    this.cpu.memory.writeByte(0xff24, 0x77)
    this.cpu.memory.writeByte(0xff25, 0xf3)
    this.cpu.memory.writeByte(0xff26, 0xf1)
    this.cpu.memory.writeByte(0xff40, 0x91)
    this.cpu.memory.writeByte(0xff41, 0x85)
    this.cpu.memory.writeByte(0xff42, 0x00)
    this.cpu.memory.writeByte(0xff43, 0x00)
    this.cpu.memory.writeByte(0xff44, 0x00)
    this.cpu.memory.writeByte(0xff45, 0x00)
    this.cpu.memory.writeByte(0xff46, 0xff)
    this.cpu.memory.writeByte(0xff47, 0xfc)
    this.cpu.memory.writeByte(0xff48, 0x07)
    this.cpu.memory.writeByte(0xff49, 0x07)
    this.cpu.memory.writeByte(0xff4a, 0x00)
    this.cpu.memory.writeByte(0xff4b, 0x00)
    this.cpu.memory.writeByte(0xff4d, 0xff)
    this.cpu.memory.writeByte(0xff4f, 0xff)
    this.cpu.memory.writeByte(0xff51, 0xff)
    this.cpu.memory.writeByte(0xff52, 0xff)
    this.cpu.memory.writeByte(0xff53, 0xff)
    this.cpu.memory.writeByte(0xff54, 0xff)
    this.cpu.memory.writeByte(0xff55, 0xff)
    this.cpu.memory.writeByte(0xff56, 0xff)
    this.cpu.memory.writeByte(0xff68, 0xff)
    this.cpu.memory.writeByte(0xff69, 0xff)
    this.cpu.memory.writeByte(0xff6a, 0xff)
    this.cpu.memory.writeByte(0xff6b, 0xff)
    this.cpu.memory.writeByte(0xff70, 0xff)
    this.cpu.memory.writeByte(0xffff, 0x00)
  }

  loadBootRom(file: File) {
    this.cpu.memory.loadRomFile(file, true)
  }

  pressButton(button: Button, pressed: boolean) {
    this.cpu.memory.toggleButton(button, pressed)
  }

  // Method to register an event listener
  on<T extends keyof EventMap>(event: T, callback: EventMap[T]): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }

    this.eventListeners[event]?.push(callback)
  }

  // Method to unregister an event listener
  off<T extends keyof EventMap>(event: T, callback: EventMap[T]): void {
    if (!this.eventListeners[event]) return
    this.eventListeners[event] = this.eventListeners[event]?.filter((listener) => listener !== callback)
  }

  // Method to emit events
  private emit: Emitter<keyof EventMap> = (event) => {
    this.eventListeners[event]?.forEach((callback) => callback())
  }
}
