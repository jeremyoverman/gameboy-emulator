import { INTERRUPTS } from '../constants'
import { CPU } from '../cpu'

test('Stepping an instruction', () => {
  const cpu = new CPU(() => {})

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0b1010_0000)
  cpu.registers.set('b', 0b0000_1111)
  cpu.bus.writeByte(0x00, 0xb0) // OR B
  cpu.step()

  expect(cpu.registers.get('a')).toBe(0b1010_1111)
  expect(cpu.registers.get('pc')).toBe(0x0001)
})

test('Stepping 2-byte instruction', () => {
  const cpu = new CPU(() => {})

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('a', 0x01)
  cpu.bus.writeByte(0x00, 0xc6) // ADD A, d8
  cpu.bus.writeByte(0x01, 0x01)
  cpu.step()

  expect(cpu.registers.get('a')).toBe(0x02)
  expect(cpu.registers.get('pc')).toBe(0x0002)
})

test('Jumping', () => {
  const cpu = new CPU(() => {})

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.registers.set('pc', 0x0000)
  cpu.bus.writeBytes(
    0x0000,
    [0xc3, 0xaa, 0xbb] // JP a16
  )
  cpu.step()

  expect(cpu.registers.get('pc')).toBe(0xbbaa)
})

test('Multiple bit operations', () => {
  const cpu = new CPU(() => {})

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('b', 0x00)
  cpu.registers.set('c', 0x00)
  cpu.registers.set('d', 0x00)

  // prettier-ignore
  cpu.bus.writeBytes(0x00, [
    0xcb, 0xc0, // SET 0, B
    0xcb, 0xc1, // SET 0, C
    0xcb, 0xc2, // SET 0, D
  ])

  cpu.step()
  cpu.step()
  cpu.step()

  expect(cpu.registers.get('pc')).toBe(0x0006)
  expect(cpu.registers.get('b')).toBe(0x01)
  expect(cpu.registers.get('c')).toBe(0x01)
  expect(cpu.registers.get('d')).toBe(0x01)
})

test('Handling a vblank interrupt', () => {
  const cpu = new CPU(() => {})

  cpu.bus.writeByte(0xff50, 0x01)
  cpu.registers.set('pc', 0x0000)
  cpu.registers.set('sp', 0xfffe)
  cpu.bus.writeBytes(0xbb00, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  // prettier-ignore
  cpu.bus.writeBytes(0x0000, [
    0x3e, 0xa0,       // $0000; LD A, 0xa0
    0x21, 0x00, 0xbb, // $0002; LD HL, 0xbb00
    0x22,             // $0005; LD (HL+), A
    0x3c,             // $0006; INC A
    0xc3, 0x05, 0x00, // $0007; JP a16, 0x0005
  ])
  // prettier-ignore
  cpu.bus.writeBytes(INTERRUPTS.vblank.jump, [
    0x06, 0xaa,       // $0040; LD B, 0xaa
    0xd9,             // $0042; RETI
  ])

  for (let i = 0; i < 10; i++) {
    cpu.step()
  }

  expect(cpu.bus.readBytes(0xbb00, 6)).toEqual(new Uint8Array([0xa0, 0xa1, 0xa2, 0x00, 0x00, 0x00]))

  // Enable vblank interrupt
  cpu.bus.writeByte(0xffff, 0b0000_0001)
  cpu.interrupt('vblank')

  expect(cpu.bus.getInterruptFlag('vblank')).toBe(true)
  expect(cpu.registers.get('pc')).toBe(0x0007)
  cpu.step()

  expect(cpu.registers.get('pc')).toBe(0x0040)

  // Run the vblank handler
  cpu.step()
  cpu.step()

  expect(cpu.registers.get('b')).toBe(0xaa)
  expect(cpu.registers.get('pc')).toBe(0x0007)

  for (let i = 0; i < 9; i++) {
    cpu.step()
  }

  expect(cpu.bus.readBytes(0xbb00, 6)).toEqual(new Uint8Array([0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5]))
})
