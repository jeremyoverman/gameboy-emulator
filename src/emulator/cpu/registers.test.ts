import { Flag, Registers } from "./registers";

test("Test setting a single register works", () => {
  const registers = new Registers(() => {});
  registers.set("a", 0xff);

  expect(registers.a).toEqual(0xff);
});

test("Test getting a single register works", () => {
  const registers = new Registers(() => {});

  const value = 0xff;
  registers.set("a", value);

  expect(registers.get("a")).toEqual(value);
});

test("Test setting a dual register works", () => {
  const registers = new Registers(() => {});

  registers.set("af", 0xfffe);

  expect(registers.a).toEqual(0xff);
  expect(registers.f).toEqual(0xfe);
});

test("Test getting a dual register works", () => {
  const registers = new Registers(() => {});

  const value = 0xfffe;
  registers.set("af", value);

  expect(registers.get("af")).toEqual(value);
});

test("Test setting the Zero flag to True", () => {
  const registers = new Registers(() => {});
  registers.setFlag(Flag.Zero, true);

  expect(registers.f).toEqual(0b00010000);
});

test("Test setting the Zero flag to False", () => {
  const registers = new Registers(() => {});
  registers.set("f", 0b01010000);
  registers.setFlag(Flag.Zero, false);

  expect(registers.f).toEqual(0b01000000);
});

test("Test getting the Zero flag", () => {
  const registers = new Registers(() => {});
  registers.setFlag(Flag.Zero, true);

  console.log("est");

  expect(registers.getFlag(Flag.Zero)).toEqual(true);
});
