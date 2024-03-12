const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('../connection/login', { title: 'Login' });
  });
  router.get('/register', (req, res) => {
    res.render('../connection/register', { title: 'register' });
  });
  
  router.post('/reset-password', (req, res) => {
    const email = req.body.email;
  
    // Here you would implement your logic to send the email
    // For demonstration purposes, let's assume it always succeeds
    // You can replace this with your actual email sending logic
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

  module.exports = router;