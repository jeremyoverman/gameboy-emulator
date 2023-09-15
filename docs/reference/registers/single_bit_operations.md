# Single Bit Operation Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description** |
|----------|--------------|--------------|------------------|-----------|-----------------|
|          | bit  n,r     | CB xx        | 8                | z01-      | test bit n      |
|          | bit  n,(HL)  | CB xx        | 12               | z01-      | test bit n      |
|          | set  n,r     | CB xx        | 8                | ––        | set bit n       |
|          | set  n,(HL)  | CB xx        | 16               | ––        | set bit n       |
|          | res  n,r     | CB xx        | 8                | ––        | reset bit n     |
|          | res  n,(HL)  | CB xx        | 16               | ––        | reset bit n     |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html