import { Instructions } from "../instructions";
import { Flag } from "../registers";
import { CPU } from "../";

test("complinents the accumulator", () => {
  const cpu = new CPU(() => {});
  const instructions = new Instructions(cpu);

  cpu.registers.set("a", 0b0000_1111);
  instructions.cpl();

  expect(cpu.registers.get("a")).toEqual(0b1111_0000);
  expect(cpu.registers.getFlag(Flag.Subtraction)).toEqual(true);
  expect(cpu.registers.getFlag(Flag.HalfCarry)).toEqual(true);
});
