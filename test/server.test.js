'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server');


// use 
chai.use(chaiHttp);

describe('Sanity Checks', function () {
  it('2+2 should return 4', function () {
    expect(2+2).to.equal(4);
  });
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
  it('should response with 404 with given a bad path', function () {
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