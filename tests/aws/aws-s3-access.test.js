const { fs, aws, path, uuid } = require("../common");

describe("AWS", function() {
  describe("#S3", function() {
    it("should list bucket contents", function(done) {
      // testDeleteBucketContents()
      // testGetFiles()
       testListAllFiles() // make sure this method excutes and not the others otherwise, a whole lot unnecessary uploads.
      // testUploadFile()
      // listLocalFilesFromDirectory()
      // testCORS('sonobang-test')
        .then(_ => console.log(_))
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});

async function testCORS() {
  var cors = await aws.GetCORS('sonobang-test');
  return cors;
}

async function testListAllFiles() {
  return await aws.ListAllFiles('sonobang-test');
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

  var resp1 = await aws.UploadFile(testsong, fName);

  console.log('Upload File Result');
  console.log(resp1);

  var resp2 = await aws.ListFiles();
  console.log(resp2);

}

async function testGetFiles() {
  var file = await aws.UploadFile("aws-s3-access-test.txt", "Test Data");
  var files = await aws.ListFiles();
  var deleteResponse = await aws.DeleteFile(file);

  return "Success";
}

async function testDeleteBucketContents() {
  console.log('deleting bucket contents');
  var files =  await testListAllFiles();
  files.Contents.forEach(async f => {
    await aws.DeleteFile('sonobang-test', f.Key);
  });

  return files;
}
