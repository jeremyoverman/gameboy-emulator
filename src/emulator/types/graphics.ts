export type ColorMap = number[][]

export type PPUEventMap = {
  render: () => void
  lcdBufferReady: () => void
}
