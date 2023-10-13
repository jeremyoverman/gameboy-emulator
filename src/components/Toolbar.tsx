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
  const { reset, pause, resume, tick, paused } = useEmulator();

  return (
    <StyledToolbar>
      <button type="button" onClick={() => paused ? resume() : pause()}>
        {paused ? 'Run' : 'Pause'}
      </button>

      <button type="button" onClick={reset}>Reset</button>
      <button type="button" onClick={tick}>Step</button>
    </StyledToolbar>
  )
}

export default Toolbar;