import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../cpu";

test("A = 0x80, H = 0, C = 0, N = 1", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x80);
  cpu.registers.setFlag(Flag.HalfCarry, false);
  cpu.registers.setFlag(Flag.Carry, false);
  cpu.registers.setFlag(Flag.Subtraction, true);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x80);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);

  // Result: A = 0x80, F = 0x40 (Z = 0, H = 0, C = 0, N = 1)
});

test("A = 0x20, H = 1, C = 0, N = 1", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x20);
  cpu.registers.setFlag(Flag.HalfCarry, true);
  cpu.registers.setFlag(Flag.Carry, false);
  cpu.registers.setFlag(Flag.Subtraction, true);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x1a);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);

  // Result: A = 0x1A, F = 0x40 (Z = 0, H = 0, C = 0, N = 1)
});

xtest("A = 0x70, H = 0, C = 1, N = 1", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x70);
  cpu.registers.setFlag(Flag.HalfCarry, false);
  cpu.registers.setFlag(Flag.Carry, true);
  cpu.registers.setFlag(Flag.Subtraction, true);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x0a);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);

  // Result: A = 0x0A, F = 1 (Z = 0, H = 0, C = 1, N = 0)
});

xtest("A = 0x02, H = 1, C = 1, N = 1", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x02);
  cpu.registers.setFlag(Flag.HalfCarry, true);
  cpu.registers.setFlag(Flag.Carry, true);
  cpu.registers.setFlag(Flag.Subtraction, true);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x9c);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);

  // Result: A = 0x9C, F = 1 (Z = 0, H = 0, C = 1, N = 0)
});

xtest("A = 0xFF, H = 0, C = 0, N = 0", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0xff);
  cpu.registers.setFlag(Flag.HalfCarry, false);
  cpu.registers.setFlag(Flag.Carry, false);
  cpu.registers.setFlag(Flag.Subtraction, false);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x05);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);

  // Result: A = 0x05, F = 1 (Z = 0, H = 0, C = 1)
});

xtest("A = 0x00, H = 0, C = 0, N = 0", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0x00);
  cpu.registers.setFlag(Flag.HalfCarry, false);
  cpu.registers.setFlag(Flag.Carry, false);
  cpu.registers.setFlag(Flag.Subtraction, false);

  instructions.daa();

  expect(cpu.registers.get("a")).toEqual(0x00);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Zero)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(false);

  // Result: A = 0x00, F = 0x80 (Z = 1, H = 0, C = 0)
});
