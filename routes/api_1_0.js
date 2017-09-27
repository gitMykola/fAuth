let express = require('express'),
    provider = new require('../providers/RatesProvider'),
    router = express.Router();

/* GET rates. */
router.get('/:pair', function(req, res) {
    let data = global.data30[req.params.pair];
    res.json((data && data.length)?data
        :{error:'No '+ req.params.pair +' data.'});
});
/* Accounts
* @method API createAccount
* @params req.body{id:String(MongoDB),
*                  passfrase:String(8..16),
*                  currency:String(3)}
* @return {String} Account address
*/
router.post('/createAccount',(req, res)=>{

});
module.exports = router;
