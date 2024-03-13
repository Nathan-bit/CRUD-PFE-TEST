const nodemailer = require('nodemailer');

// Create a nodemailer transporter

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Your SMTP host
  port: 465, // Your SMTP port
  secure: true, // true for 465, false for other ports
  auth: {
    user: "gabiamsamuelnathan@gmail.com", // Your email address
    pass: "fkjo fycc cmgy oses"// Your email password
  }
});

// Function to send registration email
// Email content
async function sendUserRegistrationMail(email, name) {
const mailOptions = {
    from: 'Gestions Stages', // Sender address
    to: email, // Recipient address
    subject: 'Registration Confirmation', // Subject line
    html: `
      <html>
        <head>
          <style>
            /* Add your custom CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .message {
              margin-bottom: 20px;
            }
            .signature {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Registration Confirmation: Welcome to [Your Company ]!</h2>
            <div class="message">
              <p>Dear ${name},</p>
              <p>Congratulations! We are thrilled to confirm that your registration with [Your Company ] was successful. Welcome to our community!</p>
              <p>Here are the details of your registration:</p>
              <ul>
                <li><strong>Username:</strong> ${name}</li>
                <li><strong>Email Address:</strong> ${email}</li>
                <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
              <p>As a registered member, you now have access to [briefly mention key features or benefits of your product/service]. We are confident that you'll find [Your Company ] to be a valuable resource.</p>
              <p>Should you have any questions or need assistance, feel free to reach out to our support team at [Support Email/Contact Information]. We're here to help!</p>
              <p>Thank you for choosing [Your Company ]. We're excited to have you on board!</p>
            </div>
            <div class="signature">
              <p>Best regards,</p>
              <p>[Your Name]<br>[Your Position/Role]<br>[Your Company ]</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
  

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}




module.exports = {sendUserRegistrationMail,};
