# 8 Bit Arithmetic / Logic Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**  |
|----------|--------------|--------------|------------------|-----------|------------------|
| Y        | add  A,r     | 8x           | 4                | z0hc      | A=A+r            |
| Y        | add  A,n     | C6 nn        | 8                | z0hc      | A=A+n            |
|          | add  A,(HL)  | 86           | 8                | z0hc      | A=A+(HL)         |
| Y        | adc  A,r     | 8x           | 4                | z0hc      | A=A+r+cy         |
| Y        | adc  A,n     | CE nn        | 8                | z0hc      | A=A+n+cy         |
|          | adc  A,(HL)  | 8E           | 8                | z0hc      | A=A+(HL)+cy      |
| Y        | sub  r       | 9x           | 4                | z1hc      | A=A-r            |
| Y        | sub  n       | D6 nn        | 8                | z1hc      | A=A-n            |
|          | sub  (HL)    | 96           | 8                | z1hc      | A=A-(HL)         |
| Y        | sbc  A,r     | 9x           | 4                | z1hc      | A=A-r-cy         |
| Y        | sbc  A,n     | DE nn        | 8                | z1hc      | A=A-n-cy         |
|          | sbc  A,(HL)  | 9E           | 8                | z1hc      | A=A-(HL)-cy      |
| Y        | and  r       | Ax           | 4                | z010      | A=A & r          |
| Y        | and  n       | E6 nn        | 8                | z010      | A=A & n          |
|          | and  (HL)    | A6           | 8                | z010      | A=A & (HL)       |
| Y        | xor  r       | Ax           | 4                | z000      | A=A xor r        |
| Y        | xor  n       | EE nn        | 8                | z000      | A=A xor n        |
|          | xor  (HL)    | AE           | 8                | z000      | A=A xor (HL)     |
| Y        | or   r       | Bx           | 4                | z000      | A=A | r          |
| Y        | or   n       | F6 nn        | 8                | z000      | A=A | n          |
|          | or   (HL)    | B6           | 8                | z000      | A=A | (HL)       |
| Y        | cp   r       | Bx           | 4                | z1hc      | compare A-r      |
| Y        | cp   n       | FE nn        | 8                | z1hc      | compare A-n      |
|          | cp   (HL)    | BE           | 8                | z1hc      | compare A-(HL)   |
| Y        | inc  r       | xx           | 4                | z0h-      | r=r+1            |
| Y        | inc  (HL)    | 34           | 12               | z0h-      | (HL)=(HL)+1      |
| Y        | dec  r       | xx           | 4                | z1h-      | r=r-1            |
| Y        | dec  (HL)    | 35           | 12               | z1h-      | (HL)=(HL)-1      |
| H        | daa          | 27           | 4                | z-0c      | decimal adjust A |
| Y        | cpl          | 2F           | 4                | -11-      | A = A xor FF     |

Notes:

* DAA has failing tests, I need to do some more reasearch to see if the instruction
is failing or the test. Ths might be easier using a test ROM once we're able to read
ROMS.