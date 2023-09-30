import styled from "styled-components"
import { EmulatorProvider } from "./context/EmulatorContext"
import SettingsPanel from "./components/SettingsPanel"
import Emulator from "./components/Emulator";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 1440px;
  width: 1440px;
  margin: 0 auto;
  gap: 16px;
`;

const Filler = styled.div`
  flex: 1 1 auto;
`;

const StyledSettingsPanel = styled(SettingsPanel)`
  flex: 1 1 auto;
`;

// const StyledLcd = styled(Lcd)`
//   flex: 0 0 auto;
// `;

const Middle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 auto;
`;


function App() {
  return (
    <EmulatorProvider>
      <Container>
        <Filler />
        <Middle>
          <Emulator />
        </Middle>
        <StyledSettingsPanel />
      </Container>
    </EmulatorProvider>
  )
}

export default App
