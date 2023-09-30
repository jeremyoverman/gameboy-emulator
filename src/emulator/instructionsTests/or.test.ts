import { Instructions } from "../instructions";

import { CPU } from "../cpu";

test("oring two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("b", 0b00000101);
  instructions.or("b");

  expect(cpu.registers.get("a")).toEqual(0b00000111);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});

test("oring two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  instructions.or(0b00000101);

  expect(cpu.registers.get("a")).toEqual(0b00000111);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});

test("oring two 16 bit numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("hl", 0b00000111_00000000);
  cpu.registers.set("bc", 0b00000101_00000000);
  instructions.or("bc");

  expect(cpu.registers.get("hl")).toEqual(0b00000111_00000000);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});

test("oring hl reference", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.memory.writeByte(0xff00, 0b00000101);
  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("hl", 0xff00);
  instructions.or("hl", true);

  expect(cpu.registers.get("a")).toEqual(0b00000111);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});