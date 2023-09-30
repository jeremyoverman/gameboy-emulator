import {
  ALL_16_BIT_REGISTERS,
  ALL_8_BIT_REGISTERS,
  FLAGS,
  GP_16_BIT_REGISTERS,
  SPECIAL_16_BIT_REGISTERS,
} from './constants'

import {
  EightBitRegisterName,
  Flag,
  GpEightBitRegisterName,
  GpSixteenBitRegisterName,
  RegisterName,
  SpecialRegisterNames,
  SpecialSixteenBitRegisterName,
} from './types/registers'

export class Registers {
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
    return ALL_16_BIT_REGISTERS.includes(reg as GpSixteenBitRegisterName)
  }

  set(reg: RegisterName, value: number) {
    if (ALL_8_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      if (value > 0xff) {
        value = value & 0xff
      }

      if (reg === 'f') {
        value = value & 0xf0
      }

      this[reg as GpEightBitRegisterName] = value
    } else {
      if (SPECIAL_16_BIT_REGISTERS.includes(reg as SpecialSixteenBitRegisterName)) {
        if (value > 0xffff) {
          value = value & 0xffff
        }

        this[reg as SpecialRegisterNames] = value
      } else {
        const [reg1, reg2] = reg.split('') as GpEightBitRegisterName[]

        this.set(reg1, (value >> 8) & 0xff)
        this.set(reg2, value & 0xff)
      }
    }
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
      this.set('f', this.f | FLAGS[flag])
    } else {
      this.set('f', this.f & (FLAGS[flag] ^ 0xff))
    }
  }

  getFlag(flag: Flag) {
    return this.f & FLAGS[flag] ? true : false
  }

  get(reg: RegisterName) {
    if (ALL_8_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      return this[reg as GpEightBitRegisterName]
    } else if (GP_16_BIT_REGISTERS.includes(reg as GpSixteenBitRegisterName)) {
      const [reg1, reg2] = reg.split('') as GpEightBitRegisterName[]
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
      a: this.get('a'),
      b: this.get('b'),
      c: this.get('c'),
      d: this.get('d'),
      e: this.get('e'),
      f: this.get('f'),
      h: this.get('h'),
      l: this.get('l'),
      af: this.get('af'),
      bc: this.get('bc'),
      de: this.get('de'),
      hl: this.get('hl'),
      sp: this.get('sp'),
      pc: this.get('pc'),
      flags: {
        Zero: this.getFlag('Zero'),
        Subtraction: this.getFlag('Subtraction'),
        HalfCarry: this.getFlag('HalfCarry'),
        Carry: this.getFlag('Carry'),
      },
    }
  }

  incStackPointer() {
    this.set('sp', this.get('sp') + 2)
  }

  decStackPointer() {
    this.set('sp', this.get('sp') - 2)
  }
}
