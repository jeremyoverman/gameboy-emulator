import { useEmulator } from "../hooks/useEmulator";

const RegisterTable = () => {
  const { emulator, registers } = useEmulator()

  console.log(registers.a)

  return (
    <button type="button" onClick={() => emulator?.registers.set('a', [1, 1, 1, 1, 0, 0, 0, 1])}>
      Set A
    </button>
  )
}

export default RegisterTable;