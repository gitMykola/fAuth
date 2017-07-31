var express = require('express'),
    auth = require('../service/auth'),
    router = express.Router(),
    model = 'markers';

/* GET users listing. */
router.get('/api/:id', auth, function(req, res) {
    var collection = req.db.get(model);
    collection.find({'author': req.params.id},function(err,markers){
        res.json(markers);
    });
});
router.post('/api', auth, function(req, res) {
    var collection = req.db.get(model);
    console.dir(req.body);
    collection.findOne({'author': req.body.author},function(err,result) {
        if (result !== null && result._id !== undefined)
        {
            //req.body._id = result._id;
            console.log(req.body);
            collection.update({'_id': result._id},req.body,eFunk);
        }else collection.insert(req.body,eFunk);
        res.json({ok:"It's ok!"});
    });
});
router.get('/api', function(req, res) {
    var collection = req.db.get(model);
    console.log(req.body);
    //collection.insert(req.body,function(err,user){res.json(user);});
    res.json({ok:'ok'});
});
router.delete('/api/:id', auth, function(req, res) {
    var collection = req.db.get(model);
    var authorId = req.params.id;
    collection.remove({author: authorId},eFunk);
    res.json({ok:"It's ok!"});
});
eFunk = function(err){console.log(err);}

module.exports = router;