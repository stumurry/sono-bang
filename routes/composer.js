const express = require("express");
const router = express.Router();
const validator = require("validator");

const composerService = require("../services/ComposerService");
const composerUtil = require("../utils/ComposerUtil");
const uuid = require("uuid");

const keys = require("../keys");

// Display Composer's landing page
router.get("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    k = composerUtil.decrypt(id);

    if (!k.composer.ispaid) {
      res.redirect("/composer/pricing/" + id);
    }

    var playlists = await composerService.ListPlayLists(k.composer);
    var songs = await composerService.ListSongsByComposer(k.composer);
    console.log("songs");
    console.log(songs);

    return res.render("composer", {
      key: id,
      playlists: playlists,
      songs: songs
    });

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
  try {
    var _ = composerUtil.decrypt(req.body.key);
    var song = {
      name: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      fileName: req.files.mp3file.name,
      bucket: keys.aws.BUCKET,
      composer_id: _.composer.id,
      // Salt Key with a GUID to prevent key name collisions for like files.
      key: _.composer.id + "-" + uuid.v4() + "-" + req.files.mp3file.name
    };

    console.log("req.files");
    console.log(req.files.mp3file);
    await composerService.AddSongToComposer(
      song,
      req.files.mp3file.data // Provide reference stream, not the actual content of the file.
    );

    res.redirect("/composer/" + req.body.key);
  } catch (ex) {
    console.log("Exception Uploading");
    console.log(ex);
    return res.redirect("/composer/" + req.body.key + "?playlisterror=true");
  }
});

router.delete("/song/:id", async (req, res, next) => {
  console.log('deleting song...')
  try {
    var id = req.params.id;
    var _ = composerUtil.decrypt(req.query.key);

    res.setHeader('Content-Type', 'application/json');
  
    try {
      await composerService.RemoveSong({ id: id });
      res.status(200).send(JSON.stringify({ success : true }, null, 3));
      // return res.redirect("/composer/" + id);
    } catch (ex) {
      res.status(400).send(JSON.stringify({ error : 'Unable to remove song.' }, null, 3));
      // return res.redirect("/composer/" + id + "?err=UNABLE_TO_DELETE_SONG");
    }
  } catch (ex) {
    console.log(ex);
    console.log("redirecting to login");
    return res.status(401).send({ error: 'Unauthenticated' });
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