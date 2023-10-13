import styled from "styled-components";
import Toolbar from "./Toolbar";
import Lcd from "./Lcd/Lcd";
import React from "react";
import { EmulatorContext } from "../context/EmulatorContext";
import { BUTTON_MAP } from "../constants";

const StyledEmulator = styled.div`
`

const Emulator = ({
  className
}: {
  className?: string;
}) => {
  const { joypadPress } = React.useContext(EmulatorContext);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = BUTTON_MAP[event.key as keyof typeof BUTTON_MAP];
      if (key) joypadPress(key, true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = BUTTON_MAP[event.key as keyof typeof BUTTON_MAP];
      if (key) joypadPress(key, false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [joypadPress]);

  return (
    <StyledEmulator className={className}>
      <Toolbar />
      <Lcd />
    </StyledEmulator>
  )
}

export default Emulator;