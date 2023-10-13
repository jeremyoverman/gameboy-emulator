import { INTERRUPTS, BUS_REGISTERS, LCD_FLAGS, CART_TYPES, RAM_SIZE_MAP } from './constants'
import { Emulator } from './emulator'
import { Header, Interrupt, RamSizeKey } from './types'

export class Bus {
  emulator: Emulator
  header?: Header

  // Timers
  div: number = 0
  tima: number = 0

  // ROM
  memory: Uint8Array = new Uint8Array(0xffff + 1).map(() => 0x00)
  bootRom: Uint8Array = new Uint8Array(0x100 + 1).map(() => 0x00)
  rom: Uint8Array = new Uint8Array(0x800000 + 1).map(() => 0x00)

  // MBC
  romBank: number = 1

  constructor(emulator: Emulator) {
    this.emulator = emulator
    this.writeByte(0xffff, 0x00)
  }

  setHeader() {
    const title = Array.from(this.readBytes(0x134, 16))
      .map((byte) => String.fromCharCode(byte))
      .join('')

    this.header = {
      title: title.replace(/\0/g, ''),
      colorGB: this.readByte(0x143) === 0x80,
      superGB: this.readByte(0x146) === 0x03,
      cartType: CART_TYPES[this.readByte(0x147)],
      romSize: 0x8000 * (1 << this.readByte(0x148)),
      ramSize: RAM_SIZE_MAP[this.readByte(0x149) as RamSizeKey],
    }

    console.log(this.header)
  }

  async loadRomFile(file: File, boot?: boolean) {
    const buffer = await file.arrayBuffer()
    this.rom = new Uint8Array(buffer)
    this.loadROM(this.rom.slice(0, 32 * 1024), boot)
    this.setHeader()
  }

  private loadROM(rom: Uint8Array, boot?: boolean) {
    if (boot) {
      this.bootRom = rom
    } else {
      this.memory.set(rom, 0)
    }
  }

  runDMA() {
    const index = this.readByte(BUS_REGISTERS.dma) << 8
    this.memory.set(this.memory.slice(index, index + 0xa0), BUS_REGISTERS.oam)
  }

  readMbc(address: number) {
    if (this.header?.cartType.mbc === 'mbc1') {
      if (address >= 0x0000 && address <= 0x3fff) {
        return this.rom[address]
      } else if (address >= 0x4000 && address <= 0x7fff) {
        return this.rom[address - 0x4000 + this.romBank * 0x4000]
      }
    }

    return this.memory[address]
  }

  readByte(address: number): number {
    if (address === BUS_REGISTERS.joypad) {
      return this.emulator.joypad.read()
    }

    if (address === BUS_REGISTERS.div) {
      return (this.div >> 8) & 0xff
    }

    if (this.memory[BUS_REGISTERS.boot] === 0 && address < 0x100) {
      return this.bootRom[address]
    }

    return this.readMbc(address)
  }

  readBytes(address: number, num: number) {
    const result = new Uint8Array(num)

    for (let i = 0; i < num; i += 1) {
      result[i] = this.readByte(address + i)
    }

    return result
  }

  writeMbc(address: number, value: number) {
    if (this.header?.cartType.mbc === 'mbc1') {
      if (address >= 0x0000 && address <= 0x1fff) {
        return
      } else if (address >= 0x2000 && address <= 0x3fff) {
        this.romBank = value & 0x1f
        return
      }
    } else if (address >= 0x0000 && address <= 0x7fff) {
      // Don't allow writing to ROM
      return
    }

    this.memory[address] = value
  }

  writeByte(address: number, value: number) {
    if (address === BUS_REGISTERS.dma) {
      this.runDMA()
    }

    if (address === BUS_REGISTERS.div) {
      this.div = 0
    }

    this.writeMbc(address, value)
  }

  writeBytes(address: number, values: number[] | Uint8Array) {
    for (let i = 0; i < values.length; i += 1) {
      this.writeByte(address + i, values[i])
    }
  }

  setInterruptFlag(flag: Interrupt, on: boolean) {
    const address = 0xff0f
    const current = this.readByte(address)

    if (on) {
      this.writeByte(address, current | INTERRUPTS[flag].flag)
    } else {
      this.writeByte(address, current & ~INTERRUPTS[flag].flag)
    }
  }

  getInterruptFlag(flag: Interrupt) {
    const interruptFlags = this.readByte(0xff0f)
    const interruptEnabled = this.readByte(0xffff)

    const current = interruptFlags & interruptEnabled

    return (current & INTERRUPTS[flag].flag) === INTERRUPTS[flag].flag
  }

  getLcdFlag(flag: keyof typeof LCD_FLAGS) {
    const lcdc = this.readByte(BUS_REGISTERS.lcdc)

    return (lcdc & LCD_FLAGS[flag]) === LCD_FLAGS[flag]
  }
}
