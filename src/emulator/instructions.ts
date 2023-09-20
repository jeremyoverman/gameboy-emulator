import { CPU } from './cpu'
import {
  ArithmeticRegisterName,
  Flag,
  RegisterName,
  CommonSixteenBitRegisterName,
  CommonEightBitRegisterName,
} from './registers'
import { uInt8ArrayToNumber } from './utils'

type ArithmeticReturn = {
  value: number
  carry: boolean
  halfCarry: boolean
  zero: boolean
  subtraction: boolean
}

export type LoadByteTarget = CommonEightBitRegisterName | CommonSixteenBitRegisterName | 'sp'
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
  direction: 'left' | 'right',
  throughCarry?: boolean,
  shift?: boolean,
  preserveMsb?: boolean,
  reference?: boolean,
}

export class Instructions {
  private cpu: CPU

  constructor(cpu: CPU) {
    this.cpu = cpu
  }

  private _setWithFlags(reg: ArithmeticRegisterName | null, ret: ArithmeticReturn) {
    this.cpu.registers.setFlag(Flag.Carry, ret.carry)
    this.cpu.registers.setFlag(Flag.Zero, ret.zero)
    this.cpu.registers.setFlag(Flag.Subtraction, ret.subtraction)
    this.cpu.registers.setFlag(Flag.HalfCarry, ret.halfCarry)

    if (reg) {
      this.cpu.registers.set(reg, ret.value)
    }
  }

  private readStack() {
    const sp = this.cpu.registers.get('sp');
    const lsb = this.cpu.memory.readByte(sp);
    const msb = this.cpu.memory.readByte(sp + 1);

    return (msb << 8) | lsb
  }

  private _add(num1: number, num2: number, withCarry?: boolean, sixteenBit?: boolean) {
    const maxFull = sixteenBit ? 0xffff : 0xff
    const maxHalf = sixteenBit ? 0xff : 0xf

    const ret: ArithmeticReturn = {
      value: num1 + num2,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: false,
    }

    if (withCarry && this.cpu.registers.getFlag(Flag.Carry)) {
      ret.value += 1
    }

    if (ret.value > maxFull) {
      // Handle overflow
      ret.value = ret.value & maxFull
      ret.carry = true
    }

    ret.zero = ret.value === 0
    ret.halfCarry = (num1 & maxHalf) + (num2 & maxHalf) > maxHalf

    return ret
  }

  private _subtract(num1: number, num2: number, withCarry?: boolean, sixteenBit?: boolean) {
    const minFull = sixteenBit ? 0xffff : 0xff
    const minHalf = sixteenBit ? 0xff : 0xf

    const ret: ArithmeticReturn = {
      value: num1 - num2,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: true,
    }

    if (withCarry && this.cpu.registers.getFlag(Flag.Carry)) {
      ret.value -= 1
    }

    if (ret.value < 0) {
      // Handle overflow
      ret.value = ret.value & minFull
      ret.carry = true
    }

    ret.zero = ret.value === 0
    ret.halfCarry = (num1 & minHalf) - (num2 & minHalf) < 0

    return ret
  }

  private _getValue(source: ArithmeticRegisterName | number) {
    return typeof source === 'number' ? source : this.cpu.registers.get(source)
  }

  private getValueAndAddress(source: ArithmeticRegisterName | number, reference?: boolean) {
    let address: number | undefined = undefined;
    let value = this._getValue(source)

    if (reference) {
      address = value;
      value = this.cpu.memory.readByte(value);
    }

    return { address, value }
  }

  private _is16bit(source: ArithmeticRegisterName | number) {
    if (typeof source === 'number') {
      return false
    }

    return this.cpu.registers.is16Bit(source as CommonSixteenBitRegisterName)
  }

  private _convertTwosComplement(value: number) {
    // Check if the most significant bit (MSB) is set
    if (value & 0x80) {
      // If MSB is set, it's a negative value
      // Perform two's complement to convert to signed int
      return -((~value & 0xff) + 1)
    } else {
      // If MSB is not set, it's a positive value
      return value
    }
  }

  _rotate(reg: ArithmeticRegisterName, opts: RotateOptions) {
    const { address, value } = this.getValueAndAddress(reg, opts.reference)

    const is16Bit = this.cpu.registers.is16Bit(reg) && !opts.reference;
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
      // Set the bit that was shifted out to the carry flag
      if (this.cpu.registers.getFlag(Flag.Carry)) {
        const sigMask = is16Bit ? 0x8000 : 0x80
        result = result | (opts.direction === 'left' ? 0x1 : sigMask)
      }
    }

