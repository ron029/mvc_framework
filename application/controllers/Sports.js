const { Sport } = require('../models/Sport');
const { Controller, Validate, Flash_Data } = require('../../system/Controller');

class Sports extends Controller {

    constructor () {
        super();
    }
    
    async index (req, res) {
        res.render('index');
    }

    async filter (req, res) {
        (async () => {
            const filter_result = await Sport.get_filter(req.body);
            res.render('index_ajax', {players: filter_result});
        })();
    }
}

module.exports = new Sports;