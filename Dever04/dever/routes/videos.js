var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('videos', { title: 'VIDEOS LINKS' });
});

module.exports = router;