    if (address) {
      this.cpu.memory.writeByte(address, result);
    } else {
      this.cpu.registers.set(reg, result)
    }
    this.cpu.registers.setFlag(Flag.Carry, bitValue === 1)
    this.cpu.registers.setFlag(Flag.Subtraction, false)
    this.cpu.registers.setFlag(Flag.HalfCarry, false)
    this.cpu.registers.setFlag(Flag.Zero, result === 0)
  }

  nop() {}

  halt() {
    this.cpu.halt()
  }

  stop() {
    this.cpu.stop()
  }

  bit(source: CommonEightBitRegisterName | 'hl', bit: number) {
    let value = this.cpu.registers.get(source)
    if (source === 'hl') {
      value = this.cpu.memory.readByte(value);
    }
    const bitValue = (value >> bit) & 0x1

    this.cpu.registers.setFlag(Flag.Zero, bitValue === 0)
    this.cpu.registers.setFlag(Flag.Subtraction, false)
    this.cpu.registers.setFlag(Flag.HalfCarry, true)
  }

  set(reg: CommonEightBitRegisterName | 'hl', bit: number) {
    const { address, value } = this.getValueAndAddress(reg, reg === 'hl')

    const result = value | (0x1 << bit);

    if (address) {
      this.cpu.memory.writeByte(address, result);
    } else {
      this.cpu.registers.set(reg, result)
    }
  }

  reset(reg: CommonEightBitRegisterName | 'hl', bit: number) {
    const { address, value } = this.getValueAndAddress(reg, reg === 'hl')

    const result = value & ~(0x1 << bit)

    if (address) {
      this.cpu.memory.writeByte(address, result);
    } else {
      this.cpu.registers.set(reg, result)
    }
  }

  add_sp(target: 'sp' | 'hl', value: number) {
    value = this._convertTwosComplement(value)

    const sp = this.cpu.registers.get('sp')
    const result = this._add(sp, value)
    this._setWithFlags(target, result)
  }

  add(source: ArithmeticRegisterName | number, withCarry?: boolean, reference?: boolean) {
    const sixteenBit = this._is16bit(source)
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
      const result = this._add(this.cpu.registers.get('a'), value, withCarry)
      this._setWithFlags('a', result)
    } else if (sixteenBit) {
      const result = this._add(this.cpu.registers.get('hl'), value, withCarry, true)

      this._setWithFlags('hl', result)
    } else {
      const result = this._add(this.cpu.registers.get('a'), value, withCarry)
      this._setWithFlags('a', result)
    }
  }

  adc(source: ArithmeticRegisterName | number, reference?: boolean) {
    this.add(source, true, reference)
  }

  sub(source: ArithmeticRegisterName | number, withCarry?: boolean, reference?: boolean) {
    const sixteenBit = this._is16bit(source)
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
      const result = this._subtract(this.cpu.registers.get('a'), value, withCarry)
      this._setWithFlags('a', result)
    } else if (sixteenBit) {
      const result = this._subtract(this.cpu.registers.get('hl'), value, withCarry, true)

      this._setWithFlags('hl', result)
    } else {
      const result = this._subtract(this.cpu.registers.get('a'), value, withCarry)
      this._setWithFlags('a', result)
    }
  }

  sbc(source: ArithmeticRegisterName | number, reference?: boolean) {
    this.sub(source, true, reference)
  }

  and(source: ArithmeticRegisterName | number, reference?: boolean) {
    const reg = this._is16bit(source) && !reference ? 'hl' : 'a'
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
    }

    this.cpu.registers.set(reg, this.cpu.registers.get(reg) & value)
  }

  xor(source: ArithmeticRegisterName | number, reference?: boolean) {
    const reg = this._is16bit(source) && !reference ? 'hl' : 'a'
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
    }

    this.cpu.registers.set(reg, this.cpu.registers.get(reg) ^ value)
  }

  or(source: ArithmeticRegisterName | number, reference?: boolean) {
    const reg = this._is16bit(source) && !reference ? 'hl' : 'a'
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
    }

    this.cpu.registers.set(reg, this.cpu.registers.get(reg) | value)
  }

  cp(source: ArithmeticRegisterName | number, reference?: boolean) {
    const sixteenBit = this._is16bit(source) && !reference;
    const reg = sixteenBit ? 'hl' : 'a'
    let value = this._getValue(source)

    if (reference) {
      value = this.cpu.memory.readByte(value);
    }

    const result = this._subtract(this.cpu.registers.get(reg), value, false, sixteenBit)

    this._setWithFlags(null, result)
  }

  inc(source: ArithmeticRegisterName, reference?: boolean) {
    let value = this._getValue(source)

    if (reference) {
      const address = value;
      value = this.cpu.memory.readByte(value);
      const result = this._add(value, 1, false, this._is16bit(source))

      this.cpu.memory.writeByte(address, result.value);
      this._setWithFlags(null, result)
    } else {
      const result = this._add(value, 1, false, this._is16bit(source))
      this._setWithFlags(source, result)
    }
  }

  dec(source: ArithmeticRegisterName, reference?: boolean) {
    let value = this._getValue(source)

    if (reference) {
      const address = value;
      value = this.cpu.memory.readByte(value);
      const result = this._subtract(value, 1, false, this._is16bit(source))

      this.cpu.memory.writeByte(address, result.value);
      this._setWithFlags(null, result)
    } else {
      const result = this._subtract(value, 1, false, this._is16bit(source))
      this._setWithFlags(source, result)
    }
  }

  cpl() {
    this.cpu.registers.set('a', this.cpu.registers.get('a') ^ 0xff)
    this.cpu.registers.setFlag(Flag.Subtraction, true)
    this.cpu.registers.setFlag(Flag.HalfCarry, true)
  }

  daa() {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    let newValue = this.cpu.registers.get('a')

    if (!this.cpu.registers.getFlag(Flag.Subtraction)) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (this.cpu.registers.getFlag(Flag.Carry) || newValue > 0x99) {
        newValue += 0x60
        this.cpu.registers.setFlag(Flag.Carry, true)
      }

      if (this.cpu.registers.getFlag(Flag.HalfCarry) || (newValue & 0x0f) > 0x09) {
        newValue += 0x6
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (this.cpu.registers.getFlag(Flag.Carry)) {
        newValue -= 0x60
      }
      if (this.cpu.registers.getFlag(Flag.HalfCarry)) {
        newValue -= 0x6
      }
    }

    this.cpu.registers.setFlag(Flag.Zero, newValue == 0)
    this.cpu.registers.setFlag(Flag.HalfCarry, false)
    this.cpu.registers.set('a', newValue)
  }

  rlca(reference?: boolean) {
    this._rotate('a', {
      direction: 'left',
      reference
    })
  }

  rla(reference?: boolean) {
    this._rotate('a', {
      direction: 'left',
      throughCarry: true,
      reference
    })
  }

  rrca(reference?: boolean) {
    this._rotate('a', {
      direction: 'right',
      reference
    })
  }

  rra(reference?: boolean) {
    this._rotate('a', {
      direction: 'right',
      throughCarry: true,
      reference
    })
  }

  rlc(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      reference
    })
  }

  rl(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      throughCarry: true,
      reference
    })
  }

  rrc(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      reference
    })
  }

  rr(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      throughCarry: true,
      reference
    })
  }

  sla(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'left',
      shift: true,
      reference
    })
  }

  sra(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      shift: true,
      preserveMsb: true,
      reference
    })
  }

  srl(reg: ArithmeticRegisterName, reference?: boolean) {
    this._rotate(reg, {
      direction: 'right',
      shift: true,
      reference
    })
  }

  swap(reg: ArithmeticRegisterName, reference?: boolean) {
    const { address, value } = this.getValueAndAddress(reg, reference);
    const is16Bit = this.cpu.registers.is16Bit(reg) && !reference;

    const shift = is16Bit ? 8 : 4
    const lowerMask = is16Bit ? 0xff : 0xf

    const low = value & lowerMask
    const high = (value >> shift) & lowerMask
    const result = (low << shift) | high

    if (address) {
      this.cpu.memory.writeByte(address, result);
    } else {
      this.cpu.registers.set(reg, result)
    }
    this.cpu.registers.setFlag(Flag.Carry, false)
    this.cpu.registers.setFlag(Flag.Subtraction, false)
    this.cpu.registers.setFlag(Flag.HalfCarry, false)
    this.cpu.registers.setFlag(Flag.Zero, result === 0)
  }

  jp(value?: Uint8Array | number, mode?: JumpMode | null, relative?: boolean) {
    let address: number;
    
    if (value !== undefined) {
      address = uInt8ArrayToNumber(value);
    } else {
      address = this.cpu.registers.get('hl')
    }

    if (relative) {
      const pc = this.cpu.registers.get('pc')
      address = pc + this._convertTwosComplement(address)
    }

    let jumped = false;

    if (mode === JumpMode.nz) {
      if (!this.cpu.registers.getFlag(Flag.Zero)) {
        this.cpu.registers.set('pc', address)
        jumped = true
      }
    } else if (mode === JumpMode.z) {
      if (this.cpu.registers.getFlag(Flag.Zero)) {
        this.cpu.registers.set('pc', address)
        jumped = true
      }
    } else if (mode === JumpMode.nc) {
      if (!this.cpu.registers.getFlag(Flag.Carry)) {
        this.cpu.registers.set('pc', address)
        jumped = true
      }
    } else if (mode === JumpMode.c) {
      if (this.cpu.registers.getFlag(Flag.Carry)) {
        this.cpu.registers.set('pc', address)
        jumped = true
      }
    } else {
      this.cpu.registers.set('pc', address)
      jumped = true
    }

    if (jumped) {
      return this.cpu.registers.get('pc');
    }
  }

  ld(value: Uint8Array, opts: LoadOptions) {
    let bytes: Uint8Array;
    let target: LoadByteTarget | number;

    if (opts.source === 'd8' || opts.source === 'd16') {
      bytes = value;
    } else {
      bytes = this.cpu.registers.getUint8Array(opts.source as RegisterName)
    }

    if (opts.refSource) {
      let address = uInt8ArrayToNumber(bytes);

      if (opts.source === 'c') {
        address += 0xff00;
      }

      bytes = this.cpu.memory.readBytes(address, 1)
    }

    if (opts.target === 'd16') {
      target = uInt8ArrayToNumber(value);
    } else if (opts.refTarget && opts.target === 'c') {
      target = 0xff00 + this.cpu.registers.get('c')
    } else {
      target = opts.target
    }

    if (typeof target === 'number' || opts.refTarget) {
      const destValue = this._getValue(target)
      this.cpu.memory.writeBytes(destValue, Array.from(bytes))
    } else {
      this.cpu.registers.setUint8Array(target, bytes)
    }

    if (opts.incHl) {
      this.cpu.instructions.inc('hl')
    } else if (opts.decHl) {
      this.cpu.instructions.dec('hl')
    }
  }

  ldh(value: Uint8Array, toA: boolean) {
    const offset = uInt8ArrayToNumber(value)
    const address = 0xff00 + offset

    if (toA) {
      this.cpu.registers.set('a', this.cpu.memory.readByte(address));
    } else {
      this.cpu.memory.writeByte(address, this.cpu.registers.get('a'));
    }
  }

  push(reg: CommonSixteenBitRegisterName | number) {
    const sp = this.cpu.registers.get('sp')
    const value = this._getValue(reg)

    this.cpu.memory.writeByte(sp - 1, value >> 8)
    this.cpu.memory.writeByte(sp - 2, value & 0xff)

    this.cpu.registers.decStackPointer()
  }

  pop(reg: CommonSixteenBitRegisterName) {
    this.cpu.registers.set(reg, this.readStack())
    this.cpu.registers.incStackPointer()
  }

  call(address: Uint8Array, mode?: JumpMode | null) {
    const pc = this.cpu.registers.get('pc');
    const newPc = this.jp(address, mode)

    if (newPc !== undefined) {
      this.push(pc + 1)
    }

    return newPc;
  }

  ret(mode?: JumpMode) {
    const address = this.readStack();
    const newPc = this.jp(address, mode)

    if (newPc !== undefined) {
      this.cpu.registers.incStackPointer();
    }

    return newPc;
  }

  scf() {
    this.cpu.registers.setFlag(Flag.Carry, true)
    this.cpu.registers.setFlag(Flag.Subtraction, false)
    this.cpu.registers.setFlag(Flag.HalfCarry, false)
  }

  ccf() {
    this.cpu.registers.setFlag(Flag.Carry, !this.cpu.registers.getFlag(Flag.Carry))
    this.cpu.registers.setFlag(Flag.Subtraction, false)
    this.cpu.registers.setFlag(Flag.HalfCarry, false)
  }

  ei() {
    this.cpu.setInterrupsEnabled(true)
  }

  di() {
    this.cpu.setInterrupsEnabled(false)
  }

  reti() {
    this.ret();
    this.ei();
  }

  rst(offset: Uint8Array | number) {
    const value = uInt8ArrayToNumber(offset);
    this.push(this.cpu.registers.get('pc'))
    this.jp(0x0000 + value)
  }
}
