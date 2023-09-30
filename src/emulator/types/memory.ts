import { BUTTONS, INTERRUPTS, RST_JUMP_ADDRESSES } from '../constants'

export type Button = keyof typeof BUTTONS
export type Interrupt = keyof typeof INTERRUPTS
export type RstJumpAddresses = (typeof RST_JUMP_ADDRESSES)[number]
