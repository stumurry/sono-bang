var AWS = require("aws-sdk");
require("dotenv").config();
var keys = require("../keys.js");

describe("AWS S3 Access Test", function() {
  describe("#Access()", function() {
    it("should list bucket contents", function(done) {
      var s3 = new AWS.S3();

      var params = { Bucket : 'sonobang-test'};
      s3.listObjectsV2(params, function(err, data) {
        if (err) { 
          console.log(err, err.stack); 
        } // an error occurred
        else  {    
          console.log(data) 
        };           // successful response
      });

      // .finally(done);
      done();

    });
  });
});
