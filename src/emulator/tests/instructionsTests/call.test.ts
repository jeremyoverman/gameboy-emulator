import { CPU } from '../../cpu'

const pc = 0x0100

const execute = (cpu: CPU, opcode: number) => {
  cpu.registers.set('pc', pc)
  cpu.registers.set('sp', 0xfffe)
  cpu.memory.writeBytes(0x0100, [opcode, 0x22, 0x11])

  cpu.step()
}

const expectJump = (cpu: CPU) => {
  cpu.instructions.pop('bc')
  expect(cpu.registers.get('pc')).toBe(0x1122)
  expect(cpu.registers.get('bc')).toBe(pc + 3)
}

const expectNoJump = (cpu: CPU) => {
  cpu.instructions.pop('bc')
  expect(cpu.registers.get('pc')).toBe(pc + 3)
  expect(cpu.registers.get('bc')).toBe(0)
}

test('0xc4: CALL NZ,a16 - Z=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', true)

  execute(cpu, 0xc4)
  expectNoJump(cpu)
})

test('0xc4: CALL NZ,a16 - Z=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', false)

  execute(cpu, 0xc4)
  expectJump(cpu)
})

test('0xcc: CALL Z,a16 - Z=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', true)

  execute(cpu, 0xcc)
  expectJump(cpu)
})

test('0xcc: CALL Z,a16 - Z=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', false)

  execute(cpu, 0xcc)
  expectNoJump(cpu)
})

test('0xcd: CALL a16', () => {
  const cpu = new CPU(() => {})

  execute(cpu, 0xcd)
  expectJump(cpu)
})

test('0xd4: CALL NC,a16 - C=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', true)

  execute(cpu, 0xd4)
  expectNoJump(cpu)
})

test('0xd4: CALL NC,a16 - C=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', false)

  execute(cpu, 0xd4)
  expectJump(cpu)
})

test('0xdc: CALL C,a16 - C=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', true)

  execute(cpu, 0xdc)
  expectJump(cpu)
})

test('0xdc: CALL C,a16 - C=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', false)

  execute(cpu, 0xdc)
  expectNoJump(cpu)
})

test('0xdc: CALL C,a16 - C=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', false)

  execute(cpu, 0xdc)
  expectNoJump(cpu)
})
