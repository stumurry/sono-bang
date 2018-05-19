process.env.NODE_ENV = "test";

var { expect, assert } = require("chai");
var ComposerService = require("../services/ComposerService");
const db = require("../db/models");

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
  describe("as a composer I should be able to edit my playlist", function() {
    // var songId = 0;
    // var composerId = 0;
    // var playlistId = 0;

    var composer = null;
    var playlist = null;
    var song = null;

    after(function(done) {
      console.log("Cleaning up database...");
      // Cleanup.  Delete added test records if any tests fail.

      // ** Note **
      // Be careful of order here.  If you try and remove a record from Mysql
      // that has a foreign key relationship,
      // then a `Foreign Key Violation` will happen and your application will blow up.
      if (song) {
        ComposerService.RemoveSong(this.song);
      }
      if (playlist) {
        ComposerService.RemovePlaylist(this.playlist);
      }
      if (composer) {
        ComposerService.RemoveComposer(this.composer);
      }

      done();
    });

    // ** done() ** - Wait for database operation to finish
    it("should be able to create a composer", function(done) {
      var _this = this;
      _this.composer = db.composers.build({
        name: "Stu",
        description:
          "A music song writer specializing in motion picture themes."
      });
      ComposerService.CreateComposer(_this.composer)
        .then(resp => {
          _this.composer = resp; // Store later for other tests
          done();
        })
        .catch(err => {
          console.log(err);
          assert.fail({ message: err });
          done();
        });
    });

    it("should be able to create a playlist", function(done) {
      var _this = this;

      var playlist = {
        name: "Stu's custom playlist# 1",
        description: "A playlist I designed for an upcoming movie."
      };
      ComposerService.CreatePlayList(_this.composer, playlist)
        .then(resp => {
          _this.playlist = resp; // Store later for other tests
          done();
        })
        .catch(err => {
          console.log(err);
          assert.fail({ message: err });
          done();
        });
    });

    it("should be able to add song to playlist", function(done) {
      var _this = this;

      var song = {
        name: "Stu's heart will go on.",
        location: "aws://asvasdf/file.jpg",
        description: "Stu's imaginary one hit wonder."
      };

      ComposerService.AddSongToPlayList(_this.playlist, song)
        .then(resp => {
          _this.song = resp; // Store later for other tests
          done();
        })
        .catch(err => {
          console.log(err);
          assert.fail({ message: err });
          done();
        });
    });

    it("should be able to list songs in a playlist", function(done) {
      var _this = this;
      var resp = ComposerService.ListSongsInPlayList(_this.playlist)
        .then(resp => {

          console.log('resp');
          console.log(resp);
          // Songs should have references to boh playlist and composer
          var list = resp.filter(
            x => x.playlist_id == _this.playlist.id
          );
          console.log(list);
          expect(list.length).is.greaterThan(
            0,
            "Intended playlist should have one record in it. Songs should have references to boh playlist and composer."
          );

          done();
        })
        .catch(err => {
          console.log(err);
          assert.fail({ message: err });
          done();
        });
    });

    it("should be able to remove song from playlist", function(done) {
      var _this = this;
      var resp = ComposerService.RemoveSongFromPlayList(
        _this.composer,
        _this.song
      )
        .then(resp => {
          done();
        })
        .catch(err => {
          assert.fail({ message: err });
          console.log(err);
          done();
        });
    });
  });
});
