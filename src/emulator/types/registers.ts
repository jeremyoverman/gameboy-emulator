import {
  ALL_16_BIT_REGISTERS,
  ALL_8_BIT_REGISTERS,
  ARITHMETIC_REGISTERS,
  GP_16_BIT_REGISTERS,
  GP_8_BIT_REGISTERS,
  REGISTERS,
  SPECIAL_16_BIT_REGISTERS,
  SPECIAL_8_BIT_REGISTERS,
} from '../constants'

export type GpEightBitRegisterName = (typeof GP_8_BIT_REGISTERS)[number]
export type SpecialEightBitRegisterName = (typeof SPECIAL_8_BIT_REGISTERS)[number]
export type EightBitRegisterName = (typeof ALL_8_BIT_REGISTERS)[number]

export type GpSixteenBitRegisterName = (typeof GP_16_BIT_REGISTERS)[number]
export type SpecialSixteenBitRegisterName = (typeof SPECIAL_16_BIT_REGISTERS)[number]
export type SixteenBitRegisterName = (typeof ALL_16_BIT_REGISTERS)[number]

export type ArithmeticRegisterName = (typeof ARITHMETIC_REGISTERS)[number]

export type RegisterName = (typeof REGISTERS)[number]
export type SpecialRegisterNames = (typeof SPECIAL_8_BIT_REGISTERS)[number]

export type Flag = 'Zero' | 'Subtraction' | 'Carry' | 'HalfCarry'
