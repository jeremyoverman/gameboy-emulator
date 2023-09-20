import { CPU } from '../cpu'

test('0x02: LD (BC),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('bc', 0x1000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x02]) // LD (BC),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x06: LD B,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x06, 0xaa]) // LD B,d8

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x08: LD (a16),SP', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('sp', 0xaabb)
  cpu.memory.writeBytes(0x0000, [0x08, 0x00, 0x10]) // LD (a16),SP

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xbb)
  expect(cpu.memory.readByte(0x1001)).toBe(0xaa)
})
test('0x0a: LD A,(BC)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('bc', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x0a]) // LD A,(BC)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x0e: LD C,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x0e, 0xaa]) // LD C,d8

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x11: LD DE,d16', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x11, 0xbb, 0xaa]) // LD DE,d16

  cpu.step()

  expect(cpu.registers.get('de')).toBe(0xaabb)
})
test('0x12: LD (DE),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('de', 0x1000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x12]) // LD (BC),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x16: LD D,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x16, 0xaa]) // LD D,d8

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x1a: LD A,(DE)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('de', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x1a]) // LD A,(DE)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x1e: LD E,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x1e, 0xaa]) // LD E,d8

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x21: LD HL,d16', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x21, 0xbb, 0xaa]) // LD HL,d16

  cpu.step()

  expect(cpu.registers.get('hl')).toBe(0xaabb)
})
test('0x22: LD (HL+),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x22]) // LD (HL+),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
  expect(cpu.registers.get('hl')).toBe(0x1001)
})
test('0x26: LD H,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x26, 0xaa]) // LD H,d8

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x2a: LD A,(HL+)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x2a]) // LD A,(HL+)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
  expect(cpu.registers.get('hl')).toBe(0x1001)
})
test('0x2e: LD L,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x2e, 0xaa]) // LD L,d8

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x31: LD SP,d16', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x31, 0xbb, 0xaa]) // LD SP,d16

  cpu.step()

  expect(cpu.registers.get('sp')).toBe(0xaabb)
})
test('0x32: LD (HL-),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x32]) // LD (HL-),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
  expect(cpu.registers.get('hl')).toBe(0x0fff)
})
test('0x36: LD (HL),d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeBytes(0x0000, [0x36, 0xaa]) // LD (HL),d8

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x3a: LD A,(HL-)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x3a]) // LD A,(HL-)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
  expect(cpu.registers.get('hl')).toBe(0x0fff)
})
test('0x3e: LD A,d8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0x3e, 0xaa]) // LD A,d8

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x40: LD B,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x40]) // LD B,B

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x41: LD B,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x41]) // LD B,C

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x42: LD B,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x42]) // LD B,D

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x43: LD B,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x43]) // LD B,E

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x44: LD B,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x44]) // LD B,H

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x45: LD B,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x45]) // LD B,L

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x46: LD B,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x46]) // LD B,(HL)

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x47: LD B,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x47]) // LD B,A

  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
})
test('0x48: LD C,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x48]) // LD C,B

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x49: LD C,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x49]) // LD C,C

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4a: LD C,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4a]) // LD C,D

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4b: LD C,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4b]) // LD C,E

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4c: LD C,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4c]) // LD C,H

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4d: LD C,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4d]) // LD C,L

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4e: LD C,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4e]) // LD C,(HL)

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x4f: LD C,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x4f]) // LD C,A

  cpu.step()

  expect(cpu.registers.get('c')).toBe(0xaa)
})
test('0x50: LD D,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x50]) // LD D,B

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x51: LD D,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x51]) // LD D,C

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x52: LD D,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x52]) // LD D,D

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x53: LD D,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x53]) // LD D,E

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x54: LD D,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x54]) // LD D,H

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x55: LD D,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x55]) // LD D,L

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x56: LD D,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x56]) // LD D,(HL)

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x57: LD D,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x57]) // LD D,A

  cpu.step()

  expect(cpu.registers.get('d')).toBe(0xaa)
})
test('0x58: LD E,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x58]) // LD E,B

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x59: LD E,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x59]) // LD E,C

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5a: LD E,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5a]) // LD E,D

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5b: LD E,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5b]) // LD E,E

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5c: LD E,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5c]) // LD E,H

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5d: LD E,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5d]) // LD E,L

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5e: LD E,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5e]) // LD E,(HL)

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x5f: LD E,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x5f]) // LD E,A

  cpu.step()

  expect(cpu.registers.get('e')).toBe(0xaa)
})
test('0x60: LD H,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x60]) // LD H,B

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x61: LD H,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x61]) // LD H,C

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x62: LD H,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x62]) // LD H,D

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x63: LD H,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x63]) // LD H,E

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x64: LD H,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x64]) // LD H,H

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x65: LD H,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x65]) // LD H,L

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x66: LD H,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x66]) // LD H,(HL)

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x67: LD H,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x67]) // LD H,A

  cpu.step()

  expect(cpu.registers.get('h')).toBe(0xaa)
})
test('0x68: LD L,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x68]) // LD L,B

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x69: LD L,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x69]) // LD L,C

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6a: LD L,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6a]) // LD L,D

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6b: LD L,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6b]) // LD L,E

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6c: LD L,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6c]) // LD L,H

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6d: LD L,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6d]) // LD L,L

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6e: LD L,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6e]) // LD L,(HL)

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x6f: LD L,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x6f]) // LD L,A

  cpu.step()

  expect(cpu.registers.get('l')).toBe(0xaa)
})
test('0x70: LD (HL),B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x70]) // LD (HL),B

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x71: LD (HL),C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x71]) // LD (HL),C

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x72: LD (HL),D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x72]) // LD (HL),D

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x73: LD (HL),E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x73]) // LD (HL),E

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x74: LD (HL),H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x74]) // LD (HL),H

  cpu.step()

  expect(cpu.memory.readByte(0xaa00)).toBe(0xaa)
})
test('0x75: LD (HL),L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x75]) // LD (HL),L

  cpu.step()

  expect(cpu.memory.readByte(0x10aa)).toBe(0xaa)
})
test('0x77: LD (HL),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x77]) // LD (HL),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0x78: LD A,B', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x78]) // LD A,B

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x79: LD A,C', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x79]) // LD A,C

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7a: LD A,D', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('d', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7a]) // LD A,D

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7b: LD A,E', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('e', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7b]) // LD A,E

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7c: LD A,H', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('h', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7c]) // LD A,H

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7d: LD A,L', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('l', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7d]) // LD A,L

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7e: LD A,(HL)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0x1000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7e]) // LD A,(HL)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
test('0x7f: LD A,A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0x7f]) // LD A,A

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa) // move
})
test('0xe2: LD (C),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0x01)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0xe2]) // LD (C),A

  cpu.step()

  expect(cpu.memory.readByte(0xff01)).toBe(0xaa)
})
test('0xea: LD (a16),A', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0xaa)
  cpu.memory.writeBytes(0x0000, [0xea, 0x00, 0x10]) // LD (a16),A

  cpu.step()

  expect(cpu.memory.readByte(0x1000)).toBe(0xaa)
})
test('0xf2: LD A,(C)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('c', 0x02)
  cpu.memory.writeByte(0xff02, 0xaa)
  cpu.memory.writeBytes(0x0000, [0xf2]) // LD A,(C)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
xtest('0xf8: LD HL,SP+r8', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeBytes(0x0000, [0xf8]) // LD HL,SP+r8

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xff)
})
test('0xf9: LD SP,HL', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('hl', 0xaabb)
  cpu.memory.writeBytes(0x0000, [0xf9]) // LD SP,HL

  cpu.step()

  expect(cpu.registers.get('sp')).toBe(0xaabb)
})
test('0xfa: LD A,(a16)', () => {
  const cpu = new CPU(() => {})

  cpu.registers.set('pc', 0x0000)
  cpu.memory.writeByte(0x1000, 0xaa)
  cpu.memory.writeBytes(0x0000, [0xfa, 0x00, 0x10]) // LD A,(a16)

  cpu.step()

  expect(cpu.registers.get('a')).toBe(0xaa)
})
