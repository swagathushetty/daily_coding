const fs = require("fs");

const key = fs.readFileSync("./key");
let keyOffset = 0;

function decrypt(ciphertext){
    let plaintext = Buffer.alloc(ciphertext.length);
    for(let i = 0; i < ciphertext.length; i++){
        plaintext[i] = ciphertext[i] ^ key[(keyOffset + i)]; // XOR operation
        key[keyOffset + i] = 0; // Clear the key byte after use
    }
    keyOffset += ciphertext.length;
   
    return plaintext;
}

const message1 = "7aeaa9bf363e192375970c38c426843e39861ade1252069e60cdebd886897e6882c9169f399ce8fcd0d00f7431"
const message2 = "232d007685b9352d52bb90b377ebc38ed5190975f75766f33c57aea88bcdf91b45814f57a6b9e897e1a2eee005167a096b89777bdad5"
const ciphertext1 = Buffer.from(message1, "hex");
const ciphertext2 = Buffer.from(message2, "hex");
const decryptedMessage1 = decrypt(ciphertext1);
const decryptedMessage2 = decrypt(ciphertext2);
console.log("Decrypted Message 1:", decryptedMessage1.toString());
console.log("Decrypted Message 2:", decryptedMessage2.toString());