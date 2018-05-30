var chai = require("chai");
var { request, expect, assert } = require("chai");
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

var meService = require("../../services/MeService");

var app = require("../../app");

describe("This person", function() {
  after((done) => {
    meService
    .Disconnect()
    .catch(_ => _)
    .then(() => done())
  });

  // ** done() ** - Wait for database operation to finish
  it("should be able to see registration form", function(done) {
    chai
      .request(app)
      .get("/me/register")
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should be able to submit this registration form", function(done) {
    chai
      .request(app)
      .post("/me/register")
      .send(SampleRegistrationForm())
      .end(function(err, res) {
        console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
  });

  function SampleRegistrationForm() {
      return {
          username : 'world'
      }
  }
});
