// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const connectionRoutes=require('./routes/connectionRoutes')
const uploadsRoutes=require('./routes/uploadsRoutes')
const databaseRoutes=require('./routes/databaseRoutes')


const app = express();
app.use(express.json());

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set static directory for public files
app.use(express.static(path.join(__dirname, '')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Import routes
app.use('/', routes);
app.use('/connection',connectionRoutes);
app.use('/uploadsfiles',uploadsRoutes);
app.use('/gestion',databaseRoutes);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
