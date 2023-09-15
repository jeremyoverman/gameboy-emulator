# Rotate And Shift Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**                |
|----------|--------------|--------------|------------------|-----------|--------------------------------|
|          | rlca         | 07           | 4                | 000c      | rotate A left                  |
|          | rla          | 17           | 4                | 000c      | rotate A left through carry    |
|          | rrca         | 0F           | 4                | 000c      | rotate A right                 |
|          | rra          | 1F           | 4                | 000c      | rotate A right through carry   |
|          | rlc  r       | CB 0x        | 8                | z00c      | rotate left                    |
|          | rlc  (HL)    | CB 06        | 16               | z00c      | rotate left                    |
|          | rl   r       | CB 1x        | 8                | z00c      | rotate left through carry      |
|          | rl   (HL)    | CB 16        | 16               | z00c      | rotate left through carry      |
|          | rrc  r       | CB 0x        | 8                | z00c      | rotate right                   |
|          | rrc  (HL)    | CB 0E        | 16               | z00c      | rotate right                   |
|          | rr   r       | CB 1x        | 8                | z00c      | rotate right through carry     |
|          | rr   (HL)    | CB 1E        | 16               | z00c      | rotate right through carry     |
|          | sla  r       | CB 2x        | 8                | z00c      | shift left arithmetic (b0=0)   |
|          | sla  (HL)    | CB 26        | 16               | z00c      | shift left arithmetic (b0=0)   |
|          | swap r       | CB 3x        | 8                | z000      | exchange low/hi-nibble         |
|          | swap (HL)    | CB 36        | 16               | z000      | exchange low/hi-nibble         |
|          | sra  r       | CB 2x        | 8                | z00c      | shift right arithmetic (b7=b7) |
|          | sra  (HL)    | CB 2E        | 16               | z00c      | shift right arithmetic (b7=b7) |
|          | srl  r       | CB 3x        | 8                | z00c      | shift right logical (b7=0)     |
|          | srl  (HL)    | CB 3E        | 16               | z00c      | shift right logical (b7=0)     |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html