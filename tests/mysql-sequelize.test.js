process.env.NODE_ENV = "test";
// For assert operation, please refer to this link:
// https://www.w3schools.com/nodejs/ref_assert.asp
var assert = require("assert");

require("dotenv").config();
var keys = require("../keys.js");
const Sequelize = require("sequelize");

describe("mysql-sequelize-test", function() {
  it("should connect and disconnect", function(done) {
    console.log("connecting to mysql...");
    console.log(keys.mysql.CLEARDB_DATABASE_URL);
    this.sequelize = new Sequelize(keys.mysql.CLEARDB_DATABASE_URL);

    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        this.sequelize.close();
        done();
      })
      .catch(err => {
        console.log(err);
        assert.fail("Unable to connect to mysql database");
        done();
      });
  });
});
