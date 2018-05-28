process.env.NODE_ENV = "test";

var { expect, assert } = require("chai");
var ComposerService = require("../services/ComposerService");
var AmazonService = require("../services/AmazonService");
const db = require("../db/models");
var uuid = require("node-uuid");
const path = require('path');
const fs = require("fs");

describe("/composer", function() {
  // Need to connect before executing queries
  before(function() {
    // customerService.Connect();
  });

  after(function() {
    // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
    // Disconnect before killing thread.
    ComposerService.Disconnect();
  });

  //https://trello.com/c/gBww47fn/21-as-a-composer-i-should-be-able-to-edit-my-playlist
  describe("as a composer", function() {
    var composer = null;
    var playlist = null;
    var song = null;
    // var S3Object = { Bucket: "sonobang-test", Key: f.Key };
    var S3Object = null;

    after(function(done) {
      console.log("Cleaning up database...");
      // Cleanup.  Delete added test records if any tests fail.

      // ** Note **
      // Be careful of order here.  If you try and remove a record from Mysql
      // that has a foreign key relationship,
      // then a `Foreign Key Violation` will happen and your application will blow up.
      var promiseChain = [];
      if (S3Object) {
        promiseChain.push(AmazonService.DeleteFile(S3Object));
      }
      if (song) {
        promiseChain.push(ComposerService.RemoveSong(song));
      }
      if (playlist) {
        promiseChain.push(ComposerService.RemovePlaylist(playlist));
      }
      if (composer) {
        promiseChain.push(ComposerService.RemoveComposer(composer));
      }

      ExecutePromiseChain(promiseChain).then(_ => done()); // Signal Mocha to wait for promise chain to finish before disconnecting database.
    });

    // Sequentially exeute promises in the order they were inserted ignoring exceptions
    async function ExecutePromiseChain(chain) {
      chain.forEach(async p => {
        try {
          await p;
        } catch (ex) {
          console.log("Ignoring this Exception on cleanup:");
          // Ignore exceptions
          console.log(ex);
        }
      });
    }

    // ** done() ** - Wait for database operation to finish
    it("should be able to create a composer", function(done) {
      var c = {
        name: "Test Composer",
        description:
          "A music song writer specializing in motion picture themes."
      };

      ComposerService.CreateComposer(c)
        .then(cc => (composer = cc))
        .then(_ => done())
        .catch(_ => done(_)); // Alert Mocha to fail test upon thrown exceptions
    });

    it("should be able to create a playlist", function(done) {
      var testplaylist = {
        name: "Stu's custom playlist# 1",
        description: "A playlist I designed for a potential producer."
      };
      ComposerService.CreatePlayList(composer, testplaylist)
        .then(p => (playlist = p))
        .then(console.log("creating playlist"))
        .then(async p => console.log(await AmazonService.ListFiles("" + p.id)))
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to add song to playlist", function(done) {

      var fName = "./tests/data/Haydn_Cello_Concerto_D-1.mp3";

      var fileName = path.basename(fName);

      // Salt Key with a GUID to prevent key name collisions for like files.
      var salt = uuid.v4();

      // Form Data supplied by Composer
      var testsong = {
        name: "HAYDN \"CONCERTO D-MAJOR\"",
        fileName: fileName,
        bucket: "sonobang-test", // bucket name
        description: "REINER HOCHMUTH CELLIST"
      };

      // S3 buckets offers only a `prefix` attribute for seaching.
      // S3 limits the number of buckets you can create and uses a Global Namespace.
      // We need a way to tie this file to a database entry.
      ComposerService.AddSongToPlayList(
        salt,
        composer,
        playlist,
        testsong,
        fName
      )
        .then(s => (song = s))
        .then(s => testDBProperties(s, testsong))
        .then(s => testKeyNomenclature(testsong, salt))
        .then(_ => done())
        .catch(_ => done(_)); // Signal Mocha that this unit of work is complete and pass exception so it can fail the test.
    });

    function testDBProperties(song, testsong) {
      // console.log(song)
      // To Do: Use sprintf or string.format() implementation late when time permits like found in C#
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(song.name).to.equal(testsong.name, "name" + errorMsg);
      expect(song.key).to.equal(testsong.key, "key" + errorMsg);
      expect(song.fileName).to.equal(testsong.fileName, "fileName" + errorMsg);
      expect(song.bucket).to.equal(testsong.bucket, "bucket" + errorMsg);
      expect(song.description).to.equal(
        testsong.description,
        "description" + errorMsg
      );

      // cd bin
      // ../node_modules/.bin/sequelize migration:create --name songs

      // Be sure to add new fields to db/models/songs.js
    }

    async function testKeyNomenclature(testsong, salt) {
      var prefix = "" + playlist.id;

      // ** Example Filename(Key) **
      // <PLAYLIST_ID>-<COMPOSER_ID>-<SALT>-<FILENAME>.<EXT>
      var key =
        prefix + "-" + composer.id + "-" + salt + "-" + testsong.fileName;
      console.log("testKeyNomenclature");
      console.log(key);
      var files = await AmazonService.ListFiles(prefix);

      console.log(files["Contents"]);

      expect(files["Contents"][0]).to.include(
        { Key: key },
        "Filename(Key) not found in S3 Bucket"
      );
    }

    it("should be able to list songs in a playlist", function(done) {
      var hasException = false;
      ComposerService.ListSongsInPlayList(playlist)
        .then(songs => {
          // Songs should have references to boh playlist and composer
          var list = songs.filter(x => x.playlist_id == playlist.id);
          expect(list.length).is.greaterThan(
            0,
            "Intended playlist should have one record in it. Songs should have references to both playlist and composer."
          );
        })
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to remove song from playlist", function(done) {
      ComposerService.RemoveSong(song)
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});
