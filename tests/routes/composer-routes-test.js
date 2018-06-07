var { composerService, chai, app, expect, keys } = require("../common");

describe("AS", function() {
  before(done => {
    composerService
      .CreateComposer({
        name: "Test Composer-Routes",
        description:
          "A music song writer specializing in motion picture themes.",
        username: "stu",
        password: "stu", // test using HMAC encryption later.
        email: "stu@sss.com",
        homepage: "http://helloworld.com"
      })
      .then(_ => ((composer = _.composer), (user = _.user)))
      .then(() => done())
      .catch(_ => done()); // ignore error
  });

  after(done => {
    composerService
      .RemoveComposer(composer)
      .then(_ => (composer = null, user = null))
      .then(_ => composerService.Disconnect())
      .then(() => done())
      .catch(_ => done(_)); // ignore error
  });

  describe("Composers", function() {
    var bucket = keys.aws.BUCKET;

    // 401 - Not Authenticated
    // 403 - Not Authorized
    it("should be required to login", function(done) {
      // done() use w/ promises
      chai
        .request(app)
        .get("/composer")
        .end(function(err, res) {
          expect(res.redirects[0]).include(
            "/me/login",
            "UnAuthenticated users should be redirected to login page"
          );
          done();
        });
    });

    // `Post` at this time doesn't work, which pretty much throws chai-http in the garbage can.
    
    it("should be able to login", function(done) {
      // done() use w/ promises
      chai
        .request(app)
        .post("/me/login")
        .send( { username : user.username, password : user.password } )
        .end(function(err, res) {
          console.log('res');
          console.log(res);
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should be required to pay", function(done) {
      // done() use w/ promises
      chai
        .request(app)
        .post("/me/login")
        .send( { username : user.username, password : user.password } )
        .end(function(err, res) {
          expect(res.redirects[1]).include(
            "/composer/pricing",
            "Unpaid composers are required to pay."
          );
          done();
        });
    });
    
  });
});
