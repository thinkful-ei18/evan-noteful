'use strict';

// DEFINE MIDDLEWARE

const logger = (req,res,next) => {
  let today  = new Date();
  console.log(today + ' ' + 'method: ' + req.method + ' url: ' + req.url);
  next();
};

module.exports = logger;