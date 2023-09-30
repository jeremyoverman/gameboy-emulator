import { ACTION_BUTTON, BUTTONS, DIRECTION_BUTTON, INTERRUPTS, BUS_REGISTERS, LCD_FLAGS } from './constants'
import { Button, Interrupt } from './types/memory'

export class Bus {
  // Timers
  div: number = 0
  tima: number = 0

  // ROM
  memory: Uint8Array = new Uint8Array(0xffff + 1).map(() => 0x00)
  bootRom: Uint8Array = new Uint8Array(0x100 + 1).map(() => 0x00)

  // State
  buttonStates: Record<Button, number> = {
    A: BUTTONS.A,
    B: BUTTONS.B,
    Select: BUTTONS.Select,
    Start: BUTTONS.Start,
    Right: BUTTONS.Right,
    Left: BUTTONS.Left,
    Up: BUTTONS.Up,
    Down: BUTTONS.Down,
  }

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

  runDMA() {
    const index = this.readByte(BUS_REGISTERS.dma) << 8
    this.memory.set(this.memory.slice(index, index + 0xa0), BUS_REGISTERS.oam)
  }

  readByte(address: number): number {
    if (address === BUS_REGISTERS.joypad) {
      return this.readJoypad()
    }

    if (address === BUS_REGISTERS.div) {
      return (this.div >> 8) & 0xff
    }

    if (this.memory[BUS_REGISTERS.boot] === 0 && address < 0x100) {
      return this.bootRom[address]
    }

    return this.memory[address]
  }

  readBytes(address: number, num: number) {
    const result = new Uint8Array(num)

    for (let i = 0; i < num; i += 1) {
      result[i] = this.readByte(address + i)
    }

    return result
  }

  writeByte(address: number, value: number) {
    if (address === BUS_REGISTERS.dma) {
      this.runDMA()
    }

    if (address === BUS_REGISTERS.div) {
      this.div = 0
    }

    this.memory[address] = value
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

  readJoypad() {
    const joypad = this.memory[0xff00]

    if ((joypad & DIRECTION_BUTTON) === 0) {
      return joypad | this.buttonStates.Up | this.buttonStates.Down | this.buttonStates.Left | this.buttonStates.Right
    } else if ((joypad & ACTION_BUTTON) === 0) {
      return joypad | this.buttonStates.A | this.buttonStates.B | this.buttonStates.Select | this.buttonStates.Start
    }

    return joypad
  }

  toggleButton(button: Button, pressed: boolean) {
    if (pressed) {
      this.buttonStates[button] = 0
    } else {
      this.buttonStates[button] = BUTTONS[button]
    }
  }
}
