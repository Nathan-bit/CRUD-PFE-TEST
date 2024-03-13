const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const UserRegistration  = require('../controllers/UserRegistration'); // Import UserRegistration model
const {sendUserRegistrationMail,sendUserResetPasswordMail}=require('../model/nodemailers');
require('dotenv').config();






router.get('/login', (req, res) => {
    res.render('../connection/login', { title: 'Login' });
  });
  router.get('/register', (req, res) => {
    res.render('../connection/register', { title: 'register' });
  });
  

  // Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
 
router.post('/register', async function(req, res) {
  try {
      const { nom, prenom, email, password } = req.body;

      // Check if email already exists
      const existingUser = await UserRegistration.findOne({ where: { email } });
      if (existingUser) {
          return res.status(400).send('Email address already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate registration token
      const registrationToken = generateRegistrationToken(email);

      // Create a new user
      const newUser = await UserRegistration.create({
          NOM: nom.trim().toUpperCase(),
          PRENOM: prenom.trim(),
          EMAIL: email.trim().toLowerCase(),
          PASSWORD: hashedPassword,
          TOKEN: registrationToken
      });

      // Send registration confirmation email
      await sendUserRegistrationMail(email.toLowerCase().trim(), nom.toUpperCase().trim(), registrationToken);
      console.log('Registration confirmation email sent successfully');

      res.status(201).send('User registered successfully, Registration confirmation email sent successfully to : ' + email);
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('An error occurred while registering the user');
  }
});


router.get('/confirm-email', async (req, res) => {
  try {
    // Extract token from the query parameters
    const TOKEN = req.query.TOKEN;

    // Find user registration by token
    const userRegistration = await UserRegistration.findOne({ where: { TOKEN } });

    // If user registration not found or account already validated
    if (!userRegistration || userRegistration.ISVALIDATED) {
      return res.send('Account already activated or token expired');
    }

    // Check if token is expired
/*     if (userRegistration.expiration_date && userRegistration.expiration_date < new Date()) {
      return res.send('Token expired');
    } */

    // Update isvalidated column to true
    await userRegistration.update({ ISVALIDATED: true });

    // Respond with success message
    res.send('Account activated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/reset-password',limiter, async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user registration record by email
    const userRegistration = await UserRegistration.findOne({ where: { email } });

    // If user registration not found, send error response
    if (!userRegistration) {
      return res.status(400).json({ error: "The email address you provided doesn't exist. Please try again." });
    }

    // Generate a new reset token
    const resetToken = generateResetToken(email);

    // Update the user registration record with the new reset token
    userRegistration.TOKEN = resetToken;
    await userRegistration.save();

    // Send reset password email
    await sendUserResetPasswordMail(email, resetToken);
    
    // Send success response
    const message = 'Password reset instructions successfully sent to:';
    res.status(200).json({ message: `${message} ` });  /* ${email} */
  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).send('An error occurred while sending reset password email');
  }
});

function generateRegistrationToken(email) {
  return jwt.sign({ email }, process.env.secretKey, { expiresIn: '1d' }); // Expires in 1 
  
}// 
function generateResetToken(email) {
  const hash = crypto.createHash('sha256');
  hash.update(email);
  return hash.digest('hex');
}

  module.exports = router;