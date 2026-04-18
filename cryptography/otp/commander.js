const fs = require("fs");

const key = fs.readFileSync("./key");
let keyOffset = 0;

function encrypt(plaintext) {
    if (keyOffset + plaintext.length > key.length) {
        throw new Error("Not enough key material available for encryption.");
    }
    const ciphertext = Buffer.alloc(plaintext.length);
    for (let i = 0; i < plaintext.length; i++) {
        ciphertext[i] = plaintext[i] ^ key[(keyOffset + i) ]; // XOR operation
        key[keyOffset + i] = 0; // Discard the key after use
    }
    keyOffset += plaintext.length;
    return ciphertext;

}

const message1 = Buffer.from("Commander, we have a problem with the engine.");
const ciphertext1 = encrypt(message1);

const message2 = Buffer.from("The engine is overheating and we need to shut it down.");
const ciphertext2 = encrypt(message2);

console.log("Ciphertext 1:",ciphertext1.toString('hex'));
console.log("Ciphertext 2:",ciphertext2.toString('hex'));