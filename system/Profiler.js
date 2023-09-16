const express = require('express');
const router = express.Router();
const { enable_profiler } = require('../application/config');

class Profiler {

    static #last_sql = '';
    static data_json = {};
    static data_list = '';
    static timer = 0;

    constructor () {
        this.uri = '';
        this.get_data = '';
        this.post_data = '';
        this.session_data = '';
    }

    static enable_profiler (req, res, next) {
        if (enable_profiler) {
            let start = Date.now();

            res.on('finish',async () => {
                let timeTaken = Date.now() - start;

                this.compute_exec(timeTaken);
            });     
            this.uri = req.originalUrl;
            this.get_data = req.query;
            this.post_data = req.body;
            this.session_data = req.session;

            this.data_json = {"uri": this.uri, "get_data": this.get_data, "post_data": this.post_data, "session": this.session_data, "timer": this.timer, "last_sql": this.#last_sql};
            this.data_list = `
            EXECUTION TIME: ${this.timer} 
            URI :  ${JSON.stringify(this.uri)}  
            GET :  ${JSON.stringify(this.get_data)} 
            POST :  ${JSON.stringify(this.post_data)} 
            SESSION : ${JSON.stringify(this.session_data)}`;
            
            res.locals.enable_profiler = this.data_list; 
        }
        next();
    }

    static last_sql (sql) {
        this.#last_sql = sql;
    }
    
    static compute_exec (time) {
        this.timer += time;
        setTimeout(function(){
            this.timer = 0;
        }, 1000);
    }
}

module.exports = { Profiler, router };