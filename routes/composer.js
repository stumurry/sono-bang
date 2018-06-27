const express = require("express");
const router = express.Router();

const validator = require("validator");

const composerService = require("../services/ComposerService");
const composerUtil = require("../utils/ComposerUtil");
const uuid = require("uuid");
const fs = require("fs");

const keys = require("../keys");

var formidable = require("formidable");

router.get("/thankyou", async (req, res, next) => {
   res.render("thank-you", {key : req.query.key, confirmation: req.query.paymentId });
});


router.get("/song-upload/", async (req, res, next) => {
  return res.render("song-upload", { key: req.query.key });
});

// Display Composer's landing page
router.get("/:key", async (req, res, next) => {
  try {
    var key = req.params.key;
    k = composerUtil.decrypt(key);
    if (!k.composer.ispaid) {
      res.redirect("/composer/pricing/" + key);
    }

    var playlists = await composerService.ListPlayLists(k.composer);

    var playlistwithsongs = [];
    for (var ppp in playlists) {
      var inplaylist = playlists[ppp].dataValues;

      // allow anyone with this key to see the playlist
      inplaylist.publickey = composerUtil.encrypt({ playlist: inplaylist, user : k.user });

      var songs = await composerService.ListSongsInPlayList(inplaylist);
      console.log('length');
      console.log(songs.length);
      
      var playlistSongs = songs.map(d => {
        var a = d.dataValues;
        a.playlistId = inplaylist.id;

        return a;
        
      })

      inplaylist.songs = playlistSongs;
      playlistwithsongs.push(inplaylist);
    }
   

    console.log('playlistwithsongs');
    console.log(playlistwithsongs);

    var songs = await composerService.ListSongsByComposer(k.composer);

    return res.render("composer", {
      key: key,
      playlists: playlistwithsongs,
      songs: songs
    });
  } catch (ex) {
    console.log("Oops, authentication failed.");
    console.log(ex);
    return res.redirect("/me/login");
  }
});

// Add song to playlist
router.post("/playlist-songs", async (req, res, next) => {
  // We need two try/catch blocks because authentication takes first priority.  Next comes business logic.
  try {
    var key = req.body.key;
    var songId = req.body["song-id"];

    k = composerUtil.decrypt(key);

    try {
      // Dealing with checkboxes here.  playlist-2 means playlist with id of 2
      var playListIds = Object.keys(req.body)
        .filter(_ => _.startsWith("playlist-"))
        .map(_ => _.replace("playlist-", ""))
        .map(_ => parseInt(_));

      playListIds.forEach(
        async playlist_id =>
          await composerService.AddSongToPlaylist(
            { id: songId },
            { id: playlist_id }
          )
      );

      res.redirect("/composer/" + key);
    } catch (ex) {
      console.log("ouch");
      console.log(ex);
      // res
      //   .status(400)
      //   .send(
      //     JSON.stringify({ message: "Failed to add song to playlist" }, null, 3)
      //   );
      res.redirect("/composer/" + key + "?error=PlayListAddFailed");
    }
  } catch (ex) {
    console.log("oops.  Unauthenticated");
    // res.status(401).send(JSON.stringify({ message: "Unauthorized" }, null, 3));
    res.redirect("/me/login");
  }
});

// Add playlist
router.post("/playlist", (req, res, next) => {
  console.log("Posting to playlist");
  console.log(req.body);
  var _ = composerUtil.decrypt(req.body.key);
  var playlist = { name: req.body.name, genre: req.body.genre };

  return composerService
    .CreatePlayList(_.composer, playlist)
    .then(() => res.redirect("/composer/" + req.body.key))
    .catch(_ => {
      return res.redirect("/composer/" + req.body.key + "?playlisterror=true");
    });
});

// Upload song
router.post("/song", async (req, res, next) => {
  var form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    var ffff = files["files[]"];

    ProcessFileUploadForm(fields, ffff)
      .then(s => {
        return res.status(200).send({ success: true });
      })
      .catch(ex => {
        console.log("Ooops, something happened.");
        console.log(ex);
        return res.status(200).send({ error: true, exception: ex });
      });
  });
});

async function ProcessFileUploadForm(fields, ffff) {
  var _ = composerUtil.decrypt(fields.key);

  //var song = await composerUtil.GetSongInformation(ffff.path, _.composer);

  await composerService.AddSongToComposer(_.composer, ffff.path);
}

// Delete Song
router.delete("/song/:id", async (req, res, next) => {
  console.log("deleting song...");
  try {
    var id = req.params.id;
    var key = req.headers.authorization;
    var _ = composerUtil.decrypt(key);

    res.setHeader("Content-Type", "application/json");

    try {
      await composerService.RemoveSong({ id: id });
      res
        .status(200)
        .send(
          JSON.stringify({ message: "Successfully removed file." }, null, 3)
        );
      // return res.redirect("/composer/" + id);
    } catch (ex) {
      console.log(ex);
      res
        .status(400)
        .send(JSON.stringify({ error: "Unable to remove song." }, null, 3));
      // return res.redirect("/composer/" + id + "?err=UNABLE_TO_DELETE_SONG");
    }
  } catch (ex) {
    console.log("UnAuthenticated");
    console.log(ex);
    return res.status(401).send({ error: "Unauthenticated" });
  }
});

