const crypto = require('crypto');

// Generate a random key of 32 bytes (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');

console.log(secretKey);
