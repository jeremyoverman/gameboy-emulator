import { Emitter } from '.'

export const COMMON_8_BIT_REGISTERS = ['a', 'b', 'c', 'd', 'e', 'h', 'l'] as const
export const SPECIAL_8_BIT_REGISTERS = ['f'] as const
export const ALL_8_BIT_REGISTERS = [...COMMON_8_BIT_REGISTERS, ...SPECIAL_8_BIT_REGISTERS] as const
export type CommonEightBitRegisterName = (typeof COMMON_8_BIT_REGISTERS)[number]
export type SpecialEightBitRegisterName = (typeof SPECIAL_8_BIT_REGISTERS)[number]
export type EightBitRegisterName = (typeof ALL_8_BIT_REGISTERS)[number]

export const COMMON_16_BIT_REGISTERS = ['af', 'bc', 'de', 'hl'] as const
export const SPECIAL_16_BIT_REGISTERS = ['sp', 'pc'] as const
export const ALL_16_BIT_REGISTERS = [...COMMON_16_BIT_REGISTERS, ...SPECIAL_16_BIT_REGISTERS] as const
export type CommonSixteenBitRegisterName = (typeof COMMON_16_BIT_REGISTERS)[number]
export type SpecialSixteenBitRegisterName = (typeof SPECIAL_16_BIT_REGISTERS)[number]
export type SixteenBitRegisterName = (typeof ALL_16_BIT_REGISTERS)[number]

export const ARITHMETIC_REGISTERS = [...COMMON_8_BIT_REGISTERS, ...COMMON_16_BIT_REGISTERS, 'sp'] as const
export type ArithmeticRegisterName = (typeof ARITHMETIC_REGISTERS)[number]

export const REGISTERS = [
  ...COMMON_8_BIT_REGISTERS,
  ...COMMON_16_BIT_REGISTERS,
  ...SPECIAL_8_BIT_REGISTERS,
  ...SPECIAL_16_BIT_REGISTERS,
]
export type RegisterName = (typeof REGISTERS)[number]
export type SpecialRegisterNames = (typeof SPECIAL_8_BIT_REGISTERS)[number]

export enum Flag {
  Zero = 'Zero',
  Subtraction = 'Subtraction',
  Carry = 'Carry',
  HalfCarry = 'HalfCarry',
}

const FLAG_POSITIONS = {
  [Flag.Zero]: 4,
  [Flag.Subtraction]: 5,
  [Flag.HalfCarry]: 6,
  [Flag.Carry]: 7,
}

export type RegisterUpdateCallback = (event: RegisterUpdateEvent) => void

export class RegisterUpdateEvent {
  reg: RegisterName
  value: number

  constructor(reg: RegisterName, value: number) {
    this.reg = reg
    this.value = value
  }
}

export type RegisterEventMap = {
  registerUpdate: RegisterUpdateCallback
}

export class Registers {
  emit: Emitter<keyof RegisterEventMap>

  constructor(emit: Emitter<keyof RegisterEventMap>) {
    this.emit = emit
  }

  a: number = 0
  b: number = 0
  c: number = 0
  d: number = 0
  e: number = 0
  h: number = 0
  l: number = 0

  f: number = 0
  pc: number = 0
  sp: number = 0

  is16Bit(reg: RegisterName) {
    return ALL_16_BIT_REGISTERS.includes(reg as CommonSixteenBitRegisterName)
  }

  set(reg: RegisterName, value: number) {
    if (ALL_8_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      if (value > 0xff) {
        throw new Error(`Cannot set ${reg} to ${value}!`)
      }

      this[reg as CommonEightBitRegisterName] = value
    } else {
      if (SPECIAL_16_BIT_REGISTERS.includes(reg as SpecialSixteenBitRegisterName)) {
        this[reg as SpecialRegisterNames] = value
      } else {
        const [reg1, reg2] = reg.split('') as CommonEightBitRegisterName[]

        this.set(reg1, (value >> 8) & 0xff)
        this.set(reg2, value & 0xff)
      }
    }

    this.emit('registerUpdate', new RegisterUpdateEvent(reg, value))
  }

  setUint8Array(reg: RegisterName, value: Uint8Array) {
    if (this.is16Bit(reg)) {
      return this.set(reg, value[0] | (value[1] << 8))
    } else {
      return this.set(reg, value[0])
    }
  }

  setFlag(flag: Flag, active: boolean) {
    if (active) {
      this.set('f', this.f | (1 << FLAG_POSITIONS[flag]))
    } else {
      this.set('f', this.f & ~((1 << FLAG_POSITIONS[flag]) & 0xff))
    }
  }

  getFlag(flag: Flag) {
    return ((this.f >> FLAG_POSITIONS[flag]) & 1) === 1
  }

  get(reg: RegisterName) {
    if (ALL_8_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      return this[reg as CommonEightBitRegisterName]
    } else if (COMMON_16_BIT_REGISTERS.includes(reg as CommonSixteenBitRegisterName)) {
      const [reg1, reg2] = reg.split('') as CommonEightBitRegisterName[]
      return (this[reg1] << 8) | this[reg2]
    } else if (SPECIAL_16_BIT_REGISTERS.includes(reg as SpecialSixteenBitRegisterName)) {
      return this[reg as SpecialRegisterNames]
    }

    throw new Error(`Unknown register ${reg}!`)
  }

  getUint8Array(reg: RegisterName) {
    const value = this.get(reg)

    if (this.is16Bit(reg)) {
      return new Uint8Array([value & 0xff, (value & 0xff00) >> 8])
    }

    return new Uint8Array([value])
  }

  getAll() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
      h: this.h,
      l: this.l,
    }
  }

  incStackPointer() {
    this.set('sp', this.get('sp') + 2);
  }

  decStackPointer() {
    this.set('sp', this.get('sp') - 2);
  }
}
