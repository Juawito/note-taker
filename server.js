const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uniqid = require('uniqid');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/api/notes', (req, res) => {
    let notesData = JSON.parse(fs.readFileSync(path.join(__dirname,'./db/db.json')));
    res.json(notesData);
})
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    let savedNotes = fs.readFileSync('./db/db.json', 'utf-8');
    savedNotes = JSON.parse(savedNotes);
    newNote.id = uniqid.process();
    console.log(newNote.id);
    savedNotes.push(newNote);
    fs.writeFileSync(path.join(__dirname,'./db/db.json'), JSON.stringify(savedNotes), function (err, data) {
        if(err) throw err;
    })
    res.json(savedNotes);
});
app.delete('/api/notes/:id', (req, res) => {
    let savedNotes = fs.readFileSync('./db/db.json', 'utf-8');
    savedNotes = JSON.parse(savedNotes);
    let noteId = req.params.id;
    let deletedNote = savedNotes.filter(notes => notes.id != noteId);
    console.log(deletedNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(deletedNote), (err) => {
        if(err) throw err;
    })

    res.send('New delete request received');
})

app.listen(PORT, () => console.log(`App is listening on PORT: ${PORT}`));