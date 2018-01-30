'use strict';

const data = require('./db/notes');
const express = require('express');
const app = express();
const config = require('./config');
const logger = require('./logger');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);




// USE MIDDLEWARE
app.use(express.static('public'));
app.use(express.json());
app.use(logger);




app.get('/home', (req,res) => {
  res.send('you\'re home');
});

app.get('/boxes', (req,res) => {
  res.send('boxes');
});




// METHOD ROUTES
// app.get('/v1/notes', (req,res) => {
//   const { searchTerm } = req.query;
//   const  searchResults = searchTerm ? data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm)) : data;
//   res.json(searchResults);
// });

app.get('/v1/notes',(req,res) => {
  const {searchTerm} = req.query;
  notes.filter(searchTerm, (err,list) => {
    if (err) {
      console.log(err); 
    } 
    res.json(list);
  });
});

app.get('/v1/notes/:id', (req,res) => {
  const { id } = req.params;
  let parsedId = parseInt(id); 
  notes.find(parsedId,(err,results) => {
    res.json(results);
  });
});


app.use((req,res,next) => {
  let err = new Error('Not found');
  err.status = 404;
  next(err);
});



app.use(function (err, req, res, next) {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
  
});

app.listen(config.PORT, () => {
  console.log('server listening on port 8080');
}).on('error', err => {
  console.log(err);
});