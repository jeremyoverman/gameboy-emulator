import { CPU } from '../../cpu'

//

const STACK_ADDR = 0xfffe
const PC_PARENT = 0x0100
const PC_SUB = 0x0200

const execute = (cpu: CPU, opcode: number) => {
  cpu.registers.set('sp', STACK_ADDR)
  cpu.registers.set('pc', PC_SUB)
  cpu.instructions.push(PC_PARENT)
  cpu.bus.writeByte(PC_SUB, opcode)
  cpu.step()
}

const expectRet = (cpu: CPU) => {
  expect(cpu.registers.get('pc')).toBe(PC_PARENT)
}

const expectNoRet = (cpu: CPU) => {
  expect(cpu.registers.get('pc')).toBe(PC_SUB + 1)
}

test('0xc0: RET NZ, Z=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', false)

  execute(cpu, 0xc0)
  expectRet(cpu)
})

test('0xc0: RET NZ, Z=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', true)

  execute(cpu, 0xc0)
  expectNoRet(cpu)
})

test('0xc8: RET Z, Z=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', false)

  execute(cpu, 0xc8)
  expectNoRet(cpu)
})

test('0xc8: RET Z, Z=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Zero', true)

  execute(cpu, 0xc8)
  expectRet(cpu)
})

test('0xc9: RET', () => {
  const cpu = new CPU(() => {})

  execute(cpu, 0xc9)
  expectRet(cpu)
})

test('0xd0: RET NC, C=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', false)

  execute(cpu, 0xd0)
  expectRet(cpu)
})

test('0xd0: RET NC, C=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', true)

  execute(cpu, 0xd0)
  expectNoRet(cpu)
})

test('0xd8: RET C, C=0', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', false)

  execute(cpu, 0xd8)
  expectNoRet(cpu)
})

test('0xd8: RET C, C=1', () => {
  const cpu = new CPU(() => {})
  cpu.registers.setFlag('Carry', true)

  execute(cpu, 0xd8)
  expectRet(cpu)
})
