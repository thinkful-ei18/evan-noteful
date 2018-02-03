'use strict';

const data = require('./db/notes');
const express = require('express');
const app = express();
const config = require('./config');
const logger = require('./logger');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const morgan = require('morgan');
const {notesRoute} = require('./router/notes.router');


// USE MIDDLEWARE
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(logger);

// USE ROUTES
app.use('/v1/notes', notesRoute);



app.use((req,res,next) => {
  let err = new Error('Not found');
  err.status = 404;
  next(err);
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
  
});



if (require.main === module) {

  app.listen(config.PORT, () => {
    console.log('server listening on port 8080');
  }).on('error', err => {
    console.log(err);
  });
}

module.exports = app;