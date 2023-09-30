import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('anding two numbers', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0b00000111)
  cpu.registers.set('b', 0b00000101)
  instructions.and('b')

  expect(cpu.registers.get('a')).toEqual(0b00000101)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('anding with direct value', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0b00000111)
  instructions.and(0b00000101)

  expect(cpu.registers.get('a')).toEqual(0b00000101)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('anding the HL reference', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.bus.writeByte(0xff00, 0b00000101)
  cpu.registers.set('a', 0b00000111)
  cpu.registers.set('hl', 0xff00)
  instructions.and('hl', true)

  expect(cpu.registers.get('a')).toEqual(0b00000101)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})
