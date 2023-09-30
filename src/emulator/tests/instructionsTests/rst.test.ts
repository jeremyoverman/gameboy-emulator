import { CPU } from '../../cpu'

const execute = (opcode: number, pc: number) => {
  const cpu = new CPU(() => {})

  cpu.registers.set('sp', 0xfffe)
  cpu.registers.set('pc', 0x0100)
  cpu.memory.writeByte(0x100, opcode)
  cpu.step()
  expect(cpu.registers.get('pc')).toEqual(pc)
  expect(cpu.memory.readByte(0xfffe)).toEqual(0x00)
  expect(cpu.memory.readByte(0xfffd)).toEqual(0x01)
}

test('0xc7: RST 00H', () => {
  execute(0xc7, 0x0000)
})

test('0xcf: RST 08H', () => {
  execute(0xcf, 0x0008)
})

test('0xd7: RST 10H', () => {
  execute(0xd7, 0x0010)
})

test('0xdf: RST 18H', () => {
  execute(0xdf, 0x0018)
})

test('0xe7: RST 20H', () => {
  execute(0xe7, 0x0020)
})

test('0xef: RST 28H', () => {
  execute(0xef, 0x0028)
})

test('0xf7: RST 30H', () => {
  execute(0xf7, 0x0030)
})

test('0xff: RST 38H', () => {
  execute(0xff, 0x0038)
})
