import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('decrementing a register', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0x03)
  instructions.dec('b')

  expect(cpu.registers.get('b')).toEqual(0x02)
})

test('decrementing a register with carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0x00)
  instructions.dec('b')

  expect(cpu.registers.get('b')).toEqual(0xff)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('decrementing a register with half carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0b0001_0000)
  instructions.dec('b')

  expect(cpu.registers.get('b')).toEqual(0b0000_1111)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
})

test('decrementing a 16bit register', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('bc', 0x0301)
  instructions.dec('bc')

  expect(cpu.registers.get('bc')).toEqual(0x0300)
})

test('decrementing hl reference', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.bus.writeByte(0xff00, 0x03)
  cpu.registers.set('hl', 0xff00)
  instructions.dec('hl', true)

  expect(cpu.bus.readByte(0xff00)).toEqual(0x02)
})
