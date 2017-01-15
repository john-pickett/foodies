var express = require('express');
var router = express.Router();

// GET users listing
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('recipes');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

// Add new user
router.post('/adduser', function(req, res) {
    var db = req.db;
    var recipe = {
      name: req.body.name,
      cuisine: req.body.cuisine,
      meats: req.body.meats,
      veggies: req.body.veggies,
      spices: req.body.spices,
      condiments: req.body.condiments,
      dry: req.body.dry,
      other: req.body.other
    };
    var collection = db.get('recipes');
    collection.insert(recipe, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

// PUT to update recipes
router.put('/updaterecipe/:id', function(req, res){
  var db = req.db;
  var collection = db.get('recipes');
  var recipeToUpdate = req.params.id;
  var doc = { $set: req.body };
  collection.update({ '_id': recipeToUpdate }, doc, function(err){
    res.send((err === null) ? {msg: '' } : { msg:'error: ' + err });
  });
});


// DELETE to deleteuser
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('recipes');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
