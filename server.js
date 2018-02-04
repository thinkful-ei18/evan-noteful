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
const fs = require('fs');


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


const runServer = function () {
  return new Promise((resolve,reject) => {
    const server = app.listen(config.PORT, () => {
      console.log('starting server');
      console.log('server listening on port 8080');
      resolve(server);
    }).on('error',reject);
  });
};


const closeServer = function () {
  return new Promise((resolve,reject) => {
    console.log('stopping server');
    fs.writeFileSync('wohoo.txt', 'server closed');
    server.close;
    resolve();
  });
};


if (require.main === module) {
  runServer();
}

module.exports = {
  app,
  runServer,
  closeServer 
  
};