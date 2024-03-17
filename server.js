// app.js
const $ = require('jquery');
global.jQuery = $;
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const routes = require('./routes/routes');
const connectionRoutes=require('./routes/connectionRoutes')
const uploadsRoutes=require('./routes/uploadsRoutes')
const databaseRoutes=require('./routes/databaseRoutes')
const authenticate = require('./middlewares/auth');
const { isAdmin, isUser } = require('./middlewares/roles');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//const flash = require('flash-message');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(flash());


app.use(session ({
  secret : process.env.secretKey,
  resave: true,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set static directory for public files
app.use(express.static(path.join(__dirname, '')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('view cache',false)




// Import routes
app.use('/',routes);
app.use('/connection',connectionRoutes);
app.use('/',authenticate,uploadsRoutes);
// Protect /gestion and its subroutes with authenticate middleware
//app.use('/gestion', authenticate, databaseRoutes); 
app.use('/gestion',authenticate,databaseRoutes); 



// Similar for other routes


/* app.get('/pages/:pageName', (req, res) => {
  const pageName = req.params.pageName;20
  // Assume you have EJS files in a directory called 'views/pages'
  ejs.renderFile(`views/${pageName}.ejs`, (err, html) => {
      if (err) {
          console.error(err);
          res.status(404).send('Page not found');
      } else {
          res.send(html);
      }
  });
});
 */

 /* app.get('/pages/:pageName', (req, res) => {
  const pageName = req.params.pageName;
  // Define data for each page dynamically
  let data = {};
  if (pageName === 'index') {
    data = { dt: 'Homepage', data: 'Welcome to the homepage!' };
  } else if (pageName === 'uploads') {
    data = { title: 'Uploads', message: 'Here you can upload files.' };
  } else if (pageName === 'etudiant') {
  
  } else {
    // Handle unknown page names
    console.error('Unknown page:', pageName);
    return res.status(404).send('Page not found');
  }
  
  // Render the EJS file with dynamic data
  ejs.renderFile(`views/${pageName}.ejs`, data, (err, html) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }
      res.send(html);
  });
});
  */
app.get(['/','/home'], (req, res) => {
  res.render('home');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
