import { CPU } from '../cpu'

test('Reading raw tile data', () => {
  const cpu = new CPU(() => {})
  const tile = new Uint8Array([
    0x3c, 0x7e, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x7e, 0x5e, 0x7e, 0x0a, 0x7c, 0x56, 0x38, 0x7c,
  ])
  cpu.memory.writeBytes(0x8000, tile)

  expect(cpu.graphics.getTileData(0)).toEqual(tile)
})

test('Converting tile data to color data', () => {
  const cpu = new CPU(() => {})
  const tile = new Uint8Array([
    0x3c, 0x7e, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x7e, 0x5e, 0x7e, 0x0a, 0x7c, 0x56, 0x38, 0x7c,
  ])
  cpu.memory.writeBytes(0x8000, tile)

  const colorMap = cpu.graphics.tileToColorMap(tile)
  expect(colorMap).toEqual([
    [0, 2, 3, 3, 3, 3, 2, 0],
    [0, 3, 0, 0, 0, 0, 3, 0],
    [0, 3, 0, 0, 0, 0, 3, 0],
    [0, 3, 0, 0, 0, 0, 3, 0],
    [0, 3, 1, 3, 3, 3, 3, 0],
    [0, 1, 1, 1, 3, 1, 3, 0],
    [0, 3, 1, 3, 1, 3, 2, 0],
    [0, 2, 3, 3, 3, 2, 0, 0],
  ])
})
