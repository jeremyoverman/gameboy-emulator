import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../cpu";

test("xoring two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("b", 0b00000101);
  instructions.xor("b");

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("xoring two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  instructions.xor(0b00000101);

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("xoring two 16bit numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0b00000111_00000000);
  cpu.registers.set("bc", 0b00000101_00000000);
  instructions.xor("bc");

  expect(cpu.registers.get("hl")).toEqual(0b00000010_00000000);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("xoring hl reference", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.memory.writeByte(0xff00, 0b00000101)
  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("hl", 0xff00);
  instructions.xor("hl", true);

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});