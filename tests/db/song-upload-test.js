process.env.NODE_ENV = "test";

var { expect, assert } = require("chai");
var ComposerService = require("../../services/ComposerService");
const db = require("../../db/models");

describe("/composer", function() {
  var _this = this;
  // Need to connect before executing queries
  before(function() {
    // customerService.Connect();
  });

  after(function() {
    // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
    // Disconnect before killing thread.
    ComposerService.Disconnect();
  });

  async function CleanUp(song, playlist, composer) {
    console.log("cleaning up...");
    if (song) {
      console.log("remove song");
      await ComposerService.RemoveSong(song);
    }
    if (playlist) {
      console.log("remove playlist");
      await ComposerService.RemovePlaylist(playlist);
    }
    console.log(composer);
    if (composer) {
      console.log("remove composer");
      await ComposerService.RemoveComposer(composer);
    }
  }

  //https://trello.com/c/gBww47fn/21-as-a-composer-i-should-be-able-to-edit-my-playlist
  describe("song-upload-test", function() {
    // var songId = 0;
    // var composerId = 0;
    // var playlistId = 0;

    var song, playlist, composer;

    after(function(done) {
      console.log("Cleaning up database...");
      // Cleanup.  Delete added test records if any tests fail.

      // ** Note **
      // Be careful of order here.  If you try and remove a record from Mysql
      // that has a foreign key relationship,
      // then a `Foreign Key Violation` will happen and your application will blow up.

      CleanUp(song, playlist, composer).then(() => done());

    });

    it("should be able to add song to playlist", function(done) {

      // Execute as a promise
      AddSongToPlaylist().then(d => {
        composer = d.composer;
        playlist = d.playlist;
        song = d.song;

        done();
      });
      
    });

    // async/await are not supported by Mocha.  
    // Need to place into another method, then execute it as a promise.
    async function AddSongToPlaylist() {
      console.log("Test Song Upload");

      var s, p, c;

      var testComposer = {
        name: "Test Composer - Delete Me",
        description:
          "A music song writer specializing in motion picture themes."
      };

      c = await ComposerService.CreateComposer(testComposer);
      console.log(c);

      var testplaylist = {
        name: "Test PlayList - Delete Me",
        description: "A playlist I designed for an upcoming movie."
      };

      p = await ComposerService.CreatePlayList(
        c,
        testplaylist
      );

      var testsong = {
        name: "Stu's heart will go on.",
        location: "aws://asvasdf/file.jpg",
        description: "Stu's imaginary one hit wonder."
      };

      s = await ComposerService.AddSongToPlayList(
        p,
        testsong
      );

      return { song: s, playlist: p, composer: c }
    }

      
  });
});
