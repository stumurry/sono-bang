var AWS = require("aws-sdk");
const db = require("../db/models");
var uuid = require("node-uuid");
var s3 = new AWS.S3();
var fs = require("fs");
const path = require("path");

var bucket = "sonobang-test";

module.exports = {
  // Require promise here instead of async because AWS-SDK uses
  // old school callback pattern instead of returning a Promise

  // song - song: song db table, data_stream: file stream from disk
  UploadFile: async function(song, file_uri) {
    return new Promise((resolve, reject) => {
      if (!file_uri) throw "Filename missing.  Must include file data.";

      fs.readFile(file_uri, function read(err, data) {
        if (err) {
          reject(err);
        }

        var params = { Bucket: bucket, Key: song.key, Body: data };

        s3.upload(params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            let objectData = data.Body; // Use the encoding necessary
            resolve({ Key: params.Key, Bucket: bucket });
          }
        });
      });
    });
  },

  // song - song: song db table, data_stream: file stream from disk
  UploadFileByStream: async function(song, stream) {
    return new Promise((resolve, reject) => {
      var params = { Bucket: bucket, Key: song.key, Body: stream };

      console.log('Uploading to AWS');
      s3.upload(params, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          
          let objectData = data.Body; // Use the encoding necessary
          console.log(objectData);
          resolve({ Key: params.Key, Bucket: bucket });
        }
      });
    });
  },

  // Remember AWS only returns 1000 keys max.  Use `marker` or simply search by key name.
  ListFiles: async function(prefix) {
    // Require promise here instead of async because AWS-SDK uses
    // old school callback pattern instead of returning a Promise
    return new Promise((resolve, reject) => {
      var params = { Bucket: bucket, Prefix: prefix };
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
  ListAllFiles: async function() {
    // Require promise here instead of async because AWS-SDK uses
    // old school callback pattern instead of returning a Promise
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

  // var file = { Bucket: "sonobang-test", Key: f.Key };
  DeleteFile: async function(key) {
    // Require promise here instead of async because AWS-SDK uses
    // old school callback pattern instead of returning a Promise
    return new Promise((resolve, reject) => {
      console.log("Deleting Object");
      console.log("key");
      console.log(key);
      s3.deleteObject({ Key: key, Bucket: bucket }, function(err, data) {
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
