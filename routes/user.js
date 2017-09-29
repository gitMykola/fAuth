let express = require('express'),
    router = express.Router(),
    model = 'users',
    auth = require('../services/auth'),
        user = require('../models/User');

/* GET users listing. */
router.get('/', auth, function(req, res)
{
    user.getAllUsers(res, function(err,users){
        console.log('Send All users. Error '+ err);
        res.json({err:err,users:users});
    })
});
router.get('/:id', auth, function(req, res)
{
    user.getUserById(req.params.id, res, function(err,user){
        console.log('Send user '+ user.name +'. Error '+ err);
        res.json({err:err,user:user});
    });
});
router.post('/', auth, function(req, res) {user.setUser(req.body, res)});
router.put('/:id', auth, function(req, res) {user.updateUser(req.params.id, req.body, res)});
router.delete('/:id', auth, function(req, res) {user.deleteUser(req.params.id, res)});

module.exports = router;