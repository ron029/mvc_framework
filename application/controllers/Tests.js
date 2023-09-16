const { Sport } = require('../models/Sport');
const { Controller, Validate, Flash_Data } = require('../../system/Controller');

class Test extends Controller {
    async test (req, res) {
        res.render('test');
    }
}

module.exports = new Test;