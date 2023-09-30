import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('subtracting two numbers', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x03)
  cpu.registers.set('b', 0x02)
  instructions.sub('b')

  expect(cpu.registers.get('a')).toEqual(0x01)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('a half carry should be set if the lower nibble carries', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x10)
  cpu.registers.set('b', 0x01)
  instructions.sub('b')

  expect(cpu.registers.get('a')).toEqual(0x0f)
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
  instructions.sub('b')

  expect(cpu.registers.get('a')).toEqual(0xff)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('subtracting two numbers directly', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x03)
  instructions.sub(0x02)

  expect(cpu.registers.get('a')).toEqual(0x01)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('subtracting with HL with half carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('hl', 0xf000)
  cpu.registers.set('bc', 0x0001)
  instructions.sub('bc')

  expect(cpu.registers.get('hl')).toEqual(0xefff)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('subtracting with HL carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('hl', 0x0000)
  cpu.registers.set('bc', 0x0001)
  instructions.sub('bc')

  expect(cpu.registers.get('hl')).toEqual(0xffff)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('subtracting from hl address', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.bus.writeByte(0xff00, 0x02)
  cpu.registers.set('a', 0x03)
  cpu.registers.set('hl', 0xff00)
  instructions.sub('hl', false, true)

  expect(cpu.registers.get('a')).toEqual(0x01)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})
