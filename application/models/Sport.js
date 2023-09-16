const bcrypt = require('bcryptjs');
const { Model } = require('../../system/Model');

class Sport {
    static async get_players () {
        const players = await Model.queryRun('SELECT concat(first_name," ",last_name) as name FROM Players');
        
        let players_arr = [];
        for (let x in players) {
            let player = players[x].name.replace(/ /g,'_');
            players_arr[players_arr.length] = [player,players[x].name];
        }
        return players_arr;
    }

    static async get_filter (post) {
        let sql = '';
        sql += `SELECT concat(first_name, " ", last_name) as name, sports.name as sport, players.gender FROM players left join sports on sports.id = players.sport_id `;
        if (post.name) {
            sql += ` WHERE concat(first_name, " ", last_name) like '%${post.name}%' `; 
        }

        if (post.sports) {
            sql += (post.name) ? ' AND ' : ' WHERE ';
            sql += ` sports.name in (`;
            for (let x=0; x<post.sports.length; x++) {
                sql += `'${post.sports[x]}'`;
                if (post.sports.length-1 !== x) sql += ','; 
            }
            sql += `)`;
        }

        if (post.gender !== undefined && post.gender.length === 1) {
            sql += (post.name || post.sports) ? ' AND ' : ' WHERE ';
            let gender = (post.gender === 'male') ? 0 : 1;
            sql += ` gender = ${gender}`;
        }
        
        const players = await Model.queryRun(sql);
        
        let players_arr = [];
        for (let x in players) {
            let player = players[x].name.replace(/ /g,'_');
            players_arr[players_arr.length] = [player,players[x].name];
        }
        return players_arr;
    }
}

module.exports = { Sport }