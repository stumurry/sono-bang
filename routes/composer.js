var express = require("express");
var router = express.Router();
var validator = require("validator");

var composerService = require("../services/ComposerService");
var composerUtil = require("../utils/ComposerUtil");

router.get("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    k = composerUtil.decrypt(id);

    if (!k.composer.ispaid) {
      res.redirect("/composer/pricing/" + id);
    }
    var playlists = await composerService.ListPlayLists(k.composer);
    var songs = await composerService.ListSongsByComposer(k.composer);
    return res.render("composer", {
      key: id,
      playlists: playlists,
      songs: songs
    });
  } catch (ex) {
    console.log("Error getting composers");
    console.log(ex);
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});

router.get("/", function(req, res, next) {
  return res.redirect("/me/login");
});

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
  try {
    var _ = composerUtil.decrypt(req.body.key);
    var song = {
      name: req.body.name,
      genre: req.body.genre,
      fileName: req.files.mp3file.name
    };
    await composerService.AddSongToComposer(
      _.composer,
      song,
      req.files.mp3file.data
    );

    res.redirect("/composer/" + req.body.key);
  } catch (ex) {
    console.log("Exception Uploading");
    console.log(ex);
    return res.redirect("/composer/" + req.body.key + "?playlisterror=true");
  }
});

router.get('/pricing/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    k = composerUtil.decrypt(id);

    return res.render('composer-pricing', { key : id });
    
  } catch (ex) {
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});

router.post('/pricing', async (req, res, next) => {
  try {
    var key = req.body.key;
    k = composerUtil.decrypt(key);
    try {
      var updatedKey = await composerService.UpdatePayment(k.composer);
      return res.render('thank-you', { key : updatedKey });
    } catch(ex) {
      console.log('Error updating payment information.');
      console.log(ex);
      return res.render('composer-pricing', { key : key, error : 'Unable to update payment information.  Please contact Sonobang for more details.' });
    }

  } catch (ex) {
    console.log(ex);
    console.log("redirecting to login");
    return res.redirect("/me/login");
  }
});


module.exports = router;
