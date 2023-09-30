import { ACTION_BUTTON, BUTTONS, DIRECTION_BUTTON } from './constants'
import { Emulator } from './emulator'
import { Button } from './types'

export class Joypad {
  emulator: Emulator

  A: number = BUTTONS.A
  B: number = BUTTONS.B
  Select: number = BUTTONS.Select
  Start: number = BUTTONS.Start
  Right: number = BUTTONS.Right
  Left: number = BUTTONS.Left
  Up: number = BUTTONS.Up
  Down: number = BUTTONS.Down

  constructor(emulator: Emulator) {
    this.emulator = emulator
  }

  read() {
    const joypad = this.emulator.bus.memory[0xff00]

    if ((joypad & DIRECTION_BUTTON) === 0) {
      return joypad | this.Up | this.Down | this.Left | this.Right
    } else if ((joypad & ACTION_BUTTON) === 0) {
      return joypad | this.A | this.B | this.Select | this.Start
    }

    return joypad
  }

  set(button: Button, pressed: boolean) {
    this[button] = pressed ? 0 : BUTTONS[button]
  }
}
