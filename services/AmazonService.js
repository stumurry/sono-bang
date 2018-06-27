var AWS = require("aws-sdk");
const db = require("../db/models");
var uuid = require("node-uuid");
var keys = require("../keys")

AWS.config.update({
  accessKeyId: keys.aws.ACCESS_KEY,
  secretAccessKey: keys.aws.SECRET_ACCESS_KEY
});

var s3 = new AWS.S3();
var ses = new AWS.SES( { region : 'us-east-1' });
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
  ListFiles: async function(bucket, prefix) {
    var params = { Bucket: bucket, Prefix: prefix };
    var resp = await s3.listObjectsV2(params).promise();
    return resp.Contents;
  },

  ListAllFiles: async function(bucket) {
    return  await s3.listObjectsV2({ Bucket: bucket }).promise();    
  },

  // var file = { Bucket: "sonobang-test", Key: f.Key };
  DeleteFile: async function(bucket, key) {
    return await s3.deleteObject({ Key: key, Bucket: bucket }).promise();
  },

  GetCORS: async function(bucket) {
    return await s3.getBucketCors({ Bucket: bucket }).promise();
  },

  GetDataUsage : async (bucket, prefix) => {
    var params = { Bucket: bucket, Prefix: prefix };
    console.log(params);
    var resp = await s3.listObjectsV2(params).promise();

    return resp.Contents.map(d => parseFloat(d.Size)).reduce((acc, curr) => acc + curr);

  },
  SendEmail : async (to, subject, body) => {

    var params = {
      Destination: { /* required */
        ToAddresses: [to]
      },
      Message: { /* required */
        Body: {
          
          Html: {
            Charset: 'UTF-8',
            Data : body,
            // Data:
            //   'This message body contains HTML formatting, like <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'This message body contains HTML formatting, like <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      ReturnPath: 'ericminson01@gmail.com',
      Source: 'ericminson01@gmail.com'
    };

    await ses.sendEmail(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
      /*
      data = {
       MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
      }
      */
    }).promise();
  }
};
