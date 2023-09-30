import { CPU } from '../../cpu'
import { Instructions } from '../../instructions'

test('Setting a 0 bit on an 8 bit register', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0b0000_0111)
  instructions.set('b', 3)

  expect(cpu.registers.get('b')).toEqual(0b0000_1111)
})

test('Setting a 1 bit on an 8 bit register', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0b0000_0111)
  instructions.set('b', 2)

  expect(cpu.registers.get('b')).toEqual(0b0000_0111)
})

test('Setting a 0 bit on hl reference', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.memory.writeByte(0xff00, 0b0000_0111)
  cpu.registers.set('hl', 0xff00)
  instructions.set('hl', 3)

  expect(cpu.memory.readByte(0xff00)).toEqual(0b0000_1111)
})
