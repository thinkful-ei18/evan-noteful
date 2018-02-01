'use strict';

const express= require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);




// METHOD ROUTES
router.get('/',(req,res,next) => {
  const {searchTerm} = req.query;
  notes.filter(searchTerm)
  .then((err,list) => {
    res.json(list);
  })
  .catch((err) => {
    console.log(err);
    next(err);
  })
});

router.get('/:id', (req,res) => {
  const { id } = req.params;
  let parsedId = parseInt(id); 
  notes.find(parsedId,(err,results) => {
    res.json(results);
  });
});



router.put('/:id', (req,res,next) => {
  const { id } = req.params;

  const updateObj = {};
  const updateFields = ['title','content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });


  notes.update(id,updateObj, (err,item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});


// POST ROUTE

router.post('/', (req,res,next) => {
  // const requiredFields = ['title','content'];

  const {title,content}=req.body;

  const newItem = {title,content};

  if (!title || !content) {
    const err = new Error('Missing title key!');
    err.status = 400;
    next(err);
  }


  notes.create(newItem, (err,item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});




router.delete('/:id', (req,res,next) => {
  let {id} = req.params;
  notes.delete(id, (err) => {
    if (err) {
      return next(err);
    }
  });
  res.status(204).end();
});

module.exports = {
  notesRoute: router
};

// console.log(module.exports);