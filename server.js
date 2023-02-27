const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use('/api/notes', require('./routes/api.js'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})