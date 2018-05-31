var { composerService, chai, app, expect, path, amazonService, uuid } = require("../common");

describe("/composer", function() {
  // Need to connect before executing queries
  before(function() {
    // customerService.Connect();
  });

  after(function() {
    // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
    // Disconnect before killing thread.
    composerService.Disconnect();
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
        promiseChain.push(amazonService.DeleteFile(S3Object));
      }
      if (song) {
        promiseChain.push(composerService.RemoveSong(song));
      }
      if (playlist) {
        promiseChain.push(composerService.RemovePlaylist(playlist));
      }
      if (composer) {
        promiseChain.push(composerService.RemoveComposer(composer));
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
          "A music song writer specializing in motion picture themes.",
        username: "stu",
        password: "stu", // test using HMAC encryption later.
        email : "stu@sss.com",
        homepage : 'http://helloworld.com'
      };

      composerService.CreateComposer(c)
        .then(cc => (composer = cc.composer, user = cc.user))
        .then(_ => testDBUser(user, c))
        .then(_ => testDBComposer(composer, c))
        .then(_ => done())
        .catch(_ => done(_)); // Alert Mocha to fail test upon thrown exceptions
    });

    async function testDBUser(user, testuser) {
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(user.name).to.equal(testuser.name, "name" + errorMsg);
      expect(user.password).to.equal(testuser.password, "password" + errorMsg);
      expect(user.username).to.equal(testuser.username, "username" + errorMsg);
      expect(user.email).to.equal(testuser.email, "email" + errorMsg);
    }
    async function testDBComposer(composer, c) {
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(composer.name).to.equal(composer.name, "name" + errorMsg);
      expect(composer.description).to.equal(composer.description, "description" + errorMsg);
      expect(composer.homepage).to.equal(composer.homepage, "homepage" + errorMsg);
      expect(composer.user_id).is.greaterThan(0, "Composer's user_id should be greater than 0");
    }

    it("should be able to create a playlist", function(done) {
      var testplaylist = {
        name: "Stu's custom playlist# 1",
        description: "A playlist I designed for a potential producer."
      };
      composerService.CreatePlayList(composer, testplaylist)
        .then(p => (playlist = p))
        .then(console.log("creating playlist"))
        .then(async p => console.log(await amazonService.ListFiles("" + p.id)))
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
        name: 'HAYDN "CONCERTO D-MAJOR"',
        fileName: fileName,
        bucket: "sonobang-test", // bucket name
        description: "REINER HOCHMUTH CELLIST"
      };

      // S3 buckets offers only a `prefix` attribute for seaching.
      // S3 limits the number of buckets you can create and uses a Global Namespace.
      // We need a way to tie this file to a database entry.
      composerService.AddSongToPlayList(
        salt,
        composer,
        playlist,
        testsong,
        fName
      )
        .then(s => (song = s)) // if s is not returned, it will not be available for other `then()` chains
        .then(_ => testDBProperties(song, testsong))
        .then(_ => testKeyNomenclature(testsong, salt))
        .then(_ => console.log(song))
        .then(_ => amazonService.DeleteFile(song.key)) // Done uploading, now delete it.
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
      var files = await amazonService.ListFiles(prefix);

      console.log(files["Contents"]);

      expect(files["Contents"][0]).to.include(
        { Key: key },
        "Filename(Key) not found in S3 Bucket"
      );
    }

    it("should be able to list songs in a playlist", function(done) {
      var hasException = false;
      composerService.ListSongsInPlayList(playlist)
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
      composerService.RemoveSong(song)
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});
