export interface JsonState {
  pc: number,
  sp: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  h: number,
  l: number,
  ime: number,
  ie: number,
  ram: number[][],
}
export interface JsonTest {
  name: string;
  initial: JsonState;
  final: JsonState;
  cycles: (number | string)[][]
}

export type JsonTestSuite = JsonTest[]