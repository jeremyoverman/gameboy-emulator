import { Emitter } from "..";

type EightBitRegisterName = "a" | "b" | "c" | "d" | "e" | "f" | "h" | "l";
type SixteenBitRegisterName = "af" | "bc" | "de" | "hl";
type RegisterName = EightBitRegisterName | SixteenBitRegisterName;

export type RegisterUpdateCallback = (event: RegisterUpdateEvent) => void;

enum Flag {
  Zero = "Zero",
  Subtraction = "Subtraction",
  Carry = "Carry",
  HalfCarry = "HalfCarry",
}

export class RegisterUpdateEvent {
  reg: RegisterName;
  value: number[];

  constructor(reg: RegisterName, value: number[]) {
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

  a: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  b: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  c: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  d: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  e: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  f: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  h: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  l: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  set(reg: RegisterName, value: number[]) {
    if (reg === "a") this.a = value;
    else if (reg === "b") this.b = value;
    else if (reg === "c") this.c = value;
    else if (reg === "d") this.d = value;
    else if (reg === "e") this.e = value;
    else if (reg === "f") this.f = value;
    else if (reg === "h") this.h = value;
    else if (reg === "l") this.l = value;
    else if (reg === "af") {
      this.a = value.slice(0, 8);
      this.f = value.slice(8, 16);
    } else if (reg === "bc") {
      this.b = value.slice(0, 8);
      this.c = value.slice(8, 16);
    } else if (reg === "de") {
      this.d = value.slice(0, 8);
      this.e = value.slice(8, 16);
    } else if (reg === "hl") {
      this.h = value.slice(0, 8);
      this.l = value.slice(8, 16);
    }

    this.emit("registerUpdate", new RegisterUpdateEvent(reg, value));
  }

  setFlag(flag: Flag, active: boolean) {
    if (flag === Flag.Zero) this.f[7] = active ? 1 : 0;
    else if (flag === Flag.Subtraction) this.f[6] = active ? 1 : 0;
    else if (flag === Flag.HalfCarry) this.f[5] = active ? 1 : 0;
    else if (flag === Flag.Carry) this.f[4] = active ? 1 : 0;

    this.emit("registerUpdate", new RegisterUpdateEvent("f", this.f));
  }

  get(reg: RegisterName) {
    if (reg === "a") return this.a;
    else if (reg === "b") return this.b;
    else if (reg === "c") return this.c;
    else if (reg === "d") return this.d;
    else if (reg === "e") return this.e;
    else if (reg === "f") return this.f;
    else if (reg === "h") return this.h;
    else if (reg === "l") return this.l;
    else if (reg === "af") {
      return this.a.concat(this.f);
    } else if (reg === "bc") {
      return this.b.concat(this.c);
    } else if (reg === "de") {
      return this.d.concat(this.e);
    } else if (reg === "hl") {
      return this.h.concat(this.l);
    }
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
