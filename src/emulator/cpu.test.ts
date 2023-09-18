import { CPU } from "./cpu";

test("Stepping an instruction", () => {
  const cpu = new CPU(() => {});

  cpu.registers.set("a", 0b1010_0000);
  cpu.registers.set("b", 0b0000_1111);
  cpu.memory.writeByte(0x00, 0xb0); // OR B
  cpu.step();

  expect(cpu.registers.get("a")).toBe(0b1010_1111);
  expect(cpu.pc).toBe(0x01);
});
