//
// Display Data
//

export const WIDTH      = 160
export const HEIGHT     = 144
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

export const IO_REGISTERS = {
  joypad:  0xff00,
  serial:  [0xff01, 0xff02],
  divider: 0xff04,
  audio:   [0xff10, 0xff26],
  wave:    [0xff30, 0xff3f],
  lcdc:    0xff40,
  stat:    0xff41,
  scy:     0xff42,
  scx:     0xff43,
  ly:      0xff44,
  lcy:     0xff45,
  windowy: 0xff4a,
  windowx: 0xff4b,
  boot:    0xff50,
  bank:    [0xff51, 0xff55],
}

export const BUTTONS = {
  Right:  0x01,
  Left:   0x02,
  Down:   0x04,
  Up:     0x08,
  A:      0x01,
  B:      0x02,
  Select: 0x04,
  Start:  0x08,
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