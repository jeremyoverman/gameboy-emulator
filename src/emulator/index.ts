import { RegisterEventMap, Registers } from "./cpu/registers";

type EventMap = RegisterEventMap;

export type SubscriptionFunction = () => void;
export type Emitter<T extends keyof EventMap> = (
  event: T,
  data: Parameters<EventMap[T]>[0]
) => void;

export class Emulator {
  public registers: Registers;

  private eventListeners: { [key in keyof EventMap]?: Array<EventMap[key]> } =
    {};

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
  private emit: Emitter<keyof EventMap> = (event, data) => {
    this.eventListeners[event]?.forEach((callback) => callback(data));
  };

  constructor() {
    this.registers = new Registers(this.emit);
  }
}
