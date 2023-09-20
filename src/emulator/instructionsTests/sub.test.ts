import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../cpu";

test("subtracting two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x03);
  cpu.registers.set("b", 0x02);
  instructions.sub("b");

  expect(cpu.registers.get("a")).toEqual(0x01);
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
  instructions.sub("b");

  expect(cpu.registers.get("a")).toEqual(0x0f);
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
  instructions.sub("b");

  expect(cpu.registers.get("a")).toEqual(0xff);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x03);
  instructions.sub(0x02);

  expect(cpu.registers.get("a")).toEqual(0x01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting with HL", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0xffff);
  cpu.registers.set("bc", 0x0001);
  instructions.sub("bc");

  expect(cpu.registers.get("hl")).toEqual(0xfffe);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting with HL with half carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0b1111_1111_0000_0000);
  cpu.registers.set("bc", 0b0000_0000_000_00001);
  instructions.sub("bc");

  expect(cpu.registers.get("hl")).toEqual(0b1111_1110_1111_1111);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting with HL carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0x0000);
  cpu.registers.set("bc", 0x0001);
  instructions.sub("bc");

  expect(cpu.registers.get("hl")).toEqual(0xffff);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});

test("subtracting from hl address", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.memory.writeByte(0xff00, 0x02);
  cpu.registers.set("a", 0x03);
  cpu.registers.set("hl", 0xff00);
  instructions.sub("hl", false, true);

  expect(cpu.registers.get("a")).toEqual(0x01);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
});