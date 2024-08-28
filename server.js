const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'books.json');

app.use(express.json());
app.use(express.static('public'));

// Load existing data from file
app.get('/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send('Error reading data file.');
        } else {
            res.send(data);
        }
    });
});

// Save data to file
app.post('/data', (req, res) => {
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing data file:', err);
            res.status(500).send('Error writing data file.');
        } else {
            res.send('Data saved successfully.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
