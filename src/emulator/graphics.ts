import { Emitter } from '.'
import { CPU } from './cpu'
import { IO_REGISTERS } from './memory'

type ColorMap = number[][]

const WIDTH = 144
const HEIGHT = 160
const TILE_WIDTH = 8 * 4

export type PPUEventMap = {
  render: () => void
  lcdBufferReady: () => void
}

export class Graphics {
  cpu: CPU
  emit: Emitter<keyof PPUEventMap>

  scale: number = 4
  width: number = 144
  height: number = 160

  colorMapCache: Record<string, ColorMap> = {}
  lcdBuffer: ImageData = new ImageData(WIDTH * this.scale, HEIGHT * this.scale)
  palette: Uint8Array = new Uint8Array([
    0x08, 0x18, 0x20, 0xff, 0x34, 0x68, 0x56, 0xff, 0x88, 0xc0, 0x70, 0xff, 0xe0, 0xf8, 0xd0, 0xff,
  ])

  constructor(cpu: CPU, emit: Emitter<keyof PPUEventMap>) {
    this.cpu = cpu
    this.emit = emit

    this.setScale(this.scale)
  }

  setScale(scale: number) {
    this.scale = scale
    this.width = this.width * scale
    this.height = this.height * scale
    this.lcdBuffer = new ImageData(WIDTH * this.scale, HEIGHT * this.scale)

    this.emit('lcdBufferReady')
  }

  render() {
    // Test code
    const tile = new Uint8Array([
      0x3c, 0x7e, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x7e, 0x5e, 0x7e, 0x0a, 0x7c, 0x56, 0x38, 0x7c,
    ])
    this.cpu.memory.writeBytes(0x8000, tile)
    this.renderTile(0, 0, 0)
    this.scaleLcdBuffer()
    //

    this.emit('render')
  }

  renderTile(tileIndex: number, x: number, y: number) {
    const tile = this.getTileData(tileIndex)
    const map = this.tileToColorMap(tile)
    const pixels = this.colorMapToPixels(map)
    const rowWidth = this.width * 4

    for (let row = 0; row < 8; row += 1) {
      const rowPos = y * rowWidth + row * rowWidth
      const rowPixels = pixels.slice(row * TILE_WIDTH, row * TILE_WIDTH + TILE_WIDTH)

      this.lcdBuffer.data.set(rowPixels, rowPos + x * 4)
    }
  }

  scaleRow(rowIdx: number, rowWidth: number) {
    const row = this.lcdBuffer.data.slice(rowIdx * rowWidth, rowIdx * rowWidth + rowWidth)
    const scaledRow = new Uint8Array(row.length)

    let scaledColIdx = 0
    for (let colIdx = 0; colIdx < 144; colIdx += 1) {
      const pixel = row.slice(colIdx * 4, colIdx * 4 + 4)

      for (let scale = 0; scale < this.scale; scale += 1) {
        scaledRow.set(pixel, scaledColIdx * 4)
        scaledColIdx += 1
      }
    }

    return scaledRow
  }

  scaleLcdBuffer() {
    const rowWidth = this.width * 4
    const scaledBuffer = new Uint8Array(this.lcdBuffer.data.length)

    let scaledRowIdx = 0
    for (let rowIdx = 0; rowIdx < 160; rowIdx += 1) {
      const row = this.scaleRow(rowIdx, rowWidth)
      for (let scale = 0; scale < this.scale; scale += 1) {
        scaledBuffer.set(row, scaledRowIdx * rowWidth)
        scaledRowIdx += 1
      }
    }

    this.lcdBuffer.data.set(scaledBuffer, 0)
  }

  scalePixel(pixel: Uint8Array, factor: number) {
    const scaledRgba = new Uint8Array(4 * factor)
    scaledRgba.set(pixel, 0)
    for (let scale = 0; scale < this.scale; scale += 1) {
      scaledRgba.copyWithin(scale * 4, 0, 4)
    }

    return scaledRgba
  }

  incrementScanline() {
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

  colorMapToPixels(map: ColorMap) {
    const pixels = new Uint8Array(8 * 8 * 4)
    let pos = 0

    map.forEach((row) => {
      row.forEach((col) => {
        const color = this.palette.slice(col * 4, col * 4 + 4)
        pixels.set(color, pos)

        pos += 4
      })
    })

    return pixels
  }
}
