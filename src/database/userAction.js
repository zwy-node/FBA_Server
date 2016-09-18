/**
 * Created by Fizz on 16/9/13.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class UserAction extends MKODBAction {
    constructor() {
        super();
    }

    *addUser(data) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_AdminUser where `account` = ?';
        let findAdmin = yield this.execSQL(querySQL, data.account, dbConnection);
        if (findAdmin.length > 0) {
            dbConnection.release();
            return findAdmin;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_AdminUser SET ?';
            let result = yield this.execSQL(insertSQL, data, dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }

    *getRecordByUser(account) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_AdminUser where `account` = ?';
        let resultData = yield this.execSQL(querySQL, account, dbConnection);
        if (resultData.length > 0) {
            resultData = resultData[0];
        } else {
            resultData = null;
        }
        dbConnection.release();
        return resultData;
    }
}

const userAction = new UserAction();
module.exports = userAction;

