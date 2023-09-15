import { CPU } from "./cpu";
import {
  ArithmeticRegisterName,
  Flag,
  RegisterName,
  SixteenBitRegisterName,
} from "./registers";

type ArithmeticReturn = {
  value: number;
  carry: boolean;
  halfCarry: boolean;
  zero: boolean;
  subtraction: boolean;
};

export class Instructions {
  cpu: CPU;

  constructor(cpu: CPU) {
    this.cpu = cpu;
  }

  private _setWithFlags(
    reg: ArithmeticRegisterName | null,
    ret: ArithmeticReturn
  ) {
    this.cpu.registers.setFlag(Flag.Carry, ret.carry);
    this.cpu.registers.setFlag(Flag.Zero, ret.zero);
    this.cpu.registers.setFlag(Flag.Subtraction, ret.subtraction);
    this.cpu.registers.setFlag(Flag.HalfCarry, ret.halfCarry);

    if (reg) {
      this.cpu.registers.set(reg, ret.value);
    }
  }

  private _add(
    num1: number,
    num2: number,
    withCarry?: boolean,
    sixteenBit?: boolean
  ) {
    const maxFull = sixteenBit ? 0xffff : 0xff;
    const maxHalf = sixteenBit ? 0xff : 0xf;

    const ret: ArithmeticReturn = {
      value: num1 + num2,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: false,
    };

    if (withCarry && this.cpu.registers.getFlag(Flag.Carry)) {
      ret.value += 1;
    }

    if (ret.value > maxFull) {
      // Handle overflow
      ret.value = ret.value & maxFull;
      ret.carry = true;
    }

    ret.zero = ret.value === 0;
    ret.halfCarry = (num1 & maxHalf) + (num2 & maxHalf) > maxHalf;

    return ret;
  }

  private _subtract(
    num1: number,
    num2: number,
    withCarry?: boolean,
    sixteenBit?: boolean
  ) {
    const minFull = sixteenBit ? 0xffff : 0xff;
    const minHalf = sixteenBit ? 0xff : 0xf;

    const ret: ArithmeticReturn = {
      value: num1 - num2,
      carry: false,
      halfCarry: false,
      zero: false,
      subtraction: true,
    };

    if (withCarry && this.cpu.registers.getFlag(Flag.Carry)) {
      ret.value -= 1;
    }

    if (ret.value < 0) {
      // Handle overflow
      ret.value = ret.value & minFull;
      ret.carry = true;
    }

    ret.zero = ret.value === 0;
    ret.halfCarry = (num1 & minHalf) - (num2 & minHalf) < 0;

    return ret;
  }

  private _getValue(source: ArithmeticRegisterName | number) {
    return typeof source === "number" ? source : this.cpu.registers.get(source);
  }

  private _is16bit(source: ArithmeticRegisterName | number) {
    if (typeof source === "number") {
      return false;
    }

    return this.cpu.registers.is16Bit(source as SixteenBitRegisterName);
  }

  _rotate(
    reg: RegisterName,
    direction: "left" | "right",
    throughCarry?: boolean,
    shift?: boolean,
    preserveMsb?: boolean
  ) {
    const is16Bit = this.cpu.registers.is16Bit(reg as SixteenBitRegisterName);
    const value = this.cpu.registers.get(reg);
    const leftBit = is16Bit ? 15 : 7;
    const msb = (value >> leftBit) & 0x1;

    // Get the bit that will be shifted out
    const bit = direction === "left" ? leftBit : 0;
    const bitValue = (value >> bit) & 0x1;

    // Shift the value
    let result = direction === "left" ? value << 1 : value >> 1;

    result = result & (is16Bit ? 0xffff : 0xff);

    if (!shift) {
      result = result | (bitValue << (direction === "left" ? 0 : leftBit));
    }

    if (preserveMsb) {
      result = result | (msb << leftBit);
    }

    if (throughCarry) {
      // Set the bit that was shifted out to the carry flag
      if (this.cpu.registers.getFlag(Flag.Carry)) {
        const sigMask = is16Bit ? 0x8000 : 0x80;
        result = result | (direction === "left" ? 0x1 : sigMask);
      }
    }

    this.cpu.registers.set(reg, result);
    this.cpu.registers.setFlag(Flag.Carry, bitValue === 1);
    this.cpu.registers.setFlag(Flag.Subtraction, false);
    this.cpu.registers.setFlag(Flag.HalfCarry, false);
    this.cpu.registers.setFlag(Flag.Zero, result === 0);
  }

  nop() {}

  halt() {
    this.cpu.halt();
  }

  stop() {
    this.cpu.stop();
  }

  bit(source: ArithmeticRegisterName, bit: number) {
    const value = this.cpu.registers.get(source);
    const bitValue = (value >> bit) & 0x1;

    this.cpu.registers.setFlag(Flag.Zero, bitValue === 0);
    this.cpu.registers.setFlag(Flag.Subtraction, false);
    this.cpu.registers.setFlag(Flag.HalfCarry, true);
  }

  set(source: ArithmeticRegisterName, bit: number) {
    const value = this.cpu.registers.get(source);

    this.cpu.registers.set(source, value | (0x1 << bit));
  }

  reset(source: ArithmeticRegisterName, bit: number) {
    const value = this.cpu.registers.get(source);

    this.cpu.registers.set(source, value & ~(0x1 << bit));
  }

