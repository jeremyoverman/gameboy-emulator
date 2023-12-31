import { Emulator } from './emulator'
import { ArithmeticRegisterName, RegisterName, GpSixteenBitRegisterName, GpEightBitRegisterName } from './types'
import { convertTwosComplement, uInt8ArrayToNumber } from './utils'

type ArithmeticReturn = {
  value: number
  carry: boolean
  halfCarry: boolean
  zero: boolean
  subtraction: boolean
}

export type LoadByteTarget = GpEightBitRegisterName | GpSixteenBitRegisterName | 'sp'
export type LoadByteSource = LoadByteTarget | 'd8' | 'd16'

export enum JumpMode {
  nz,
  z,
  nc,
  c,
}

export interface LoadOptions {
  refTarget?: boolean
  target: LoadByteTarget | 'd16'

  refSource?: boolean
  source: LoadByteSource

  incHl?: boolean
  decHl?: boolean
}

export interface RotateOptions {
  direction: 'left' | 'right'
  throughCarry?: boolean
  shift?: boolean
  preserveMsb?: boolean
  reference?: boolean
}

export class Instructions {
  emulator: Emulator

  constructor(emulator: Emulator) {
    this.emulator = emulator
  }

  private _setWithFlags(reg: ArithmeticRegisterName | null, ret: ArithmeticReturn) {
    this.emulator.cpu.registers.setFlag('Carry', ret.carry)
    this.emulator.cpu.registers.setFlag('Zero', ret.zero)
    this.emulator.cpu.registers.setFlag('Subtraction', ret.subtraction)
    this.emulator.cpu.registers.setFlag('HalfCarry', ret.halfCarry)

    if (reg) {
      this.emulator.cpu.registers.set(reg, ret.value)
    }
  }

  private readStack() {
    const sp = this.emulator.cpu.registers.get('sp')
    const lsb = this.emulator.bus.readByte(sp)
    const msb = this.emulator.bus.readByte(sp + 1)

    return (msb << 8) | lsb
  }

  private _add(num1: number, num2: number, withCarry?: boolean, sixteenBit?: boolean, hcLower?: boolean) {
    const maxFull = sixteenBit ? 0xffff : 0xff
    const carry = withCarry && this.emulator.cpu.registers.getFlag('Carry') ? 1 : 0

    const value = num1 + num2 + carry
    const ret: ArithmeticReturn = {
      value: value > maxFull ? value & maxFull : value,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: false,
    }

    ret.zero = ret.value === 0

    if (sixteenBit && !hcLower) {
      ret.halfCarry = (((num1 & 0xfff) + (num2 & 0xfff) + (carry & 0xfff)) & 0x1000) == 0x1000
      ret.carry = (((num1 & 0xffff) + (num2 & 0xffff) + (carry & 0xffff)) & 0x10000) == 0x10000
    } else {
      ret.halfCarry = (((num1 & 0xf) + (num2 & 0xf) + (carry & 0xf)) & 0x10) == 0x10
      ret.carry = (((num1 & 0xff) + (num2 & 0xff) + (carry & 0xff)) & 0x100) == 0x100
    }

    return ret
  }

  private _subtract(num1: number, num2: number, withCarry?: boolean, sixteenBit?: boolean) {
    const minFull = sixteenBit ? 0xffff : 0xff
    const carry = withCarry && this.emulator.cpu.registers.getFlag('Carry') ? 1 : 0

    const value = num1 - num2 - carry
    const ret: ArithmeticReturn = {
      value: value < 0 ? value & minFull : value,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: true,
    }

    ret.zero = ret.value === 0

    if (sixteenBit) {
      ret.halfCarry = (((num1 & 0xfff) - (num2 & 0xfff) - (carry & 0xfff)) & 0x1000) == 0x1000
      ret.carry = (((num1 & 0xffff) - (num2 & 0xffff) - (carry & 0xffff)) & 0x10000) == 0x10000
    } else {
      ret.halfCarry = (((num1 & 0xf) - (num2 & 0xf) - (carry & 0xf)) & 0x10) == 0x10
      ret.carry = (((num1 & 0xff) - (num2 & 0xff) - (carry & 0xff)) & 0x100) == 0x100
    }

    return ret
  }

