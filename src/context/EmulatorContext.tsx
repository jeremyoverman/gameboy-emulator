import React, { createContext, useEffect } from "react";
import { Emulator, EventMap } from '../emulator';

interface EmulatorContextType {
  emulator?: Emulator;
  paused: boolean;
  vblankCounter: number;
}

export const EmulatorContext = createContext<EmulatorContextType>({
  paused: true,
  vblankCounter: 0,
});

export const EmulatorProvider = ({
  children
}: { children: React.ReactNode }) => {
  const [emulator, setEmulator] = React.useState<Emulator>();
  const [paused, setPaused] = React.useState(true);
  const [vblankCounter, setVblankCounter] = React.useState(0);

  useEffect(() => {
    if (!emulator) {
      setEmulator(new Emulator());
    }

    if (!emulator) {
      return;
    }

    const handlers: { [key in keyof EventMap]: () => void } = {
      vblank: () => {
        setVblankCounter((prev) => prev + 1);
      },
      pause: () => {
        setPaused(emulator.cpu.paused)
      },
      resume: () => {
        setPaused(emulator.cpu.paused)
      }
    }

    Object.keys(handlers).forEach((event) => {
      emulator.on((event as keyof typeof handlers), handlers[event as keyof typeof handlers]);
    });

    return () => {
      Object.keys(handlers).forEach((event) => {
        emulator.off((event as keyof typeof handlers), handlers[event as keyof typeof handlers]);
      });
    };
  }, [emulator]);

  return (
    <EmulatorContext.Provider value={{
      emulator,
      vblankCounter,
      paused,
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
