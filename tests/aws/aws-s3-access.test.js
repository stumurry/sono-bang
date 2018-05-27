require("dotenv").config();
var keys = require("../../keys.js");
const aws = require("../../services/AmazonService");

var { expect, assert } = require("chai");

describe("AWS", function() {
  describe("#S3", function() {
    it("should list bucket contents", function(done) {
      // testDeleteBucketContents()
      // testGetFiles()
      testListFiles()
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});

async function testListFiles() {
  return await aws.ListFiles();
}

async function testGetFiles() {
  var file = await aws.UploadFile("aws-s3-access-test.txt", "Test Data");
  var files = await aws.ListFiles();
  var deleteResponse = await aws.DeleteFile(file);

  return "Success";
}

async function testDeleteBucketContents() {
  var files = await aws.ListFiles();

  files["Contents"].forEach(async f => {
    console.log(f);
    var file = { Bucket: "sonobang-test", Key: f.Key };
    await aws.DeleteFile(file);
  });
}
