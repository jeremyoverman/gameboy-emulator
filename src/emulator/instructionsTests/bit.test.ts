import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../cpu";

test("An 8 bit register with a bit set", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.bit("b", 0);

  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("An 8 bit register with a bit unset", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.bit("b", 3);

  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("A 16 bit register with a bit set", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0b0000_0111_0000_0000);
  instructions.bit("bc", 8);

  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});
