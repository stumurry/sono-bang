var express = require('express');
var router = express.Router();
var validator = require('validator');

var Composer = require('../services/ComposerService')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});

// Simpl upload test via form to AWS.  Not to be used in production.
router.post('/', function(req, res, next) {

  let sampleFile = req.files;
  console.log(sampleFile);
  res.send('File uploaded!');
});

module.exports = router;