  private _getValue(source: ArithmeticRegisterName | 'pc' | number) {
    return typeof source === 'number' ? source : this.emulator.cpu.registers.get(source)
  }

  private getValueAndAddress(source: ArithmeticRegisterName | number, reference?: boolean) {
    let address: number | undefined = undefined
    let value = this._getValue(source)

    if (reference) {
      address = value
      value = this.emulator.bus.readByte(value)
    }

    return { address, value }
  }

  private _is16bit(source: ArithmeticRegisterName | number) {
    if (typeof source === 'number') {
      return false
    }

    return this.emulator.cpu.registers.is16Bit(source as GpSixteenBitRegisterName)
  }

  _rotate(reg: ArithmeticRegisterName, opts: RotateOptions) {
    const { address, value } = this.getValueAndAddress(reg, opts.reference)

    const is16Bit = this.emulator.cpu.registers.is16Bit(reg) && !opts.reference
    const leftBit = is16Bit ? 15 : 7
    const msb = (value >> leftBit) & 0x1

    // Get the bit that will be shifted out
    const bit = opts.direction === 'left' ? leftBit : 0
    const bitValue = (value >> bit) & 0x1

    // Shift the value
    let result = opts.direction === 'left' ? value << 1 : value >> 1

    result = result & (is16Bit ? 0xffff : 0xff)

    if (!opts.shift) {
      result = result | (bitValue << (opts.direction === 'left' ? 0 : leftBit))
    }

    if (opts.preserveMsb) {
      result = result | (msb << leftBit)
    }

    if (opts.throughCarry) {
      if (this.emulator.cpu.registers.getFlag('Carry')) {
        const sigMask = is16Bit ? 0x8000 : 0x80
        result = result | (opts.direction === 'left' ? 0x1 : sigMask)
      } else {
        const sigMask = is16Bit ? 0x7fff : 0x7f
        result = result & (opts.direction === 'left' ? 0xfffe : sigMask)
      }
    }

    if (address) {
      this.emulator.bus.writeByte(address, result)
    } else {
      this.emulator.cpu.registers.set(reg, result)
    }
    this.emulator.cpu.registers.setFlag('Zero', result === 0)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Carry', bitValue === 1)
  }

  nop() {}

  halt() {
    this.emulator.cpu.halt()
  }

  stop() {
    this.emulator.cpu.stop()
  }

  bit(source: GpEightBitRegisterName | 'hl', bit: number) {
    let value = this.emulator.cpu.registers.get(source)
    if (source === 'hl') {
      value = this.emulator.bus.readByte(value)
    }
    const bitValue = (value >> bit) & 0x1

    this.emulator.cpu.registers.setFlag('Zero', bitValue === 0)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', true)
  }

  set(reg: GpEightBitRegisterName | 'hl', bit: number) {
    const { address, value } = this.getValueAndAddress(reg, reg === 'hl')

    const result = value | (0x1 << bit)

    if (address) {
      this.emulator.bus.writeByte(address, result)
    } else {
      this.emulator.cpu.registers.set(reg, result)
    }
  }

  reset(reg: GpEightBitRegisterName | 'hl', bit: number) {
    const { address, value } = this.getValueAndAddress(reg, reg === 'hl')

    const result = value & ~(0x1 << bit)

    if (address) {
      this.emulator.bus.writeByte(address, result)
    } else {
      this.emulator.cpu.registers.set(reg, result)
    }
  }

