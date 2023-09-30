import { Bus } from '../bus'

test('Reading a byte from memory', () => {
  const memory = new Bus()
  memory.writeByte(0xff50, 0x01)
  memory.memory[0x00ff] = 0xbb

  expect(memory.readByte(0x00ff)).toEqual(0xbb)
})

test('Writing a byte to memory', () => {
  const memory = new Bus()
  memory.writeByte(0x00ff, 0xbb)

  expect(memory.memory[0x00ff]).toEqual(0xbb)
})
