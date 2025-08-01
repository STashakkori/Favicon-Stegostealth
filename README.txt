Favicon Stegostealth: A Turing complete method of favicon steganography
-----------------------------------------------------------------------

Stegoloader/Gatak of 2015 showed the viability of embedded PNG payloads

Before designing mitigations it was important to first replicate such a scenario

The scenario has now been replicated in code and is a viable APT persistance vector

As browsers continue to improve and restrict favicon caching this will likely go away
between sessions but is still in-session viable.

Turing completeness was tested and passed with Fibonacci of 5:
  set i 2
  set fact 1
  set n 5
  inc n
  
  label loop
    iflt i n loop_body
    jmp end
  
  label loop_body
    mul fact i
    inc i
    jmp loop
  
  label end
    printvar fact

Compilation Result:
  vm-compiler.js:177 [JUMP FIX] loop_body → 51
  vm-compiler.js:177 [JUMP FIX] end → 77
  vm-compiler.js:177 [JUMP FIX] loop → 21
  vm-compiler.js:241 [HEX BYTECODE] 01 01 69 01 32 01 04 66 61 63 74 01 31 01 01 6e 01 35 02 01 6e 07 04 6c 6f 6f 70 18 01 69 01 6e 05 5f 63 6d 70 30 0a 05 5f 63 6d 70 30 00 33 08 00 00 4d 07 09 6c 6f 6f 70 5f 62 6f 64 79 19 04 66 61 63 74 01 69 02 01 69 08 00 00 15 07 03 65 6e 64 06 04 66 61 63 74
  vm-compiler.js:247 [DEBUG] Bytecode length prepended: 88
  vm-compiler.js:223 Bits embedded: 768

Runtime Result:
  vm-runtime.js:330 [VM] Extracted bits: 16384
  vm-runtime.js:331 [VM] Declared payload length: 94
  vm-runtime.js:332 [VM] Actual bytes reconstructed: 94
  vm-runtime.js:343 [DEBUG] Bytecode length: 88
  vm-runtime.js:344 First 20 opcodes: (20) [1, 1, 105, 1, 50, 1, 4, 102, 97, 99, 116, 1, 49, 1, 1, 110, 1, 53, 2, 1]
  vm-runtime.js:5 [DEBUG] Bytecode length: 88
  3vm-runtime.js:67 [VM] Executing opcode: 1
  vm-runtime.js:67 [VM] Executing opcode: 2
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 24
  vm-runtime.js:216 [IFLT named] i(2) < n(6) → _cmp0 = 1
  vm-runtime.js:67 [VM] Executing opcode: 10
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 25
  vm-runtime.js:67 [VM] Executing opcode: 2
  vm-runtime.js:67 [VM] Executing opcode: 8
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 24
  vm-runtime.js:216 [IFLT named] i(3) < n(6) → _cmp0 = 1
  vm-runtime.js:67 [VM] Executing opcode: 10
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 25
  vm-runtime.js:67 [VM] Executing opcode: 2
  vm-runtime.js:67 [VM] Executing opcode: 8
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 24
  vm-runtime.js:216 [IFLT named] i(4) < n(6) → _cmp0 = 1
  vm-runtime.js:67 [VM] Executing opcode: 10
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 25
  vm-runtime.js:67 [VM] Executing opcode: 2
  vm-runtime.js:67 [VM] Executing opcode: 8
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 24
  vm-runtime.js:216 [IFLT named] i(5) < n(6) → _cmp0 = 1
  vm-runtime.js:67 [VM] Executing opcode: 10
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 25
  vm-runtime.js:67 [VM] Executing opcode: 2
  vm-runtime.js:67 [VM] Executing opcode: 8
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 24
  vm-runtime.js:216 [IFLT named] i(6) < n(6) → _cmp0 = 0
  vm-runtime.js:67 [VM] Executing opcode: 10
  vm-runtime.js:67 [VM] Executing opcode: 8
  vm-runtime.js:67 [VM] Executing opcode: 7
  vm-runtime.js:67 [VM] Executing opcode: 6
  vm-runtime.js:98 [VAR] fact = 120
