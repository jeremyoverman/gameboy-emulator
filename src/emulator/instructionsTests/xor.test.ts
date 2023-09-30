import { Instructions } from "../instructions";

import { CPU } from "../cpu";

test("xoring two numbers", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("b", 0b00000101);
  instructions.xor("b");

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});

test("xoring two numbers directly", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b00000111);
  instructions.xor(0b00000101);

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});

test("xoring hl reference", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.memory.writeByte(0xff00, 0b00000101)
  cpu.registers.set("a", 0b00000111);
  cpu.registers.set("hl", 0xff00);
  instructions.xor("hl", true);

  expect(cpu.registers.get("a")).toEqual(0b00000010);
  expect(cpu.registers.getFlag('Carry')).toEqual(false);
  expect(cpu.registers.getFlag('Zero')).toEqual(false);
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false);
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false);
});