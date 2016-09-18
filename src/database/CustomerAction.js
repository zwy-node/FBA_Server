/**
 * Created by Fizz on 16/9/13.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class CustomerAction extends MKODBAction {
    constructor() {
        super();
    }

    *addCustomer(data) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_AdminUser where `account` = ?';
        let findAdmin = yield this.execSQL(querySQL, data.account, dbConnection);
        if(findAdmin.length > 0) {
            dbConnection.release();
            return findAdmin;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_AdminUser SET ?';
            //console.log(insertSQL)
            let result = yield this.execSQL(insertSQL, data, dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }
}

const customerAction = new CustomerAction();

module.exports = customerAction;
