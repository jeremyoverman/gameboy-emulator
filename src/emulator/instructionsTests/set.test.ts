import { CPU } from "../cpu";
import { Instructions } from "../instructions";

test("Setting a 0 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.set("b", 3);

  expect(cpu.registers.get("b")).toEqual(0b0000_1111);
});

test("Setting a 1 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("b", 0b0000_0111);
  instructions.set("b", 2);

  expect(cpu.registers.get("b")).toEqual(0b0000_0111);
});

test("Setting a 0 bit on an 16 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0b0000_0111_0000_0000);
  instructions.set("bc", 11);

  expect(cpu.registers.get("bc")).toEqual(0b0000_1111_0000_0000);
});

test("Setting a 1 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("bc", 0b0000_0111_0000_0000);
  instructions.set("bc", 10);

  expect(cpu.registers.get("bc")).toEqual(0b0000_0111_0000_0000);
});
