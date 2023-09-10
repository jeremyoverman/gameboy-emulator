import React, { createContext, useState, useEffect } from "react";
import { Emulator } from '../emulator';

interface EmulatorContextType {
  emulator?: Emulator;
  registers: {
    [key: string]: number[];
  };
}

export const EmulatorContext = createContext<EmulatorContextType>({
  registers: {}
});

export const EmulatorProvider = ({
  children
}: { children: React.ReactNode }) => {
  const emulator = new Emulator();

  const [registers, setRegisters] = useState(emulator.registers.getAll());

  useEffect(() => {
    const handlers = {
      'registerUpdate': () => {
        setRegisters(emulator.registers.getAll());
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmulatorContext.Provider value={{
      emulator,
      registers
    }}>
      {children}
    </EmulatorContext.Provider>
  );
};
