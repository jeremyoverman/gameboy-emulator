import { Memory } from "./memory";

test("Reading a byte from memory", () => {
  const memory = new Memory();
  memory.memory[0x00ff] = 0xbb;

  expect(memory.readByte(0x00ff)).toEqual(0xbb);
});

test("Writing a byte to memory", () => {
  const memory = new Memory();
  memory.writeByte(0x00ff, 0xbb);

  expect(memory.memory[0x00ff]).toEqual(0xbb);
});

test("Reading and writing an io register with 1 byte", () => {
  const memory = new Memory();

  memory.writeIoRegister("joypad", 0xab);

  expect(memory.readByte(0xff00)).toEqual(0xab);

  const value = memory.readIoRegister("joypad");
  expect(value).toBe(0xab);
});

test("Reading and writing an io register with multiple bytes", () => {
  const memory = new Memory();

  memory.writeIoRegister("serial", [0xab, 0xcd]);

  expect(memory.readByte(0xff01)).toEqual(0xab);
  expect(memory.readByte(0xff02)).toEqual(0xcd);

  const value = memory.readIoRegister("serial");
  expect(value).toEqual(new Uint8Array([0xab, 0xcd]));
});