// Delete Playlist
router.delete("/playlist/:id", async (req, res, next) => {
  console.log("deleting playlist...");
  try {
    
    var key = req.headers.authorization;
    var _ = composerUtil.decrypt(key);

    res.setHeader("Content-Type", "application/json");

    try {
      var id = parseInt(req.params.id);
      await composerService.RemovePlaylist({ id: id });

      res
        .status(200)
        .send(
          JSON.stringify({ message: "Successfully removed playlist." }, null, 3)
        );
      // return res.redirect("/composer/" + id);
    } catch (ex) {
      console.log(ex);
      res
        .status(400)
        .send(JSON.stringify({ error: "Unable to remove playlist." }, null, 3));
      // return res.redirect("/composer/" + id + "?err=UNABLE_TO_DELETE_SONG");
    }
  } catch (ex) {
    console.log("UnAuthenticated");
    console.log(ex);
    return res.status(401).send({ error: "Unauthenticated" });
  }
});

// Delete Song
router.delete("/playlist/:playlistId/song/:songId", async (req, res, next) => {
  console.log("deleting playlist/ song...");
  try {
    
    var key = req.headers.authorization;
    var _ = composerUtil.decrypt(key);

    res.setHeader("Content-Type", "application/json");

    try {

      await composerService.RemoveSongFromPlaylist({ id : req.params.songId }, { id : req.params.playlistId})
      
      res
        .status(200)
        .send(
          JSON.stringify({ message: "Successfully removed playlist." }, null, 3)
        );
      // return res.redirect("/composer/" + id);
    } catch (ex) {
      console.log(ex);
      res
        .status(400)
        .send(JSON.stringify({ error: "Unable to remove playlist." }, null, 3));
      // return res.redirect("/composer/" + id + "?err=UNABLE_TO_DELETE_SONG");
    }
  } catch (ex) {
    console.log("UnAuthenticated");
    console.log(ex);
    return res.status(401).send({ error: "Unauthenticated" });
  }
});


// // view pricing page
router.get("/pricing/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    k = composerUtil.decrypt(id);

    return res.render("composer-pricing", { key: id });
  } catch (ex) {
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});

// pay the bill
router.post("/pricing", async (req, res, next) => {
  try {
    console.log(req.body)
    var key = req.body.key;
    k = composerUtil.decrypt(key);
    try {
      var updatedKey = await composerService.UpdatePayment(k.composer);
      return res.render("thank-you", { key: updatedKey });
    } catch (ex) {
      console.log("Error updating payment information.");
      console.log(ex);
      return res.render("composer-pricing", {
        key: key,
        error:
          "Unable to update payment information.  Please contact Sonobang for more details."
      });
    }
  } catch (ex) {
    console.log(ex);
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});

router.post("/paypal", async (req, res, next) => {
  console.log(req.body);

  switch(req.body.event_type) {
    case 'PAYMENT.SALE.COMPLETED':
        console.log('Payment Sale Completed...')
        
        break;
    case n:
        
        break;
    default:
        
  }


  res.setHeader("Content-Type", "application/json");
  res
        .status(200)
        .send(
          JSON.stringify({ message: "Payment Successful." }, null, 3)
        );
})

// Send playlist to email receipient
router.post("/send-playlist", async (req, res, next) => {
  try {
    var key = req.body.key;
    var link = req.body.publicKey;
    var email = req.body.email;
    k = composerUtil.decrypt(key);

    // console.log(k);

    var name = k.user.name;
    try {

      var playlistId = req.body.playlistId;

      console.log('link');
      console.log(req.body);

      var hostName = req.body.hostname;
      var port = req.body.port;
      var protocol = req.body.protocol;

      var link = '';
      if (port || port != '80') {
        link = protocol + '//' + hostName + ':' + port + '/producer/?key=' + req.body.publicKey;
      } else {
        link = protocol + '//' + hostName + '/producer/?key=' + req.body.publicKey;
      }

      console.log(link);

      await composerService.SendPlaylist(email, playlistId, name, link);

    } catch (ex) {
      console.log("Error sending email.");
      console.log(ex);
      return res.render("composer-pricing", {
        key: key,
        error:
          "Unable to update payment information.  Please contact Sonobang for more details."
      });
    }

    return res.redirect('/composer/' + key);

  } catch (ex) {
    console.log(ex);
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});

// Require login- change to bearer token within header when time persists
router.get("/", function(req, res, next) {
  return res.redirect("/me/login");
});

module.exports = router;
