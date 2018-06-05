const express = require("express");
const router = express.Router();

const validator = require("validator");

const composerService = require("../services/ComposerService");
const composerUtil = require("../utils/ComposerUtil");
const uuid = require("uuid");
const fs = require("fs");

const keys = require("../keys");

var formidable = require("formidable");
var mm = require("musicmetadata");

router.get("/song-upload/", async (req, res, next) => {
  return res.render("song-upload", { key: req.query.key });
});

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
    // console.log("songs");
    // console.log(songs);

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

router.post("/song", async (req, res, next) => {
  var form = new formidable.IncomingForm();

  // console.log(form);

  form.parse(req, (err, fields, files) => {
    var ffff = files["files[]"];
    ProcessFileUploadForm(req, fields, files, ffff)
    .then(s => {
      return res.status(200).send({ success : true });
    })
    .catch(ex => {
      console.log('Ooops, something happened.');
      console.log(ex);
      return res.status(200).send({ error : true, exception : ex });
    });
  });

});

async function ProcessFileUploadForm(req, fields, files, ffff) {

  console.log('ffff');
  console.log(files);

  var _ = composerUtil.decrypt(fields.key);

  var meta = await GetFileMetaData(ffff.path);

  var keyTitle = str = meta.title.replace(/\s/g, '');

  console.log(meta);
  var song = {
    name: meta.title,
    description: fields.artist ? fields.artist[0] : '',
    genre: fields.genre ? fields.genre[0] : '',
    fileName: ffff.name,
    bucket: keys.aws.BUCKET,
    composer_id: _.composer.id,
    // Salt Key with a GUID to prevent key name collisions for like files.
    key: _.composer.id + "-" + uuid.v4() + "-" + keyTitle + '.mp3'
  };

  console.log('song');
  console.log(song);


  await composerService.AddSongToComposer(
    song,
    ffff.path,
  );

  // res.redirect("/composer/" + req.body.key);
  
}

function GetFileMetaData(path) {
  return new Promise((resolve, reject) => {
    // var stats = fs.statSync(fObject.path);
    
    var rs = fs.createReadStream(path);

    var parser = mm(rs, function(err, metadata) {
      if (err) {
        rs.close();
        reject(err);
        console.log(err);
      } else {
        rs.close();
        resolve(metadata);
        console.log(metadata);
      }
    });
  });
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
