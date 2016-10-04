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

    *updateUser(id, opt) {
        let dbConnection = yield this.getDBConnection();
        //let querySQL = 'SELECT * FROM YSGJ_AdminUser where `account` = ?';
        //let findAdmin = yield this.execSQL(querySQL, data.account, dbConnection);
        //if (findAdmin.length > 0) {
        //    dbConnection.release();
        //    return findAdmin;
        //} else {

        let insertSQL = 'UPDATE YSGJ_AdminUser SET ? WHERE id = ?';
        let result = yield this.execSQL(insertSQL, [opt, id], dbConnection);
        dbConnection.release();
        return result.insertId;

        //}
    }

    *removeUser(id, status) {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'UPDATE YSGJ_AdminUser status = ? WHERE id = ?';
        let result = yield this.execSQL(insertSQL, [status, id], dbConnection);
        dbConnection.release();
        return result.insertId;
    }

    *userList() {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'SELECT id, account, name, role, createDate, status FROM YSGJ_AdminUser WHERE status = 1 OR status = 2';
        let result = yield this.execSQL(insertSQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }

    *userInfo(id) {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'SELECT * FROM YSGJ_AdminUser WHERE id = ? LIMIT 1';
        let result = yield this.execSQL(insertSQL, [id], dbConnection);
        dbConnection.release();
        return result[0];
    }

    *changPwd(id, newPassword) {
        let dbConnection = yield this.getDBConnection();
        let insertSQL = 'UPDATE YSGJ_AdminUser SET ? WHERE id = ?';
        let result = yield this.execSQL(insertSQL, [newPassword, id], dbConnection);
        dbConnection.release();
        return result.insertId;
    }

    *getRecordByUser(account) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_AdminUser where `account` = ? AND status = 1';
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

