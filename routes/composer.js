var express = require('express');
var router = express.Router();
var validator = require('validator');

var composerService = require('../services/ComposerService')
var composerUtil = require('../utils/ComposerUtil');

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    // // offer back door for testing...
    // if (id === 'test') {
    //     res.render("playlist", { });
    // } else {
    //     res.redirect('/me/login');
    // }
    var composer = composerUtil.decrypt(id);
    console.log(composer);

    res.render('composer', { key : id });


});
router.get('/', function(req, res, next) {
    res.redirect('/me/login');
});

router.post('/playlist', (req, res, next) => {
    var _ = composerUtil.decrypt(req.body.key);
    var playlist = { name: req.body.name };
    composerService.CreatePlayList(_.composer, playlist)
    res.redirect('/composer/' + req.body.key);
});

module.exports = router;