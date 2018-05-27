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
  describe("as a composer", function() {
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
      var promiseChain = [];
      if (song) {
        promiseChain.push(ComposerService.RemoveSong(song));
      }
      if (playlist) {
        promiseChain.push(ComposerService.RemovePlaylist(playlist));
      }
      if (composer) {
        promiseChain.push(ComposerService.RemoveComposer(composer));
      }

      ExecutePromiseChain()
        .then(_ => done())
        .catch(_ => done()); // don't care about any exceptions on cleanup stage.
    });

    async function ExecutePromiseChain(chain) {
      chain.forEach(async p => {
        await p;
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
        .catch(_ => done(_));
    });

    it("should be able to create a playlist", function(done) {
      var testplaylist = {
        name: "Stu's custom playlist# 1",
        description: "A playlist I designed for an upcoming movie."
      };
      ComposerService.CreatePlayList(composer, testplaylist)
        .then(p => (playlist = p))
        .then(_ => done())
        .catch(_ => done(_));
    });

    it("should be able to add song to playlist", function(done) {
      var testsong = {
        name: "Stu's heart will go on.",
        location: "aws://asvasdf/file.jpg",
        description: "Stu's imaginary one hit wonder."
      };

      ComposerService.AddSongToPlayList(playlist, testsong)
        .then(s => song = s)
        .then(_ => done())
        .catch(_ => done(_));
    });

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
