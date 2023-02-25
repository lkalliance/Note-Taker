const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

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
    res.send(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if ( title && text ) {
        const newNote = {
            id: req.body.id || uuid(),
            title,
            text
        };

        notes.push(newNote);
        const notesString = JSON.stringify(notes, null, 4);
        fs.writeFile('./db/db.json', notesString, (err) => {
            err ? 
                console.error(err)
                : console.log(`Note with title "${req.body.title}" has been saved`);
            }
        );
        const response = {
            status: 'success',
            body: newNote
        }

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review')
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const target = notes.find( (note) => note.id == id );

    if (target) {
        const deleted = notes.splice(notes.indexOf(target), 1);
        const notesString = JSON.stringify(notes, null, 4);
        fs.writeFile('./db/db.json', notesString, (err) => {
            err ? 
                console.error(err)
                : console.log(`Note with title "${req.body.title}" has been saved`);
            }
        );

        const response = {
            status: 'success',
            body: deleted
        }

        console.log(response);
        res.status(200).json(response);
    } else {
        res.status(404).send("The requested note did not exist in the database");
    }
    
})





app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})