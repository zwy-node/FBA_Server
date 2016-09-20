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
        let querySQL = 'SELECT * FROM YSGJ_Users where `email` = ?';
        let findAdmin = yield this.execSQL(querySQL, [data.email], dbConnection);
        if(findAdmin.length > 0) {
            dbConnection.release();
            return findAdmin[0];
        } else {
            let insertSQL = 'INSERT INTO YSGJ_Users SET ?';
            let result = yield this.execSQL(insertSQL, data, dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }

    *updateCustomer(id, data) {
        let dbConnection = yield this.getDBConnection();
        let updateSQL = 'UPDATE YSGJ_Users SET ? WHERE `id` = ?';
        let result = yield this.execSQL(updateSQL, [data, id], dbConnection);
        dbConnection.release();
        return result;
    }

    *customerList() {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_Users';
        let result = yield this.queryList(querySQL, dbConnection);
        dbConnection.release();
        return  {page: 1, pageCount: 0, pageNumber: 1, datas: result};
    }

    *customerDetail(id) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `id`, `userName`, `headURL`, `email`, `mobile`, `company`, `phone`, `createDate`, `loginTime`, `status`, `salesmanID` FROM YSGJ_Users WHERE `id` = ?';
        let result = yield this.execSQL(querySQL, id, dbConnection);
        dbConnection.release();
        return result[0];
    }

    *customerOrder(id) {
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `startAddressID`, `endAddressID` FROM YSGJ_Order WHERE `id` = ?';
        let result = yield this.execSQL(querySQL, id, dbConnection);
        dbConnection.release();
        return result;
    }

    *salesmanList() {
        const ROLE = 2;
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT `id`, `name` FROM YSGJ_AdminUser WHERE `role` = ?';
        let result = yield this.execSQL(querySQL, ROLE, dbConnection);
        dbConnection.release();
        return result;
    }
}

module.exports = CustomerAction;

