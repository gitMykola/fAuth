var express = require('express'),
    router = express.Router(),
    model = 'users',
    auth = require('../service/auth');


/* GET users listing. */
router.get('/api/', auth, function(req, res) {
    var collection = req.db.get(model);
    collection.find({},function(err,users){
      res.json(users);
    });
});
router.get('/api/:id', auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.find({'_id':userId},function(err,user){
      res.json(user);
    });
});
router.post('/api/', auth, function(req, res) {
    var collection = req.db.get(model);
    collection.insert(req.body,function(err,user){
        res.json(user);
    });
});
router.put('/api/:id', auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.update({'_id': userId},req.body,function(err,user){
        res.json(user);
    });
});
router.delete('/api/:id', auth, function(req, res) {
    var collection = req.db.get(model);
    var userId = req.params.id;
    collection.remove({'_id':userId},function(err){
        res.json(err);
    });
});

module.exports = router;
