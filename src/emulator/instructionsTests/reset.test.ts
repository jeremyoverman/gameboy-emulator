import { CPU } from "../cpu";
import { Instructions } from "../instructions";

test("Resetting a 0 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.reset("b", 3);

  expect(cpu.registers.get("b")).toEqual(0b0000_0111);
});

test("Resetting a 1 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.reset("b", 2);

  expect(cpu.registers.get("b")).toEqual(0b0000_0011);
});

test("Resetting a 0 bit on an 16 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0b0000_0111_0000_0000);
  instructions.reset("bc", 11);

  expect(cpu.registers.get("bc")).toEqual(0b0000_0111_0000_0000);
});

test("Resetting a 1 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0b0000_0111_0000_0000);
  instructions.reset("bc", 10);

  expect(cpu.registers.get("bc")).toEqual(0b0000_0011_0000_0000);
});
