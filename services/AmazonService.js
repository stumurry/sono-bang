var AWS = require("aws-sdk");
const db = require("../db/models");
var uuid = require("node-uuid");
var s3 = new AWS.S3();

var bucket = "sonobang-test";

module.exports = {
  // Testing purposes only.
  UploadFile: async function(fileName, data) {
    return new Promise((resolve, reject) => {
      var kName = uuid.v4() + "_" + fileName;
      var params = { Bucket: bucket, Key: kName, Body: data };

      s3.putObject(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          
          resolve({Key: kName, Bucket: bucket });
        }
      });
    });
  },

  ListFiles: async function() {
    return new Promise((resolve, reject) => {
      var params = { Bucket: bucket };
      s3.listObjectsV2(params, function(err, data) {
        if (err) {
          reject(err);
        } // an error occurred
        else {
          resolve(data);
        } // successful response
      });
    });
  },

  DeleteFile: async function(file) {
    return new Promise((resolve, reject) => {
        console.log('file');
      console.log(file);
      s3.deleteObject(file, function(err, data) {
        console.log('deleted object');
        console.log(err);
        console.log(data);
        if (err) {
          reject(err);
        } // an error occurred
        else {
          resolve(data);
        } // successful response
      });
    });
  }
};
