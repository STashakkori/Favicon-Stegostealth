Favicon Stegostealth: A Turing complete method of favicon steganography
-----------------------------------------------------------------------

Stegoloader/Gatak of 2015 showed the viability of embedded PNG payloads

Before designing mitigations it was important to first replicate such a scenario

The scenario has now been replicated in code and is a viable APT persistance vector

As browsers continue to improve and restrict favicon caching this will likely go away
between sessions but can still in-session viable.

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

Result:
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
