import { CPU, CPUEventMap } from './cpu'
import { PPUEventMap } from './graphics'

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
    this.cpu.registers.set('b',	0x00)
    this.cpu.registers.set('c',	0x13)
    this.cpu.registers.set('d',	0x00)
    this.cpu.registers.set('e',	0xD8)
    this.cpu.registers.set('h',	0x01)
    this.cpu.registers.set('l',	0x4D)
    this.cpu.registers.set('pc',	0x0100)
    this.cpu.registers.set('sp',	0xFFFE)

    this.cpu.memory.writeByte(0xFF00, 0xCF)
    this.cpu.memory.writeByte(0xFF01, 0x00)
    this.cpu.memory.writeByte(0xFF02, 0x7E)
    this.cpu.memory.writeByte(0xFF04, 0xAB)
    this.cpu.memory.writeByte(0xFF05, 0x00)
    this.cpu.memory.writeByte(0xFF06, 0x00)
    this.cpu.memory.writeByte(0xFF07, 0xF8)
    this.cpu.memory.writeByte(0xFF0F, 0xE1)
    this.cpu.memory.writeByte(0xFF10, 0x80)
    this.cpu.memory.writeByte(0xFF11, 0xBF)
    this.cpu.memory.writeByte(0xFF12, 0xF3)
    this.cpu.memory.writeByte(0xFF13, 0xFF)
    this.cpu.memory.writeByte(0xFF14, 0xBF)
    this.cpu.memory.writeByte(0xFF16, 0x3F)
    this.cpu.memory.writeByte(0xFF17, 0x00)
    this.cpu.memory.writeByte(0xFF18, 0xFF)
    this.cpu.memory.writeByte(0xFF19, 0xBF)
    this.cpu.memory.writeByte(0xFF1A, 0x7F)
    this.cpu.memory.writeByte(0xFF1B, 0xFF)
    this.cpu.memory.writeByte(0xFF1C, 0x9F)
    this.cpu.memory.writeByte(0xFF1D, 0xFF)
    this.cpu.memory.writeByte(0xFF1E, 0xBF)
    this.cpu.memory.writeByte(0xFF20, 0xFF)
    this.cpu.memory.writeByte(0xFF21, 0x00)
    this.cpu.memory.writeByte(0xFF22, 0x00)
    this.cpu.memory.writeByte(0xFF23, 0xBF)
    this.cpu.memory.writeByte(0xFF24, 0x77)
    this.cpu.memory.writeByte(0xFF25, 0xF3)
    this.cpu.memory.writeByte(0xFF26, 0xF1)
    this.cpu.memory.writeByte(0xFF40, 0x91)
    this.cpu.memory.writeByte(0xFF41, 0x85)
    this.cpu.memory.writeByte(0xFF42, 0x00)
    this.cpu.memory.writeByte(0xFF43, 0x00)
    this.cpu.memory.writeByte(0xFF44, 0x00)
    this.cpu.memory.writeByte(0xFF45, 0x00)
    this.cpu.memory.writeByte(0xFF46, 0xFF)
    this.cpu.memory.writeByte(0xFF47, 0xFC)
    this.cpu.memory.writeByte(0xFF48, 0x07)
    this.cpu.memory.writeByte(0xFF49, 0x07)
    this.cpu.memory.writeByte(0xFF4A, 0x00)
    this.cpu.memory.writeByte(0xFF4B, 0x00)
    this.cpu.memory.writeByte(0xFF4D, 0xFF)
    this.cpu.memory.writeByte(0xFF4F, 0xFF)
    this.cpu.memory.writeByte(0xFF51, 0xFF)
    this.cpu.memory.writeByte(0xFF52, 0xFF)
    this.cpu.memory.writeByte(0xFF53, 0xFF)
    this.cpu.memory.writeByte(0xFF54, 0xFF)
    this.cpu.memory.writeByte(0xFF55, 0xFF)
    this.cpu.memory.writeByte(0xFF56, 0xFF)
    this.cpu.memory.writeByte(0xFF68, 0xFF)
    this.cpu.memory.writeByte(0xFF69, 0xFF)
    this.cpu.memory.writeByte(0xFF6A, 0xFF)
    this.cpu.memory.writeByte(0xFF6B, 0xFF)
    this.cpu.memory.writeByte(0xFF70, 0xFF)
    this.cpu.memory.writeByte(0xFFFF, 0x00)
  }

  loadBootRom(file: File) {
    this.cpu.memory.loadRomFile(file, true)
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