  add_sp(target: 'sp' | 'hl', value: number) {
    value = convertTwosComplement(value)

    const sp = this.emulator.cpu.registers.get('sp')
    const result = this._add(sp, value, false, true, true)
    result.zero = false
    this._setWithFlags(target, result)
  }

  add(source: ArithmeticRegisterName | number, withCarry?: boolean, reference?: boolean) {
    const reg = this._is16bit(source) && !reference ? 'hl' : 'a'
    const { value } = this.getValueAndAddress(source, reference)

    const result = this._add(this.emulator.cpu.registers.get(reg), value, withCarry, reg === 'hl')

    if (reg === 'hl') {
      result.zero = this.emulator.cpu.registers.getFlag('Zero')
    }

    this._setWithFlags(reg, result)
  }

  adc(source: ArithmeticRegisterName | number, reference?: boolean) {
    this.add(source, true, reference)
  }

  sub(source: ArithmeticRegisterName | number, withCarry?: boolean, reference?: boolean) {
    const { value } = this.getValueAndAddress(source, reference)

    if (this._is16bit(source) && !reference) {
      const result = this._subtract(this.emulator.cpu.registers.get('hl'), value, withCarry, true)
      this._setWithFlags('hl', result)
    } else {
      const result = this._subtract(this.emulator.cpu.registers.get('a'), value, withCarry)
      this._setWithFlags('a', result)
    }
  }

  sbc(source: ArithmeticRegisterName | number, reference?: boolean) {
    this.sub(source, true, reference)
  }

  and(source: ArithmeticRegisterName | number, reference?: boolean) {
    const { value } = this.getValueAndAddress(source, reference)

    const result = this.emulator.cpu.registers.get('a') & value
    this.emulator.cpu.registers.setFlag('Zero', result === 0)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', true)
    this.emulator.cpu.registers.setFlag('Carry', false)
    this.emulator.cpu.registers.set('a', result)
  }

  xor(source: ArithmeticRegisterName | number, reference?: boolean) {
    const { value } = this.getValueAndAddress(source, reference)

    const result = this.emulator.cpu.registers.get('a') ^ value
    this.emulator.cpu.registers.setFlag('Zero', result === 0)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Carry', false)
    this.emulator.cpu.registers.set('a', result)
  }

  or(source: ArithmeticRegisterName | number, reference?: boolean) {
    const { value } = this.getValueAndAddress(source, reference)

    const result = this.emulator.cpu.registers.get('a') | value
    this.emulator.cpu.registers.setFlag('Zero', result === 0)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Carry', false)
    this.emulator.cpu.registers.set('a', result)
  }

  cp(source: ArithmeticRegisterName | number, reference?: boolean) {
    const { value } = this.getValueAndAddress(source, reference)
    const result = this._subtract(this.emulator.cpu.registers.get('a'), value, false, false)
    this._setWithFlags(null, result)
  }

  inc(source: ArithmeticRegisterName, reference?: boolean) {
    const is16Bit = this._is16bit(source) && !reference
    const { address, value } = this.getValueAndAddress(source, reference)
    const result = this._add(value, 1, false, is16Bit)

    result.carry = this.emulator.cpu.registers.getFlag('Carry')
    if (address) {
      this.emulator.bus.writeByte(address, result.value)
      this._setWithFlags(null, result)
    } else if (is16Bit) {
      this.emulator.cpu.registers.set(source, result.value)
    } else {
      this._setWithFlags(source, result)
    }
  }

  dec(source: ArithmeticRegisterName, reference?: boolean) {
    const is16Bit = this._is16bit(source) && !reference
    const { address, value } = this.getValueAndAddress(source, reference)
    const result = this._subtract(value, 1, false, is16Bit)

    result.carry = this.emulator.cpu.registers.getFlag('Carry')
    if (address) {
      this.emulator.bus.writeByte(address, result.value)
      this._setWithFlags(null, result)
    } else if (is16Bit) {
      this.emulator.cpu.registers.set(source, result.value)
    } else {
      this._setWithFlags(source, result)
    }
  }

