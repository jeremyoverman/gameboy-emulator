import { CPU } from "../cpu"

test('PUSH BC', () => {
  const cpu = new CPU(() => {});

  cpu.registers.set('pc', 0x0000);
  cpu.registers.set('sp', 0xfffe);
  cpu.registers.set('bc', 0xaabb)
  cpu.memory.writeByte(0x0000, 0xc5) // PUSH BC

  cpu.step()

  expect(cpu.memory.readByte(0xfffd)).toBe(0xaa)
  expect(cpu.memory.readByte(0xfffc)).toBe(0xbb)
})

test('POP BC', () => {
  const cpu = new CPU(() => {});

  cpu.registers.set('pc', 0x0000);
  cpu.registers.set('sp', 0xfffc);
  cpu.memory.writeByte(0x0000, 0xc1) // POP BC
  cpu.memory.writeByte(0xfffc, 0xbb)
  cpu.memory.writeByte(0xfffd, 0xaa)

  cpu.step()

  expect(cpu.registers.get('bc')).toBe(0xaabb)
})