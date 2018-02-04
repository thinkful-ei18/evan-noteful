'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const {app,runServer,closeServer} = require('../server');
const chaiSpies = require('chai-spies');

// use 
chai.use(chaiHttp);
chai.use(chaiSpies);

let server;

describe('Sanity Checks', function () {
  it('2+2 should return 4', function () {
    expect(2+2).to.equal(4);
  });
});

before(function () {
  runServer();
});


after(function() {
  closeServer();
});

describe('Express Static', function() {
  it('GET request to `/` should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res.status).to.equal(200);
        expect(res).to.exist;
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {
  it('should respond with 404 with given a bad path', function () {
    const spy = chai.spy();
    return chai.request(app)
      .get('/badpathmon')
      .then(spy)
      .then(function() {
        expect(spy).to.not.have.been.called();
      })
      .catch(function (err) {
        expect(err.response).to.have.status(404);
      });
  });
});


describe('GET /v1/notes', function () {
  it('should return 10 notes', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.length).to.equal(10);
        expect(res.body).to.be.a('array');
      });
  });

  it('should return correct search results', function() {
    return chai.request(app)
      .get('/v1/notes?searchTerm=5')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(1);
      });
  });
});


describe('GET /v1/notes/:id', function () {
  it('should return the correct item when querying by ID', function () {
    return chai.request(app)
      .get('/v1/notes/1000')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.id).to.equal(1000);
        expect(res).to.be.json;
        expect(res.body).to.include.keys('id','title','content');
      });

  });

  it('should return 404 when an invalid ID has been queried', function () {
    return chai.request(app)
      .get('/v1/notes/23446')
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
});

describe('POST /v1/notes', function() {
  it('should return a new item when posting', function () {
    const updateData = {title:'I have a twinky', content:'Many, actually'};
    return chai.request(app)
      .post('/v1/notes/')
      .send(updateData)
      .then(function(res) {
        expect(res.body).to.include.keys('title','content','id');
        expect(res.body.title).to.equal('I have a twinky');
        expect(res).to.be.json;
        expect(res).to.have.status(201);
      });
  });

  it('should return error when post body is missing a field', function () {
    const updateData = {content:'Many, actually'};
    return chai.request(app)
      .post('/v1/notes')
      .send(updateData)
      .catch((err) => {
        expect(err.response).to.have.status(400);
      });
  });
});


describe('PUT /v1/notes', function () {
  it('should update item on correct put call', function () {
    const updateData = {title:'Dogs'};
    return chai.request(app)
      .put('/v1/notes/1000')
      .send(updateData)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.include.keys('title','content','id');
      });
      
  });

  it('should return error when all valid fields are missing', function () {
    const updateData = {test:'Many, actually'};
    return chai.request(app)
      .post('/v1/notes')
      .send(updateData)
      .catch((err) => {
        expect(err.response).to.have.status(400);
      });
  });
});

