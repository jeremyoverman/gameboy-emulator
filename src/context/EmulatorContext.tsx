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
    const registerUpdate = () => {
      setRegisters(emulator.registers.getAll());
    }
    emulator.on('registerUpdate', registerUpdate);

    return () => {
      emulator.off('registerUpdate', registerUpdate);
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
