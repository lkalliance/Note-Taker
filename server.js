const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.post('/api/notes', (req, res) => {
    notes.push(req.body);
    const newNotes = JSON.stringify(notes, null, 4);
    fs.writeFile('./db/db.json', newNotes, (err) => {
        err ? console.error(err) : console.log(
            `Note with title "${req.body.title}" has been saved`
        );
    });
});






app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})