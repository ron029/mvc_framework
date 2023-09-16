const { connection } = require('../application/config');
const { Profiler } = require('./Profiler');
class Model {

    static queryRun(sql) {
        const result = new Promise((resolve, reject) => {
            connection.query(sql, (err, rows, fields)  => {
                if (err) return reject(err);
                resolve(rows = JSON.parse(JSON.stringify(rows)));
            });
            Profiler.last_sql(sql);
        });
        return result;
    }

    static async add(sql) {
        const result = new Promise((resolve, reject) => {
            connection.query(sql, async (err, rows, fields) => {
                if (err) return reject(err);
                resolve(true);
            });
            Profiler.last_sql(sql);
        });
        return result;
    }
}

module.exports = { Model }