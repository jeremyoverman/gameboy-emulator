import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../";

test("incrementing a register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0x03);
  instructions.inc("b");

  expect(cpu.registers.get("b")).toEqual(0x04);
});

test("incrementing a register with carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0xff);
  instructions.inc("b");

  expect(cpu.registers.get("b")).toEqual(0x00);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(true);
});

test("incrementing a register with half carry", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_1111);
  instructions.inc("b");

  expect(cpu.registers.get("b")).toEqual(0b0001_0000);
  expect(cpu.registers.getFlag(Flag.Carry)).toEqual(false);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
});

test("incrementing a 16bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0x0300);
  instructions.inc("bc");

  expect(cpu.registers.get("bc")).toEqual(0x0301);
});
