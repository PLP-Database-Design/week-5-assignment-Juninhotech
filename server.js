const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Setup database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching patients' });
    } else {
      res.json(results);
    }
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching providers' });
    } else {
      res.json(results);
    }
  });
});

// 3. Filter patients by First Name
app.get('/patients/:firstName', (req, res) => {
  const { firstName } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching patients by first name' });
    } else {
      res.json(results);
    }
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/speciality/:speciality', (req, res) => {
    const { speciality } = req.params;
    const query = 'SELECT first_name, last_name FROM providers WHERE provider_speciality = ?';
    db.query(query, [speciality], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching providers by speciality' });
      } else {
        res.json(results);
      }
    });
  });
  

// Start the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
