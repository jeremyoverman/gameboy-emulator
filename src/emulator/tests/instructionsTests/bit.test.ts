import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('An 8 bit register with a bit set', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0b0000_0111)
  instructions.bit('b', 0)

  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('An 8 bit register with a bit unset', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('b', 0b0000_0111)
  instructions.bit('b', 3)

  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('hl ref with a bit set', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.bus.writeByte(0xff00, 0b0000_0111)
  cpu.registers.set('hl', 0xff00)
  instructions.bit('hl', 0)

  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})
