let express = require('express'),
    provider = new require('../providers/RatesProvider'),
    router = express.Router();

/* GET rates. */
router.get('/:pair', function(req, res) {
    res.json(global.data30[req.params.pair]);
});

module.exports = router;
