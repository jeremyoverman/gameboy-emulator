import styled from "styled-components";
import { useEmulator } from "../hooks/useEmulator";

const StyledToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 1px solid black;
`;


const Toolbar = () => {
  const { reset, emulator, paused } = useEmulator();

  const handleRun = () => {
    if (paused) {
      emulator?.cpu.resume();
    } else {
      emulator?.cpu.pause();
    }
  }

  const handleStep = () => {
    emulator?.cpu.step();
  }

  const handleReset = () => {
    reset();
  }

  return (
    <StyledToolbar>
      <button type="button" onClick={handleRun}>
        {paused ? 'Run' : 'Pause'}
      </button>

      <button type="button" onClick={handleReset}>Reset</button>
      <button type="button" onClick={handleStep}>Step</button>
    </StyledToolbar>
  )
}

export default Toolbar;