// require("dotenv").config();
// var keys = require("../keys.js");


process.env.NODE_ENV = "test";
// For assert operation, please refer to this link:
// https://www.w3schools.com/nodejs/ref_assert.asp
var assert = require("assert");
var meService = require("../services/MeService");

describe("Customer View", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    meService.Disconnect();
  });

  
});
