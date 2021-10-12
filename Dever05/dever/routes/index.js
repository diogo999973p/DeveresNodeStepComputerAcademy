var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/quartos', function(req, res, next) {
  res.render('quartos');
});

router.get('/reservas', function(req, res, next) {
  res.render('reservas');
});

module.exports = router;
