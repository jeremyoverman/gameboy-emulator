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
    }

    this.cpu.memory.writeByte(IO_REGISTERS.ly, ly)
  }
}