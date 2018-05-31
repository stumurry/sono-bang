var { composerService, meService, chai, app, expect, path, uuid } = require("../common");

describe("Customer View", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    meService.Disconnect();
  });

  it("should be able to login", function(done) {
    console.log('Testing me!');
    var hasException = false;
    meService.Login('test', 'asdfasdf')
      .then(_ => {
        expect(_.key, 'expect a key ').not.to.be.empty;
        // console.log('composer');
        // console.log(composer);
        // Songs should have references to boh playlist and composer
        
        // expect(composer, 'expect a value from login').not.to.be.null;
      })
      .then(_ => done())
      .catch(_ => done(_));
  });

  
});
