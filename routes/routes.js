// routes.js
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../model/dbConfig');
const router = express.Router();



router.get('/gestion', (req, res) => {
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

router.get('/', (req, res) => {
  res.render('home');
});

  

module.exports = router;
