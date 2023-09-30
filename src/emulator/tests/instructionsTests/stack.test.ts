import { CPU } from '../../cpu'

test('PUSH BC', () => {
  const cpu = new CPU(() => {})
  cpu.memory.writeByte(0xff50, 0x01)

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('sp', 0xfffe)
  cpu.registers.set('bc', 0xaabb)
  cpu.memory.writeByte(0x0000, 0xc5) // PUSH BC

  cpu.step()

  expect(cpu.memory.readByte(0xfffd)).toBe(0xaa)
  expect(cpu.memory.readByte(0xfffc)).toBe(0xbb)
})

test('POP BC', () => {
  const cpu = new CPU(() => {})
  cpu.memory.writeByte(0xff50, 0x01)

  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('sp', 0xfffc)
  cpu.memory.writeByte(0x0000, 0xc1) // POP BC
  cpu.memory.writeByte(0xfffc, 0xbb)
  cpu.memory.writeByte(0xfffd, 0xaa)

  cpu.step()

  expect(cpu.registers.get('bc')).toBe(0xaabb)
})

xtest('blargg special test #5', () => {
  const cpu = new CPU(() => {})
  cpu.memory.writeByte(0xff50, 0x01)

  cpu.registers.set('sp', 0xfffe)
  cpu.registers.set('pc', 0x0000)

  // Failure
  cpu.memory.writeBytes(0xaa00, [
    0x01,
    0xaa,
    0xaa, // LD BC,$aaaa
    0x3e,
    0xbb, // LD A,$bb
    0x02, // LD (BC),A
    0x10,
    0x00, // STOP
  ])

  // Success
  cpu.memory.writeBytes(0xaa10, [
    0x01,
    0xaa,
    0xaa, // LD BC,$aaaa
    0x3e,
    0xaa, // LD A,$aa
    0x02, // LD (BC),A
    0x10,
    0x00, // STOP
  ])

  const instructions = [
    0x01,
    0x00,
    0x12, // $0000: LD BC,$1200
    0xc5, // $0003: PUSH BC
    0xf1, // $0004: POP AF
    0xf5, // $0005: PUSH AF
    0xd1, // $0006: POP DE
    0x79, // $0007: LD A,C
    0xe6,
    0xf0, // $0008: AND $F0
    0xbb, // $0009: CP E
    0xc2,
    0x00,
    0xaa, // $000A: JP NZ,$aa00 ; fails here
    0x04, // $000B: INC B
    0x0c, // $000C: INC C
    0xc2,
    0x03,
    0x00, // $000D: JP NZ,$0003 ; loop
    0xc2,
    0x10,
    0xaa, // $000D: JP NZ,$aa10 ; success
  ]
  cpu.memory.writeBytes(0x0000, instructions)

  let i = 0
  while (!cpu.isStopped()) {
    cpu.step()

    if (++i > 500000) {
      throw new Error('Test timed out')
    }
  }

  expect(cpu.memory.readByte(0xaaaa)).toBe(0xaa)
})
