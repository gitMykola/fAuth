let express = require('express'),
    provider = new require('../providers/RatesProvider'),
    router = express.Router();

/* GET rates. */
router.get('/:pair', function(req, res) {
    let data = global.data30[req.params.pair];
    res.json((data && data.length)?data
        :{error:'No '+ req.params.pair +' data.'});
});

module.exports = router;
