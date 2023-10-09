import * as constants from './constants'

//
// CPU
//

export type OpCodeDefinition = {
  run: (pc: number, args: Uint8Array) => number | void
  name: string
  length: number
  cycles: number | number[]
} | null

//
// Events
//

export type ClockEventMap = {
  pause: () => void
  resume: () => void
}

export type PPUEventMap = {
  render: () => void
  lcdBufferReady: () => void
  vblank: () => void
}

export type EventMap = PPUEventMap & ClockEventMap

//
// PPU
//

export type ColorMap = number[][]

export type OAMEntry = {
  y: number
  x: number
  tile: number
  flags: number
}

//
// Bus
//

export type Interrupt = keyof typeof constants.INTERRUPTS
export type RstJumpAddresses = (typeof constants.RST_JUMP_ADDRESSES)[number]

//
// Joypad
//

export type Button = keyof typeof constants.BUTTONS

//
// Registers
//

export type GpEightBitRegisterName = (typeof constants.GP_8_BIT_REGISTERS)[number]
export type SpecialEightBitRegisterName = (typeof constants.SPECIAL_8_BIT_REGISTERS)[number]
export type EightBitRegisterName = (typeof constants.ALL_8_BIT_REGISTERS)[number]

export type GpSixteenBitRegisterName = (typeof constants.GP_16_BIT_REGISTERS)[number]
export type SpecialSixteenBitRegisterName = (typeof constants.SPECIAL_16_BIT_REGISTERS)[number]
export type SixteenBitRegisterName = (typeof constants.ALL_16_BIT_REGISTERS)[number]

export type ArithmeticRegisterName = (typeof constants.ARITHMETIC_REGISTERS)[number]

export type RegisterName = (typeof constants.REGISTERS)[number]
export type SpecialRegisterNames = (typeof constants.SPECIAL_8_BIT_REGISTERS)[number]

export type Flag = 'Zero' | 'Subtraction' | 'Carry' | 'HalfCarry'

//
// Tests
//

export interface JsonState {
  pc: number
  sp: number
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
  h: number
  l: number
  ime: number
  ie: number
  ram: number[][]
}
export interface JsonTest {
  name: string
  initial: JsonState
  final: JsonState
  cycles: (number | string)[][]
}

export type JsonTestSuite = JsonTest[]
