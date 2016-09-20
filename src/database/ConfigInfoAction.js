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
        let querySQL = 'SELECT * FROM YSGJ_FBAWarehouse where `postcode` = ?';
        let findFBAWarehouse = yield this.execSQL(querySQL, [data.addressID, data.postcode], dbConnection);
        console.log(findFBAWarehouse);
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

    *FBAWarehouseList(){
        let dbConnection = yield this.getDBConnection();
        let querySQL = 'SELECT * FROM YSGJ_FBAWarehouse';
        let result = yield this.execSQL(querySQL, [], dbConnection);
        dbConnection.release();
        return {page: 1, pageCount: 1, pageNumber: 1, datas: result};
    }
}

module.exports = ConfigInfoAction;