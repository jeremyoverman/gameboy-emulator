import Panel from "./Panel";
import { useEmulator } from "../hooks/useEmulator";
import FileUpload from "./FileUpload";

const SettingsPanel = ({
  className
}: {
  className?: string
}) => {
  const { loadRom, setUseBootRom, useBootRom } = useEmulator();

  const setBootRom = (file: File) => {
    loadRom(file, true);
  }

  const setGameRom = (file: File) => {
    loadRom(file);
  }

  const handleToggleBootRom = () => {
    setUseBootRom(!useBootRom);
  }

  return (
    <Panel title="Settings" className={className}>
      <FileUpload name="bootrom" label="Boot ROM" onChange={setBootRom} />
      <label htmlFor="use-boot-rom">Use Boot Rom?</label>
      <input type="checkbox" id="use-boot-rom" checked={useBootRom} onChange={handleToggleBootRom} />
      <br />
      <br />
      <FileUpload name="gamerom" label="Game ROM" onChange={setGameRom} />
    </Panel>
  )
}

export default SettingsPanel;