  cpl() {
    this.emulator.cpu.registers.set('a', this.emulator.cpu.registers.get('a') ^ 0xff)
    this.emulator.cpu.registers.setFlag('Subtraction', true)
    this.emulator.cpu.registers.setFlag('HalfCarry', true)
  }

  daa() {
    let value = this.emulator.cpu.registers.get('a')

    if (!this.emulator.cpu.registers.getFlag('Subtraction')) {
      if (this.emulator.cpu.registers.getFlag('HalfCarry') || (value & 0xf) > 9) {
        value += 0x06
      }

      // Check for carry immediately after half-carry adjustment.
      if (value > 0xff) {
        this.emulator.cpu.registers.setFlag('Carry', true)
      }

      if (this.emulator.cpu.registers.getFlag('Carry') || value > 0x9f) {
        value += 0x60
      }
    } else {
      if (this.emulator.cpu.registers.getFlag('HalfCarry')) {
        value = (value - 6) & 0xff
      }

      if (this.emulator.cpu.registers.getFlag('Carry')) {
        value -= 0x60
      }
    }

    if ((value & 0x100) == 0x100) {
      this.emulator.cpu.registers.setFlag('Carry', true)
    }

    value &= 0xff

    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Zero', value === 0)
    this.emulator.cpu.registers.set('a', value)
  }

  rlca(reference?: boolean) {
    this._rotate('a', {
      direction: 'left',
      reference,
    })
    this.emulator.cpu.registers.setFlag('Zero', false)
  }

  rla(reference?: boolean) {
    this._rotate('a', {
      direction: 'left',
      throughCarry: true,
      reference,
    })
    this.emulator.cpu.registers.setFlag('Zero', false)
  }

  rrca(reference?: boolean) {
    this._rotate('a', {
      direction: 'right',
      reference,
    })
    this.emulator.cpu.registers.setFlag('Zero', false)
  }

  rra(reference?: boolean) {
    this._rotate('a', {
      direction: 'right',
      throughCarry: true,
      reference,
    })
    this.emulator.cpu.registers.setFlag('Zero', false)
  }

