const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fss'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the index page
app.get('/', (req, res) => {
  // Query MySQL for table names
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error fetching table names:', err);
      res.status(500).send('Error fetching table names');
      return;
    }
    const tables = results.map(row => ({ Tables_in_fss: row[`Tables_in_${connection.config.database}`] }));
    res.render('index', { tables });
  });
});

// Route to handle table selection
app.get('/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  // Query MySQL for table data
  connection.query(`SELECT * FROM ${tableName}`, (err, results) => {
    if (err) {
      console.error(`Error fetching data from table ${tableName}:`, err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.render('tp', { data: results, tableName });
  });
});

// Route to handle form submission for creating a new entry
app.post('/:tableName/create', (req, res) => {
  const tableName = req.params.tableName;
  const email = req.body.email;
  // Assuming other fields are passed in the request body
  const otherFields = req.body.otherFields;

  // Insert new entry into the table
  connection.query(`INSERT INTO ${tableName} (EMAIL, other_column1, other_column2) VALUES (?, ?)`, [email, otherFields], (err, result) => {
    if (err) {
      console.error(`Error inserting data into table ${tableName}:`, err);
      res.status(500).send('Error creating entry');
      return;
    }
    res.redirect(`/${tableName}`);
  });
});

// Route to handle form submission for updating an existing entry
app.post('/:tableName/update/:email', (req, res) => {
  const tableName = req.params.tableName;
  const email = req.params.email;
  // Assuming other fields are passed in the request body
  const otherFields = req.body.otherFields;

  // Update entry in the table
  connection.query(`UPDATE ${tableName} SET other_column1=?, other_column2=? WHERE EMAIL=?`, [otherFields, email], (err, result) => {
    if (err) {
      console.error(`Error updating data in table ${tableName}:`, err);
      res.status(500).send('Error updating entry');
      return;
    }
    res.redirect(`/${tableName}`);
  });
});

// Route to handle deleting an entry
app.get('/:tableName/delete/:email', (req, res) => {
  const tableName = req.params.tableName;
  const email = req.params.email;

  // Delete entry from the table
  connection.query(`DELETE FROM ${tableName} WHERE EMAIL=?`, [email], (err, result) => {
    if (err) {
      console.error(`Error deleting data from table ${tableName}:`, err);
      res.status(500).send('Error deleting entry');
      return;
    }
    res.redirect(`/${tableName}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
