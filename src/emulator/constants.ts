//
// Display Data
//

export const LCD_WIDTH      = 160
export const LCD_HEIGHT     = 144
export const FRAME_HEIGHT   = 153
export const TILE_WIDTH = 8 * 4

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
// Memory
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

export const FPS = 60

export const CYCLES_PER_SECOND   = 4194304
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
