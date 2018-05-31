var { meService, chai, app, expect } = require("../common");

describe("This person", function() {
  after(done => {
    meService
      .Disconnect()
      .catch(_ => done())
      .then(() => done());
  });

  describe("##### who logs in #########", function() {
    // Login
    it("should be able to see login form", function(done) {
      // done() use w/ promises
      chai
        .request(app)
        .get("/me/login")
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
    // Login
    it("should be able to validate a login form", function(done) {
      chai
        .request(app)
        .post("/me/login")
        .send(EmptyLoginForm())
        .end(function(err, res) {
          // console.log(res.body);
          expect(res).to.have.status(422);
          done();
        });
    });

    it("should be redirected to the composer page", function(done) {
      chai
        .request(app)
        .post("/me/login")
        .send(ValidLoginForm())
        .end(function(err, res) {
          // console.log(res.body);
          expect(res.redirects[0]).include('/composer', 'Authenticated Composers should be redirected to composer page' );
          done();
        });
    });

    function ValidLoginForm() {
      return {
        username: 'test',
        password: 'test'
      
      };
    }

    function EmptyLoginForm() {
      return {};
    }
  });

  describe("##### who registers #########", function() {
    // Register
    it("should be able to see registration form", function(done) {
      chai
        .request(app)
        .get("/me/register")
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    // Register
    it("should be able to validate a registration form", function(done) {
      chai
        .request(app)
        .post("/me/register")
        .send(EmptyRegistrationForm())
        .end(function(err, res) {
          // console.log(res.body);
          expect(res).to.have.status(422);
          done();
        });
    });
    function EmptyRegistrationForm() {
      return {};
    }
  });

  
});
