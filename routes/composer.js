var express = require('express');
var router = express.Router();
var validator = require('validator');

var Composer = require('../services/ComposerService')

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    // offer back door for testing...
    if (id === 'test') {
        res.render("playlist", { });
    } else {
        res.redirect('/me/login');
    }

    
});
router.get('/', function(req, res, next) {
    res.redirect('/me/login');
});

module.exports = router;