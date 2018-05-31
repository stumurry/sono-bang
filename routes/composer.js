var express = require('express');
var router = express.Router();
var validator = require('validator');

var Composer = require('../services/ComposerService')

router.get('/', function(req, res, next) {
    res.redirect('/me/login');
});

module.exports = router;