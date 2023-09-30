import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('comparing two numbers', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x03)
  cpu.registers.set('b', 0x02)
  instructions.cp('b')

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('comparing two numbers are the same', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x03)
  cpu.registers.set('b', 0x03)
  instructions.cp('b')

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('a half carry should be set if the lower nibble carries', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x10)
  cpu.registers.set('b', 0x01)
  instructions.cp('b')

  expect(cpu.registers.get('a')).toEqual(0x10)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('a carry should be set if the result carries', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x01)
  cpu.registers.set('b', 0x02)
  instructions.cp('b')

  expect(cpu.registers.get('a')).toEqual(0x01)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('comparing two numbers directly', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x03)
  instructions.cp(0x02)

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('comparing hl reference', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.memory.writeByte(0xff00, 0x02)
  cpu.registers.set('a', 0x03)
  cpu.registers.set('hl', 0xff00)
  instructions.cp('hl', true)

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})
