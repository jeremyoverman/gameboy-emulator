import { CPU, CPUEventMap } from "./cpu";

export type EventMap = CPUEventMap;

export type SubscriptionFunction = () => void;
export type Emitter<T extends keyof EventMap> = (
  event: T,
) => void;

export class Emulator {
  public cpu: CPU;

  private eventListeners: {
    [key in keyof EventMap]?: Array<EventMap[key]>;
  } = {};

  constructor() {
    console.log('Creating a new emulator')
    this.cpu = new CPU(this.emit);
  }

  loadBootRom(file: File) {
    this.cpu.memory.loadRomFile(file, true);
  }

  // Method to register an event listener
  on<T extends keyof EventMap>(event: T, callback: EventMap[T]): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }

    this.eventListeners[event]?.push(callback);
  }

  // Method to unregister an event listener
  off<T extends keyof EventMap>(event: T, callback: EventMap[T]): void {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event]?.filter(
      (listener) => listener !== callback
    );
  }

  // Method to emit events
  private emit: Emitter<keyof EventMap> = (event) => {
    this.eventListeners[event]?.forEach((callback) => callback());
  };
}
