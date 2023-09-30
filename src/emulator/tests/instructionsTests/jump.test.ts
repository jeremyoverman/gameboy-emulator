import { Instructions, JumpMode } from '../../instructions'

import { CPU } from '../../cpu'

test('Jump', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  instructions.jp(0xff00)

  expect(cpu.registers.get('pc')).toEqual(0xff00)
})

test('Jump nz, z=false', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Zero', false)
  instructions.jp(0xff00, JumpMode.nz)

  expect(cpu.registers.get('pc')).toEqual(0xff00)
})

test('Jump nz, z=true', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Zero', true)
  instructions.jp(0xff00, JumpMode.nz)

  expect(cpu.registers.get('pc')).toEqual(0x0000)
})

test('Jump z, z=false', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Zero', false)
  instructions.jp(0xff00, JumpMode.z)

  expect(cpu.registers.get('pc')).toEqual(0x0000)
})

test('Jump z, z=true', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Zero', true)
  instructions.jp(0xff00, JumpMode.z)

  expect(cpu.registers.get('pc')).toEqual(0xff00)
})

test('Jump nc, c=false', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', false)
  instructions.jp(0xff00, JumpMode.nc)

  expect(cpu.registers.get('pc')).toEqual(0xff00)
})

test('Jump nc, c=true', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', true)
  instructions.jp(0xff00, JumpMode.nc)

  expect(cpu.registers.get('pc')).toEqual(0x0000)
})

test('Jump c, c=false', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', false)
  instructions.jp(0xff00, JumpMode.c)

  expect(cpu.registers.get('pc')).toEqual(0x0000)
})

test('Jump c, c=true', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.setFlag('Carry', true)
  instructions.jp(0xff00, JumpMode.c)

  expect(cpu.registers.get('pc')).toEqual(0xff00)
})

test('Jump relative forward', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  instructions.jp(0x05, null, true)

  expect(cpu.registers.get('pc')).toEqual(0x0005)
})

test('Jump relative backwards', () => {
  const cpu = new CPU(() => {})
  const instructions = new Instructions(cpu)

  cpu.registers.set('pc', 0x000a)
  instructions.jp(0xfb, null, true)

  expect(cpu.registers.get('pc')).toEqual(0x0005)
})
