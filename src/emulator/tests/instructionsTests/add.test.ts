import { Instructions } from '../../instructions'

import { CPU } from '../../cpu'

test('add a number with no overflow', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x01)
  cpu.registers.set('b', 0x02)
  instructions.add('b')

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('add a number with overflow', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0xff)
  cpu.registers.set('b', 0x05)
  instructions.add('b')

  expect(cpu.registers.get('a')).toEqual(0x04)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('add a number resulting in 0', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x00)
  cpu.registers.set('b', 0x00)
  instructions.add('b')

  expect(cpu.registers.get('a')).toEqual(0x00)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('add a number resulting in half carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0b1000_1111)
  cpu.registers.set('b', 0b0000_0001)
  instructions.add('b')

  expect(cpu.registers.get('a')).toEqual(0b1001_0000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding a number directly', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('a', 0x01)
  instructions.add(0x02)

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding with HL', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('hl', 0x0001)
  cpu.registers.set('bc', 0x1111)
  instructions.add('bc')

  expect(cpu.registers.get('hl')).toEqual(0x1112)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding with HL with carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('hl', 0xffff)
  cpu.registers.set('bc', 0x0001)
  instructions.add('bc')

  expect(cpu.registers.get('hl')).toEqual(0x0000)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
  expect(cpu.registers.getFlag('Zero')).toEqual(true)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding with HL with half carry', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('hl', 0x0fff)
  cpu.registers.set('bc', 0x0001)
  instructions.add('bc')

  expect(cpu.registers.get('hl')).toEqual(0x1000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding the reference HL with A', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.bus.writeByte(0x00ff, 0x01)
  cpu.registers.set('hl', 0x00ff)
  cpu.registers.set('a', 0x02)
  instructions.add('hl', false, true)

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding sp with n', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('sp', 0x0005)
  instructions.add_sp('sp', 0x02)

  expect(cpu.registers.get('sp')).toEqual(0x0007)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding sp with negative n', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('sp', 0x0005)
  instructions.add_sp('sp', 0b11111110)

  expect(cpu.registers.get('sp')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding sp with n, set to hl', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('sp', 0x0005)
  instructions.add_sp('hl', 0x02)

  expect(cpu.registers.get('hl')).toEqual(0x0007)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})

test('adding 1 to SP with no overflow', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('sp', 0x00ff)
  instructions.add_sp('sp', 0x01)

  expect(cpu.registers.get('sp')).toEqual(0x0100)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(false)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})
