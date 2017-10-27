const
    monk = require('monk'),
    config = require('../services/config'),
    db = monk(config.db.url);

module.export = db;