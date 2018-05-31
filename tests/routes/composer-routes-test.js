var { composerService, chai, app, expect } = require("../common");

describe("UnAuthenticated Persons", function() {
  after((done) => {
    composerService
    .Disconnect()
    .catch(_ => done()) // ignore error
    .then(() => done())
  });

  // 401 - Not Authenticated
  // 403 - Not Authorized
  it("should be forced to login", function(done) { // done() use w/ promises
    chai
      .request(app)
      .get("/composer")
      .end(function(err, res) {
        console.log('res.headers');
        console.log(res);
        expect(res.redirects[0]).include('/me/login', 'UnAuthenticated users should be redirected to login page' );
        done();
      });
  });
  
});
