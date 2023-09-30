import Panel from "./Panel";
import { useEmulator } from "../hooks/useEmulator";
import FileUpload from "./FileUpload";

const SettingsPanel = ({
  className
}: {
  className?: string
}) => {
  const { emulator } = useEmulator();

  const setBootRom = (file: File) => {
    emulator?.loadBootRom(file);
  }

  const setGameRom = (file: File) => {
    emulator?.cpu.memory.loadRomFile(file);
  }

  return (
    <Panel title="Settings" className={className}>
      <FileUpload name="bootrom" label="Boot ROM" onChange={setBootRom} />
      <br />
      <br />
      <FileUpload name="gamerom" label="Game ROM" onChange={setGameRom} />
    </Panel>
  )
}

export default SettingsPanel;