# Single Bit Operation Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description** |
|----------|--------------|--------------|------------------|-----------|-----------------|
| Y        | bit  n,r     | CB xx        | 8                | z01-      | test bit n      |
| Y        | bit  n,(HL)  | CB xx        | 12               | z01-      | test bit n      |
| Y        | set  n,r     | CB xx        | 8                | ––        | set bit n       |
| Y        | set  n,(HL)  | CB xx        | 16               | ––        | set bit n       |
| Y        | res  n,r     | CB xx        | 8                | ––        | reset bit n     |
| Y        | res  n,(HL)  | CB xx        | 16               | ––        | reset bit n     |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html