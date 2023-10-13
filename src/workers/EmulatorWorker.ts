import { Emulator } from '../emulator/emulator'
import { Button } from '../emulator/types'

const emulator = new Emulator()

emulator.on('vblank', () => {
  self.postMessage({
    type: 'vblank',
  })
})
emulator.on('pause', () =>
  self.postMessage({
    type: 'pause',
  })
)
emulator.on('resume', () =>
  self.postMessage({
    type: 'resume',
  })
)
emulator.on('render', () =>
  self.postMessage({
    type: 'render',
    data: {
      fps: emulator.ppu.fps,
      width: emulator.ppu.width,
      height: emulator.ppu.height,
      lcdBuffer: emulator.ppu.lcdBuffer,
    },
  })
)

const handlers = {
  resume: () => {
    emulator.clock.resume()
  },
  pause: () => {
    emulator.clock.pause()
  },
  tick: () => {
    emulator.cpu.tick()
  },
  bootstrapWithoutRom: () => {
    emulator.bootstrapWithoutRom()
  },
  loadRom: ({ rom, bootRom }: { rom: File; bootRom?: boolean }) => {
    if (bootRom) {
      emulator.loadBootRom(rom)
    } else {
      emulator.bus.loadRomFile(rom)
    }
  },
  joypadPress: ({ button, pressed }: { button: Button; pressed: boolean }) => {
    emulator.joypad.set(button, pressed)
  },
} as const

type Event = {
  type: keyof typeof handlers
  data?: Parameters<(typeof handlers)[keyof typeof handlers]>[0]
}

export interface TEmulatorWorker extends Omit<Worker, 'postMessage'> {
  postMessage(event: Event): void
}

self.onmessage = (event: MessageEvent<Event>) => {
  if (!event.data.data || handlers[event.data.type].length === 0) {
    // @ts-expect-error - TS doesn't know that it may or may not take an argument
    handlers[event.data.type]()
  } else {
    // @ts-expect-error - TS doesn't know that it may or may not take an argument
    handlers[event.data.type](event.data.data)
  }
}

export type EmulatorMessageNames = keyof typeof handlers
