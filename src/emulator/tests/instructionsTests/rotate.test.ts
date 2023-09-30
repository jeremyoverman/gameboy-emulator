import { CPU } from '../../cpu'

test('rlca with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('a', 0b11100000)
  cpu.instructions.rlca()

  expect(cpu.registers.get('a')).toEqual(0b11000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rlca without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('a', 0b01110000)
  cpu.instructions.rlca()

  expect(cpu.registers.get('a')).toEqual(0b11100000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rla with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('a', 0b01110000)
  cpu.instructions.rla()

  expect(cpu.registers.get('a')).toEqual(0b11100001)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rla without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('a', 0b01110000)
  cpu.instructions.rla()

  expect(cpu.registers.get('a')).toEqual(0b11100000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rrca with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('a', 0b00000111)
  cpu.instructions.rrca()

  expect(cpu.registers.get('a')).toEqual(0b10000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rra with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('a', 0b00000110)
  cpu.instructions.rra()

  expect(cpu.registers.get('a')).toEqual(0b10000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rra without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('a', 0b01110000)
  cpu.instructions.rra()

  expect(cpu.registers.get('a')).toEqual(0b00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rlc with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b11100000)
  cpu.instructions.rlc('b')

  expect(cpu.registers.get('b')).toEqual(0b11000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rlc with carry on hl ref', () => {
  const cpu = new CPU(() => {})

  cpu.memory.writeByte(0xff00, 0b11100000)
  cpu.registers.set('hl', 0xff00)
  cpu.instructions.rlc('hl', true)

  expect(cpu.memory.readByte(0xff00)).toEqual(0b11000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rlc without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b01110000)
  cpu.instructions.rlc('b')

  expect(cpu.registers.get('b')).toEqual(0b11100000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rl with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('b', 0b01110000)
  cpu.instructions.rl('b')

  expect(cpu.registers.get('b')).toEqual(0b11100001)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rl without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('b', 0b01110000)
  cpu.instructions.rl('b')

  expect(cpu.registers.get('b')).toEqual(0b11100000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rl without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('b', 0b11100000)
  cpu.instructions.rl('b')

  expect(cpu.registers.get('b')).toEqual(0b11000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rrc with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b00000111)
  cpu.instructions.rrc('b')

  expect(cpu.registers.get('b')).toEqual(0b10000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('rrc without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b01110000)
  cpu.instructions.rrc('b')

  expect(cpu.registers.get('b')).toEqual(0b00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rr with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('b', 0b00000110)
  cpu.instructions.rr('b')

  expect(cpu.registers.get('b')).toEqual(0b10000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('rr without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('b', 0b01110000)
  cpu.instructions.rr('b')

  expect(cpu.registers.get('b')).toEqual(0b00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rlc with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b11100000_00000000)
  cpu.instructions.rlc('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11000000_00000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('16bit rlc without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.rlc('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11100000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rl with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.rl('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11100000_00000001)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rl without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.rl('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11100000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rrc with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b00000000_00000111)
  cpu.instructions.rrc('hl')

  expect(cpu.registers.get('hl')).toEqual(0b10000000_00000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('16bit rrc without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.rrc('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00111000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rr with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('hl', 0b00000110_00000000)
  cpu.instructions.rr('hl')

  expect(cpu.registers.get('hl')).toEqual(0b10000011_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit rr without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', false)
  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.rr('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00111000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('sla with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('b', 0b11100000)
  cpu.instructions.sla('b')

  expect(cpu.registers.get('b')).toEqual(0b11000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('sla without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b01110000)
  cpu.instructions.sla('b')

  expect(cpu.registers.get('b')).toEqual(0b11100000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('sra with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b00000111)
  cpu.instructions.sra('b')

  expect(cpu.registers.get('b')).toEqual(0b00000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('sra without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b01110000)
  cpu.instructions.sra('b')

  expect(cpu.registers.get('b')).toEqual(0b00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('sra without carry and 1 msb', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b11100000)
  cpu.instructions.sra('b')

  expect(cpu.registers.get('b')).toEqual(0b11110000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit sla with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.setFlag('Carry', true)
  cpu.registers.set('hl', 0b11100000_00000000)
  cpu.instructions.sla('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11000000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('16bit sla without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b01110000_00000000)
  cpu.instructions.sla('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11100000_00000000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit sra with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b00000000_00000111)
  cpu.instructions.sra('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00000000_00000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('16bit sra without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b00000000_01110000)
  cpu.instructions.sra('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00000000_00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit sra without carry and 1 msb', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b10000000_01110000)
  cpu.instructions.sra('hl')

  expect(cpu.registers.get('hl')).toEqual(0b11000000_00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('srl with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b00000111)
  cpu.instructions.srl('b')

  expect(cpu.registers.get('b')).toEqual(0b00000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('srl without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b01110000)
  cpu.instructions.srl('b')

  expect(cpu.registers.get('b')).toEqual(0b00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('srl without carry and 1 msb', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b11100000)
  cpu.instructions.srl('b')

  expect(cpu.registers.get('b')).toEqual(0b01110000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit srl with carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b00000000_00000111)
  cpu.instructions.srl('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00000000_00000011)
  expect(cpu.registers.getFlag('Carry')).toEqual(true)
})

test('16bit srl without carry', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b00000000_01110000)
  cpu.instructions.srl('hl')

  expect(cpu.registers.get('hl')).toEqual(0b00000000_00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('16bit srl without carry and 1 msb', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b10000000_01110000)
  cpu.instructions.srl('hl')

  expect(cpu.registers.get('hl')).toEqual(0b01000000_00111000)
  expect(cpu.registers.getFlag('Carry')).toEqual(false)
})

test('swap 8 bit register', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('b', 0b11110000)
  cpu.instructions.swap('b')

  expect(cpu.registers.get('b')).toEqual(0b00001111)
})

test('swap 16 bit register', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('hl', 0b10000000_01110000)
  cpu.instructions.swap('hl')

  expect(cpu.registers.get('hl')).toEqual(0b01110000_10000000)
})

test('swap hl reference', () => {
  const cpu = new CPU(() => {})

  cpu.memory.writeByte(0xff00, 0b11110000)
  cpu.registers.set('hl', 0xff00)
  cpu.instructions.swap('hl', true)

  expect(cpu.memory.readByte(0xff00)).toEqual(0b00001111)
})
