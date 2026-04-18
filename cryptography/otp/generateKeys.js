const crypto = require("crypto");
const fs = require("fs");

const key = crypto.randomBytes(100); // Generate a random 100-byte key (800 bits)
console.log("Generated Key:", key.toString("hex"));


fs.writeFileSync("./key", key); // Save the key to a file named "key"