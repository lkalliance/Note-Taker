/* NODE REQUIRES */
const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const notes = require('../db/db.json');
const uuid = require('../helpers/uuid.js');

router.use(express.json())

// Return the current list of notes
router.get('/', (req, res) => {
    console.info(`${req.method} request for notes list`)
    res.send(notes);
});

// Save a new note
router.post('/', (req, res) => {
    console.info(`${req.method} request for notes list`);
    const { title, text } = req.body;
    
    if ( title && text ) {
        const newNote = {
            // id can be provided in the request; if not, generate one
            id: req.body.id || uuid(),
            title,
            text
        };
        notes.push(newNote);

        // stringify and overwrite the file with the updated array
        const notesString = JSON.stringify(notes, null, 4);
        fs.writeFile('./db/db.json', notesString, (err) => {
            err ? 
                console.error(err)
                : console.log(`Note with title "${req.body.title}" has been saved`);
            }
        );

        // send back a copy of the note on success
        const response = {
            status: 'success',
            body: newNote
        }
        res.status(201).send(response);
    } else {
        // post failed for some reason, send 500
        res.status(500).json('Error in posting review')
    }
});

// Delete a note
router.delete('/:id', (req, res) => {
    // find the proper note to delete
    const id = req.params.id;
    const target = notes.find( (note) => note.id == id );

    if (target) {
        // if the note was found, remove from the array and rewrite the file
        const deleted = notes.splice(notes.indexOf(target), 1);
        const notesString = JSON.stringify(notes, null, 4);
        fs.writeFile('./db/db.json', notesString, (err) => {
            err ? 
                console.error(err)
                : console.log(`Note with id "${id}" has been deleted`);
            }
        );

        // send back a copy of the deleted note on success
        const response = {
            status: 'success',
            body: deleted
        }
        console.log(response);
        res.status(200).json(response);
    } else {
        // target didn't exist, respond with 404
        res.status(404).send("The requested note did not exist in the database");
    }
    
})


module.exports = router;