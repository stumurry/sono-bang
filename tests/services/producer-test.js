process.env.NODE_ENV = "test";

var expect = require("chai").expect;
var ComposerService = require("../services/ProducerService");

describe("/producer", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
    // Disconnect before killing thread.
    ProducerService.Disconnect();
  });

});
