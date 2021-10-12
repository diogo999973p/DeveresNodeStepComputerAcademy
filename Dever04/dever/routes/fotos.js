var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fotos', { title: 'PHOTOS LINKS' });
});

module.exports = router;