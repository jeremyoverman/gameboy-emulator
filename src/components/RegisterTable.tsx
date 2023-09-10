import styled from 'styled-components';
import { useEmulator } from "../hooks/useEmulator";

const Table = styled.table`
  border: 1px solid black;
`;

const RegisterTable = () => {
  const { emulator, registers } = useEmulator()

  return (
    <>
      <Table>
        {Object.keys(registers).map((register) => (
          <tr>
            <td>{register}</td>
            <td>{registers[register].join(' ')}</td>
          </tr>
        ))}
      </Table>
      <button type="button" onClick={() => emulator?.registers.set('a', [1, 1, 1, 1, 0, 0, 0, 1])}>
        Set A
      </button>
    </>
  )
}

export default RegisterTable;