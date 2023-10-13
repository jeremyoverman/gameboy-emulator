import React from 'react'
import { useEffect, useState } from 'react'
import { dataURItoBlob } from '../utils/dataUriToBlob'

const useFile = (name: string) => {
  const [rom, setRom] = useState<File | null>(null)

  const handleFileChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            window.localStorage.setItem(`file_name_${name}`, file.name)
            window.localStorage.setItem(`file_data_${name}`, event.target?.result as string)
          }
          reader.readAsDataURL(file)
        }

        setRom(file)
      }
    },
    [name]
  )

  useEffect(() => {
    const bootRomName = window.localStorage.getItem(`file_name_${name}`)
    const bootRomData = window.localStorage.getItem(`file_data_${name}`)

    if (!bootRomData || !bootRomName) {
      return
    }

    if (bootRomName && bootRomData) {
      const file = new File([dataURItoBlob(bootRomData)], bootRomName)
      setRom(file)
    }
  }, [name])

  return {
    file: rom,
    handleFileChange,
  }
}

export default useFile
