export class Memory {
  memory: Uint8Array = new Uint8Array(0xffff);

  readByte(address: number): number {
    return this.memory[address];
  }

  writeByte(address: number, value: number) {
    this.memory[address] = value;
  }
}
