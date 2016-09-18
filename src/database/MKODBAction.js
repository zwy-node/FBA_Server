/**
 * Created by Fizz on 16/9/13.
 */

var co = require('co');
var mysql = require('mysql');

var mysqlPool = null;
if (!mysqlPool) {
    mysqlPool = mysql.createPool(CONFIG.db);
}

class MKODBAction {
    constructor() {
        this.co = co;
    }

    getDBConnection() {
        return function (cb) {
            mysqlPool.getConnection(cb);
        }
    }

    execSQL(sql, values, dbConnection) {
        console.log(sql)
        return function(cb) {
            let start = new Date();
            let query = dbConnection.query(sql, values, function(err, result){
                let ms = new Date() - start;
                logger.info(`EXEC SQL: "${query.sql}" ${ms}ms`);
                if(err) {
                    cb(err);
                    logger.error(`EXEC SQL ERROR: "${query.sql}" ${ms}ms`);
                    logger.error(err);
                }
                cb(null, result);
            });
        }
    }

    queryList(sql, dbConnection) {
        console.log(sql)
        return function(cb) {
            let start = new Date();
            let query = dbConnection.query(sql, function(err, result){
                let ms = new Date() - start;
                logger.info(`EXEC SQL: "${query.sql}" ${ms}ms`);
                if(err) {
                    cb(err);
                    logger.error(`EXEC SQL ERROR: "${query.sql}" ${ms}ms`);
                    logger.error(err);
                }
                cb(null, result);
            });
        }
    }
}

module.exports = MKODBAction;