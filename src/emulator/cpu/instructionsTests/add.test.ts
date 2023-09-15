import { Instructions } from "../instructions";
import { Flag, Registers } from "../registers";

test("add a number with no overflow", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0x01);
  registers.set("b", 0x02);
  instructions.add("b");

  expect(registers.get("a")).toEqual(0x03);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("add a number with overflow", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0xff);
  registers.set("b", 0x05);
  instructions.add("b");

  expect(registers.get("a")).toEqual(0x04);
  expect(registers.getFlag(Flag.Carry)).toEqual(true);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("add a number resulting in 0", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0x00);
  registers.set("b", 0x00);
  instructions.add("b");

  expect(registers.get("a")).toEqual(0x00);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
  expect(registers.getFlag(Flag.Zero)).toEqual(true);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(false);
});

test("add a number resulting in half carry", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0b1000_1111);
  registers.set("b", 0b0000_0001);
  instructions.add("b");

  expect(registers.get("a")).toEqual(0b1001_0000);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(false);
});
