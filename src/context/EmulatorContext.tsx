import React, { createContext, useEffect } from "react";
import { Emulator, EventMap } from '../emulator';
import useFile from "../hooks/useFile";

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
  useBootRom: boolean;
  reset: () => void;
  setUseBootRom: (enabled: boolean) => void;
}

const initialValue: EmulatorContextType = {
  useBootRom: true,
  paused: true,
  vblankCounter: 0,
  lcd: {
    data: new Uint8ClampedArray(144 * 160 * 4 * 4 * 4),
    width: 160 * 4,
    height: 144 * 4,
  },
  reset: () => { },
  setUseBootRom: () => { },
}

export const EmulatorContext = createContext<EmulatorContextType>(initialValue);

export const EmulatorProvider = ({
  children
}: { children: React.ReactNode }) => {
  const [lcd, setLcd] = React.useState<LCD>(initialValue.lcd);
  const [emulator, setEmulator] = React.useState<Emulator>();
  const [paused, setPaused] = React.useState(initialValue.paused);
  const [vblankCounter, setVblankCounter] = React.useState(initialValue.vblankCounter);
  const [useBootRom, setUseBootRom] = React.useState(initialValue.useBootRom);

  const bootrom = useFile('bootrom');
  const gamerom = useFile('gamerom');

  const reset = () => {
    setPaused(initialValue.paused);
    setVblankCounter(initialValue.vblankCounter);
    setLcd(initialValue.lcd)
    setEmulator(undefined);
  }

  const loadRoms = () => {
    if (bootrom?.file) {
      emulator?.loadBootRom(bootrom.file);
    }

    if (gamerom?.file) {
      emulator?.cpu.bus.loadRomFile(gamerom.file);
    }
  }

  useEffect(() => {
    if (!emulator) {
      const emulatorInst = new Emulator();

      if (!useBootRom) {
        emulatorInst.bootstrapWithoutRom();
      }
      setEmulator(emulatorInst);
      loadRoms();
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
      lcd,
      reset,
      useBootRom,
      setUseBootRom
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
