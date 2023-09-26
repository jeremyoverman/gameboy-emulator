export const IO_REGISTERS = {
  joypad: [0xff00],
  serial: [0xff01, 0xff02],
  divider: [0xff04, 0xff07],
  audio: [0xff10, 0xff26],
  wave: [0xff30, 0xff3f],
  lcd: [0xff40, 0xff4b],
  boot: [0xff50],
  bank: [0xff51, 0xff55],
  ly: 0xff44,
}
export type IoRegister = keyof typeof IO_REGISTERS

export const RST_JUMP_ADDRESSES = [0x0000, 0x0008, 0x0010, 0x0018, 0x0020, 0x0028, 0x0030, 0x0038]
export type RstJumpAddresses = (typeof RST_JUMP_ADDRESSES)[number]

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

  constructor() {
    this.writeByte(0xffff, 0x00)
  }

  async loadRomFile(file: File, boot?: boolean) {
    const buffer = await file.arrayBuffer()
    const rom = new Uint8Array(buffer)
    const offset = boot ? 0x0000 : 0x0100
    console.log('loading rom file', offset, rom)

    this.loadROM(rom, offset)
  }

  private loadROM(rom: Uint8Array, offset: number) {
    this.memory.set(rom, offset)
  }

  readByte(address: number): number {
    return this.memory[address]
  }

  readBytes(address: number, num: number) {
    return this.memory.slice(address, address + num)
  }

  writeByte(address: number, value: number) {
    this.memory[address] = value
  }

  writeBytes(address: number, values: number[] | Uint8Array) {
    this.memory.set(values, address)
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
}
