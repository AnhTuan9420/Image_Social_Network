var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  const { msg } = req.query;
  res.render('register', {err: msg});
});

router.get('/Terms_Conditions', function(req, res, next) {
  res.render('Terms_Conditions');
});


module.exports = router;
