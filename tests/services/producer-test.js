// var {
//   composerService,
//   producerService,
//   chai,
//   app,
//   expect,
//   path,
//   uuid
// } = require("../common");

// describe("/producer", function() {
//   var testComposer = {
//     name: "Test Composer",
//     description: "A music song writer specializing in motion picture themes.",
//     username: "stu",
//     password: "stu", // test using HMAC encryption later.
//     email: "stu@sss.com",
//     homepage: "http://helloworld.com"
//   };

//   var testplaylist = {
//     name: "Stu's custom playlist# 1",
//     description: "A playlist I designed for a potential producer."
//   };

//   // Need to connect before executing queries
//   before(function(done) {
//     composerService
//       .CreateComposer(testComposer)
//       // .then(_ => { console.log(_); return _})
//       .then(_ => (composer = _.composer, user = _.user))
//       .then(console.log("composer"))
//       .then(console.log(composer))
//       .then(async _ => await composerService.AddSongToComposer(composer, fName))
//       .then(_ => (song = _))
//       .then(console.log("song"))
//       .then(console.log(song))
//       .then(
//         async _ => await composerService.CreatePlayList(composer, testplaylist)
//       )
//       .then(_ => (playlist = _))
//       .then(console.log("playlist"))
//       .then(console.log(playlist))
//       .then(_ => done())
//       .catch(_ => done(_));
//   });

//   after(function(done) {
//     // ** Test Purposes only **  Locked connection with Mysql will cause unit tests to hang.
//     // Disconnect before killing thread.

//     composerService
//       .RemovePlaylist(playlist)
//       .then(async _ => await composerService.RemoveSong(song))
//       .then(async _ => await composerService.RemovePlaylist(playlist))
//       .then(async _ => await composerService.RemoveComposer(composer))
//       .then(async _ => await producerService.Disconnect())
//       .then(_ => done())
//       .catch(_ => done(_));
//   });

//   describe("as a producer", function() {
//     it("should be able view a composer's playlist", function(done) {
//       done();
//     });
//   });
// });
