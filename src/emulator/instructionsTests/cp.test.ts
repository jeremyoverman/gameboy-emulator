import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../cpu";

test("comparing two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x03);
  cpu.registers.set("b", 0x02);
  instructions.cp("b");

  expect(cpu.registers.get("a")).toEqual(0x03);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a half carry should be set if the lower nibble carries", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x10);
  cpu.registers.set("b", 0x01);
  instructions.cp("b");

  expect(cpu.registers.get("a")).toEqual(0x10);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a carry should be set if the result carries", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x01);
  cpu.registers.set("b", 0x02);
  instructions.cp("b");

  expect(cpu.registers.get("a")).toEqual(0x01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("comparing two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x03);
  instructions.cp(0x02);

  expect(cpu.registers.get("a")).toEqual(0x03);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("comparing two 16bit numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0x0300);
  cpu.registers.set("bc", 0x0200);
  instructions.cp("bc");

  expect(cpu.registers.get("hl")).toEqual(0x0300);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a 16bit half carry should be set if the lower byte carries", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0x0000);
  cpu.registers.set("bc", 0x0001);
  instructions.cp("bc");

  expect(cpu.registers.get("hl")).toEqual(0x0000);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("a 16bit carry should be set if the result carries", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0x0000);
  cpu.registers.set("bc", 0x0001);
  instructions.cp("bc");

  expect(cpu.registers.get("hl")).toEqual(0x0000);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});
