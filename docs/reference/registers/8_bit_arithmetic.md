# 8 Bit Arithmetic / Logic Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**  |
|----------|--------------|--------------|------------------|-----------|------------------|
| Y        | add  A,r     | 8x           | 4                | z0hc      | A=A+r            |
|          | add  A,n     | C6 nn        | 8                | z0hc      | A=A+n            |
|          | add  A,(HL)  | 86           | 8                | z0hc      | A=A+(HL)         |
| Y        | adc  A,r     | 8x           | 4                | z0hc      | A=A+r+cy         |
|          | adc  A,n     | CE nn        | 8                | z0hc      | A=A+n+cy         |
|          | adc  A,(HL)  | 8E           | 8                | z0hc      | A=A+(HL)+cy      |
| Y        | sub  r       | 9x           | 4                | z1hc      | A=A-r            |
|          | sub  n       | D6 nn        | 8                | z1hc      | A=A-n            |
|          | sub  (HL)    | 96           | 8                | z1hc      | A=A-(HL)         |
| Y        | sbc  A,r     | 9x           | 4                | z1hc      | A=A-r-cy         |
|          | sbc  A,n     | DE nn        | 8                | z1hc      | A=A-n-cy         |
|          | sbc  A,(HL)  | 9E           | 8                | z1hc      | A=A-(HL)-cy      |
|          | and  r       | Ax           | 4                | z010      | A=A & r          |
|          | and  n       | E6 nn        | 8                | z010      | A=A & n          |
|          | and  (HL)    | A6           | 8                | z010      | A=A & (HL)       |
|          | xor  r       | Ax           | 4                | z000      | A=A xor r        |
|          | xor  n       | EE nn        | 8                | z000      | A=A xor n        |
|          | xor  (HL)    | AE           | 8                | z000      | A=A xor (HL)     |
|          | or   r       | Bx           | 4                | z000      | A=A | r          |
|          | or   n       | F6 nn        | 8                | z000      | A=A | n          |
|          | or   (HL)    | B6           | 8                | z000      | A=A | (HL)       |
|          | cp   r       | Bx           | 4                | z1hc      | compare A-r      |
|          | cp   n       | FE nn        | 8                | z1hc      | compare A-n      |
|          | cp   (HL)    | BE           | 8                | z1hc      | compare A-(HL)   |
|          | inc  r       | xx           | 4                | z0h-      | r=r+1            |
|          | inc  (HL)    | 34           | 12               | z0h-      | (HL)=(HL)+1      |
|          | dec  r       | xx           | 4                | z1h-      | r=r-1            |
|          | dec  (HL)    | 35           | 12               | z1h-      | (HL)=(HL)-1      |
|          | daa          | 27           | 4                | z-0c      | decimal adjust A |
|          | cpl          | 2F           | 4                | -11-      | A = A xor FF     |

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