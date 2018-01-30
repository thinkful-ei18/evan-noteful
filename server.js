'use strict';

const data = require('./db/notes');
const express = require('express');
const app = express();
const config = require('./config');

// DEFINE MIDDLEWARE

const logger = (req,res,next) => {
  let today  = new Date();
  console.log(today + ' ' + 'method: ' + req.method + ' url: ' + req.url);
  next();
};


// USE MIDDLEWARE
app.use(express.static('public'));


app.use(logger);




app.get('/home', (req,res) => {
  res.send('you\'re home');
});

app.get('/boxes', (req,res) => {
  res.send('boxes');
});




// METHOD ROUTES
app.get('/v1/notes', (req,res) => {
  console.log(req.testing);
  const { searchTerm } = req.query;
  const  searchResults = searchTerm ? data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm)) : data;
  res.json(searchResults);
});

    
app.get('/v1/notes/:id', (req,res) => {
  const { id } = req.params;
  let parsedId = parseInt(id);
  let results = data.find((note) => {
    return note.id === parsedId;
  });
  res.json(results);
});


app.get('*',(req,res) => {
  throw new Error('you screwed up!');
});


app.use(function (err, req, res, next) {
  console.log('error handler ran');
  res.send(404,'There was a problem: \n ' + err);
  console.error(err);

});

app.listen(config.PORT, () => {
  console.log('server listening on port 8080');
}).on('error', err => {
  console.log(err);
});