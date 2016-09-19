/**
 * Created by Fizz on 16/9/19.
 */
'use strict';

var MKODBAction = require('./MKODBAction');

class ConfigInfoAction extends MKODBAction {
    constructor() {
        super();
    }

    *addFBAWarehouse(data){
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_AdminUser where `addressID` = ? AND `postcode` = ?';
        let findFBAWarehouse = yield this.execSQL(querySQL, [data.addressID, data.postcode], dbConnection);
        if(findFBAWarehouse.length > 0) {
            dbConnection.release();
            return findFBAWarehouse;
        } else {
            let insertSQL = 'INSERT INTO YSGJ_FBAWarehouse SET ?';
            let result = yield this.execSQL(insertSQL, data, dbConnection);
            dbConnection.release();
            return result.insertId;
        }
    }
}

module.exports = ConfigInfoAction;