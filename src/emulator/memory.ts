export const IO_REGISTERS = {
  joypad: 0xff00,
  serial: [0xff01, 0xff02],
  divider: [0xff04, 0xff07],
  audio: [0xff10, 0xff26],
  wave: [0xff30, 0xff3f],
  lcdc: 0xff40,
  stat: 0xff41,
  scy: 0xff42,
  scx: 0xff43,
  ly: 0xff44,
  lcy: 0xff45,
  windowy: 0xff4a,
  windowx: 0xff4b,
  boot: 0xff50,
  bank: [0xff51, 0xff55],
}
export type IoRegister = keyof typeof IO_REGISTERS

export const RST_JUMP_ADDRESSES = [0x0000, 0x0008, 0x0010, 0x0018, 0x0020, 0x0028, 0x0030, 0x0038]
export type RstJumpAddresses = (typeof RST_JUMP_ADDRESSES)[number]

export const LCD_FLAGS = {
  enable: 0b10000000,
  windowTileMap: 0b01000000,
  windowEnable: 0b00100000,
  bgWindowTileData: 0b00010000,
  bgTileMap: 0b00001000,
  spriteSize: 0b00000100,
  spriteEnable: 0b00000010,
  bgWindowEnable: 0b00000001,
} as const

export const INTERRUPTS = {
  vblank: {
    jump: 0x0040,
    flag: 0b00001,
  },
  lcdstat: {
    jump: 0x0048,
    flag: 0b00010,
  },
  timer: {
    jump: 0x0050,
    flag: 0b00100,
  },
  serial: {
    jump: 0x0058,
    flag: 0b01000,
  },
  joypad: {
    jump: 0x0060,
    flag: 0b10000,
  },
} as const

export const INTERRUPT_PRIORITY = ['vblank', 'lcdstat', 'timer', 'serial', 'joypad'] as const

export type Interrupt = keyof typeof INTERRUPTS

export class Memory {
  memory: Uint8Array = new Uint8Array(0xffff + 1).map(() => 0x00)
  bootRom: Uint8Array = new Uint8Array(0x100 + 1).map(() => 0x00)

  constructor() {
    this.writeByte(0xffff, 0x00)
  }

  async loadRomFile(file: File, boot?: boolean) {
    const buffer = await file.arrayBuffer()
    const rom = new Uint8Array(buffer)

    this.loadROM(rom, boot)
  }

  private loadROM(rom: Uint8Array, boot?: boolean) {
    if (boot) {
      this.bootRom = rom
    } else {
      this.memory.set(rom, 0)
    }
  }

  readByte(address: number): number {
    if (address === 0xff00) {
      return 0xff
    }

    if (this.memory[IO_REGISTERS.boot] === 0 && address < 0x100) {
      return this.bootRom[address]
    }

    return this.memory[address]
  }

  readBytes(address: number, num: number) {
    if (this.memory[IO_REGISTERS.boot] === 0 && address < 0x100) {
      const bootRomBytes = this.bootRom.slice(address, address + num)
      const memoryBytes = this.memory.slice(address + num, address + num + (num - bootRomBytes.length))
      return new Uint8Array([...bootRomBytes, ...memoryBytes])
    }

    return this.memory.slice(address, address + num)
  }

  writeByte(address: number, value: number) {
    this.memory[address] = value
  }

  writeBytes(address: number, values: number[] | Uint8Array) {
    try {
      this.memory.set(values, address)
    } catch (e) {
      console.log(
        'error writing bytes',
        address.toString(16),
        [...values].map((v) => v.toString(16))
      )
      throw e
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
    const lcdc = this.readByte(IO_REGISTERS.lcdc)

    return (lcdc & LCD_FLAGS[flag]) === LCD_FLAGS[flag]
  }
}
