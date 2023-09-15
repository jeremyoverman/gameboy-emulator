import { Instructions } from "../instructions";
import { Flag, Registers } from "../registers";

test("subtracting two numbers", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0x03);
  registers.set("b", 0x02);
  instructions.sub("b");

  expect(registers.get("a")).toEqual(0x01);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a half carry should be set if the lower nibble carries", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0x10);
  registers.set("b", 0x01);
  instructions.sub("b");

  expect(registers.get("a")).toEqual(0x0f);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a carry should be set if the result carries", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.set("a", 0x01);
  registers.set("b", 0x02);
  instructions.sub("b");

  expect(registers.get("a")).toEqual(0xff);
  expect(registers.getFlag(Flag.Carry)).toEqual(true);
  expect(registers.getFlag(Flag.Zero)).toEqual(false);
  expect(registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(registers.getFlag(Flag.Subtraction)).toEqual(true);
});
