import { ArithmeticRegisterName, Flag, Registers } from "./registers";

export class Instructions {
  registers: Registers;

  constructor(registers: Registers) {
    this.registers = registers;
  }

  add(reg: ArithmeticRegisterName, withCarry?: boolean) {
    const value = this.registers.get(reg);
    let newValue = this.registers.a + value;

    if (withCarry && this.registers.getFlag(Flag.Carry)) {
      newValue += 1;
    }

    if (newValue > 0xff) {
      // Handle overflow
      newValue = newValue & 0xff;
      this.registers.setFlag(Flag.Carry, true);
    } else {
      this.registers.setFlag(Flag.Carry, false);
    }

    this.registers.setFlag(Flag.Zero, newValue === 0);
    this.registers.setFlag(Flag.Subtraction, false);
    this.registers.setFlag(
      Flag.HalfCarry,
      (value & 0xf) + (this.registers.a & 0xf) > 0xf
    );

    this.registers.set("a", newValue);
  }

  adc(reg: ArithmeticRegisterName) {
    this.add(reg, true);
  }

  sub(reg: ArithmeticRegisterName) {
    const value = this.registers.get(reg);
    let newValue = this.registers.a - value;

    if (newValue < 0) {
      // Handle overflow
      newValue = newValue & 0xff;
      this.registers.setFlag(Flag.Carry, true);
    } else {
      this.registers.setFlag(Flag.Carry, false);
    }

    this.registers.setFlag(Flag.Zero, newValue === 0);
    this.registers.setFlag(Flag.Subtraction, true);
    this.registers.setFlag(
      Flag.HalfCarry,
      (this.registers.a & 0x0f) - (value & 0x0f) < 0
    );

    this.registers.set("a", newValue);
  }
}
