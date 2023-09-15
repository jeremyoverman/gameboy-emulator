# 16 Bit Arithmetic / Logic Instructions

| **Done** | **Mnemonic**  | **Encoding** | **Clock cycles** | **Flags** | **Description**                            |
|----------|---------------|--------------|------------------|-----------|--------------------------------------------|
| Y        | add  HL,rr    | x9           | 8                | -0hc      | HL = HL+rr     ; rr may be BC,DE,HL,SP     |
| Y        | inc  rr       | x3           | 8                | ––        | rr = rr+1      ; rr may be BC,DE,HL,SP     |
| Y        | dec  rr       | xB           | 8                | ––        | rr = rr-1      ; rr may be BC,DE,HL,SP     |
|          | add  SP,dd    | E8 dd        | 16               | 00hc      | SP = SP +/- dd ; dd is 8-bit signed number |
|          | ld   HL,SP+dd | F8 dd        | 12               | 00hc      | HL = SP +/- dd ; dd is 8-bit signed number |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html