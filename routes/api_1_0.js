let express = require('express'),
    provider = new require('../providers/RatesProvider'),
    router = express.Router();

/* GET rates. */
router.get('/:pair', function(req, res) {
    provider.getRates(res, req.params.pair);
});

module.exports = router;