var { producerService, chai, app, expect, path, uuid } = require("../common");

describe("/producer", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
    // Disconnect before killing thread.
    producerService.Disconnect();
  });

});
