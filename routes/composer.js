const express = require("express");
const router = express.Router();

const validator = require("validator");

const composerService = require("../services/ComposerService");
const composerUtil = require("../utils/ComposerUtil");
const uuid = require("uuid");
const fs = require("fs");

const keys = require("../keys");

var formidable = require("formidable");


router.get("/song-upload/", async (req, res, next) => {
  return res.render("song-upload", { key: req.query.key });
});

// Display Composer's landing page
router.get("/:key", async (req, res, next) => {
  try {
    var key =  req.params.key;
    console.log(key);
    k = composerUtil.decrypt(key);
    console.log(k);
    if (!k.composer.ispaid) {
      res.redirect("/composer/pricing/" + key);
    }

    var playlists = await composerService.ListPlayLists(k.composer);
    var songs = await composerService.ListSongsByComposer(k.composer);

    return res.render("composer", {
      key: key,
      playlists: playlists,
      songs: songs
    });
  } catch (ex) {
    console.log("Oops, authentication failed.");
    console.log(ex);
    return res.redirect("/me/login");
  }
});

// Require login- change to bearer token within header when time persists
router.get("/", function(req, res, next) {
  return res.redirect("/me/login");
});

// Add song to playlist
router.post("/playlist-songs", async (req, res, next) => {
  // We need two try/catch blocks because authentication takes first priority.  Next comes business logic.
  try {
    console.log("req.body");
    var id = req.body.key;

    console.log(req.body);
    k = composerUtil.decrypt(id);

    try {
      // Dealing with checkboxes here.  playlist-2 means playlist with id of 2
      var playListIds = Object.keys(req.body)
        .filter(_ => _.startsWith("playlist-"))
        .map(_ => _.replace("playlist-", ""))
        .map(_ => parseInt(_));

      console.log("playListIds");
      console.log(playListIds);
    } catch (ex) {
      console.log("ouch");
      console.log(ex);
      res
        .status(400)
        .send(
          JSON.stringify({ message: "Failed to add song to playlist" }, null, 3)
        );
    }
  } catch (ex) {
    console.log("oops");
    res.status(401).send(JSON.stringify({ message: "Unauthorized" }, null, 3));
  }

  var key = req.body.key;

  return res.render("composer", { key: key });
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

router.post("/song", async (req, res, next) => {
  var form = new formidable.IncomingForm();

  // console.log(form);

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

  var song = await composerUtil.GetSongInformation(ffff.path, _.composer);

  await composerService.AddSongToComposer(song, ffff.path);
  
}

router.delete("/song/:id", async (req, res, next) => {
  console.log("deleting song...");
  try {
    var id = req.params.id;
    var _ = composerUtil.decrypt(req.query.key);

    res.setHeader("Content-Type", "application/json");

    try {
      await composerService.RemoveSong({ id: id });
      res
        .status(200)
        .send(
          JSON.stringify({ message: "Successfully uploaded file." }, null, 3)
        );
      // return res.redirect("/composer/" + id);
    } catch (ex) {
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

// view pricing page
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

module.exports = router;
