import React, { createContext, useEffect } from "react";
import { Emulator, EventMap } from '../emulator';

export type LCD = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

interface EmulatorContextType {
  emulator?: Emulator;
  paused: boolean;
  vblankCounter: number;
  lcd: LCD;
}

export const EmulatorContext = createContext<EmulatorContextType>({
  paused: true,
  vblankCounter: 0,
  lcd: {
    data: new Uint8ClampedArray(144 * 160 * 4),
    width: 144,
    height: 160,
  },
});

export const EmulatorProvider = ({
  children
}: { children: React.ReactNode }) => {
  const [lcd, setLcd] = React.useState<LCD>({
    data: new Uint8ClampedArray(144 * 160 * 4),
    width: 144,
    height: 160,
  });
  const [emulator, setEmulator] = React.useState<Emulator>();
  const [paused, setPaused] = React.useState(true);
  const [vblankCounter, setVblankCounter] = React.useState(0);

  useEffect(() => {
    if (!emulator) {
      const emulatorInst = new Emulator();
      // emulatorInst.bootstrapWithoutRom();
      setEmulator(emulatorInst);
    }

    if (!emulator) {
      return;
    }

    const handlers: { [key in keyof EventMap]?: () => void } = {
      vblank: () => {
        setVblankCounter((prev) => prev + 1);
      },
      pause: () => {
        setPaused(emulator.cpu.paused)
      },
      resume: () => {
        setPaused(emulator.cpu.paused)
      },
      render: () => {
        setLcd({
          width: emulator.cpu.graphics.width,
          height: emulator.cpu.graphics.height,
          data: emulator.cpu.graphics.lcdBuffer,
        });
      },
    }

    Object.keys(handlers).forEach((event) => {
      const handler = handlers[event as keyof typeof handlers];

      if (!handler) {
        return;
      }

      emulator.on((event as keyof typeof handlers), handler);
    });

    emulator.cpu.graphics.render();

    return () => {
      Object.keys(handlers).forEach((event) => {
        const handler = handlers[event as keyof typeof handlers];

        if (!handler) {
          return;
        }

        emulator.off((event as keyof typeof handlers), handler);
      });
    };
  }, [emulator]);

  return (
    <EmulatorContext.Provider value={{
      emulator,
      vblankCounter,
      paused,
      lcd
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
