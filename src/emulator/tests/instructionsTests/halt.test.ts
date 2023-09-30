import { CPU } from '../../cpu'

test('halt halts the cpu', () => {
  const cpu = new CPU(() => {})

  cpu.instructions.halt()

  expect(cpu.isHalted()).toEqual(true)
})
