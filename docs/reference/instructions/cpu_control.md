# CPU Control Instructions

| **Done** | **Mnemonic** | **Encoding** | **Clock cycles** | **Flags** | **Description**                         |
|----------|--------------|--------------|------------------|-----------|-----------------------------------------|
|          | ccf          | 3F           | 4                | -00c      | cy=cy xor 1                             |
|          | scf          | 37           | 4                | -001      | cy=1                                    |
| Y        | nop          | 00           | 4                | ––        | no operation                            |
| Y        | halt         | 76           | N*4              | ––        | halt until interrupt occurs (low power) |
| Y        | stop         | 10 00        | ?                | ––        | low power standby mode (VERY low power) |
|          | di           | F3           | 4                | ––        | disable interrupts, IME=0               |
|          | ei           | FB           | 4                | ––        | enable interrupts, IME=1                |

Source: https://gbdev.io/pandocs/CPU_Instruction_Set.html