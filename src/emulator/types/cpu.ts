export type OpCodeDefinition = {
  run: (pc: number, args: Uint8Array) => number | void
  name: string
  length: number
  cycles: number | number[]
} | null
