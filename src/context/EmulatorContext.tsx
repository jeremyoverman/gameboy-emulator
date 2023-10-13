import React, { createContext, useEffect } from "react";
import useFile from "../hooks/useFile";
import EmulatorWorker from '../workers/EmulatorWorker?worker'
import { BUTTON_MAP } from "../constants";
import { Button } from "../emulator/types";

export type LCD = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

interface EmulatorContextType {
  paused: boolean;
  vblankCounter: number;
  lcd: LCD;
  useBootRom: boolean;
  fps: number;
  reset: () => void;
  setUseBootRom: (enabled: boolean) => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  loadRom: (rom: File, bootRom?: boolean) => void;
  joypadPress: (key: Button, pressed: boolean) => void;
}

const initialValue: EmulatorContextType = {
  fps: 0,
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
  pause: () => { },
  resume: () => { },
  tick: () => { },
  loadRom: () => { },
  joypadPress: () => { },
}

export const EmulatorContext = createContext<EmulatorContextType>(initialValue);

export const EmulatorProvider = ({
  children
}: { children: React.ReactNode }) => {
  // Worker
  const worker = React.useMemo(() => new EmulatorWorker(), []);

  // LCD
  const [lcd, setLcd] = React.useState<LCD>(initialValue.lcd);
  const [fps, setFps] = React.useState(0);

  // Clock
  const [paused, setPaused] = React.useState(initialValue.paused);
  const pause = React.useCallback(() => worker.postMessage({ type: 'pause' }), [worker]);
  const resume = React.useCallback(() => worker.postMessage({ type: 'resume' }), [worker]);
  const tick = React.useCallback(() => worker.postMessage({ type: 'tick' }), [worker]);

  // Counters
  const [vblankCounter, setVblankCounter] = React.useState(initialValue.vblankCounter);

  // Roms
  const [useBootRom, setUseBootRom] = React.useState(initialValue.useBootRom);
  const { file: bootrom } = useFile('bootrom');
  const { file: gamerom } = useFile('gamerom');

  // Emulator
  const joypadPress = React.useCallback((button: Button, pressed: boolean) => worker.postMessage({
    type: 'joypadPress',
    data: {
      button,
      pressed
    }
  }), [worker]);
  const reset = React.useCallback(() => {
    setPaused(initialValue.paused);
    setVblankCounter(initialValue.vblankCounter);
    setLcd(initialValue.lcd)
  }, [])

  const loadRom = React.useCallback((rom: File, bootRom: boolean = false) => {
    worker.postMessage({
      type: 'loadRom', data: {
        rom,
        bootRom
      }
    })
  }, [worker])

  useEffect(() => {
    if (bootrom) {
      loadRom(bootrom, true);
    }

    if (gamerom) {
      loadRom(gamerom);
    }

    if (!useBootRom) {
      worker.postMessage({ type: 'bootstrapWithoutRom' })
    }
  }, [worker, loadRom, bootrom, gamerom, useBootRom])

  useEffect(() => {
    worker.onmessage = (event) => {
      const { data } = event.data;

      if (event.data.type === 'vblank') {
        setVblankCounter((prev) => prev + 1);
      } else if (event.data.type === 'pause') {
        setPaused(true)
      } else if (event.data.type === 'resume') {
        setPaused(false)
      } else if (event.data.type === 'render') {
        setFps(data.fps);

        setLcd({
          width: data.width,
          height: data.height,
          data: data.lcdBuffer,
        });
      }
    }
  }, [worker, pause, resume, tick, loadRom]);

  return (
    <EmulatorContext.Provider value={{
      vblankCounter,
      paused,
      lcd,
      reset,
      useBootRom,
      setUseBootRom,
      fps,
      pause,
      resume,
      tick,
      loadRom,
      joypadPress
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
