import { createRef, useEffect } from "react";
import useFile from "../hooks/useFile";
import Panel from "./Panel";
import { useEmulator } from "../hooks/useEmulator";

const SettingsPanel = ({
  className
}: {
  className?: string
}) => {
  const { file, handleFileChange } = useFile("bootRom");
  const bootRomRef = createRef<HTMLInputElement>();
  const { emulator } = useEmulator();

  useEffect(() => {
    if (file) {
      emulator?.loadBootRom(file);

      if (bootRomRef.current) {
        const list = new DataTransfer();
        list.items.add(file);
        bootRomRef.current.files = list.files
      }
    }
  }, [file])


  return (
    <Panel title="Settings" className={className}>
      <label htmlFor="boot-rom">Boot ROM:</label>&nbsp;
      <input ref={bootRomRef} id="boot-rom" type="file" onChange={handleFileChange} />
    </Panel>
  )
}

export default SettingsPanel;