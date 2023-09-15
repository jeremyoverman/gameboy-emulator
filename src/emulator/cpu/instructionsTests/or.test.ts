import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../";

test("oring two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("b", 0b00000101);
  instructions.or("b");

  expect(cpu.registers.get("a")).toEqual(0b00000111);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("oring two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  instructions.or(0b00000101);

  expect(cpu.registers.get("a")).toEqual(0b00000111);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("oring two 16 bit numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0b00000111_00000000);
  cpu.registers.set("bc", 0b00000101_00000000);
  instructions.or("bc");

  expect(cpu.registers.get("hl")).toEqual(0b00000111_00000000);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);
});
