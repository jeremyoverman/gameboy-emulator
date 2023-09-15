import { Emitter } from "..";

export const EIGHT_BIT_REGISTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
  "l",
] as const;
export const SIXTEEN_BIT_REGISTERS = ["af", "bc", "de", "hl"] as const;
export const ARITHMETIC_REGISTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "h",
  "l",
  ...SIXTEEN_BIT_REGISTERS,
] as const;

export enum Flag {
  Zero = "Zero",
  Subtraction = "Subtraction",
  Carry = "Carry",
  HalfCarry = "HalfCarry",
}

const FLAG_POSITIONS = {
  [Flag.Zero]: 4,
  [Flag.Subtraction]: 5,
  [Flag.HalfCarry]: 6,
  [Flag.Carry]: 7,
};

export type EightBitRegisterName = (typeof EIGHT_BIT_REGISTERS)[number];
export type ArithmeticRegisterName = (typeof ARITHMETIC_REGISTERS)[number];
export type SixteenBitRegisterName = (typeof SIXTEEN_BIT_REGISTERS)[number];
export type RegisterName = EightBitRegisterName | SixteenBitRegisterName;

export type RegisterUpdateCallback = (event: RegisterUpdateEvent) => void;

export class RegisterUpdateEvent {
  reg: RegisterName;
  value: number;

  constructor(reg: RegisterName, value: number) {
    this.reg = reg;
    this.value = value;
  }
}

export type RegisterEventMap = {
  registerUpdate: RegisterUpdateCallback;
};

export class Registers {
  emit: Emitter<keyof RegisterEventMap>;

  constructor(emit: Emitter<keyof RegisterEventMap>) {
    this.emit = emit;
  }

  a: number = 0;
  b: number = 0;
  c: number = 0;
  d: number = 0;
  e: number = 0;
  f: number = 0;
  h: number = 0;
  l: number = 0;

  set(reg: RegisterName, value: number) {
    if (EIGHT_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      if (value > 0xff) {
        throw new Error(`Cannot set ${reg} to ${value}!`);
      }

      this[reg as EightBitRegisterName] = value;
    } else {
      const [reg1, reg2] = reg.split("") as EightBitRegisterName[];

      this.set(reg1, (value >> 8) & 0xff);
      this.set(reg2, value & 0xff);
    }

    this.emit("registerUpdate", new RegisterUpdateEvent(reg, value));
  }

  setFlag(flag: Flag, active: boolean) {
    if (active) {
      this.set("f", this.f | (1 << FLAG_POSITIONS[flag]));
    } else {
      this.set("f", this.f & ~((1 << FLAG_POSITIONS[flag]) & 0xff));
    }
  }

  getFlag(flag: Flag) {
    return ((this.f >> FLAG_POSITIONS[flag]) & 1) === 1;
  }

  get(reg: RegisterName) {
    if (EIGHT_BIT_REGISTERS.includes(reg as EightBitRegisterName)) {
      return this[reg as EightBitRegisterName];
    } else if (SIXTEEN_BIT_REGISTERS.includes(reg as SixteenBitRegisterName)) {
      const [reg1, reg2] = reg.split("") as EightBitRegisterName[];
      return (this[reg1] << 8) | this[reg2];
    }

    throw new Error(`Unknown register ${reg}!`);
  }

  getAll() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f,
      h: this.h,
      l: this.l,
    };
  }
}
