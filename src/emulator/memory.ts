export class Memory {
  memory: Uint8Array = new Uint8Array(0xffff);

  readByte(address: number): number {
    return this.memory[address];
  }

  readBytes(address: number, num: number) {
    return this.memory.slice(address, address + num);
  }

  writeByte(address: number, value: number) {
    this.memory[address] = value;
  }

  writeBytes(address: number, values: number[]) {
    this.memory.set(values, address);
  }
}
