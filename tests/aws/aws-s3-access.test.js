require("dotenv").config();
const keys = require("../../keys.js");
const aws = require("../../services/AmazonService");
const fs = require("fs");
const uuid = require("node-uuid");
const path = require('path');

var { expect, assert } = require("chai");

describe("AWS", function() {
  describe("#S3", function() {
    it("should list bucket contents", function(done) {
      // testDeleteBucketContents()
      // testGetFiles()
      testListFiles()
      // testUploadFile()
      // listLocalFilesFromDirectory()
        .then(_ => console.log(_))
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});

async function testListFiles() {
  return await aws.ListAllFiles();
}

async function listLocalFilesFromDirectory() {
  return new Promise((resolve,reject) => {
    fs.readdir('./tests/data', (err, files) => {
      if (err) {
        reject(err)
      }
      files.forEach(file => {
        console.log(file)
      });
      resolve(files);
    })
  });
  
}

//http://www.hochmuth.com/mp3-samples.htm
async function testUploadFile() {

  var fName = "./tests/data/Haydn_Cello_Concerto_D-1.mp3"

  var fileName = path.basename(fName);


  var salt = uuid.v4();
  // Form Data supplied by Composer
  var testsong = {
    key : salt + "+" + fileName,
    name: "HAYDN \"CONCERTO D-MAJOR\"",
    fileName: fileName,
    bucket: "sonobang-test", // bucket name
    description: "REINER HOCHMUTH CELLIST"
  };

  var file = await aws.UploadFile(testsong, fName);
  var files = await aws.ListFiles();
  console.log(files);

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
    var file = { Bucket: "sonobang-test", Key: f.Key };
    await aws.DeleteFile(file);
  });
}
