import { CPU } from "../cpu";

test("stop stops the cpu", () => {
  const cpu = new CPU(() => {});

  cpu.instructions.stop();

  expect(cpu.isStopped()).toEqual(true);
});
