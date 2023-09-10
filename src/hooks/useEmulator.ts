import { useContext } from "react";
import { EmulatorContext } from "../context/EmulatorContext";

export const useEmulator = () => {
  const context = useContext(EmulatorContext);

  if (!context) {
    throw new Error("useEmulator must be used within an EmulatorProvider");
  }

  return context;
};
