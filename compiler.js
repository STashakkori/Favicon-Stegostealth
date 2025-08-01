/* 
Favicon Stegostealh - A Turing complete method of favicon steganography

Tested with Factorial of 5

$t@$h
*/

import { gzipSync } from "https://cdn.skypack.dev/fflate";

let cmpCounter = 0;

const compileVMSource = (src) => {
  const lines = src.trim().split("\n");
  const bytecode = [];
  const labels = {};
  const jumpFixups = [];

  const encode = (s) => new TextEncoder().encode(s);
  let position = 0;

  let ticks = 0;
  const maxTicks = 10000;

  for (let rawLine of lines) {
    const line = rawLine.split("//")[0].trim();
    if (!line) continue;
    if (++ticks > maxTicks) {
      console.error("[VM] Aborting: max instruction count exceeded");
      return;
    }

    const parts = line.split(/\s+/);
    const instr = parts[0].toUpperCase();
    const emit = (...bytes) => { for (const b of bytes) bytecode.push(b), position++; };

    switch (instr) {
      case "PRINT": {
        const enc = encode(parts.slice(1).join(" "));
        emit(0x05, enc.length, ...enc);
        break;
      }
      case "SET": {
        const key = encode(parts[1]);
        const val = encode(parts.slice(2).join(" "));
        emit(0x01, key.length, ...key, val.length, ...val);
        break;
      }
      case "INC": {
        const key = encode(parts[1]);
        emit(0x02, key.length, ...key);
        break;
      }
      case "DEC": {
        const key = encode(parts[1]);
        emit(0x03, key.length, ...key);
        break;
      }
      case "ADD": {
        const key = encode(parts[1]);
        const val = encode(parts[2]);
        emit(0x04, key.length, ...key, val.length, ...val);
        break;
      }
      case "PRINTVAR": {
        const key = encode(parts[1]);
        emit(0x06, key.length, ...key);
        break;
      }
      case "LABEL": {
        const name = parts[1];
        labels[name] = position;
        const nameEnc = encode(name);
        emit(0x07, nameEnc.length, ...nameEnc);
        break;
      }
      case "JMP": {
        emit(0x08, 0); // dummy varlen
        emit(0xff, 0xff);
        jumpFixups.push({ at: position - 2, label: parts[1] });
        break;
      }
      case "MUL": {
        const key = encode(parts[1]);
        const val = encode(parts[2]);
        emit(0x19, key.length, ...key, val.length, ...val);  // opcode 0x19 for MUL
        break;
      }
      case "IFZ":
      case "IFNZ": {
        const key = encode(parts[1]);
        emit(instr === "IFZ" ? 0x09 : 0x0A, key.length, ...key);
        emit(0xff, 0xff);
        jumpFixups.push({ at: position - 2, label: parts[2] });
        break;
      }
      case "IFLT": {
        const lhs = parts[1];
        const rhs = parts[2];
        const label = parts[3];
        if (!label) throw new Error("IFLT requires 3 operands: lhs rhs label");
      
        const tmpVar = `_cmp${cmpCounter++}`;
        const lhsEnc = encode(lhs);
        const rhsEnc = encode(rhs);
        const tmpEnc = encode(tmpVar);
      
        // Emit triple-mode IFLT directly
        emit(0x18,
             lhsEnc.length, ...lhsEnc,
             rhsEnc.length, ...rhsEnc,
             tmpEnc.length, ...tmpEnc);
      
        // Emit IFNZ _cmpN <offset>
        emit(0x0A, tmpEnc.length, ...tmpEnc);
        const jumpTargetPos = position;
        emit(0xff, 0xff); // placeholder
        jumpFixups.push({ at: jumpTargetPos, label });
        break;
      }
      case "CALL": {
        emit(0x12, 0); // opcode + dummy varlen/unused byte
        emit(0xff, 0xff); // placeholder for address
        jumpFixups.push({ at: position - 2, label: parts[1] });  // target the 2 bytes we just emitted
        break;
      }
      case "RET": {
        emit(0x13);
        break;
      }
      case "PTRSET": {
        emit(0x0B, parseInt(parts[1]));
        break;
      }
      case "PTRINC": emit(0x0C); break;
      case "PTRDEC": emit(0x0D); break;
      case "LOAD":
      case "STORE": {
        const key = encode(parts[1]);
        emit(instr === "LOAD" ? 0x0E : 0x0F, key.length, ...key);
        break;
      }
      case "EXECJS": {
        const js = encode(parts.slice(1).join(" "));
        emit(0x10, js.length, ...js);
        break;
      }
      case "EVALENC": {
        const b64 = encode(parts[1]);
        emit(0x11, b64.length, ...b64);
        break;
      }
      case "PUSH": {
        const PUSH_OPCODE = 0x1A;
        if (parts.length === 1) {
          emit(PUSH_OPCODE, 0x00); // stack-mode: PUSH with 0-len
        } else {
          const arg = encode(parts[1]);
          emit(PUSH_OPCODE, arg.length, ...arg); // named push
        }
        break;
      }
      case "POP": {
        const POP_OPCODE = 0x1B;
        if (parts.length === 1) {
          emit(POP_OPCODE, 0x00); // stack-mode: POP with 0-len
        } else {
          const arg = encode(parts[1]);
          emit(POP_OPCODE, arg.length, ...arg); // named-mode: POP target
        }
        break;
      }
      default:
        throw new Error("Unknown instruction: " + instr);
    }
  }

  // Patch jump addresses
  for (const fix of jumpFixups) {
    if (!(fix.label in labels)) {
      console.error(`[JUMP FIX FAIL] Label "${fix.label}" was never defined`);
      throw new Error("Undefined label: " + fix.label);
    }
    const addr = labels[fix.label];
    console.log(`[JUMP FIX] ${fix.label} → ${addr}`);
    bytecode[fix.at] = (addr >> 8) & 0xff;
    bytecode[fix.at + 1] = addr & 0xff;
  }

  return new Uint8Array(bytecode);
};

