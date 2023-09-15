# 8 Bit Load Instructions

| **Done** | **Mnemonic**    | **Encoding** | **Clock cycles** | **Flags** | **Description**                     |
|----------|-----------------|--------------|------------------|-----------|-------------------------------------|
|          | ld   r,r        | xx           | 4                | ––        | r=r                                 |
|          | ld   r,n        | xx nn        | 8                | ––        | r=n                                 |
|          | ld   r,(HL)     | xx           | 8                | ––        | r=(HL)                              |
|          | ld   (HL),r     | 7x           | 8                | ––        | (HL)=r                              |
|          | ld   (HL),n     | 36 nn        | 12               | ––        | (HL)=n                              |
|          | ld   A,(BC)     | 0A           | 8                | ––        | A=(BC)                              |
|          | ld   A,(DE)     | 1A           | 8                | ––        | A=(DE)                              |
|          | ld   A,(nn)     | FA           | 16               | ––        | A=(nn)                              |
|          | ld   (BC),A     | 02           | 8                | ––        | (BC)=A                              |
|          | ld   (DE),A     | 12           | 8                | ––        | (DE)=A                              |
|          | ld   (nn),A     | EA           | 16               | ––        | (nn)=A                              |
|          | ld   A,(FF00+n) | F0 nn        | 12               | ––        | read from io-port n (memory FF00+n) |
|          | ld   (FF00+n),A | E0 nn        | 12               | ––        | write to io-port n (memory FF00+n)  |
|          | ld   A,(FF00+C) | F2           | 8                | ––        | read from io-port C (memory FF00+C) |
|          | ld   (FF00+C),A | E2           | 8                | ––        | write to io-port C (memory FF00+C)  |
|          | ldi  (HL),A     | 22           | 8                | ––        | (HL)=A, HL=HL+1                     |
|          | ldi  A,(HL)     | 2A           | 8                | ––        | A=(HL), HL=HL+1                     |
|          | ldd  (HL),A     | 32           | 8                | ––        | (HL)=A, HL=HL-1                     |
|          | ldd  A,(HL)     | 3A           | 8                | ––        | A=(HL), HL=HL-1                     |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html