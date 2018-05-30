var assert = require("assert");

var composerService = require("../services/ComposerService");

var app = require("../../app");

describe("Composer Routes", function() {
  after(function() {
    composerService.Disconnect();
  });

  // ** done() ** - Wait for database operation to finish
  it("should be able to create a composer", function(done) {
    // chai
    //   .request(app)
    //   .get("/me/register")
    //   .end(function(err, res) {
    //     expect(res).to.have.status(200);
    //     done();
    //   });
  });
});