const embedPayloadInImage = async (imgFile, payloadBytes) => {
  const img = new Image();
  const imgData = await imgFile.arrayBuffer();
  const blobURL = URL.createObjectURL(new Blob([imgData], { type: "image/png" }));

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // CCSDS-style header: 2-byte length prefix
      const lengthBytes = new Uint8Array(2);
      lengthBytes[0] = (payloadBytes.length >> 8) & 0xff;
      lengthBytes[1] = payloadBytes.length & 0xff;

      const fullPayload = new Uint8Array(2 + payloadBytes.length);
      fullPayload.set(lengthBytes, 0);
      fullPayload.set(payloadBytes, 2);

      // Embed into alpha channel ===
      let bitIndex = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (bitIndex >= fullPayload.length * 8) break;
        const byte = fullPayload[Math.floor(bitIndex / 8)];
        const bit = (byte >> (7 - (bitIndex % 8))) & 1;

        if (data[i + 3] > 0) {
          data[i + 3] = (data[i + 3] & 0xFE) | bit;
          bitIndex++;
        }
      }

      console.log("Bits embedded:", bitIndex);

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };

    img.src = blobURL;
  });
};

document.getElementById("generate").addEventListener("click", async () => {
  const src = document.getElementById("vm-input").value;
  const iconFile = document.getElementById("base-icon").files[0];
  if (!iconFile) return alert("Upload base icon first.");

  const raw = compileVMSource(src);
  console.log("[HEX BYTECODE]", Array.from(raw).map(b => b.toString(16).padStart(2, "0")).join(" "));
  const rawLen = raw.length;
  const withLength = new Uint8Array(2 + rawLen);
  withLength[0] = (rawLen >> 8) & 0xff;
  withLength[1] = rawLen & 0xff;
  withLength.set(raw, 2);
  console.log("[DEBUG] Bytecode length prepended:", rawLen);
  
  const compressed = gzipSync(withLength);

  const newFavicon = await embedPayloadInImage(iconFile, compressed);
  const outputURL = URL.createObjectURL(newFavicon);

  document.getElementById("output-icon").src = outputURL;
  document.getElementById("download-link").href = outputURL;
});
