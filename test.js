var assert = require("assert");

require("dotenv").config();
var keys = require("./keys.js");

const Sequelize = require("sequelize");
var sequelize;

describe("Sequelize Mysql Setup", function() {

  before(function() {
    // runs before all tests in this block
    console.log('Before magical testing begins.');
    sequelize = new Sequelize(keys.mysql.CLEARDB_DATABASE_URL);
  });

  after(function() {
    // runs before all tests in this block
    console.log('Closing connection');
    sequelize.close();
    // process.exit();
  });


  describe("#authenticate()", function() {
    it("should connect to mysql", function(done) {
      const User = sequelize.define('user', {
        username: Sequelize.STRING,
        birthday: Sequelize.DATE
      });
      
      sequelize.sync()
        .then(() => User.create({
          username: 'john doe',
          birthday: new Date(1980, 6, 20)
        }))
        .then(jane => {
          console.log(jane.toJSON());
        })
        .finally(done);
      
    });
  });
});


