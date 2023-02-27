const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const notes = require('../db/db.json');
const uuid = require('../helpers/uuid.js');

router.use(express.json())


router.get('/', (req, res) => {
    console.info(`${req.method} request for notes list`)
    res.send(notes);
});

router.post('/', (req, res) => {
    console.info(`${req.method} request for notes list`);

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
        res.status(201).send(response);
    } else {
        res.status(500).json('Error in posting review')
    }
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const target = notes.find( (note) => note.id == id );

    if (target) {
        const deleted = notes.splice(notes.indexOf(target), 1);
        const notesString = JSON.stringify(notes, null, 4);
        fs.writeFile('./db/db.json', notesString, (err) => {
            err ? 
                console.error(err)
                : console.log(`Note with id "${id}" has been deleted`);
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



module.exports = router;