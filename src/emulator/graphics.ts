import { CPU } from "./cpu";
import { IO_REGISTERS } from "./memory";

export class Graphics {
  cpu: CPU;

  constructor(cpu: CPU) {
    this.cpu = cpu;
  }

  renderScanline() {
    let ly = this.cpu.memory.readByte(IO_REGISTERS.ly) + 1;

    if (ly > 153) {
      ly = 0;
    } else if (ly === 144) {
      this.cpu.interrupt('vblank');
    }

    this.cpu.memory.writeByte(IO_REGISTERS.ly, ly)
  }

  getTileData(tileIndex: number) {
    return this.cpu.memory.readBytes(0x8000 + (tileIndex * 16), 16);
  }

  tileToColorData(tile: Uint8Array) {
    const result: number[][] = [];
    for (let row = 0; row < 8; row += 1) {
      result.push([]);

      const left = tile[row];
      const right = tile[row + 1]

      console.log(left, right);
    }
  }
}