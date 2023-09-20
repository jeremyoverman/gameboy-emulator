export const IO_REGISTERS = {
  joypad: [0xFF00],
  serial: [0xFF01, 0xFF02],
  divider: [0xFF04, 0xFF07],
  audio: [0xFF10, 0xFF26],
  wave: [0xFF30, 0xFF3F],
  lcd: [0xFF40, 0xFF4B],
  boot: [0xFF50],
  bank: [0xFF51, 0xFF55],
  ly: 0xFF44,
}
export type IoRegister = keyof typeof IO_REGISTERS;

export const RST_JUMP_ADDRESSES = [ 0x0000,0x0008,0x0010,0x0018,0x0020,0x0028,0x0030,0x0038 ];
export type RstJumpAddresses = typeof RST_JUMP_ADDRESSES[number];

export const INTERRUPT_JUMP_ADDRESSES = {
  vblank: 0x0040,
  lcdstat: 0x0048,
  timer: 0x0050,
  serial: 0x0058,
  joypad: 0x0060,
};
export type InterruptJumpAddresses = keyof typeof INTERRUPT_JUMP_ADDRESSES

export const INTERRUPT_FLAGS = {
  vblank: 0b00001,
  lcdstat: 0b00010,
  timer: 0b00100,
  serial: 0b01000,
  joypad: 0b10000,
}
export type InterruptFlag = keyof typeof INTERRUPT_FLAGS;

export class Memory {
  memory: Uint8Array = new Uint8Array(0xffff).map(() => 0xff);

  constructor() {
  }

  async loadRomFile(file: File, boot?: boolean) {
    const buffer = await file.arrayBuffer();
    const rom = new Uint8Array(buffer);
    const offset = boot ? 0x0000 : 0x0100;
    console.log('loading rom file', offset, rom)

    this.loadROM(rom, offset);
  }

  private loadROM(rom: Uint8Array, offset: number) {
    this.memory.set(rom, offset);
  }

  readByte(address: number): number {
    return this.memory[address];
  }

  readBytes(address: number, num: number) {
    return this.memory.slice(address, address + num);
  }

  writeByte(address: number, value: number) {
    this.memory[address] = value;
  }

  writeBytes(address: number, values: number[] | Uint8Array) {
    this.memory.set(values, address);
  }

  setInterruptFlag(flag: InterruptFlag, on: boolean) {
    const address = 0xff0f;
    const current = this.readByte(address);

    if (on) {
      this.writeByte(address, current | INTERRUPT_FLAGS[flag]);
    } else {
      this.writeByte(address, current & ~INTERRUPT_FLAGS[flag]);
    }
  }
}
