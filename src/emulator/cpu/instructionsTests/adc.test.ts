import { Instructions } from "../instructions";
import { Flag, Registers } from "../registers";

test("Adding a number without the carry bit set", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.setFlag(Flag.Carry, false);
  registers.set("a", 0x01);
  registers.set("b", 0x02);
  instructions.adc("b");

  expect(registers.get("a")).toEqual(0x03);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
});

test("Adding a number with the carry bit set", () => {
  const registers = new Registers(() => {});
  const instructions = new Instructions(registers);

  registers.setFlag(Flag.Carry, true);
  registers.set("a", 0x01);
  registers.set("b", 0x02);
  instructions.adc("b");

  expect(registers.get("a")).toEqual(0x04);
  expect(registers.getFlag(Flag.Carry)).toEqual(false);
});
