const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserRegistration  = require('../controllers/UserRegistration'); // Import UserRegistration model
const {sendUserRegistrationMail}=require('../model/nodemailers');





router.get('/login', (req, res) => {
    res.render('../connection/login', { title: 'Login' });
  });
  router.get('/register', (req, res) => {
    res.render('../connection/register', { title: 'register' });
  });
  
  router.post('/reset-password', (req, res) => {
    const email = req.body.email;
    console.log(email);
                 if(email=='test@gmail.com')
                 {
                  let message =' Password reset instructions successfuly sent to :'
                  res.status(200).json({ message:message  });
                  console.log(message);
                  
                 }else{
  
                   res.status(400).json({ error: " The address mail you provide doesn't exist.  Please try again." })
                 }
    // Send success response
   // res.status(200).json({ message: 'Password reset instructions sent successfully.' });
  });
  router.post('/register', async function(req, res) {
    let { nom, prenom, email, password } = req.body;

    // Check if email already exists
    const existingUser = await UserRegistration.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).send('Email address already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const secretKey = 'your-secret-key';
    const registrationToken = generateRegistrationToken(email);

    try {
        // Create a new user
        const newUser = await UserRegistration.create({
            NOM: nom.toString().trim(),
            PRENOM: prenom.toString().trim(),
            EMAIL: email.toString().toLowerCase().trim(),
            PASSWORD: hashedPassword,
            TOKEN: registrationToken

        });

        console.log(newUser.toJSON()); // Log the created user 
        
       
       let mail=email.toString().toLowerCase().trim()
       let name =nom.toString().toUpperCase().trim()
       let TOKEN=registrationToken;
        // Send registration confirmation email
        await sendUserRegistrationMail(mail,name,TOKEN);
        console.log('Registration confirmation email sent successfully');

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('An error occurred while registering the user');
    }
});

function generateRegistrationToken(email) {
  return jwt.sign({ email }, secretKey, { expiresIn: '1d' }); // Expires in 1 day
}

  module.exports = router;