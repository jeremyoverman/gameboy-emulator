import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('A = 0x80, H = 0, C = 0, N = 1', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x80)
  cpu.registers.setFlag('HalfCarry', false)
  cpu.registers.setFlag('Carry', false)
  cpu.registers.setFlag('Subtraction', true)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x80)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

test('A = 0x20, H = 1, C = 0, N = 1', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x20)
  cpu.registers.setFlag('HalfCarry', true)
  cpu.registers.setFlag('Carry', false)
  cpu.registers.setFlag('Subtraction', true)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x1a)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(true)
})

xtest('A = 0x70, H = 0, C = 1, N = 1', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x70)
  cpu.registers.setFlag('HalfCarry', false)
  cpu.registers.setFlag('Carry', true)
  cpu.registers.setFlag('Subtraction', true)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x0a)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

xtest('A = 0x02, H = 1, C = 1, N = 1', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x02)
  cpu.registers.setFlag('HalfCarry', true)
  cpu.registers.setFlag('Carry', true)
  cpu.registers.setFlag('Subtraction', true)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x9c)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

xtest('A = 0xFF, H = 0, C = 0, N = 0', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0xff)
  cpu.registers.setFlag('HalfCarry', false)
  cpu.registers.setFlag('Carry', false)
  cpu.registers.setFlag('Subtraction', false)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x05)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('A = 0x00, H = 0, C = 0, N = 0', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x00)
  cpu.registers.setFlag('HalfCarry', false)
  cpu.registers.setFlag('Carry', false)
  cpu.registers.setFlag('Subtraction', false)

  instructions.daa()

  expect(cpu.registers.get('a')).toEqual(0x00)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})
