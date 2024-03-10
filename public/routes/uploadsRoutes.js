const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');
const csvParser = require('csv-parser');
const bodyParser = require('body-parser');
const { getDataFromTable, getAllTablesAndStructure } = require('../model/model');
const unidecode = require('unidecode');
const connection = require ('../model/dbConfig')

const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Initialize multer
const uploadFolder = 'uploads';
const uploadFolderPath = path.join(__dirname, '..', '..', uploadFolder);
if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath);
}
const upload = multer({ dest: uploadFolderPath });


let data=[]
let items=[]


router.get('/upload', (req, res) => {
    getAllTablesAndStructure()
        .then(tablesStructure => {
            items=tablesStructure ;
           console.log('items from upload : ',items);
            res.render('uploads', {dt:data, items: tablesStructure });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Error occurred while fetching tables and their structures');
        });
});

router.post('/uploads', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // Check file type synchronously
    const fileType = path.extname(file.originalname).toLowerCase();
    if (fileType !== '.xlsx' && fileType !== '.csv') {
        return res.status(400).send('Unsupported file format. Please upload an Excel file (xlsx) or CSV file.');
    }

    try {
        // Read and process file asynchronously
        if (fileType === '.xlsx') {
            // Read Excel file
            const workbook = await xlsx.readFile(file.path);
            // Convert first sheet to JSON
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let excelData = xlsx.utils.sheet_to_json(worksheet);
            // Apply unidecode to keys
            excelData = excelData.map((row) => {
                const transformedRow = {};
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        const newKey = unidecode(key).replace(/[^\w\s]/gi, ''); // Remove special characters and convert accented characters
                        transformedRow[newKey] = row[key];
                    }
                }
                data=transformedRow
                return transformedRow;
            });
            return res.render('uploads', { dt: excelData , items : items });
        } else if (fileType === '.csv') {
            // Read CSV file asynchronously
            const csvData = [];
            fs.createReadStream(file.path, { encoding: 'latin1' })
                .pipe(csvParser())
                .on('data', (row) => {
                    const transformedRow = {};
                    for (const key in row) {
                        if (row.hasOwnProperty(key)) {
                            const newKey = unidecode(key).replace(/[^\w\s]/gi, ''); // Remove special characters and convert accented characters
                            transformedRow[newKey] = row[key];
                        }
                    }
                    csvData.push(transformedRow);
                    data=csvData
                })
                .on('end', () => {
                    res.render('uploads', { dt: csvData ,items: items });
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                    return res.status(500).send('Error while processing file.');
                });
        }
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Error while processing file.');
    }
});

router.post('/saveToDatabase', async (req, res) => {
  const { Data, Options, TableName } = req.body;
  let d = Data;

  try {
    // Check if TableName is missing
    if (!TableName) {
      res.status(400).json({ error: 'Table name is required.' });
      return;
    }

    // Check if Options is missing or invalid
    if (Options !== '1' && Options !== '2') {
      res.status(400).json({ error: 'Invalid Options value. Use 1 or 2.' });
      return;
    }

    // Handle data insertion based on the specified options
    if (Options === '1') {
      // Insert new data only
      for (const item of d) {
        try {
          const query = 'INSERT INTO ?? SET ?';
          await connection.query(query, [TableName, item]);
        } catch (error) {
          // Ignore duplicate key errors
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Internal server error.' });
            return;
          }
        }
      }
      res.status(200).json({ message: 'Data inserte                                                                                                                                                                                                                                                                                                                                                                                                                                                                        d successfully.' });
    } else if (Options === '2') {
      // Insert new data and update existing data
      for (const item of d) {
        const query = 'INSERT INTO ?? SET ? ON DUPLICATE KEY UPDATE ?';
        await connection.query(query, [TableName, item, item]);
      }
      res.status(200).json({ message: 'Data inserted and updated successfully.' });
    }
  } catch (error) {
    console.error('Error saving data to database:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


  router.get('/upload', (req, res) => { 
    console.log('items from uploads', items)
    res.render('uploads',{dt : data, items:items });
});


module.exports = router;
