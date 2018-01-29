'use strict';

const data = require('./db/notes');
const express = require('express');

const app = express();

// INSERT EXPRESS APP CODE HERE...

app.use(express.static('public'));


app.get('/v1/notes', (req,res) => {
  if (Object.keys(req.query).length === 0) {
    // console.log('no req query: ' + req.query);
    res.json(data);
  } else {
    // console.log('yes req query: ' + req.query);
    let { searchTerm } = req.query;
    let searchResults = data.filter((note) => {
      return (note.title.includes(searchTerm) || note.content.includes(searchTerm));
    });
    // console.log(searchResults);
    res.json(searchResults);
  }
});
    

app.get('/v1/notes/:id', (req,res) => {
  const { id } = req.params;
  let parsedId = parseInt(id);
  let results = data.find((note) => {
    return note.id === parsedId;
  });
  res.json(results);
});


app.listen(8080, () => {
  console.log('server listening on port 8080');
}).on('error', err => {
  console.log(err);
});