  add(source: ArithmeticRegisterName | number, withCarry?: boolean) {
    const sixteenBit = this._is16bit(source);
    const value = this._getValue(source);

    if (sixteenBit) {
      const result = this._add(
        this.cpu.registers.get("hl"),
        value,
        withCarry,
        true
      );

      this._setWithFlags("hl", result);
    } else {
      const result = this._add(this.cpu.registers.get("a"), value, withCarry);
      this._setWithFlags("a", result);
    }
  }

  adc(source: ArithmeticRegisterName | number) {
    this.add(source, true);
  }

  sub(source: ArithmeticRegisterName | number, withCarry?: boolean) {
    const sixteenBit = this._is16bit(source);
    const value = this._getValue(source);

    if (sixteenBit) {
      const result = this._subtract(
        this.cpu.registers.get("hl"),
        value,
        withCarry,
        true
      );

      this._setWithFlags("hl", result);
    } else {
      const result = this._subtract(
        this.cpu.registers.get("a"),
        value,
        withCarry
      );
      this._setWithFlags("a", result);
    }
  }

  sbc(source: ArithmeticRegisterName | number) {
    this.sub(source, true);
  }

  and(source: ArithmeticRegisterName | number) {
    const reg = this._is16bit(source) ? "hl" : "a";
    const value = this._getValue(source);
    this.cpu.registers.set(reg, this.cpu.registers.get(reg) & value);
  }

  xor(source: ArithmeticRegisterName | number) {
    const reg = this._is16bit(source) ? "hl" : "a";
    const value = this._getValue(source);
    this.cpu.registers.set(reg, this.cpu.registers.get(reg) ^ value);
  }

  or(source: ArithmeticRegisterName | number) {
    const reg = this._is16bit(source) ? "hl" : "a";
    const value = this._getValue(source);
    this.cpu.registers.set(reg, this.cpu.registers.get(reg) | value);
  }

  cp(source: ArithmeticRegisterName | number) {
    const sixteenBit = this._is16bit(source);
    const value = this._getValue(source);
    const result = this._subtract(
      this.cpu.registers.get(sixteenBit ? "hl" : "a"),
      value,
      false,
      sixteenBit
    );

    this._setWithFlags(null, result);
  }

  inc(source: ArithmeticRegisterName) {
    const result = this._add(
      this.cpu.registers.get(source),
      1,
      false,
      this._is16bit(source)
    );
    this._setWithFlags(source, result);
  }

  dec(source: ArithmeticRegisterName) {
    const result = this._subtract(
      this.cpu.registers.get(source),
      1,
      false,
      this._is16bit(source)
    );

    this._setWithFlags(source, result);
  }

  cpl() {
    this.cpu.registers.set("a", this.cpu.registers.get("a") ^ 0xff);
    this.cpu.registers.setFlag(Flag.Subtraction, true);
    this.cpu.registers.setFlag(Flag.HalfCarry, true);
  }

  daa() {
    // note: assumes a is a uint8_t and wraps from 0xff to 0
    let newValue = this.cpu.registers.get("a");

    if (!this.cpu.registers.getFlag(Flag.Subtraction)) {
      // after an addition, adjust if (half-)carry occurred or if result is out of bounds
      if (this.cpu.registers.getFlag(Flag.Carry) || newValue > 0x99) {
        newValue += 0x60;
        this.cpu.registers.setFlag(Flag.Carry, true);
      }

      if (
        this.cpu.registers.getFlag(Flag.HalfCarry) ||
        (newValue & 0x0f) > 0x09
      ) {
        newValue += 0x6;
      }
    } else {
      // after a subtraction, only adjust if (half-)carry occurred
      if (this.cpu.registers.getFlag(Flag.Carry)) {
        newValue -= 0x60;
      }
      if (this.cpu.registers.getFlag(Flag.HalfCarry)) {
        newValue -= 0x6;
      }
    }

    this.cpu.registers.setFlag(Flag.Zero, newValue == 0);
    this.cpu.registers.setFlag(Flag.HalfCarry, false);
    this.cpu.registers.set("a", newValue);
  }

  rlca() {
    this._rotate("a", "left");
  }

  rla() {
    this._rotate("a", "left", true);
  }

  rrca() {
    this._rotate("a", "right");
  }

  rra() {
    this._rotate("a", "right", true);
  }

  rlc(reg: RegisterName) {
    this._rotate(reg, "left");
  }

  rl(reg: RegisterName) {
    this._rotate(reg, "left", true);
  }

  rrc(reg: RegisterName) {
    this._rotate(reg, "right");
  }

  rr(reg: RegisterName) {
    this._rotate(reg, "right", true);
  }

  sla(reg: RegisterName) {
    this._rotate(reg, "left", false, true);
  }

  sra(reg: RegisterName) {
    this._rotate(reg, "right", false, true, true);
  }

  srl(reg: RegisterName) {
    this._rotate(reg, "right", false, true);
  }

  swap(reg: RegisterName) {
    const value = this.cpu.registers.get(reg);

    const shift = this.cpu.registers.is16Bit(reg) ? 8 : 4;
    const lowerMask = this.cpu.registers.is16Bit(reg) ? 0xff : 0xf;

    const low = value & lowerMask;
    const high = (value >> shift) & lowerMask;
    const result = (low << shift) | high;

    this.cpu.registers.set(reg, result);
    this.cpu.registers.setFlag(Flag.Carry, false);
    this.cpu.registers.setFlag(Flag.Subtraction, false);
    this.cpu.registers.setFlag(Flag.HalfCarry, false);
    this.cpu.registers.setFlag(Flag.Zero, result === 0);
  }
}
