//one time pad encryption rules
// key length should be equal to plaintext length
// key should be truly random
//key should be used only once and then discarded

//eg- 
// 100 1 1 0 1 0 1 0 1 0 (plaintext)
// 101 0 1 1 0 1 0 1 0 1 (key)
// -------------------------(xor operation)
// 001 1 0 1 1 1 1 1 1 1 (ciphertext)


const a = Buffer.from("a4", "hex");
const b = Buffer.from("c8", "hex");

const xorResult = Buffer.alloc(a.length); 
for (let i = 0; i < a.length; i++) {
  xorResult[i] = a[i] ^ b[i];
}

console.log("XOR Result:", xorResult.toString("hex"));