  rlc(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      reference,
    })
  }

  rl(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      throughCarry: true,
      reference,
    })
  }

  rrc(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      reference,
    })
  }

  rr(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      throughCarry: true,
      reference,
    })
  }

  sla(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      shift: true,
      reference,
    })
  }

  sra(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      shift: true,
      preserveMsb: true,
      reference,
    })
  }

  srl(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      shift: true,
      reference,
    })
  }

  swap(reg: ArithmeticRegisterName, reference?: boolean) {
    const { address, value } = this.getValueAndAddress(reg, reference)

    let result: number

    if (this.emulator.cpu.registers.is16Bit(reg) && !reference) {
      const low = value & 0xff
      const high = (value >> 8) & 0xff
      result = (low << 8) | high
    } else {
      const low = value & 0xf
      const high = (value >> 4) & 0xf
      result = (low << 4) | high
    }

    if (address) {
      this.emulator.bus.writeByte(address, result)
    } else {
      this.emulator.cpu.registers.set(reg, result)
    }
    this.emulator.cpu.registers.setFlag('Carry', false)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Zero', result === 0)
  }

  jp(value?: Uint8Array | number, mode?: JumpMode | null, relative?: boolean) {
    let address: number

    if (value !== undefined) {
      address = uInt8ArrayToNumber(value)
    } else {
      address = this.emulator.cpu.registers.get('hl')
    }

    if (relative) {
      const pc = this.emulator.cpu.registers.get('pc')
      address = (pc + convertTwosComplement(address)) & 0xffff
    }

    if (
      (mode === JumpMode.nz && !this.emulator.cpu.registers.getFlag('Zero')) ||
      (mode === JumpMode.z && this.emulator.cpu.registers.getFlag('Zero')) ||
      (mode === JumpMode.nc && !this.emulator.cpu.registers.getFlag('Carry')) ||
      (mode === JumpMode.c && this.emulator.cpu.registers.getFlag('Carry')) ||
      mode === undefined ||
      mode === null
    ) {
      this.emulator.cpu.registers.set('pc', address)
      return address
    }
  }

  ld(value: Uint8Array, opts: LoadOptions) {
    let bytes: Uint8Array
    let target: LoadByteTarget | number

    if (opts.source === 'd8' || opts.source === 'd16') {
      bytes = value
    } else {
      bytes = this.emulator.cpu.registers.getUint8Array(opts.source as RegisterName)
    }

    if (opts.refSource) {
      let address = uInt8ArrayToNumber(bytes)

      if (opts.source === 'c') {
        address += 0xff00
      }

      bytes = this.emulator.bus.readBytes(address, 1)
    }

    if (opts.target === 'd16') {
      target = uInt8ArrayToNumber(value)
    } else if (opts.refTarget && opts.target === 'c') {
      target = 0xff00 + this.emulator.cpu.registers.get('c')
    } else {
      target = opts.target
    }

    if (typeof target === 'number' || opts.refTarget) {
      const destValue = this._getValue(target)
      this.emulator.bus.writeBytes(destValue, Array.from(bytes))
    } else {
      this.emulator.cpu.registers.setUint8Array(target, bytes)
    }

    if (opts.incHl) {
      this.emulator.cpu.registers.set('hl', this.emulator.cpu.registers.get('hl') + 1)
    } else if (opts.decHl) {
      this.emulator.cpu.registers.set('hl', this.emulator.cpu.registers.get('hl') - 1)
    }
  }

  ldh(value: Uint8Array, toA: boolean) {
    const offset = uInt8ArrayToNumber(value)
    const address = 0xff00 + offset

    if (toA) {
      this.emulator.cpu.registers.set('a', this.emulator.bus.readByte(address))
    } else {
      this.emulator.bus.writeByte(address, this.emulator.cpu.registers.get('a'))
    }
  }

  push(reg: GpSixteenBitRegisterName | 'pc' | number) {
    const sp = this.emulator.cpu.registers.get('sp')
    const value = this._getValue(reg)

    this.emulator.bus.writeByte(sp - 1, value >> 8)
    this.emulator.bus.writeByte(sp - 2, value & 0xff)

    this.emulator.cpu.registers.decStackPointer()
  }

  pop(reg: GpSixteenBitRegisterName) {
    this.emulator.cpu.registers.set(reg, this.readStack())
    this.emulator.cpu.registers.incStackPointer()
  }

  call(address: Uint8Array, mode?: JumpMode | null) {
    const pc = this.emulator.cpu.registers.get('pc')
    const newPc = this.jp(address, mode)

    if (newPc !== undefined) {
      this.push(pc)
    }

    return newPc
  }

  ret(mode?: JumpMode) {
    const address = this.readStack()
    const newPc = this.jp(address, mode)

    if (newPc !== undefined) {
      this.emulator.cpu.registers.incStackPointer()
    }

    return newPc
  }

  scf() {
    this.emulator.cpu.registers.setFlag('Carry', true)
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
  }

  ccf() {
    this.emulator.cpu.registers.setFlag('Subtraction', false)
    this.emulator.cpu.registers.setFlag('HalfCarry', false)
    this.emulator.cpu.registers.setFlag('Carry', !this.emulator.cpu.registers.getFlag('Carry'))
  }

  ei() {
    this.emulator.cpu.setIME(true)
  }

  di() {
    this.emulator.cpu.setIME(false)
  }

  reti() {
    this.ret()
    this.ei()
  }

  rst(offset: Uint8Array | number) {
    const value = uInt8ArrayToNumber(offset)
    this.push(this.emulator.cpu.registers.get('pc'))
    return this.jp(value)
  }
}
