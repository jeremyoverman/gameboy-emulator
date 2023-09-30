import styled from "styled-components";
import Toolbar from "./Toolbar";
import Lcd from "./Lcd/Lcd";
import React from "react";
import { EmulatorContext } from "../context/EmulatorContext";

const BUTTON_MAP = {
  w: "Up",
  s: "Down",
  a: "Left",
  d: "Right",
  m: "Start",
  n: "Select",
  k: "A",
  j: "B",
} as const;

const StyledEmulator = styled.div`
`

const Emulator = ({
  className
}: {
  className?: string;
}) => {
  const { emulator } = React.useContext(EmulatorContext);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = BUTTON_MAP[event.key as keyof typeof BUTTON_MAP];
      if (key) emulator?.joypad.set(key, true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = BUTTON_MAP[event.key as keyof typeof BUTTON_MAP];
      if (key) emulator?.joypad.set(key, false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [emulator]);

  return (
    <StyledEmulator className={className}>
      <Toolbar />
      <Lcd />
    </StyledEmulator>
  )
}

export default Emulator;