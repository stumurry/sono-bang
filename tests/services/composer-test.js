var {
  composerService,
  chai,
  app,
  expect,
  path,
  amazonService,
  uuid,
  composerUtil,
  keys
} = require("../common");

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
    var bucket = "sonobang-test";
    var fName = "./tests/data/Haydn_Cello_Concerto_D-1.mp3";

    var testplaylist = {
      name: "Stu's custom playlist# 1",
      description: "A playlist I designed for a potential producer."
    };

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
        email: "stu@sss.com",
        homepage: "http://helloworld.com"
      };

      composerService
        .CreateComposer(c)
        .then(cc => ((composer = cc.composer), (user = cc.user)))
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
      // console.log('dbcomposer');
      // console.log(composer);
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(composer.name).to.equal(c.name, "name" + errorMsg);
      expect(composer.description).to.equal(
        c.description,
        "description" + errorMsg
      );
      expect(composer.homepage).to.equal(c.homepage, "homepage" + errorMsg);
      expect(composer.user_id).is.greaterThan(
        0,
        "Composer's user_id should be greater than 0"
      );
    }

    it("should be able to create a playlist", function(done) {
      composerService
        .CreatePlayList(composer, testplaylist)
        .then(p => {
          testDBPlaylist(p, testplaylist);
          playlist = p;
          return p; // make available for other promise chain
        })
        // .then(async p => console.log(await amazonService.ListFiles(bucket, "" + p.id)))
        .then(_ => done())
        .catch(_ => done(_));
    });
    async function testDBPlaylist(playlist, p) {
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(playlist.name).to.equal(p.name, "name" + errorMsg);
      expect(playlist.description).to.equal(
        p.description,
        "description" + errorMsg
      );
      expect(playlist.genre).to.equal(p.genre, "genre" + errorMsg);
    }

    // When a user drags and drops a song onto the screen.  This file should be added to songlist.
    it("should be able to add song to composer", function(done) {
      // S3 buckets offers only a `prefix` attribute for seaching.
      // S3 limits the number of buckets you can create and uses a Global Namespace.
      // We need a way to tie this file to a database entry.
      AddSong(composer)
        .then(s => (song = s)) // if s is not returned, it will not be available for other `then()` chains
        .then(async _ => testDBProperties(song, await GetSongInfo()))
        // .then(_ => testKeyNomenclature(testsong, salt))
        // .then(_ => console.log(song))
        .then(_ => amazonService.DeleteFile("sonobang-test", song.key)) // Done uploading, now delete it.
        .then(_ => done())
        .catch(_ => done(_)); // Signal Mocha that this unit of work is complete and pass exception so it can fail the test.
    });

    async function GetSongInfo() {
      
      // var fName = "./tests/data/airborne.mp3";

      return await composerUtil.GetSongInformation(fName, composer);
    }

    async function AddSong(composer) {
      var testsong = await GetSongInfo();
      return await composerService.AddSongToComposer(testsong, fName);
    }

    function testDBProperties(song, testsong) {
      // console.log(song)
      // To Do: Use sprintf or string.format() implementation late when time permits like found in C#
      var errorMsg =
        " property not found. Use Sequelize CLI to create a new migration and insert this field.";
      expect(song.name).to.equal(testsong.name, "name" + errorMsg);
      // expect(song.key).to.equal(testsong.key, "key" + errorMsg);
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

    it("should be able to list songs by composer", function(done) {
      var hasException = false;
      composerService
        .ListSongsByComposer(composer)
        .then(songs => {
          // Songs should have references to boh playlist and composer
          var list = songs.filter(x => x.composer_id == composer.id);
          expect(list.length).is.greaterThan(
            0,
            "Intended song list should have one record in it. Songs should have reference a composer."
          );
        })
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to add and remove a song from a playlist", function(done) {
      composerService
        .AddSongToPlaylist(song, playlist)
        .then(async _ => await composerService.ListSongsInPlayList(playlist))
        // .then(_ => {
        //   console.log("Listing Songs in Playlist");
        //   console.log(_);
        //   return _;
        // })
        .then(_ =>
          expect(_.length).is.greaterThan(
            0,
            "Intended playlist should have one song in it."
          )
        )
        .then(
          async _ =>
            await composerService.RemoveSongFromPlaylist(song, playlist)
        )
        .then(async _ => await composerService.ListSongsInPlayList(playlist))
        .then(_ =>
          expect(_.length).is.eq(0, "Intended playlist should no songs in it.")
        )
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to remove song", function(done) {
      composerService
        .RemoveSong(song)
        .then(_ => composerService.ListPlaylistReferencesBySong(song)) // Are song_id's hanging around the playlistsongs reference table?
        // .then(_ => { console.log('playlist references'); console.log(_); return _ } )
        .then(_ =>
          expect(_.length).is.eq(
            0,
            "Playlist Song reference table still shows a reference to this song.  It must be removed."
          )
        )
        .then(_ => (song = null))
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to remove a playlist", function(done) {
      composerService
        .RemovePlaylist(playlist)
        .then(_ => composerService.ListPlaylistReferencesByPlaylist(playlist)) // Are song_id's hanging around the playlistsongs reference table?
        .then(_ =>
          expect(_.length).is.eq(
            0,
            "Playlist Song reference table still shows a reference to this playlist.  It must be removed."
          )
        )
        .then(_ => (playlist = null))
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to remove composer", function(done) {
      composerService.CreatePlayList(composer, testplaylist)
        .then(_ => (playlist = _))
        .then(async _ => await AddSong(composer))
        .then(_ => (song = _))
        .then(async _ => await composerService.ListSongsByComposer(composer))
        // Delete Cascade should remove joining songs and playlists
        .then(async _ => await composerService.RemoveComposer(composer)) 
        .then(async _ => await composerService.ListSongsByComposer(composer))
        .then(_ =>
          expect(_.length).is.eq(
            0,
            "There should be no songs associated with this composer.  They must be removed."
          )
        )
        .then(async _ => await composerService.ListPlayLists(composer))
        .then(_ => { console.log('list playlists'); console.log(_); return _ } )
        .then(_ =>
          expect(_.length).is.eq(
            0,
            "There should be no playlists associated with this composer.  They must be removed."
          )
        )
        .then(async _ => await amazonService.ListFiles(bucket, composer.id + "-"))
        // .then(_ => { console.log('amazon files'); console.log(_); return _ } )
        .then(_ =>
          expect(_.length).is.eq(
            0,
            "There should be no AWS files associated with this composer.  They must be removed."
          )
        )
        .then(_ => ((playlist = null), (composer = null), (user = null)))
        .then(_ => done())
        .catch(_ => done(_));
    });
  });
});
