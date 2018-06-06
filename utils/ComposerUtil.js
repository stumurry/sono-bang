const keys = require("../keys");
const fs = require("fs");
const mm = require("musicmetadata");
const path = require("path");
const uuid = require("uuid");

var crypto = require("crypto"),
  algorithm = keys.encryption.algorithm,
  password = keys.encryption.password;

var ComposerUtil = {
  encrypt: function(text) {
    var message = JSON.stringify(text);
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(message, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  },

  decrypt: function(text) {
    // console.log('text');
    // console.log(text);
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    // console.log('Deciphered Text');
    // console.log(dec);
    return JSON.parse(dec);
  },
  GetSongInformation: async function(file_path, composer) {
    var meta = await this.GetFileMetaData(file_path);

    var filename = path.basename(file_path);

    var keyTitle = (str = meta.title.replace(/\s/g, ""));

    var song = {
      name: meta.title,
      description: meta.artist ? meta.artist[0] : "",
      genre: meta.genre ? meta.genre[0] : "",
      fileName: filename,
      bucket: keys.aws.BUCKET,
      composer_id: composer.id,
      // Salt Key with a GUID to prevent key name collisions for like files.
      key: composer.id + "-" + uuid.v4() + "-" + keyTitle + ".mp3"
    };

    return song;
  },

  GetFileMetaData: function(path) {
    return new Promise((resolve, reject) => {
      // var stats = fs.statSync(fObject.path);

      var rs = fs.createReadStream(path);

      var parser = mm(rs, function(err, metadata) {
        if (err) {
          rs.close();
          // reject(err); // if header is missing, then we will prepoluate it with Untitled, etc...
          // console.log(err);

          var untitled = {
            title: "Untitled",
            artist: ["Untitled Artist"],
            albumartist: ["Untitled Album Artist"],
            album: "Untitled Album",
            year: "0000",
            track: { no: 1, of: 0 },
            genre: ["Untitled Genre"],
            disk: { no: 1, of: 1 },
            picture: [],
            duration: 0
          };
          resolve(untitled);
        } else {
          rs.close();
          resolve(metadata);
          // console.log(metadata);
        }
      });
    });
  }
};

module.exports = ComposerUtil;
