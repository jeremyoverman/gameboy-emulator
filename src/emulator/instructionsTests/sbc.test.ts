import { CPU } from "../cpu";
import { Instructions } from "../instructions";
import { Flag } from "../registers";

test("subtracting two numbers with carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.setFlag(Flag.Carry, true);

  cpu.registers.set("a", 0x03);
  cpu.registers.set("b", 0x01);
  instructions.sbc("b");

  expect(cpu.registers.get("a")).toEqual(0x01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting two numbers with carry directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.setFlag(Flag.Carry, true);

  cpu.registers.set("a", 0x03);
  instructions.sbc(0x01);

  expect(cpu.registers.get("a")).toEqual(0x01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting HL with carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.setFlag(Flag.Carry, true);

  cpu.registers.set("hl", 0xff03);
  cpu.registers.set("bc", 0x0001);
  instructions.sbc("bc");

  expect(cpu.registers.get("hl")).toEqual(0xff01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});
