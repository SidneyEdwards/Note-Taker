const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET fetch to localhost:3001/api/notes
app.get('/api/notes',(req, res) => {
    res.json(allNotes);
});


function createNewNote(body, notesArray) {
    const newNote = body;
    console.log(newNote)
    newNote["id"] = notesArray.length
    console.log(newNote)
    if (!Array.isArray(notesArray)) {
    notesArray = [];
    }
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
    }
    // localhost:3001/api/notes <== req.params
    app.post('/api/notes', (req, res) => {
        const newNote = createNewNote(req.body, allNotes);
        res.json(newNote);
    });



    function deleteNote(id, notesArray){
        for (let i = 0; i < notesArray.length; i++){
            let note = notesArray[i];

            if (note.id == id){
                notesArray.splice(i, 1);
                fs.writeFileSync(
                    path.join(__dirname, './db/db.json'),
                    JSON.stringify(notesArray, null, 2)
                );
                break;
            }
        }
    };
    // localhost:3001/notes/someId req.params
    app.delete('/api/notes/:id', (req, res) => {
        deleteNote(req.params.id, allNotes);
        res.json(true);
    });

// front end routes
// localhost:3001/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// localhost:3001/notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`)
    });