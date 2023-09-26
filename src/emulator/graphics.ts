import { CPU } from './cpu'
import { IO_REGISTERS } from './memory'

type ColorMap = number[][]

export class Graphics {
  cpu: CPU
  colorMapCache: Record<string, ColorMap> = {}

  constructor(cpu: CPU) {
    this.cpu = cpu
  }

  renderScanline() {
    let ly = this.cpu.memory.readByte(IO_REGISTERS.ly) + 1

    if (ly > 153) {
      ly = 0
    } else if (ly === 144) {
      this.cpu.interrupt('vblank')
    }

    this.cpu.memory.writeByte(IO_REGISTERS.ly, ly)
  }

  getTileData(tileIndex: number) {
    return this.cpu.memory.readBytes(0x8000 + tileIndex * 16, 16)
  }

  tileToColorMap(tile: Uint8Array) {
    const key = tile.toString()

    if (this.colorMapCache[key]) {
      return this.colorMapCache[key]
    }

    const result: number[][] = []

    for (let row = 0; row < 8; row += 1) {
      result.push([])

      const left = tile[row * 2]
      const right = tile[row * 2 + 1]

      for (let col = 0; col < 8; col += 1) {
        result[row][col] = ((left >> (7 - col)) & 1) | (((right >> (7 - col)) & 1) << 1)
      }
    }

    this.colorMapCache[key] = result

    return result
  }
}
