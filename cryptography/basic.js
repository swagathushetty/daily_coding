const crypto = require("crypto");

// Using AES to encrypt
const cipher = "aes-128-ecb";

// Our key which is 16 bytes (128 bits)
const key = Buffer.from("4e2ba6d34baff532ee26bbbb16d34baf", "hex");

function encrypt(plaintext) {
  const encryptor = crypto.createCipheriv(cipher, key, null);
  const ciphertext = Buffer.concat([
    encryptor.update(plaintext),
    encryptor.final(),
  ]);
  return ciphertext;
}

function decrypt(ciphertext) {
  const decryptor = crypto.createDecipheriv(cipher, key, null);
  const plaintext = Buffer.concat([
    decryptor.update(ciphertext),
    decryptor.final(),
  ]);
  return plaintext;
}

// Our plaintext (original data)
const plaintext = Buffer.from("My password is hHF2346%62nvFW.");

// Encrypt the data
const ciphertext = encrypt(plaintext);

// Final plaintext after decryption
const decryptedPlaintext = decrypt(ciphertext);

console.log("Plaintext:", plaintext.toString("utf8"));
console.log("Ciphertext:", ciphertext.toString("utf8"));
console.log("Decrypted Plaintext:", decryptedPlaintext.toString("utf8"));
