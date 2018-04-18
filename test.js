var assert = require("assert");

require("dotenv").config();
var keys = require("./keys.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(keys.mysql.CLEARDB_DATABASE_URL);

describe("Sequelize Mysql Setup", function() {
  describe("#authenticate()", function() {
    it("should connect to mysql", function() {

      const User = sequelize.define("user", {
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        test : {
          type: Sequelize.STRING
        }
      });

      // force: true will drop the table if it already exists
      User.sync({ force: true }).then(() => {
        // Table created
        return User.create({
          firstName: "John",
          lastName: "Hancock",
          test : "sdfadsf"
        });
      });
    });
  });
});
