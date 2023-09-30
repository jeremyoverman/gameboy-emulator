import { Emitter, Emulator } from './emulator'
import { LCD_HEIGHT, BUS_REGISTERS, TILE_WIDTH, LCD_WIDTH, DOTS_PER_SCANLINE, FRAME_HEIGHT } from './constants'
import { ColorMap } from './types'
import { convertTwosComplement } from './utils'
import { PPUEventMap } from './types'

export class PPU {
  emulator: Emulator
  emit: Emitter<keyof PPUEventMap>

  // FPS
  fps: number = 0
  fpsStart: number = Date.now()

  // Counters
  dot: number = 0
  frames: number = 0

  // Display
  scale: number = 4
  width: number = LCD_WIDTH
  height: number = LCD_HEIGHT

  // Cache
  colorMapCache: Record<string, ColorMap> = {}

  // Buffers
  graphicsBuffer: Uint8Array = new Uint8Array(LCD_WIDTH * LCD_HEIGHT * 4)
  lcdBuffer: Uint8ClampedArray = new Uint8ClampedArray(LCD_WIDTH * this.scale * LCD_HEIGHT * this.scale * 4)

  palette: number[] = [0xe0dfd3, 0x807d6f, 0x473f37, 0x241914]

  constructor(emulator: Emulator) {
    this.emulator = emulator
    this.emit = emulator.emit

    this.setScale(this.scale)
    this.emulator.bus.writeByte(BUS_REGISTERS.stat, 0b00000001)
  }

  resetFrames() {
    this.frames = 0
  }

  setScale(scale: number) {
    this.scale = scale
    this.width = this.width * scale
    this.height = this.height * scale
    this.lcdBuffer = new Uint8ClampedArray(LCD_WIDTH * this.scale * LCD_HEIGHT * this.scale * 4)

    this.emit('lcdBufferReady')
  }

  tick() {
    for (; this.dot < this.emulator.clock.dotCycles; this.dot += 1) {
      const scanline = Math.floor(this.dot / DOTS_PER_SCANLINE)
      if (this.dot % DOTS_PER_SCANLINE === 0) {
        this.emulator.bus.writeByte(BUS_REGISTERS.ly, scanline)
      }

      if (this.dot === LCD_HEIGHT * DOTS_PER_SCANLINE) {
        this.emulator.cpu.interrupt('vblank')
        this.emit('vblank')
        this.render()
      }

      if (scanline === FRAME_HEIGHT) {
        this.dot = 0
        this.emulator.clock.dotCycles = 0
      }
    }
  }

  calculateFps() {
    // Calculate FPS once per second:
    if (Date.now() - this.fpsStart >= 1000) {
      const currentTime = Date.now()
      const elapsedTime = (currentTime - this.fpsStart) / 1000 // in seconds
      this.fps = this.frames / elapsedTime

      // Reset counters for the next second:
      this.fpsStart = currentTime
      this.frames = 0
    }
  }

  render() {
    this.frames += 1
    if (!this.emulator.bus.getLcdFlag('enable')) {
      return
    }

    this.calculateFps()

    this.renderBackground()
    this.renderObjects()
    this.scaleLcdBuffer()
    this.emit('render')
  }

  renderBackground() {
    const index = this.emulator.bus.getLcdFlag('bgTileMap') ? 0x9c00 : 0x9800

    for (let idx = 0; idx < 32 * 32; idx += 1) {
      try {
        const scx = this.emulator.bus.readByte(BUS_REGISTERS.scx)
        const scy = this.emulator.bus.readByte(BUS_REGISTERS.scy)
        const tile = this.emulator.bus.memory[index + idx]

        this.renderTile(tile, (idx % 32) * 8 - scx, Math.floor(idx / 32) * 8 - scy)
      } catch (e) {
        // console.log(e, idx)
      }
    }
  }

  renderObjects() {
    const index = BUS_REGISTERS.oam

    for (let idx = 0; idx < 40; idx += 1) {
      const y = this.emulator.bus.memory[index + idx * 4]
      const x = this.emulator.bus.memory[index + idx * 4 + 1]
      const tile = this.emulator.bus.memory[index + idx * 4 + 2]
      // const flags = this.emulator.bus.memory[index + idx * 4 + 3]

      if (x && y) {
        this.renderTile(tile, x - 8, y - 16)
        // console.log(flags)
      }
    }
  }

  renderTile(tileIndex: number, x: number, y: number) {
    const tile = this.getTileData(tileIndex)
    const map = this.tileToColorMap(tile)
    const pixels = this.colorMapToPixels(map)
    const rowWidth = this.width * 4

    for (let row = 0; row < 8; row += 1) {
      if (y + row + 1 < 1) {
        continue
      }
      const rowPos = y * rowWidth + row * rowWidth
      const rowPixels = pixels.slice(row * TILE_WIDTH, row * TILE_WIDTH + TILE_WIDTH)

      this.lcdBuffer.set(rowPixels, rowPos + x * 4)
    }
  }

  scaleRow(rowIdx: number, rowWidth: number) {
    const row = this.lcdBuffer.slice(rowIdx * rowWidth, rowIdx * rowWidth + rowWidth)
    const scaledRow = new Uint8Array(row.length)

    let scaledColIdx = 0
    for (let colIdx = 0; colIdx < LCD_WIDTH; colIdx += 1) {
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
    const scaledBuffer = new Uint8Array(this.lcdBuffer.length)

    let scaledRowIdx = 0
    for (let rowIdx = 0; rowIdx < LCD_HEIGHT; rowIdx += 1) {
      const row = this.scaleRow(rowIdx, rowWidth)
      for (let scale = 0; scale < this.scale; scale += 1) {
        scaledBuffer.set(row, scaledRowIdx * rowWidth)
        scaledRowIdx += 1
      }
    }

    this.lcdBuffer.set(scaledBuffer, 0)
  }

  incrementScanline() {}

  getTileData(tileIndex: number) {
    const bgWindowTileData = this.emulator.bus.getLcdFlag('bgWindowTileData')
    const bgIndex = bgWindowTileData ? 0x8000 : 0x9000

    if (!bgWindowTileData) {
      tileIndex = convertTwosComplement(tileIndex)
    }

    return this.emulator.bus.readBytes(bgIndex + tileIndex * 16, 16)
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

  convertPaletteToRGB(paletteValue: number) {
    const colors = [
      paletteValue & 0x03,
      (paletteValue >> 2) & 0x03,
      (paletteValue >> 4) & 0x03,
      (paletteValue >> 6) & 0x03,
    ]

    const rgbValues = colors.map((intensity) => {
      const r = (this.palette[intensity] >> 16) & 0xff
      const g = (this.palette[intensity] >> 8) & 0xff
      const b = (this.palette[intensity] >> 0) & 0xff
      const a = 0xff
      return new Uint8Array([r, g, b, a])
    })
    return rgbValues
  }

  colorMapToPixels(map: ColorMap) {
    const pixels = new Uint8Array(8 * 8 * 4)
    let pos = 0

    const palette = this.convertPaletteToRGB(this.emulator.bus.readByte(0xff47))

    map.forEach((row) => {
      row.forEach((col) => {
        const color = palette[col]
        pixels.set(color, pos)

        pos += 4
      })
    })

    return pixels
  }
}
