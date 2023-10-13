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
    this.emulator.bus.writeByte(BUS_REGISTERS.stat, 1)
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
    const bytesPerRow = LCD_WIDTH * 4

    while (this.dot < this.emulator.clock.dotCycles) {
      const lineDot = this.dot % DOTS_PER_SCANLINE
      const scanline = Math.floor(this.dot / DOTS_PER_SCANLINE)

      if (lineDot === 0) {
        this.emulator.bus.writeByte(BUS_REGISTERS.ly, scanline)
      }

      // Mode 3 - Pixel Transfer
      if (lineDot == 80 && scanline < LCD_HEIGHT) {
        this.setRGBPalette()

        const scy = this.emulator.bus.readByte(BUS_REGISTERS.scy)
        const lcdRowIdx = scanline * bytesPerRow

        const objectPixels = this.getScanlineObjectPixels(scanline + scy)
        const bgPixels = this.getScanlineBackgroundPixels(scanline)

        for (let pixelIdx = 0; pixelIdx < LCD_WIDTH; pixelIdx += 1) {
          const pos = pixelIdx * 4
          const bgPixel = bgPixels.slice(pos, pos + 4)
          const objectPixel = objectPixels.slice(pos, pos + 4)

          if (objectPixel[3] === 0) {
            this.graphicsBuffer.set(bgPixel, lcdRowIdx + pos)
          } else {
            this.graphicsBuffer.set(objectPixel, lcdRowIdx + pos)
          }
        }
      }

      if (this.dot === LCD_HEIGHT * DOTS_PER_SCANLINE) {
        this.scaleLcdBuffer()
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

  getObjectsOnScanline(scanline: number) {
    // turn off write access to OAM
    const oam: OAMEntry[] = []
    if (this.emulator.bus.getLcdFlag('spriteEnable') === false) {
      return oam
    }

    const oamIdx = BUS_REGISTERS.oam
    const spriteHeight = this.emulator.bus.getLcdFlag('spriteSize') ? 16 : 8

    for (let spriteIdx = 0; spriteIdx < 40; spriteIdx += 1) {
      const y = this.emulator.bus.memory[oamIdx + spriteIdx * 4]

      if (y > scanline + 16 || y + spriteHeight <= scanline + 16) {
        continue
      }

      const x = this.emulator.bus.memory[oamIdx + spriteIdx * 4 + 1]
      const tile = this.emulator.bus.memory[oamIdx + spriteIdx * 4 + 2]
      const flags = this.emulator.bus.memory[oamIdx + spriteIdx * 4 + 3]

      oam.push({ x, y, tile, flags })
    }

    return oam
  }

  getScanlineBackgroundPixels(scanline: number) {
    const pixels = new Uint8Array(LCD_WIDTH * 4)

    if (this.emulator.bus.getLcdFlag('bgWindowEnable') === false) {
      return pixels
    }

    const bgMapBaseIndex = this.emulator.bus.getLcdFlag('bgTileMap') ? 0x9c00 : 0x9800
    const scx = this.emulator.bus.readByte(BUS_REGISTERS.scx)
    const scy = this.emulator.bus.readByte(BUS_REGISTERS.scy)
    const bgMapRowIdx = bgMapBaseIndex + ((32 * Math.floor((scanline + scy) / 8)) % 32 ** 2)

    for (let bgMapColIdx = 0; bgMapColIdx < 32; bgMapColIdx += 1) {
      try {
        const rowPos = bgMapColIdx * TILE_WIDTH - scx * 4
        // if (scx > 0) {
        //   console.log(bgMapColIdx, scx, rowPos)
        // }
        const tileIndex = this.emulator.bus.memory[bgMapRowIdx + (Math.floor(bgMapColIdx + scx / 8) % 32)]
        const address = this.getTileAddressByIndex(tileIndex)
        const tileRowIdx = (scanline + scy) % 8

        for (let pixelIdx = 0; pixelIdx < 8; pixelIdx += 1) {
          const pixelPos = rowPos + pixelIdx * 4
          if (pixelPos < 0 || pixelPos + 4 > pixels.length) {
            // console.log(rowPos)
            continue
          }

          const bgPixel = this.getTilePixel(address, pixelIdx, tileRowIdx)
          pixels.set(bgPixel, pixelPos)
        }
      } catch (e) {
        // console.log(e)
      }
    }

    // return pixels.slice(scx * 4, scx * 4 + LCD_WIDTH * 4)
    return pixels
  }

  getScanlineObjectPixels(scanline: number) {
    const oam = this.getObjectsOnScanline(scanline)
    const pixels = new Uint8Array(this.width * 4)

    oam
      .sort((a, b) => {
        return a.x - b.x
      })
      .forEach((object) => {
        const tileRowIdx = scanline - object.y + 16

        for (let pixelIdx = 0; pixelIdx < 8; pixelIdx += 1) {
          const x = object.x - 8
          if (x <= 0 || x > 168) {
            continue
          }

          const address = this.getTileAddressByIndex(object.tile, true)
          const pixel = this.getTilePixel(address, pixelIdx, tileRowIdx, true)

          if (pixel[3] !== 0) {
            pixels.set(pixel, pixelIdx * 4 + x * 4)
          }
        }
      })

    return pixels
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

  getTileAddressByIndex(index: number, object?: boolean) {
    const unsignedIndexing = object || this.emulator.bus.getLcdFlag('bgWindowTileData')
    const bgIndex = unsignedIndexing ? 0x8000 : 0x9000

    if (!unsignedIndexing) {
      index = convertTwosComplement(index)
    }

    return bgIndex + index * 16
  }

  getTilePixel(address: number, col: number, row: number, transparent?: boolean) {
    const pixelIndex = address + row * 2
    const [left, right] = this.emulator.bus.readBytes(pixelIndex, 2)
    const color = ((left >> (7 - col)) & 1) | (((right >> (7 - col)) & 1) << 1)

    if (transparent && color === 0) {
      return new Uint8Array([0, 0, 0, 0])
    }

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

  scaleRow(rowIdx: number) {
    const rowWidth = LCD_WIDTH * 4
    const row = this.graphicsBuffer.slice(rowIdx * rowWidth, rowIdx * rowWidth + rowWidth)
    const scaledRow = new Uint8Array(this.width * 4)

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
    let scaledRowIdx = 0
    for (let rowIdx = 0; rowIdx < LCD_HEIGHT; rowIdx += 1) {
      const row = this.scaleRow(rowIdx)
      for (let scale = 0; scale < this.scale; scale += 1) {
        this.lcdBuffer.set(row, scaledRowIdx * this.width * 4)
        scaledRowIdx += 1
      }
    }
  }
}
