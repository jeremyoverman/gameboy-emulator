//
// Display Data
//

import { CartType } from "./types"

export const LCD_WIDTH         = 160
export const LCD_HEIGHT        = 144
export const FRAME_HEIGHT      = 153
export const TILE_WIDTH        = 8 * 4
export const BACKGROUND_WIDTH  = 256
export const BACKGROUND_HEIGHT = 256

export const LCD_FLAGS  = {
  enable:           0b10000000,
  windowTileMap:    0b01000000,
  windowEnable:     0b00100000,
  bgWindowTileData: 0b00010000,
  bgTileMap:        0b00001000,
  spriteSize:       0b00000100,
  spriteEnable:     0b00000010,
  bgWindowEnable:   0b00000001,
} as const

//
// Bus
//

export const RST_JUMP_ADDRESSES = [0x0000, 0x0008, 0x0010, 0x0018, 0x0020, 0x0028, 0x0030, 0x0038]
export const INTERRUPT_PRIORITY = ['vblank', 'lcdstat', 'timer', 'serial', 'joypad'] as const

export const INTERRUPTS = {
  vblank:  { jump: 0x0040, flag: 0b00001, },

  lcdstat: { jump: 0x0048, flag: 0b00010, },

  timer:   { jump: 0x0050, flag: 0b00100, },

  serial:  { jump: 0x0058, flag: 0b01000, },

  joypad:  { jump: 0x0060, flag: 0b10000, },

} as const

export const BUS_REGISTERS = {
  oam:     0xfe00,
  joypad:  0xff00,
  serial:  [0xff01, 0xff02],
  div:     0xff04,
  tima:    0xff05,
  tma:     0xff06,
  tac:     0xff07,
  audio:   [0xff10, 0xff26],
  wave:    [0xff30, 0xff3f],
  lcdc:    0xff40,
  stat:    0xff41,
  scy:     0xff42,
  scx:     0xff43,
  ly:      0xff44,
  lcy:     0xff45,
  dma:     0xff46,
  windowy: 0xff4a,
  windowx: 0xff4b,
  boot:    0xff50,
  bank:    [0xff51, 0xff55],
}

export const ACTION_BUTTON    = 0b00100000
export const DIRECTION_BUTTON = 0b00010000
export const BUTTONS = {
  Right:  0b00000001,
  Left:   0b00000010,
  Up:     0b00000100,
  Down:   0b00001000,
  A:      0b00000001,
  B:      0b00000010,
  Select: 0b00000100,
  Start:  0b00001000,
}

export const MBCS = ['mbc1', 'mbc2', 'mbc3', 'mbc5', 'mbc6', 'mbc7'] as const

export const CART_TYPES: Record<number, CartType> = {
  0x00: { },
  0x01: { mbc: 'mbc1', },
  0x02: { mbc: 'mbc1', ram: true, },
  0x03: { mbc: 'mbc1', ram: true, battery: true, },
  0x05: { mbc: 'mbc2', },
  0x06: { mbc: 'mbc2', battery: true, },
  0x08: { ram: true, },
  0x09: { ram: true, battery: true, },
  0x0B: { },
  0x0C: { ram: true, },
  0x0D: { ram: true, battery: true, },
  0x0F: { mbc: 'mbc3', battery: true, timer: true, },
  0x10: { mbc: 'mbc3', ram: true, battery: true, timer: true, },
  0x11: { mbc: 'mbc3', },
  0x12: { mbc: 'mbc3', ram: true, },
  0x13: { mbc: 'mbc3', ram: true, battery: true, },
  0x19: { mbc: 'mbc5', },
  0x1A: { mbc: 'mbc5', ram: true, },
  0x1B: { mbc: 'mbc5', ram: true, battery: true, },
  0x1C: { mbc: 'mbc5', rumble: true, },
  0x1D: { mbc: 'mbc5', ram: true, rumble: true, },
  0x1E: { mbc: 'mbc5', ram: true, battery: true, rumble: true },
  0x20: { mbc: 'mbc6', },
  0x22: { mbc: 'mbc7', ram: true, battery: true, rumble: true, sensor: true, },
  0xFC: { },
  0xFD: { },
  0xFE: { },
  0xFF: { ram: true, battery: true, },
}

export const RAM_SIZE_MAP = {
  0x00: 0,
  0x01: 2 * 1024,
  0x02: 8 * 1024,
  0x03: 32 * 1024,
  0x04: 128 * 1024,
  0x05: 64 * 1024,
} as const

//
// Registers
//

export const GP_8_BIT_REGISTERS       = ['a', 'b', 'c', 'd', 'e', 'h', 'l'] as const
export const SPECIAL_8_BIT_REGISTERS  = ['f'] as const
export const GP_16_BIT_REGISTERS      = ['af', 'bc', 'de', 'hl'] as const
export const SPECIAL_16_BIT_REGISTERS = ['sp', 'pc'] as const

export const ALL_8_BIT_REGISTERS  = [...GP_8_BIT_REGISTERS, ...SPECIAL_8_BIT_REGISTERS] as const
export const ALL_16_BIT_REGISTERS = [...GP_16_BIT_REGISTERS, ...SPECIAL_16_BIT_REGISTERS] as const
export const ARITHMETIC_REGISTERS = [...GP_8_BIT_REGISTERS, ...GP_16_BIT_REGISTERS, 'sp'] as const
export const REGISTERS = [ ...GP_8_BIT_REGISTERS, ...GP_16_BIT_REGISTERS, ...SPECIAL_8_BIT_REGISTERS, ...SPECIAL_16_BIT_REGISTERS ] as const

export const FLAGS = {
  Zero:        0x80,
  Subtraction: 0x40,
  HalfCarry:   0x20,
  Carry:       0x10,
}

//
// Cycles
//

export const FPS = 120

export const CYCLES_PER_SECOND   = 4194304  // Gamboy cock is 4.194304 MHz
export const CYCLES_PER_DIV      = CYCLES_PER_SECOND / 16384

export const DOTS_PER_SCANLINE   = 456

export const TIMER_FLAGS = {
  enable: 0b100,
}

export const TMA = [
  CYCLES_PER_SECOND / 1024,
  CYCLES_PER_SECOND / 16,
  CYCLES_PER_SECOND / 64,
  CYCLES_PER_SECOND / 256,
]
