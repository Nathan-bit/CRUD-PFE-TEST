const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token with user's email as payload
function generateRegistrationToken(email) {
    return jwt.sign({ email }, process.env.secretKey, { expiresIn: '1d' }); // Expires in 1 day
}

// Generate registration URL with JWT token
function generateRegistrationURL(email) {
    const registrationToken = generateRegistrationToken(email);
    const encodedToken = encodeURIComponent(registrationToken); // URL encode the token
    return `https://example.com/confirm-registration?token=${encodedToken}`;
}

// Generate a cryptographic hash of the email
function generateHash(email) {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
}

// Example usage
const email = 'testofthetoken@gmail.com';
const registrationToken = generateRegistrationToken(email);
const encodedToken = encodeURIComponent(registrationToken); // URL encode the token
const registrationURL = generateRegistrationURL(email);
const hash = generateHash(email);

console.log('Raw JWT Token:', registrationToken );
console.log('Encoded Token:', encodedToken );
console.log('Registration URL:', registrationURL );
console.log('Hash of Email:', hash );
