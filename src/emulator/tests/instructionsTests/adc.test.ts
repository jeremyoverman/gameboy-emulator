import { CPU } from '../../cpu'
import { Instructions } from '../../instructions'

test('Adding a number without the carry bit set', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('a', 0x01)
  cpu.registers.set('b', 0x02)
  instructions.adc('b')

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('Adding a number with the carry bit set', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('a', 0x01)
  cpu.registers.set('b', 0x02)
  instructions.adc('b')

  expect(cpu.registers.get('a')).toEqual(0x04)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('adding a number directly', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('a', 0x01)
  instructions.adc(0x02)

  expect(cpu.registers.get('a')).toEqual(0x03)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('adding with HL', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('hl', 0x0001)
  cpu.registers.set('bc', 0x1111)
  instructions.adc('bc')

  expect(cpu.registers.get('hl')).toEqual(0x1113)
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
  instructions.adc('bc')

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
  instructions.adc('bc')

  expect(cpu.registers.get('hl')).toEqual(0x1000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
  expect(cpu.registers.getFlag('Zero')).toEqual(false)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual(true)
  expect(cpu.registers.getFlag('Subtraction')).toEqual(false)
})
