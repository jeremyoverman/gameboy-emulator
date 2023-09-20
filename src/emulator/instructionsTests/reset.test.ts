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

test("Resetting a 1 bit on an 8 bit register", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.memory.writeByte(0xff00, 0b0000_1111);
  cpu.registers.set("hl", 0xff00);
  instructions.reset("hl", 3);

  expect(cpu.memory.readByte(0xff00)).toEqual(0b0000_0111);
});