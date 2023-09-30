import { Registers } from '../registers'

test('Test setting a single register works', () => {
  const registers = new Registers()
  registers.set('a', 0xff)

  expect(registers.a).toEqual(0xff)
})

test('Test getting a single register works', () => {
  const registers = new Registers()

  const value = 0xff
  registers.set('a', value)

  expect(registers.get('a')).toEqual(value)
})

test('Test setting a dual register works', () => {
  const registers = new Registers()

  registers.set('af', 0xfffe)

  expect(registers.a).toEqual(0xff)
  expect(registers.f).toEqual(0xf0)
})

test('Test getting bc works', () => {
  const registers = new Registers()

  registers.set('bc', 0xfffe)

  expect(registers.b).toEqual(0xff)
  expect(registers.c).toEqual(0xfe)
})

test('Test getting a dual register works', () => {
  const registers = new Registers()

  const value = 0xfffe
  registers.set('hl', value)

  expect(registers.get('hl')).toEqual(value)
})

test('Test setting the Zero flag to True', () => {
  const registers = new Registers()
  registers.setFlag('Zero', true)

  expect(registers.f).toEqual(0b1000_0000)
})

test('Test setting the Zero flag to False', () => {
  const registers = new Registers()
  registers.set('f', 0b11000000)
  registers.setFlag('Zero', false)

  expect(registers.f).toEqual(0b01000000)
})

test('Test getting the Zero flag', () => {
  const registers = new Registers()
  registers.setFlag('Zero', true)

  expect(registers.getFlag('Zero')).toEqual(true)
})

test('Setting the half carry and subtraction flags', () => {
  const registers = new Registers()
  registers.setFlag('HalfCarry', true)
  registers.setFlag('Subtraction', true)

  expect(registers.f).toEqual(0b01100000)
})

test('Getting the half carry and subtraction flags', () => {
  const registers = new Registers()
  registers.setFlag('HalfCarry', true)
  registers.setFlag('Subtraction', true)

  expect(registers.getFlag('HalfCarry')).toEqual(true)
  expect(registers.getFlag('Subtraction')).toEqual(true)
})
