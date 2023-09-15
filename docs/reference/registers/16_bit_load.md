# 8 Bit Load Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**                          |
|----------|--------------|--------------|------------------|-----------|------------------------------------------|
|          | ld   rr,nn   | x1 nn nn     | 12               | ––        | rr=nn (rr may be BC,DE,HL or SP)         |
|          | ld   (nn),SP | 08 nn nn     | 20               | ––        | (nn)=SP                                  |
|          | ld   SP,HL   | F9           | 8                | ––        | SP=HL                                    |
|          | push rr      | x5           | 16               | ––        | SP=SP-2  (SP)=rr ; rr may be BC,DE,HL,AF |
|          | pop  rr      | x1           | 12               | (AF)      | rr=(SP)  SP=SP+2 ; rr may be BC,DE,HL,AF |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html