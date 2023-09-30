import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('compliments the accumulator', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)
  cpu.registers.setFlag('Zero', true)
  cpu.registers.setFlag('Carry', true)

  cpu.registers.set('a', 0b0000_1111)
  instructions.cpl()

  expect(cpu.registers.get('a')).toEqual(0b1111_0000)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('compliments the accumulator without affecting other flags', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)
  cpu.registers.setFlag('Zero', false)
  cpu.registers.setFlag('Carry', false)

  cpu.registers.set('a', 0b0000_1111)
  instructions.cpl()

  expect(cpu.registers.get('a')).toEqual(0b1111_0000)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})
