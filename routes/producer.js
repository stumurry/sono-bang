var express = require('express');
var router = express.Router();
var validator = require('validator');
var composerUtil = require('../utils/ComposerUtil')
var producerService = require('../services/ProducerService')
var Composer = require('../services/ComposerService')

router.get('/', async (req, res, next) => {
    console.log("Getting producer...");
  try {
    
    var key = req.query.key;
    var _ = composerUtil.decrypt(key);

    try {
  
      var songs = await producerService.GetSongsByPlaylist(_.playlist);

      var playlist = {
          email : _.user.email,
          name : _.playlist.name,
          songs : songs,
      }

      console.log('Return Playlist');
      console.log(playlist);
      return res.render("producer", playlist);

    } catch (ex) {
      console.log(ex);
      return res.redirect("/producer/missingplaylist/");
    }
  } catch (ex) {
    console.log("UnAuthenticated");
    console.log(ex);
    return res.status(401).send({ error: "Unauthenticated" });
  }
});


module.exports = router;