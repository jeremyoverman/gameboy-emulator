import { createRef, useEffect } from "react";
import useFile from "../hooks/useFile";

interface Props {
  name: string;
  label: string;
  onChange: (file: File) => void;
}

const FileUpload = ({ name, onChange, label }: Props) => {
  const { file, handleFileChange } = useFile(name);
  const fileRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (file) {
      if (fileRef.current) {
        const list = new DataTransfer();
        list.items.add(file);
        fileRef.current.files = list.files
      }

      onChange(file);
    }
  }, [file])


  return (
    <>
      <label htmlFor={`file-${name}`}>{label}: </label>&nbsp;
      <input ref={fileRef} id={`file-${name}`} type="file" onChange={handleFileChange} />
    </>
  )
}

export default FileUpload;