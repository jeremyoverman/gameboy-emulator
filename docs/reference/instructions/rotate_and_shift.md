# Rotate And Shift Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**                |
|----------|--------------|--------------|------------------|-----------|--------------------------------|
| Y        | rlca         | 07           | 4                | 000c      | rotate A left                  |
| Y        | rla          | 17           | 4                | 000c      | rotate A left through carry    |
| Y        | rrca         | 0F           | 4                | 000c      | rotate A right                 |
| Y        | rra          | 1F           | 4                | 000c      | rotate A right through carry   |
| Y        | rlc  r       | CB 0x        | 8                | z00c      | rotate left                    |
| Y        | rlc  (HL)    | CB 06        | 16               | z00c      | rotate left                    |
| Y        | rl   r       | CB 1x        | 8                | z00c      | rotate left through carry      |
| Y        | rl   (HL)    | CB 16        | 16               | z00c      | rotate left through carry      |
| Y        | rrc  r       | CB 0x        | 8                | z00c      | rotate right                   |
| Y        | rrc  (HL)    | CB 0E        | 16               | z00c      | rotate right                   |
| Y        | rr   r       | CB 1x        | 8                | z00c      | rotate right through carry     |
| Y        | rr   (HL)    | CB 1E        | 16               | z00c      | rotate right through carry     |
| Y        | sla  r       | CB 2x        | 8                | z00c      | shift left arithmetic (b0=0)   |
| Y        | sla  (HL)    | CB 26        | 16               | z00c      | shift left arithmetic (b0=0)   |
| Y        | swap r       | CB 3x        | 8                | z000      | exchange low/hi-nibble         |
| Y        | swap (HL)    | CB 36        | 16               | z000      | exchange low/hi-nibble         |
| Y        | sra  r       | CB 2x        | 8                | z00c      | shift right arithmetic (b7=b7) |
| Y        | sra  (HL)    | CB 2E        | 16               | z00c      | shift right arithmetic (b7=b7) |
| Y        | srl  r       | CB 3x        | 8                | z00c      | shift right logical (b7=0)     |
| Y        | srl  (HL)    | CB 3E        | 16               | z00c      | shift right logical (b7=0)     |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html