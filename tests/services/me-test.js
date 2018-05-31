var { meService, chai, app, expect, path, uuid } = require("../common");

describe("Customer View", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    meService.Disconnect();
  });

  
});
