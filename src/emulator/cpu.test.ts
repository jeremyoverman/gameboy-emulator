import { CPU } from "./cpu";

test("Stepping an instruction", () => {
  const cpu = new CPU(() => {});

  cpu.registers.set("pc", 0x0000);
  cpu.registers.set("a", 0b1010_0000);
  cpu.registers.set("b", 0b0000_1111);
  cpu.memory.writeByte(0x00, 0xb0); // OR B
  cpu.step();

  expect(cpu.registers.get("a")).toBe(0b1010_1111);
  expect(cpu.registers.get('pc')).toBe(0x0001);
});

test("Stepping 2-byte instruction", () => {
  const cpu = new CPU(() => {});

  cpu.registers.set("pc", 0x0000);
  cpu.registers.set("a", 0x01);
  cpu.memory.writeByte(0x00, 0xc6); // ADD A, d8
  cpu.memory.writeByte(0x01, 0x01);
  cpu.step();

  expect(cpu.registers.get("a")).toBe(0x02);
  expect(cpu.registers.get('pc')).toBe(0x0002);
});

test("Jumping", () => {
  const cpu = new CPU(() => {});

  cpu.registers.set("pc", 0x0000);
  cpu.memory.writeBytes(0x0000, 
    [0xc3, 0xAA, 0xBB] // JP a16
  );
  cpu.step();

  expect(cpu.registers.get('pc')).toBe(0xBBAA);
});

test("Multiple bit operations", () => {
  const cpu = new CPU(() => {});

  cpu.registers.set("pc", 0x0000);
  cpu.registers.set("b", 0x00);
  cpu.registers.set("c", 0x00);
  cpu.registers.set("d", 0x00);

  cpu.memory.writeBytes(0x00, [
    0xcb, 0xc0, // SET 0, B
    0xcb, 0xc1, // SET 0, C
    0xcb, 0xc2, // SET 0, D
  ]);

  cpu.step();
  cpu.step();
  cpu.step();

  expect(cpu.registers.get('pc')).toBe(0x0006);
  expect(cpu.registers.get("b")).toBe(0x01);
  expect(cpu.registers.get("c")).toBe(0x01);
  expect(cpu.registers.get("d")).toBe(0x01);
})