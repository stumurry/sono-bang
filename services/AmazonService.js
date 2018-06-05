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
    var rs = fs.createReadStream(file_uri);

    var params = {
      ACL: "public-read",
      ContentType: 'audio/mp3',
      Bucket: bucket,
      Key: song.key,
      Body: rs
    };

    await s3.upload(params).promise();
    return await s3
      .headObject({ Bucket: params.Bucket, Key: params.Key })
      .promise();
  },

  // song - song: song db table, data_stream: file stream from disk
  UploadFileByStream: async function(song, stream, size) {
    var params = {
      ACL: "public-read",
      // ContentType: 'audio/mpeg',
      //ContentDisposition: 'attachment; filename="'+ song.fileName + '"',
      // ContentLength : size,
      Bucket: song.bucket,
      Key: song.key,
      Body: stream
    };

    return await s3.upload(params).promise();
  },

  // Remember AWS only returns 1000 keys max.  Use `marker` or simply search by key name.
  ListFiles: async function(prefix) {
    var params = { Bucket: bucket, Prefix: prefix };
    return s3.listObjectsV2(params).promise();
  },

  ListAllFiles: async function(bucket) {
    var resp =  await s3.listObjectsV2({ Bucket: bucket }).promise();

    var oo = [];
    await resp.Contents.forEach(async element => {

      
      var o = await s3.headObject({ Bucket : bucket, Key : element.Key}).promise();
      console.log(o);

      oo.push(o);
      
    });

    return { Contents: resp.Contents, HeadObjects: oo };
    
  },

  // var file = { Bucket: "sonobang-test", Key: f.Key };
  DeleteFile: async function(bucket, key) {
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
  },

  GetCORS: async function(bucket) {
    return new Promise((resolve, reject) => {
      console.log("Getting CORS");
      s3.getBucketCors({ Bucket: bucket }, function(err, data) {
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
