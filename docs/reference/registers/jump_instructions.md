# Jump Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**                          |
|----------|--------------|--------------|------------------|-----------|------------------------------------------|
|          | jp   nn      | C3 nn nn     | 16               | ––        | jump to nn, PC=nn                        |
|          | jp   HL      | E9           | 4                | ––        | jump to HL, PC=HL                        |
|          | jp   f,nn    | xx nn nn     | 16/12            | ––        | conditional jump if nz,z,nc,c            |
|          | jr   PC+dd   | 18 dd        | 12               | ––        | relative jump to nn (PC=PC+8-bit signed) |
|          | jr   f,PC+dd | xx dd        | 12/8             | ––        | conditional relative jump if nz,z,nc,c   |
|          | call nn      | CD nn nn     | 24               | ––        | call to nn, SP=SP-2, (SP)=PC, PC=nn      |
|          | call f,nn    | xx nn nn     | 24/12            | ––        | conditional call if nz,z,nc,c            |
|          | ret          | C9           | 16               | ––        | return, PC=(SP), SP=SP+2                 |
|          | ret  f       | xx           | 20/8             | ––        | conditional return if nz,z,nc,c          |
|          | reti         | D9           | 16               | ––        | return and enable interrupts (IME=1)     |
|          | rst  n       | xx           | 16               | ––        | call to 00,08,10,18,20,28,30,38          |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html