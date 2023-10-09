import { Emitter, Emulator } from './emulator'
import { LCD_HEIGHT, BUS_REGISTERS, TILE_WIDTH, LCD_WIDTH, DOTS_PER_SCANLINE, FRAME_HEIGHT } from './constants'
import { ColorMap, OAMEntry } from './types'
import { convertTwosComplement } from './utils'
import { PPUEventMap } from './types'

export class PPU {
  emulator: Emulator
  emit: Emitter<keyof PPUEventMap>
  rendered: boolean = false

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

  // Palette
  palette: number[] = [0xe0dfd3, 0x807d6f, 0x473f37, 0x241914]
  rgbPalette: Uint8Array[] = []

  // OAM
  oam: OAMEntry[] = []

  constructor(emulator: Emulator) {
    this.emulator = emulator
    this.emit = emulator.emit

    this.setScale(this.scale)
    this.setRGBPalette()
    this.emulator.bus.writeByte(BUS_REGISTERS.stat, 0b00000001)
  }

  resetFrames() {
    this.frames = 0
  }

  setRGBPalette() {
    this.rgbPalette = this.convertPaletteToRGB(this.emulator.bus.readByte(0xff47))
  }

  setScale(scale: number) {
    this.scale = scale
    this.width = this.width * scale
    this.height = this.height * scale
    this.lcdBuffer = new Uint8ClampedArray(LCD_WIDTH * this.scale * LCD_HEIGHT * this.scale * 4)

    this.emit('lcdBufferReady')
  }

  tick() {
    while (this.dot < this.emulator.clock.dotCycles) {
      const lineDot = this.dot % DOTS_PER_SCANLINE
      const scanline = Math.floor(this.dot / DOTS_PER_SCANLINE)

      if (lineDot === 0) {
        this.emulator.bus.writeByte(BUS_REGISTERS.ly, scanline)
      }

      // New Logic

      // if (lineDot === 0) {
      //   // turn off write access to OAM
      //   const index = BUS_REGISTERS.oam

      //   for (let idx = 0; idx < 40; idx += 1) {
      //     const y = this.emulator.bus.memory[index + idx * 4]
      //     const x = this.emulator.bus.memory[index + idx * 4 + 1]
      //     const tile = this.emulator.bus.memory[index + idx * 4 + 2]
      //     // const flags = this.emulator.bus.memory[index + idx * 4 + 3]

      //     if (x && y) {
      //       this.renderTile(tile, x - 8, y - 16)
      //       // console.log(flags)
      //     }
      //   }
      // }

      if (lineDot == 80 && scanline < LCD_HEIGHT) {
        this.setRGBPalette()
        const bgMapBaseIndex = this.emulator.bus.getLcdFlag('bgTileMap') ? 0x9c00 : 0x9800
        const scx = this.emulator.bus.readByte(BUS_REGISTERS.scx)
        const scy = this.emulator.bus.readByte(BUS_REGISTERS.scy)
        const pixelsPerRow = this.width * 4
        const bgMapRowIdx = 32 * Math.floor((scanline + scy) / 8)
        for (let bgMapColIdx = 0; bgMapColIdx < 32; bgMapColIdx += 1) {
          try {
            const rowPos = bgMapColIdx * TILE_WIDTH * this.scale + scx
            if (rowPos / 4 + 32 > this.width) {
              break
            }
            const tileIndex = this.emulator.bus.memory[bgMapBaseIndex + bgMapRowIdx + bgMapColIdx]
            const tileRowIdx = (scanline + scy) % 8
            const scaledPixels = new Uint8Array(TILE_WIDTH * this.scale)
            for (let pixelIdx = 0; pixelIdx < 8; pixelIdx += 1) {
              const pixel = this.getTilePixel(tileIndex, pixelIdx, tileRowIdx)
              for (let scaleIdx = 0; scaleIdx < this.scale; scaleIdx += 1) {
                scaledPixels.set(pixel, pixelIdx * 4 * this.scale + scaleIdx * 4)
              }
            }
            for (let scaleYIdx = 0; scaleYIdx < this.scale; scaleYIdx += 1) {
              const lcdRowIdx = scanline * pixelsPerRow * this.scale + scaleYIdx * pixelsPerRow
              this.lcdBuffer.set(scaledPixels, lcdRowIdx + rowPos)
            }
          } catch (e) {
            console.log(e)
          }
        }
      }

      // End New Logic

      if (this.dot === LCD_HEIGHT * DOTS_PER_SCANLINE) {
        this.frames += 1
        this.calculateFps()
        this.emulator.cpu.interrupt('vblank')
        this.emit('vblank')
        this.emit('render')
      }

      if (scanline === FRAME_HEIGHT) {
        this.dot = 0
        this.emulator.clock.dotCycles = 0
      }

      this.dot += 1
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

  getTileData(tileIndex: number) {
    const bgWindowTileData = this.emulator.bus.getLcdFlag('bgWindowTileData')
    const bgIndex = bgWindowTileData ? 0x8000 : 0x9000

    if (!bgWindowTileData) {
      tileIndex = convertTwosComplement(tileIndex)
    }

    return this.emulator.bus.readBytes(bgIndex + tileIndex * 16, 16)
  }

  getTilePixel(index: number, col: number, row: number) {
    const bgWindowTileData = this.emulator.bus.getLcdFlag('bgWindowTileData')
    const bgIndex = bgWindowTileData ? 0x8000 : 0x9000

    if (!bgWindowTileData) {
      index = convertTwosComplement(index)
    }

    const pixelIndex = bgIndex + index * 16 + row * 2
    const [left, right] = this.emulator.bus.readBytes(pixelIndex, 2)
    const color = ((left >> (7 - col)) & 1) | (((right >> (7 - col)) & 1) << 1)

    return this.rgbPalette[color]
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
}
