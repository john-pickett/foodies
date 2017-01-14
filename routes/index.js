var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipes' });
});

/* GET New Recipe page. */
router.get('/newrecipe', function(req, res, next) {
  res.render('newrecipe', { title: 'Add New Recipes' });
});

module.exports = router;
